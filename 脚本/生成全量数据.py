# -*- coding: utf-8 -*-
"""生成浮层用的全量检索数据（首次打开探索浮层时按需加载）。

输出（成品网页/，契约见 导演板块产品方案.md §8.1）：
  数据-导演.js  window.全量.导演 = {字段, 行}            39,702 行
  数据-电影.js  window.全量.电影 = {字段, 行}            86,537 行（行序即电影索引）
  数据-关系.js  window.全量.关系 = {导演作品起, 导演作品电影}
  数据-合作.js  window.全量.合作 = {行:[[导演A索引,导演B索引,合作片数,总评分人数,[电影索引]]]}
  图片清单.js   window.图片      = {导演:{编号:文件名}, 电影:{电影编号:文件名}}

索引约定：导演索引 = 导演表行序（累计人数降序）；电影索引 = 电影表行序（电影编号升序）。
中文名优先级：精选配置中文名（按编号）→ 导演中文名.json（按英文名）→ 空。
"""
from __future__ import annotations

import argparse
import csv
import json
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "原始数据"
PROC = ROOT / "加工数据"
WEB = ROOT / "成品网页"
SCRIPTS = ROOT / "脚本"
CACHE = ROOT / ".archive" / "IMDb原始数据"

DIRECTOR_COUNT = 39702
MOVIE_COUNT = 86537
RELATION_COUNT = 98169
PAIR_COUNT = 34387


def write_js(path: Path, head: str, obj) -> int:
    text = head + json.dumps(obj, ensure_ascii=False, separators=(",", ":")) + ";\n"
    path.write_text(text, encoding="utf-8")
    return path.stat().st_size


def num(value, nd=None):
    if value is None or pd.isna(value) or str(value).strip() in ("", "nan", "None"):
        return None
    return round(float(value), nd) if nd is not None else int(float(value))


def read_cn_names() -> tuple[dict, dict, dict]:
    cfg = json.loads((SCRIPTS / "导演板块精选.json").read_text(encoding="utf-8-sig"))
    by_id = {str(k): str(v) for k, v in cfg.get("中文名", {}).items()}
    by_name = json.loads((SCRIPTS / "导演中文名.json").read_text(encoding="utf-8-sig"))
    by_name_low = {str(k).lower(): str(v) for k, v in by_name.items()}
    return by_id, by_name, by_name_low


def read_images() -> dict:
    df = pd.read_csv(PROC / "导演图片清单.csv", dtype=str, encoding="utf-8-sig").fillna("")
    result = {"导演": {}, "电影": {}}
    for kind, key in (("导演肖像", "导演"), ("电影海报", "电影")):
        for _, row in df[df["类型"] == kind].iterrows():
            code, filename = str(row["编号"]).strip(), str(row["文件名"]).split("/")[-1]
            if code and filename and (WEB / '图片' / filename).is_file():
                result[key][code] = filename
    return result


def scan_imdb_ratings(tconsts: set[str]) -> dict[str, tuple[float, int]]:
    frames = []
    for chunk in pd.read_csv(CACHE / "title.ratings.tsv.gz", sep="\t", dtype=str,
                             usecols=["tconst", "averageRating", "numVotes"], chunksize=800_000,
                             keep_default_na=False, na_filter=False, compression="gzip",
                             quoting=csv.QUOTE_NONE):
        hit = chunk[chunk["tconst"].isin(tconsts)]
        if len(hit):
            frames.append(hit)
    df = pd.concat(frames, ignore_index=True) if frames else pd.DataFrame()
    return {r.tconst: (round(float(r.averageRating), 1), int(r.numVotes)) for r in df.itertuples(index=False)}


def build_directors(dd: pd.DataFrame, cn) -> tuple[list, list]:
    fields = ["编号", "英文名", "中文名", "出生年", "逝世年", "职业", "作品数", "有评分作品数",
              "累计人数", "加权均分", "最高分", "最高分片名", "首部年", "最近年", "联合执导片数", "合作导演数"]
    rows = []
    for r in dd.itertuples(index=False):
        rows.append([
            r.导演编号, r.导演名, cn(r.导演编号, r.导演名), num(r.出生年), num(r.逝世年), r.职业,
            num(r.本库作品数), num(r.有评分作品数), num(r.总评分人数),
            num(r.加权平均分, 3), num(r.最高分, 3), r.最高分片名,
            num(r.首部上映年), num(r.最近上映年), num(r.联合执导片数), num(r.合作导演数),
        ])
    assert len(rows) == DIRECTOR_COUNT, f"导演行数 {len(rows)} != {DIRECTOR_COUNT}"
    return fields, rows


def build_movies(movies: pd.DataFrame, long: pd.DataFrame, rating: pd.DataFrame,
                 links: pd.DataFrame, imdb: dict) -> tuple[list, list]:
    year = pd.to_numeric(movies["上映年份"], errors="coerce")
    fill_year = {str(r.电影编号): int(r.上映年份) for r in long.itertuples(index=False)
                 if not pd.isna(r.上映年份)}
    tconst_of = dict(zip(links["电影编号"].astype(int), "tt" + links["IMDb编号"].astype(str).str.strip()))
    rating_idx = rating.set_index("电影编号")
    rows = []
    for r in movies.itertuples(index=False):
        mid = int(r.电影编号)
        if not pd.isna(year.iloc[len(rows)]):
            year_value = int(year.iloc[len(rows)])
        else:
            year_value = fill_year.get(str(mid))
        votes = avg = None
        key = str(mid)
        if key in rating_idx.index:
            votes = num(rating_idx.loc[key, "评分人数"])
            avg = num(rating_idx.loc[key, "平均分"], 3)
        imdb_pair = imdb.get(tconst_of.get(mid, ""))
        rows.append([
            mid, r.片名, year_value, r.类型中文 if isinstance(r.类型中文, str) else "",
            votes, avg, imdb_pair[0] if imdb_pair else None, imdb_pair[1] if imdb_pair else None,
        ])
    fields = ["编号", "片名", "上映年份", "类型", "评分人数", "平均分", "IMDb评分", "IMDb票数"]
    assert len(rows) == MOVIE_COUNT, f"电影行数 {len(rows)} != {MOVIE_COUNT}"
    return fields, rows


