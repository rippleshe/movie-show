# -*- coding: utf-8 -*-
"""生成导演板块加工表与前端数据。

输入：.archive/IMDb原始数据/ 下 IMDb 官方四个数据集（title.crew / name.basics /
title.ratings / title.basics），加工数据/电影.csv、电影评分汇总.csv、原始数据/链接.csv。
输出：加工数据/导演*.csv、导演候选.json 与 成品网页/导演数据.js（CSV 用 utf-8-sig 中文表头）。

口径：
- tconst = "tt" + IMDb编号（7/8 位原样拼，不补零）；title.crew 的 directors 字段逗号
  分隔 nconst，反斜杠 N 表示无导演，缺导演如实计数、不伪造。
- 作品只统计 MovieLens 库内电影；评分和评分人数取 电影评分汇总.csv。
- 加权平均分 = sum(评分人数 × 平均分) / sum(评分人数)；最高分 = 评分人数 ≥ 50 的作品中
  平均分最高（项目榜单门槛）；前十 = 评分人数降序、同人数按平均分降序。
- 联合执导 = 同片 directors ≥ 2 人，共创组合取 C(n,2) 对。
- 精选 8 位、中文名、国籍/一句话、4 组共创大卡全部来自 脚本/导演板块精选.json。
"""
from __future__ import annotations

import argparse
import csv
import json
import time
from itertools import combinations
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "原始数据"
PROC = ROOT / "加工数据"
WEB = ROOT / "成品网页"
SCRIPTS = ROOT / "脚本"
CACHE = ROOT / ".archive" / "IMDb原始数据"

RATING_THRESHOLD = 50  # 榜单门槛：评分人数 >= 50
BIG_RATING_THRESHOLD = 1000  # 精选导演考核的观众规模
IMDB_FILES = ["title.crew.tsv.gz", "name.basics.tsv.gz", "title.ratings.tsv.gz", "title.basics.tsv.gz"]
PROFESSION_CN = {
    "director": "导演", "writer": "编剧", "producer": "制片人", "actor": "演员",
    "actress": "女演员", "composer": "作曲家", "editor": "剪辑", "cinematographer": "摄影师",
    "art_director": "艺术指导", "production_designer": "美术设计", "self": "本人",
    "soundtrack": "配乐", "camera_department": "摄影部门", "animation_department": "动画部门",
    "casting_director": "选角导演", "costume_designer": "服装设计", "make_up_department": "化妆部门",
    "second_unit_director": "副导演", "assistant_director": "助理导演", "sound_department": "音效部门",
    "visual_effects": "视觉特效", "special_effects": "特效", "stunts": "特技", "manager": "经理",
    "executive": "高管", "legal": "法务", "miscellaneous": "其他", "transport_department": "运输部门",
    "location_management": "场地管理", "production_manager": "制片管理", "set_decorator": "置景",
    "script_department": "场记", "music_department": "音乐部门", "editorial_department": "剪辑部门",
    "thanks": "致谢", "archive_footage": "档案影像", "archive_sound": "档案声音", "sculptor": "雕塑",
    "choreographer": "编舞", "talent_department": "演员部门", "publicity": "宣传", "distributor": "发行",
    "publicist": "公关", "unit_manager": "单元经理", "property_master": "道具", "gaffer": "灯光",
    "production_department": "制片部门", "miscellaneous_crew": "剧组成员", "director_of_photography": "摄影指导",
    "music_artist": "音乐人", "sound_designer": "声音设计", "production_assistant": "制片助理",
    "set_designer": "布景设计", "casting_department": "选角部门", "costume_department": "服装部门",
}


def log(msg: str) -> None:
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def require_imdb_files() -> None:
    missing = [n for n in IMDB_FILES if not (CACHE / n).exists() or (CACHE / n).stat().st_size == 0]
    if missing:
        raise SystemExit("IMDb 原始数据未就绪：" + "、".join(missing) + "（先跑 脚本/抓取IMDb数据.py）")


def profession_cn(raw: str) -> str:
    if not raw or raw == r"\N":
        return ""
    return "、".join(PROFESSION_CN.get(x.strip(), x.strip()) for x in raw.split(",") if x.strip())


