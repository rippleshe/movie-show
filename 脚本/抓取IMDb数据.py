# -*- coding: utf-8 -*-
"""抓取 IMDb 官方公开数据集（导演与影片信息），供导演板块使用。

数据来源：https://datasets.imdbws.com/
  title.crew / name.basics / title.ratings / title.basics

缓存到 .archive/IMDb原始数据/（大文件不进 U 盘），加工后的中文表在 加工数据/。
按 2MB 分块下载，每块单独落盘，可断点续跑；requests 超时 + 重试，完成后按序合并。

重要：IMDb 数据集每天更新，文件字节数会变。总长度一律运行时用 HEAD 的
Content-Length 动态获取，不允许硬编码；分块缓存带版本标签（大小 + ETag），
版本变了自动清空旧块，避免新旧数据拼在一起。合并后做整文件 gzip 解压校验，
校验失败会清空分块缓存并报错，绝不把坏文件当“已完成”缓存。
"""
from __future__ import annotations

import argparse
import gzip
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests

BASE = "https://datasets.imdbws.com/"
UA = "MovieShow-coursework/1.0 (educational; local term project)"
TARGETS = [
    "title.crew.tsv.gz",
    "name.basics.tsv.gz",
    "title.ratings.tsv.gz",
    "title.basics.tsv.gz",
]
# 仅作日志对照：2026-11-12 上午的旧大小，当天数据已更新，实际以下载时 HEAD 为准
OLD_SIZES = {
    "title.crew.tsv.gz": 84_037_624,
    "name.basics.tsv.gz": 312_803_538,
    "title.ratings.tsv.gz": 8_747_316,
    "title.basics.tsv.gz": 230_164_222,
}
CHUNK = 2 * 1024 * 1024
THREADS = 32
ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".archive" / "IMDb原始数据"
LOG = CACHE / "下载日志.txt"

SESS = requests.Session()
SESS.mount("https://", requests.adapters.HTTPAdapter(pool_connections=64, pool_maxsize=64))


def log(msg: str) -> None:
    CACHE.mkdir(parents=True, exist_ok=True)
    line = f"{time.strftime('%H:%M:%S')} {msg}"
    print(line, flush=True)
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def head_info(name: str) -> tuple[int, str]:
    """HEAD 取实时 Content-Length 与版本标签；HEAD 不给长度时用 Range 0-0 探测。"""
    url = BASE + name
    headers = {"User-Agent": UA, "Accept-Encoding": "identity"}
    try:
        r = SESS.head(url, headers=headers, timeout=(10, 30))
        cl = r.headers.get("Content-Length", "")
        if r.status_code == 200 and cl.isdigit() and int(cl) > 0:
            tag = r.headers.get("ETag") or r.headers.get("Last-Modified") or ""
            return int(cl), tag
    except Exception as exc:  # noqa: BLE001
        log(f"  HEAD 失败（改用 Range 探测）：{exc!r}")
    r = SESS.get(url, headers={**headers, "Range": "bytes=0-0"}, timeout=(10, 30))
    r.raise_for_status()
    content_range = r.headers.get("Content-Range", "")
    total = content_range.rsplit("/", 1)[-1] if "/" in content_range else ""
    if not total.isdigit():
        raise RuntimeError(f"{name} 无法取得文件总长度（HTTP {r.status_code}）")
    tag = r.headers.get("ETag") or r.headers.get("Last-Modified") or ""
    return int(total), tag


def fetch_chunk(session: requests.Session, url: str, start: int, end: int, retries: int = 6) -> bytes:
    last = None
    for i in range(retries):
        try:
            r = session.get(url, headers={
                "User-Agent": UA,
                "Range": f"bytes={start}-{end}",
                "Accept-Encoding": "identity",
            }, timeout=(10, 30))
            if r.status_code in (200, 206) and len(r.content) == end - start + 1:
                return r.content
            last = f"HTTP {r.status_code} len {len(r.content)}"
        except Exception as e:  # noqa: BLE001
            last = repr(e)
        time.sleep(min(1.0 * (i + 1), 8))
    raise RuntimeError(f"{start}-{end} 失败: {last}")


def gzip_ok(path: Path) -> tuple[bool, str]:
    """整文件解压校验（gzip 到 EOF 会检查 CRC 与长度），返回 (是否通过, 错误信息)。"""
    try:
        with gzip.open(path, "rb") as f:
            while f.read(8 * 1024 * 1024):
                pass
        return True, ""
    except Exception as exc:  # noqa: BLE001
        return False, repr(exc)