def build_relations(long: pd.DataFrame, director_rows: list, movie_index: dict) -> tuple[list, list]:
    per_director: dict[str, list] = {}
    for r in long.itertuples(index=False):
        votes = pd.to_numeric(pd.Series([r.评分人数]), errors="coerce").iloc[0]
        per_director.setdefault(r.导演编号, []).append(
            (int(r.电影编号), -1 if pd.isna(votes) else int(votes)))
    starts, works = [0], []
    for row in director_rows:
        nconst = row[0]
        items = per_director.pop(nconst, [])
        items.sort(key=lambda x: (-x[1], x[0]))  # 每位导演按评分人数降序，海报卡顺序
        works.extend(movie_index[m] for m, _ in items)
        starts.append(len(works))
    assert not per_director, f"关系里有导演不在导演表：{list(per_director)[:3]}"
    assert len(works) == RELATION_COUNT and len(starts) == DIRECTOR_COUNT + 1
    return starts, works


def build_pairs(pairs: pd.DataFrame, director_index: dict, movie_index: dict) -> list:
    rows = []
    for r in pairs.itertuples(index=False):
        mids = [int(x) for x in str(r.合作电影编号).split("|") if x]
        rows.append([
            director_index[r.导演A编号], director_index[r.导演B编号],
            int(float(r.合作电影数)), int(float(r.总评分人数 or 0)),
            [movie_index[m] for m in mids],
        ])
    assert len(rows) == PAIR_COUNT, f"合作行数 {len(rows)} != {PAIR_COUNT}"
    return rows


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--images-only', action='store_true', help='只更新本地图片索引')
    args = parser.parse_args()
    if args.images_only:
        images = read_images()
        write_js(WEB / '图片清单.js', 'window.图片 = ', images)
        print(f"Images: {len(images['电影'])} films, {len(images['导演'])} directors")
        return
    dd = pd.read_csv(PROC / "导演表.csv", dtype=str, encoding="utf-8-sig")
    movies = pd.read_csv(PROC / "电影.csv", dtype=str, encoding="utf-8-sig")
    rating = pd.read_csv(PROC / "电影评分汇总.csv", dtype=str, encoding="utf-8-sig")
    long = pd.read_csv(PROC / "导演作品表.csv", dtype=str, encoding="utf-8-sig")
    pairs = pd.read_csv(PROC / "导演合作表.csv", dtype=str, encoding="utf-8-sig")
    links = pd.read_csv(RAW / "链接.csv", dtype=str, encoding="utf-8-sig")

    by_id, by_name, by_name_low = read_cn_names()

    def cn(nid: str, name: str):
        return by_id.get(nid) or by_name.get(name) or by_name_low.get(str(name).lower()) or None

    for c in ["本库作品数", "有评分作品数", "总评分人数", "加权平均分", "最高分",
              "首部上映年", "最近上映年", "联合执导片数", "合作导演数"]:
        dd[c] = pd.to_numeric(dd[c], errors="coerce")

    d_fields, director_rows = build_directors(dd, cn)
    director_index = {row[0]: i for i, row in enumerate(director_rows)}
    movie_index = {int(r.电影编号): i for i, r in enumerate(movies.itertuples(index=False))}

    imdb = scan_imdb_ratings({"tt" + str(x).strip() for x in links["IMDb编号"]})
    m_fields, movie_rows = build_movies(movies, long, rating, links, imdb)
    starts, works = build_relations(long, director_rows, movie_index)
    pair_rows = build_pairs(pairs, director_index, movie_index)
    images = read_images()

    sizes = {
        "数据-导演.js": write_js(WEB / "数据-导演.js", "window.全量 = window.全量 || {};\nwindow.全量.导演 = ",
                              {"字段": d_fields, "行": director_rows}),
        "数据-电影.js": write_js(WEB / "数据-电影.js", "window.全量 = window.全量 || {};\nwindow.全量.电影 = ",
                              {"字段": m_fields, "行": movie_rows}),
        "数据-关系.js": write_js(WEB / "数据-关系.js", "window.全量 = window.全量 || {};\nwindow.全量.关系 = ",
                              {"导演作品起": starts, "导演作品电影": works}),
        "数据-合作.js": write_js(WEB / "数据-合作.js", "window.全量 = window.全量 || {};\nwindow.全量.合作 = ",
                              {"行": pair_rows}),
        "图片清单.js": write_js(WEB / "图片清单.js", "window.图片 = ", images),
    }
    print(f"导演 {len(director_rows)} / 电影 {len(movie_rows)} / 关系 {len(works)} / 合作 {len(pair_rows)}")
    print(f"图片：导演 {len(images['导演'])} / 电影 {len(images['电影'])}")
    for name, size in sizes.items():
        print(f"  {name}  {size / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