def scan_tsv(path: Path, usecols: list[str], key: str, wanted: set[str]) -> pd.DataFrame:
    """分块读大 TSV，只保留 key 在 wanted 里的行，避免整表进内存。"""
    frames = []
    for chunk in pd.read_csv(path, sep="\t", dtype=str, usecols=usecols, chunksize=800_000,
                             keep_default_na=False, na_filter=False, compression="gzip",
                             quoting=csv.QUOTE_NONE):
        hit = chunk[chunk[key].isin(wanted)]
        if len(hit):
            frames.append(hit)
    return pd.concat(frames, ignore_index=True) if frames else pd.DataFrame(columns=usecols)


def read_movies() -> pd.DataFrame:
    links = pd.read_csv(RAW / "链接.csv", dtype=str, encoding="utf-8-sig")
    links["电影编号"] = links["电影编号"].astype(int)
    links["tconst"] = "tt" + links["IMDb编号"].astype(str).str.strip()  # 7/8 位原样，不补零
    movies = pd.read_csv(PROC / "电影.csv", dtype=str, encoding="utf-8-sig")
    movies["电影编号"] = movies["电影编号"].astype(int)
    movies["上映年份"] = pd.to_numeric(movies["上映年份"], errors="coerce").astype("Int64")
    movies["片名"] = movies["片名"].fillna("")
    movies["类型中文"] = movies["类型中文"].fillna("")
    ratings = pd.read_csv(PROC / "电影评分汇总.csv", dtype=str, encoding="utf-8-sig")
    ratings["电影编号"] = ratings["电影编号"].astype(int)
    ratings["评分人数"] = pd.to_numeric(ratings["评分人数"], errors="coerce").astype("Int64")
    ratings["平均分"] = pd.to_numeric(ratings["平均分"], errors="coerce").round(3)
    base = links[["电影编号", "tconst"]].drop_duplicates("电影编号").merge(movies, on="电影编号", how="left")
    base = base.merge(ratings[["电影编号", "评分人数", "平均分"]], on="电影编号", how="left")
    log(f"电影 {len(base):,} 部，有 IMDb 编号 {base['tconst'].notna().sum():,}，有评分 {base['评分人数'].notna().sum():,}")
    return base


def parse_directors(raw: str) -> list[str]:
    if not raw or raw == r"\N":
        return []
    return [x for x in raw.split(",") if x]


def scan_names(nconsts: set[str]) -> dict[str, dict]:
    df = scan_tsv(CACHE / "name.basics.tsv.gz",
                  ["nconst", "primaryName", "birthYear", "deathYear", "primaryProfession"],
                  "nconst", nconsts).drop_duplicates("nconst")
    return {r.nconst: {"name": r.primaryName or r.nconst,
                       "birth": int(r.birthYear) if r.birthYear and r.birthYear.isdigit() else None,
                       "death": int(r.deathYear) if r.deathYear and r.deathYear.isdigit() else None,
                       "profession": profession_cn(r.primaryProfession)}
            for r in df.itertuples(index=False)}


def scan_imdb_ratings(tconsts: set[str]) -> dict[str, tuple[float, int]]:
    df = scan_tsv(CACHE / "title.ratings.tsv.gz", ["tconst", "averageRating", "numVotes"],
                  "tconst", tconsts).drop_duplicates("tconst")
    return {r.tconst: (round(float(r.averageRating), 1), int(r.numVotes)) for r in df.itertuples(index=False)}


def scan_basics(tconsts: set[str]) -> dict[str, dict]:
    df = scan_tsv(CACHE / "title.basics.tsv.gz", ["tconst", "titleType", "startYear", "runtimeMinutes"],
                  "tconst", tconsts).drop_duplicates("tconst")
    return {r.tconst: {"start": int(r.startYear) if r.startYear and r.startYear.isdigit() else None,
                       "runtime": int(r.runtimeMinutes) if r.runtimeMinutes and r.runtimeMinutes.isdigit() else None,
                       "type": r.titleType} for r in df.itertuples(index=False)}