def clear_chunks(chunk_dir: Path) -> None:
    if not chunk_dir.exists():
        return
    for item in chunk_dir.iterdir():
        item.unlink(missing_ok=True)
    chunk_dir.rmdir()


def download_one(name: str, force: bool = False) -> None:
    dst = CACHE / name
    total, tag = head_info(name)
    old = OLD_SIZES.get(name)
    change = "" if old in (None, total) else f"（旧记录 {old:,} B，当日已更新）"
    log(f"[目标] {name} 实测 {total:,} B{change}")

    if dst.exists() and not force:
        if dst.stat().st_size == total:
            ok, err = gzip_ok(dst)
            if ok:
                log(f"[跳过] {name} 已完整且 gzip 校验通过 ({total:,} B)")
                return
            backup = dst.with_name(dst.name + f".bad-{time.strftime('%H%M%S')}")
            dst.replace(backup)
            log(f"[重下] {name} 大小对但 gzip 校验失败（{err}），旧文件已改名 {backup.name}")
        else:
            log(f"[重下] {name} 本地 {dst.stat().st_size:,} B ≠ 远端 {total:,} B")
            dst.unlink()

    chunk_dir = CACHE / ".chunks" / name
    chunk_dir.mkdir(parents=True, exist_ok=True)
    meta_path = chunk_dir / "meta.txt"
    meta = f"{total}|{tag}"
    stale = False
    if meta_path.exists():
        stale = meta_path.read_text(encoding="utf-8").strip() != meta
    else:
        stale = any(chunk_dir.iterdir())  # 老版本下载器留下的块没有版本标签，一律作废
    if stale:
        log(f"[清缓存] {name} 远端版本变了（大小/ETag）或旧块无版本标签，清空旧分块")
        clear_chunks(chunk_dir)
        chunk_dir.mkdir(parents=True, exist_ok=True)
    meta_path.write_text(meta, encoding="utf-8")

    segs = [(s, min(s + CHUNK - 1, total - 1)) for s in range(0, total, CHUNK)]

    def seg_path(i: int) -> Path:
        return chunk_dir / f"{i:05d}.bin"

    pending = [(i, s, e) for i, (s, e) in enumerate(segs)
               if not (seg_path(i).exists() and seg_path(i).stat().st_size == e - s + 1)]
    log(f"[开始] {name} {total:,} B · {len(segs)} 块 · 待下 {len(pending)} 块 · {THREADS} 线程")
    t0 = time.time()
    done = 0
    next_mark = 32 * 1024 * 1024

    def work(item) -> int:
        i, s, e = item
        data = fetch_chunk(SESS, BASE + name, s, e)
        seg_path(i).write_bytes(data)
        return len(data)

    with ThreadPoolExecutor(max_workers=THREADS) as pool:
        futs = [pool.submit(work, it) for it in pending]
        for fut in as_completed(futs):
            done += fut.result()
            if done >= next_mark:
                speed = done / max(time.time() - t0, 1e-6) / 1024
                log(f"  {name}: 本轮已下 {done/1024/1024:.1f} MB，{speed:.0f} KB/s")
                next_mark += 32 * 1024 * 1024
    missing = [seg_path(i) for i, (s, e) in enumerate(segs)
               if not (seg_path(i).exists() and seg_path(i).stat().st_size == e - s + 1)]
    if missing:
        raise RuntimeError(f"{name} 仍有 {len(missing)} 块缺失，可重跑续传")
    part = CACHE / (name + ".part")
    with open(part, "wb") as out:
        for i, (s, e) in enumerate(segs):
            out.write(seg_path(i).read_bytes())
    if part.stat().st_size != total:
        raise RuntimeError(f"{name} 合并后大小 {part.stat().st_size} != {total}")
    ok, err = gzip_ok(part)
    if not ok:
        clear_chunks(chunk_dir)
        part.unlink(missing_ok=True)
        raise RuntimeError(f"{name} gzip 完整性校验失败，已清空分块缓存，请重跑：{err}")
    part.replace(dst)
    clear_chunks(chunk_dir)
    log(f"[完成] {name} -> {dst} ({total:,} B，gzip 校验通过)")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", nargs="*", default=None, help="只下载指定文件")
    ap.add_argument("--force", action="store_true", help="忽略已有完整文件，强制重下")
    args = ap.parse_args()
    names = args.only or TARGETS
    for name in names:
        if name not in TARGETS:
            raise SystemExit(f"未知文件：{name}")
        download_one(name, force=args.force)
    log("全部完成。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