def build_long_table(base, crew_map, name_map, imdb_ratings, basics) -> pd.DataFrame:
    rows = []
    for r in base.itertuples(index=False):
        directors = crew_map.get(r.tconst, [])
        if not directors:
            continue
        names = [name_map.get(n, {}).get("name", n) for n in directors]
        multi = len(directors) >= 2
        year = r.上映年份
        if pd.isna(year) and basics.get(r.tconst, {}).get("start"):
            year = basics[r.tconst]["start"]  # MovieLens 缺年份时用 IMDb startYear 补
        imdb = imdb_ratings.get(r.tconst)
        for i, nconst in enumerate(directors):
            rows.append({
                "导演编号": nconst, "导演名": names[i], "电影编号": int(r.电影编号),
                "片名": r.片名, "上映年份": year, "类型中文": r.类型中文,
                "评分人数": r.评分人数, "平均分": r.平均分,
                "IMDb评分": imdb[0] if imdb else None, "IMDb票数": imdb[1] if imdb else None,
                "是否联合执导": "是" if multi else "否",
                "合作导演": "|".join(names[:i] + names[i + 1:]) if multi else "",
            })
    long = pd.DataFrame(rows)
    long["导演编号"] = long["导演编号"].astype(str)
    long["导演名"] = long["导演名"].astype(str)
    long["电影编号"] = long["电影编号"].astype(int)
    long["上映年份"] = long["上映年份"].astype("Int64")
    long["评分人数"] = long["评分人数"].astype("Int64")
    long["是否联合执导"] = long["是否联合执导"].astype(str)
    log(f"导演作品关系 {len(long):,} 行，导演 {long['导演编号'].nunique():,} 位")
    return long


def build_director_table(long, name_map) -> pd.DataFrame:
    work = long.copy()
    work["加权分子"] = work["评分人数"].fillna(0).astype("float64") * work["平均分"].fillna(0).astype("float64")
    rated = work[work["评分人数"].notna()]
    g = work.groupby("导演编号", sort=False)
    rated_g = rated.groupby("导演编号", sort=False)

    out = pd.DataFrame({"导演编号": g.size().index}).set_index("导演编号")
    out["导演名"] = g["导演名"].first()
    out["本库作品数"] = g.size().astype("int64")
    out["有评分作品数"] = rated_g.size().reindex(out.index).fillna(0).astype("int64")
    out["总评分人数"] = g["评分人数"].sum(min_count=1).reindex(out.index).fillna(0).astype("int64")
    out["加权分子"] = g["加权分子"].sum(min_count=1).reindex(out.index).fillna(0.0)
    out["加权平均分"] = (out["加权分子"] / out["总评分人数"].where(out["总评分人数"] > 0)).round(3)

    # 最高分只在达到榜单门槛的作品里评，并列取评分人数多者
    r50 = work[work["评分人数"].notna() & (work["评分人数"] >= RATING_THRESHOLD)]
    best = r50.sort_values(["平均分", "评分人数", "电影编号"], ascending=[False, False, True]).drop_duplicates("导演编号")
    best_map = dict(zip(best["导演编号"], zip(best["平均分"], best["片名"])))
    out["最高分"] = [best_map.get(i, (pd.NA, ""))[0] for i in out.index]
    out["最高分片名"] = [best_map.get(i, (pd.NA, ""))[1] for i in out.index]
    out["首部上映年"] = g["上映年份"].min().reindex(out.index)
    out["最近上映年"] = g["上映年份"].max().reindex(out.index)
    multi = work[work["是否联合执导"] == "是"].groupby("导演编号", sort=False).size()
    out["联合执导片数"] = multi.reindex(out.index).fillna(0).astype("int64")

    partners: dict[str, set[str]] = {}
    for dirs in long.groupby("电影编号")["导演编号"].apply(list):
        if len(dirs) >= 2:
            for i, nconst in enumerate(dirs):
                partners.setdefault(nconst, set()).update(dirs[:i] + dirs[i + 1:])
    out["合作导演数"] = [len(partners.get(i, ())) for i in out.index]
    out["出生年"] = [name_map.get(i, {}).get("birth") for i in out.index]
    out["逝世年"] = [name_map.get(i, {}).get("death") for i in out.index]
    out["职业"] = [name_map.get(i, {}).get("profession", "") for i in out.index]

    out = out.reset_index().sort_values(
        ["总评分人数", "本库作品数", "导演编号"], ascending=[False, False, True]).reset_index(drop=True)
    cols = ["导演编号", "导演名", "出生年", "逝世年", "职业", "本库作品数", "有评分作品数", "总评分人数",
            "加权平均分", "最高分", "最高分片名", "首部上映年", "最近上映年", "联合执导片数", "合作导演数"]
    return out[cols]


def build_top10(long) -> pd.DataFrame:
    rated = long[long["评分人数"].notna()].sort_values(
        ["导演编号", "评分人数", "平均分", "电影编号"], ascending=[True, False, False, True]).copy()
    rated["排序"] = rated.groupby("导演编号").cumcount() + 1
    top = rated[rated["排序"] <= 10][
        ["导演编号", "导演名", "排序", "电影编号", "片名", "上映年份", "评分人数", "平均分", "IMDb评分"]]
    top = top.reset_index(drop=True)
    log(f"导演前十作品 {len(top):,} 行，覆盖导演 {top['导演编号'].nunique():,} 位")
    return top


def build_pairs(long) -> pd.DataFrame:
    movie_dirs = {}
    for movie_id, group in long.groupby("电影编号", sort=False):
        dirs = list(group["导演编号"])
        if len(dirs) >= 2:
            movie_dirs[int(movie_id)] = dirs
    names = dict(zip(long["导演编号"], long["导演名"]))
    movie_info = {int(r.电影编号): {"片名": r.片名, "评分人数": r.评分人数, "平均分": r.平均分}
                  for r in long.drop_duplicates("电影编号").itertuples(index=False)}
    pair_movies: dict[tuple[str, str], list[int]] = {}
    for movie_id, dirs in movie_dirs.items():
        for a, b in combinations(sorted(dirs), 2):
            pair_movies.setdefault((a, b), []).append(movie_id)

    rows = []
    for (a, b), movies in pair_movies.items():
        def sort_key(m):
            votes = movie_info[m]["评分人数"]
            return (0 if pd.isna(votes) else -int(votes), m)
        movies_sorted = sorted(movies, key=sort_key)
        votes = [movie_info[m]["评分人数"] for m in movies_sorted if not pd.isna(movie_info[m]["评分人数"])]
        avgs = [movie_info[m]["平均分"] for m in movies_sorted
                if not pd.isna(movie_info[m]["平均分"]) and not pd.isna(movie_info[m]["评分人数"])
                and int(movie_info[m]["评分人数"]) >= RATING_THRESHOLD]
        rows.append({
            "导演A编号": a, "导演A名": names.get(a, a), "导演B编号": b, "导演B名": names.get(b, b),
            "合作电影数": len(movies_sorted),
            "合作电影编号": "|".join(str(m) for m in movies_sorted),
            "合作片名": "|".join(movie_info[m]["片名"] for m in movies_sorted),
            "总评分人数": int(sum(int(v) for v in votes)) if votes else 0,
            "最高平均分": round(float(max(avgs)), 3) if avgs else None,
        })
    pairs = pd.DataFrame(rows).sort_values(
        ["合作电影数", "总评分人数", "导演A编号", "导演B编号"],
        ascending=[False, False, True, True]).reset_index(drop=True)
    log(f"联合执导电影 {len(movie_dirs):,} 部，共创组合 {len(pairs):,} 组")
    return pairs


def build_coverage(base, crew, long, pairs, imdb_ratings, basics, name_map, top10) -> pd.DataFrame:
    total = len(base)
    all_dirs = long["导演编号"].unique()
    rows = [
        ("电影总数", total),
        ("有IMDb编号电影数", int(base["tconst"].notna().sum())),
        ("匹配IMDb剧组表电影数", int(base["tconst"].isin(set(crew["tconst"])).sum())),
        ("有导演电影数", int(long["电影编号"].nunique())),
        ("缺导演电影数", total - int(long["电影编号"].nunique())),
        ("导演总数", int(long["导演编号"].nunique())),
        ("联合执导电影数", int((long.groupby("电影编号")["导演编号"].nunique() >= 2).sum())),
        ("共创组合数", len(pairs)),
        ("导演作品关系数", len(long)),
        ("有评分电影数", int(base["评分人数"].notna().sum())),
        ("有评分且有导演电影数", int(base.loc[base["电影编号"].isin(set(long["电影编号"])) & base["评分人数"].notna()].shape[0])),
        ("有评分导演作品关系数", int(long["评分人数"].notna().sum())),
        ("导演名可匹配数", len(name_map)),
        ("出生年可用导演数", int(pd.Series([name_map.get(i, {}).get("birth") for i in all_dirs]).notna().sum())),
        ("职业可用导演数", int((pd.Series([name_map.get(i, {}).get("profession") for i in all_dirs]) != "").sum())),
        ("IMDb评分匹配电影数", len(imdb_ratings)),
        ("IMDb片长匹配电影数", int(sum(1 for v in basics.values() if v["runtime"]))),
        ("导演前十作品行数", len(top10)),
        ("统计口径评分人数门槛", RATING_THRESHOLD),
        ("精选门槛千人大作数", BIG_RATING_THRESHOLD),
    ]
    return pd.DataFrame(rows, columns=["指标", "数值"])


def json_num(value, nd: int = 3):
    """pandas 的 NA/NaN → None；float 保留 nd 位，其余按整数输出。"""
    if value is None or pd.isna(value):
        return None
    return round(float(value), nd) if isinstance(value, float) else int(value)


def build_candidates(director_df, top10, pairs, coverage, movie_meta) -> dict:
    top10_map: dict[str, list[dict]] = {}
    for _, row in top10.iterrows():
        top10_map.setdefault(row["导演编号"], []).append({
            "电影编号": int(row["电影编号"]), "片名": row["片名"],
            "上映年份": json_num(row["上映年份"]), "评分人数": json_num(row["评分人数"]),
            "平均分": json_num(row["平均分"]), "IMDb评分": json_num(row["IMDb评分"], 1)})
    dirs = [{"导演编号": row["导演编号"], "导演名": row["导演名"],
             "出生年": json_num(row["出生年"]), "职业": row["职业"],
             "作品数": int(row["本库作品数"]), "有评分作品数": int(row["有评分作品数"]),
             "总评分人数": int(row["总评分人数"]), "加权平均分": json_num(row["加权平均分"]),
             "最高分": json_num(row["最高分"]), "最高分片名": row["最高分片名"],
             "首部上映年": json_num(row["首部上映年"]), "最近上映年": json_num(row["最近上映年"]),
             "联合执导片数": int(row["联合执导片数"]), "合作导演数": int(row["合作导演数"]),
             "前十": top10_map.get(row["导演编号"], [])}
            for _, row in director_df.head(150).iterrows()]
    pair_rows = []
    for _, row in pairs.head(80).iterrows():
        ids = [int(x) for x in str(row["合作电影编号"]).split("|") if x]
        pair_rows.append({"导演A编号": row["导演A编号"], "导演A名": row["导演A名"],
                          "导演B编号": row["导演B编号"], "导演B名": row["导演B名"],
                          "合作片数": int(row["合作电影数"]), "总评分人数": int(row["总评分人数"]),
                          "最高平均分": json_num(row["最高平均分"]),
                          "片单": [{"电影编号": m, **movie_meta[m]} for m in ids]})
    cov = dict(zip(coverage["指标"], coverage["数值"]))
    stats = {k: int(cov[k]) for k in [
        "电影总数", "有IMDb编号电影数", "匹配IMDb剧组表电影数", "有导演电影数", "缺导演电影数",
        "导演总数", "联合执导电影数", "共创组合数", "导演作品关系数", "有评分电影数", "有评分且有导演电影数"]}
    stats["生成时间"] = time.strftime("%Y-%m-%d %H:%M:%S")
    return {"统计": stats, "导演": dirs, "共创": pair_rows}


def build_web_data(director_df, top10, pairs, long, base, coverage_df, movie_meta) -> dict:
    cfg = json.loads((SCRIPTS / "导演板块精选.json").read_text(encoding="utf-8-sig"))
    cn_names = {str(k): str(v) for k, v in cfg.get("中文名", {}).items()}
    dir_extra = {str(k): (v or {}) for k, v in (cfg.get("导演补充") or {}).items()}
    pair_extra = {str(k): (v or {}) for k, v in (cfg.get("组合补充") or {}).items()}
    cfg_pairs = [[str(x) for x in pair] for pair in (cfg.get("共创组合") or []) if len(pair) == 2]
    picked = [str(x) for x in cfg.get("精选导演", [])]
    unknown = [p for p in picked if p not in set(director_df["导演编号"])]
    if unknown:
        raise SystemExit(f"精选配置里的导演不在导演表：{unknown}")

    dir_row = {row["导演编号"]: row for _, row in director_df.iterrows()}
    top10_map: dict[str, list] = {}
    for _, row in top10.iterrows():
        top10_map.setdefault(row["导演编号"], []).append(row)
    movie_dirs = {int(k): list(v) for k, v in long.groupby("电影编号")["导演编号"].apply(list).items()}
    dir_names = dict(zip(long["导演编号"], long["导演名"]))

    selected = []
    for nconst in picked:
        row = dir_row[nconst]
        selected.append({
            "导演编号": nconst, "导演名": row["导演名"],
            "中文名": cn_names.get(nconst) or row["导演名"],
            "国籍": dir_extra.get(nconst, {}).get("国籍") or None,
            "一句话": dir_extra.get(nconst, {}).get("一句话") or None,
            "出生年": json_num(row["出生年"]), "作品数": int(row["本库作品数"]),
            "有评分作品数": int(row["有评分作品数"]), "总评分人数": int(row["总评分人数"]),
            "加权平均分": json_num(row["加权平均分"]), "最高分": json_num(row["最高分"]),
            "最高分片名": row["最高分片名"],
            "首部年": json_num(row["首部上映年"]), "最近年": json_num(row["最近上映年"]),
            "肖像": f"图片/导演-{nconst}.jpg",
            "前十": [{"电影编号": int(f["电影编号"]), "片名": f["片名"],
                      "上映年份": json_num(f["上映年份"]), "评分人数": json_num(f["评分人数"]),
                      "平均分": json_num(f["平均分"]), "IMDb评分": json_num(f["IMDb评分"], 1),
                      "图片": f"图片/电影-{int(f['电影编号'])}.jpg"}
                     for f in top10_map.get(nconst, [])[:10]],
        })

    # 共创网络：config 的 4 组大卡放最前并标 精选；其余取合作 ≥2 部、按累计观众降序补到 24 组
    pair_index = {}
    for _, row in pairs.iterrows():
        a, b = str(row["导演A编号"]), str(row["导演B编号"])
        pair_index.setdefault((a, b), row)
        pair_index.setdefault((b, a), row)

    def combo_entry(row, a: str, b: str, featured: bool = False) -> dict:
        a_name, b_name = str(row["导演A名"]), str(row["导演B名"])
        if str(row["导演A编号"]) != a:
            a_name, b_name = b_name, a_name  # config 顺序与表内顺序相反
        entry = {
            "导演A编号": a, "导演A名": a_name, "导演B编号": b, "导演B名": b_name,
            "中文名A": cn_names.get(a) or a_name, "中文名B": cn_names.get(b) or b_name,
            "合作片数": int(row["合作电影数"]), "总评分人数": int(row["总评分人数"]),
            "最高平均分": json_num(row["最高平均分"]),
            "片单": [{"电影编号": m, **movie_meta[m]}
                     for m in (int(x) for x in str(row["合作电影编号"]).split("|") if x)],
        }
        extra = pair_extra.get(f"{a}+{b}") or pair_extra.get(f"{b}+{a}") or {}
        if extra.get("一句话"):
            entry["一句话"] = extra["一句话"]
        if featured:
            entry["精选"] = True
        return entry

    combos, used = [], set()
    for a, b in cfg_pairs:
        row, key = pair_index.get((a, b)), tuple(sorted((a, b)))
        if row is None or key in used:
            continue
        used.add(key)
        combos.append(combo_entry(row, a, b, True))
    pool = pairs[pd.to_numeric(pairs["合作电影数"], errors="coerce") >= 2].sort_values(
        ["总评分人数", "合作电影数"], ascending=[False, False])
    for _, row in pool.iterrows():
        if len(combos) >= 24:
            break
        a, b = str(row["导演A编号"]), str(row["导演B编号"])
        key = tuple(sorted((a, b)))
        if key in used:
            continue
        used.add(key)
        combos.append(combo_entry(row, a, b))

    hot_dirs = []
    for _, row in director_df.head(12).iterrows():
        nconst, cn = row["导演编号"], cn_names.get(row["导演编号"])
        hot_dirs.append({
            "导演编号": nconst, "导演名": cn or row["导演名"], "中文名": cn or row["导演名"],
            "英文名": row["导演名"], "作品数": int(row["本库作品数"]),
            "有评分作品数": int(row["有评分作品数"]), "总评分人数": int(row["总评分人数"]),
            "加权平均分": json_num(row["加权平均分"]), "最高分": json_num(row["最高分"]),
            "肖像": f"图片/导演-{nconst}.jpg"})

    hot_films = []
    for row in base[base["评分人数"].notna()].sort_values(
            ["评分人数", "平均分", "电影编号"], ascending=[False, False, True]).head(10).itertuples(index=False):
        mid = int(row.电影编号)
        hot_films.append({
            "电影编号": mid, "片名": row.片名, "上映年份": json_num(row.上映年份),
            "评分人数": json_num(row.评分人数), "平均分": json_num(row.平均分),
            "导演名": [cn_names.get(nid) or dir_names.get(nid, nid) for nid in movie_dirs.get(mid, [])] or ["未知"],
            "图片": f"图片/电影-{mid}.jpg"})

    cov = dict(zip(coverage_df["指标"], coverage_df["数值"]))
    stats = {k: int(cov[k]) for k in [
        "电影总数", "有导演电影数", "缺导演电影数", "导演总数", "联合执导电影数", "共创组合数"]}
    return {"统计": stats, "精选": selected, "共创": {"组合": combos},
            "榜单": {"人气导演": hot_dirs, "热门电影": hot_films}}


def main() -> int:
    ap = argparse.ArgumentParser(description="生成导演板块加工表与前端数据")
    ap.add_argument("--no-js", action="store_true", help="只生成加工表与候选 JSON")
    args = ap.parse_args()

    require_imdb_files()
    t0 = time.time()
    base = read_movies()
    tconsts = set(base["tconst"].dropna())
    crew = scan_tsv(CACHE / "title.crew.tsv.gz", ["tconst", "directors"], "tconst", tconsts)
    crew_map = {r.tconst: parse_directors(r.directors) for r in crew.drop_duplicates("tconst").itertuples(index=False)}
    crew_map = {k: v for k, v in crew_map.items() if v}
    log(f"title.crew 命中 {len(crew):,} 部，其中有导演 {len(crew_map):,} 部")
    name_map = scan_names({n for dirs in crew_map.values() for n in dirs})
    imdb_ratings = scan_imdb_ratings(tconsts)
    basics = scan_basics(tconsts)
    log(f"IMDb 姓名 {len(name_map):,} 位、评分 {len(imdb_ratings):,} 部、片长年份 {len(basics):,} 部")

    long = build_long_table(base, crew_map, name_map, imdb_ratings, basics)
    director_df = build_director_table(long, name_map)
    top10 = build_top10(long)
    pairs = build_pairs(long)
    coverage_df = build_coverage(base, crew, long, pairs, imdb_ratings, basics, name_map, top10)
    for df, name in [(director_df, "导演表.csv"), (long, "导演作品表.csv"), (pairs, "导演合作表.csv"),
                     (top10, "导演前十作品.csv"), (coverage_df, "导演数据覆盖.csv")]:
        df.to_csv(PROC / name, index=False, encoding="utf-8-sig")
        log(f"写出 加工数据/{name}（{len(df):,} 行）")

    movie_meta = {int(r.电影编号): {"片名": r.片名, "上映年份": json_num(r.上映年份),
                                    "评分人数": json_num(r.评分人数), "平均分": json_num(r.平均分)}
                  for r in long.drop_duplicates("电影编号").itertuples(index=False)}
    candidates = build_candidates(director_df, top10, pairs, coverage_df, movie_meta)
    (PROC / "导演候选.json").write_text(json.dumps(candidates, ensure_ascii=False, indent=1), encoding="utf-8")
    log(f"写出 加工数据/导演候选.json（导演 {len(candidates['导演'])} 位，共创 {len(candidates['共创'])} 组）")

    if not args.no_js:
        web_data = build_web_data(director_df, top10, pairs, long, base, coverage_df, movie_meta)
        (WEB / "导演数据.js").write_text(
            "// 导演板块前端数据 · 由 脚本/生成导演数据.py 自动生成，勿手改\n"
            "window.导演数据 = " + json.dumps(web_data, ensure_ascii=False, indent=1) + ";\n",
            encoding="utf-8")
        log(f"写出 成品网页/导演数据.js（精选 {len(web_data['精选'])} 位，共创 {len(web_data['共创']['组合'])} 组）")
    log(f"全部完成，用时 {time.time() - t0:.1f}s")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
