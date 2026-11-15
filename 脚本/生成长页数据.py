# -*- coding: utf-8 -*-
"""生成导演长页聚合数据（首屏加载，口径见 导演板块数据说明.md）。

输出：成品网页/导演长页数据.js（window.长页数据）。
数据全部由加工表计算，不手写；中文名优先级：精选配置中文名（按编号）→ 导演中文名.json（按英文名）→ 英文名。
"""
from __future__ import annotations

import json
import math
from collections import Counter
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
PROC = ROOT / "加工数据"
WEB = ROOT / "成品网页"
SCRIPTS = ROOT / "脚本"

RATING_THRESHOLD = 50  # 榜单门槛，供图注说明
KDE_GRID = np.round(np.arange(0.5, 5.0 + 1e-9, 0.05), 2)  # 0.5–5.0，步长 0.05
C6_TOP = 80  # 生涯跨度图取 Top 80
C6_MIN_WORKS = 5  # 入选门槛：本库作品数
C6_MIN_VOTES = 10000  # 入选门槛：累计评分人数


def num(value, nd=None):
    if value is None or pd.isna(value):
        return None
    return round(float(value), nd) if nd is not None else int(float(value))


def read_cn() -> tuple[dict, dict, dict]:
    cfg = json.loads((SCRIPTS / "导演板块精选.json").read_text(encoding="utf-8-sig"))
    by_id = {str(k): str(v) for k, v in cfg.get("中文名", {}).items()}
    by_name = json.loads((SCRIPTS / "导演中文名.json").read_text(encoding="utf-8-sig"))
    return by_id, by_name, {str(k).lower(): str(v) for k, v in by_name.items()}


def read_portraits() -> set[str]:
    df = pd.read_csv(PROC / "导演图片清单.csv", dtype=str, encoding="utf-8-sig").fillna("")
    return set(df[df["类型"] == "导演肖像"]["编号"])


def portrait_path(nconst: str, portraits: set[str]):
    return f"图片/导演-{nconst}.jpg" if nconst in portraits else None


def unified_card(nconst, name, cnname, v1, v2, portraits, extra=None):
    card = {"编号": nconst, "名": name, "中文名": cnname, "数值1": v1, "数值2": v2,
            "肖像": portrait_path(nconst, portraits)}
    if extra:
        card.update(extra)
    return card


# ---------- C1 产量长尾 ----------
def build_c1(dd, cn) -> dict:
    buckets = [(1, 1, "1 部"), (2, 4, "2–4 部"), (5, 9, "5–9 部"),
               (10, 19, "10–19 部"), (20, 49, "20–49 部"), (50, 10 ** 9, "50 部以上")]
    distribution = [{"标签": label, "数量": int(((dd["本库作品数"] >= lo) & (dd["本库作品数"] <= hi)).sum())}
                    for lo, hi, label in buckets]
    top = dd.sort_values(["本库作品数", "总评分人数", "导演编号"], ascending=[False, False, True]).head(15)
    chart = [{"编号": r.导演编号, "名": r.导演名, "中文名": cn(r.导演编号, r.导演名),
              "作品数": int(r.本库作品数), "累计人数": int(r.总评分人数), "均分": num(r.加权平均分, 3)}
             for r in top.itertuples(index=False)]
    assert sum(x["数量"] for x in distribution) == len(dd)
    return {"分档": distribution, "产量榜": chart}


# ---------- C2 注意力集中度 ----------
def build_c2(dd, cn) -> dict:
    ranked = dd.sort_values(["总评分人数", "导演编号"], ascending=[False, True]).reset_index(drop=True)
    votes = ranked["总评分人数"].fillna(0).to_numpy(dtype=float)
    cumulative = np.cumsum(votes) / votes.sum()
    n = len(votes)
    sample_idx = np.unique(np.r_[
        np.geomspace(1, n, 250).round().astype(int) - 1,
        np.linspace(0, n - 1, 250).round().astype(int),
        [math.ceil(n * p / 100) - 1 for p in (1, 5, 10)],
    ]).tolist()
    curve = [[round((i + 1) / n * 100, 4), round(cumulative[i] * 100, 3)] for i in sample_idx]
    key = {}
    for p in (1, 5, 10):
        idx = min(max(math.ceil(n * p / 100) - 1, 0), n - 1)
        key[f"前{p}"] = round(float(cumulative[idx]) * 100, 2)
    top = ranked.head(10)
    audience = [{"编号": r.导演编号, "名": r.导演名, "中文名": cn(r.导演编号, r.导演名),
                 "累计人数": int(r.总评分人数), "加权均分": num(r.加权平均分, 3),
                 "作品数": int(r.本库作品数)} for r in top.itertuples(index=False)]
    head_count = math.ceil(n / 100)
    head = {"导演数": head_count, "评分记录数": int(votes[:head_count].sum()),
            "评分占比": round(float(cumulative[head_count - 1]) * 100, 4)}
    return {"曲线": curve, "关键点": key, "头部": head, "合计人数": int(votes.sum()), "观众榜": audience,
            "说明": "累计人数含联合执导重复计入：多导演片会同时计入每位导演，合计大于评分数"}


# ---------- C3 口碑分布（四档 KDE） ----------
def kde_curve(sample: np.ndarray) -> list:
    std = float(sample.std())
    band = max(1.06 * std * len(sample) ** (-0.2), 0.02)
    density = np.exp(-0.5 * ((KDE_GRID[:, None] - sample[None, :]) / band) ** 2).mean(axis=1)
    density = density / (band * math.sqrt(2 * math.pi))
    return [[float(x), round(float(d), 4)] for x, d in zip(KDE_GRID, density)]


def build_c3(dd, cn) -> dict:
    groups = [(1, 1, "1 部"), (2, 4, "2–4 部"), (5, 9, "5–9 部"), (10, 10 ** 9, "10+ 部")]
    tiers = []
    for lo, hi, label in groups:
        sub = dd[(dd["本库作品数"] >= lo) & (dd["本库作品数"] <= hi) & dd["加权平均分"].notna()]
        sample = sub["加权平均分"].to_numpy(dtype=float)
        ordered = np.sort(sample)
        half = len(ordered) // 2
        tiers.append({"标签": label, "样本数": len(sample),
                      "中位": round(float(np.median(sample)), 3),
                      "四分位": [round(float(np.median(part)), 3) for part in [ordered[:half], ordered[-half:]]],
                      "标准差": round(float(sample.std()), 3),
                      "曲线": kde_curve(sample)})
    high = dd[(dd["本库作品数"] >= 5) & (dd["总评分人数"] >= 50000)].sort_values(
        ["加权平均分", "总评分人数", "导演编号"], ascending=[False, False, True]).head(10)
    high_cards = [{"编号": r.导演编号, "名": r.导演名, "中文名": cn(r.导演编号, r.导演名),
                   "加权均分": num(r.加权平均分, 3), "累计人数": int(r.总评分人数),
                   "作品数": int(r.本库作品数)} for r in high.itertuples(index=False)]
    return {"档": tiers, "高分榜": high_cards,
            "说明": "四档按本库作品数分；只统计有加权均分的导演"}


# ---------- C4 叫好 × 叫座四象限 ----------
def build_c4(dd, cn, portraits) -> dict:
    c4 = dd[(dd["本库作品数"] >= 3) & (dd["总评分人数"] >= 20000) & dd["加权平均分"].notna()].copy()
    split_x = float(c4["总评分人数"].median())
    split_y = float(c4["加权平均分"].median())
    points = [{"编号": r.导演编号, "名": r.导演名, "中文名": cn(r.导演编号, r.导演名),
               "x": int(r.总评分人数), "y": num(r.加权平均分, 3),
               "作品数": int(r.本库作品数), "首部年": num(r.首部上映年)}
              for r in c4.sort_values("总评分人数", ascending=False).itertuples(index=False)]
    quadrants = {
        "高人气高口碑": (c4["总评分人数"] >= split_x) & (c4["加权平均分"] >= split_y),
        "低人气高口碑": (c4["总评分人数"] < split_x) & (c4["加权平均分"] >= split_y),
        "低人气低口碑": (c4["总评分人数"] < split_x) & (c4["加权平均分"] < split_y),
        "高人气低口碑": (c4["总评分人数"] >= split_x) & (c4["加权平均分"] < split_y),
    }
    samples = []
    for label, cond in quadrants.items():
        sub = c4[cond].copy()
        score = (sub["加权平均分"].rank(ascending=False, method="min")
                 + sub["总评分人数"].rank(ascending=False, method="min"))
        for r in sub.assign(得分=score).sort_values(["得分", "导演编号"]).head(2).itertuples(index=False):
            samples.append(unified_card(r.导演编号, r.导演名, cn(r.导演编号, r.导演名),
                                        int(r.总评分人数), num(r.加权平均分, 3), portraits,
                                        {"象限": label}))
    recommendations = [row['编号'] for row in sorted(points, key=lambda row: (-row['y'], row['x'], row['编号']))
                       if row['y'] >= 4 and row['x'] < split_x]
    return {"点": points, "推荐": recommendations,
            "四象限": {"x切分": split_x, "y切分": round(split_y, 3)}, "示例卡": samples,
            "说明": f"作品≥3 部且累计人数≥2 万；k={len(points)} 位；x 轴建议对数刻度"}


# ---------- C5 共创网络 ----------
def force_layout(count: int, edges: list[tuple[int, int, int]], iters: int = 180) -> tuple[np.ndarray, np.ndarray]:
    """确定性力导向布局（圆形初始位，无随机数），返回归一化到 5–95 的坐标。"""
    width = height = 100.0
    pos = np.array([[math.cos(2 * math.pi * i / count) * width / 4,
                     math.sin(2 * math.pi * i / count) * height / 4] for i in range(count)], dtype=float)
    weight = np.zeros((count, count))
    for si, ti, w in edges:
        weight[si, ti] += w
        weight[ti, si] += w
    k = math.sqrt(width * height / count)
    temperature = width / 8
    for _ in range(iters):
        disp = np.zeros_like(pos)
        delta = pos[:, None, :] - pos[None, :, :]
        dist = np.maximum(np.linalg.norm(delta, axis=2), 0.05)
        force = k * k / dist
        np.fill_diagonal(force, 0.0)
        disp += (delta / dist[:, :, None] * force[:, :, None]).sum(axis=1)
        for si, ti, w in edges:
            d = pos[si] - pos[ti]
            length = max(float(np.linalg.norm(d)), 0.05)
            f = length * length / k * min(w, 5)
            disp[si] -= d / length * f
            disp[ti] += d / length * f
        for i in range(count):
            length = max(float(np.linalg.norm(disp[i])), 0.01)
            pos[i] += disp[i] / length * min(length, temperature)
        temperature *= 0.96

    def scale(values: np.ndarray) -> np.ndarray:
        lo, hi = float(values.min()), float(values.max())
        return np.full_like(values, 50.0) if hi <= lo else (values - lo) / (hi - lo) * 90 + 5
    return scale(pos[:, 0]), scale(pos[:, 1])


def build_c5(dd, pairs, movie_titles: dict, cfg: dict, cn, portraits) -> dict:
    p2 = pairs[pairs["合作电影数"] >= 2]
    acc = {}
    for r in p2.itertuples(index=False):
        for nid, name in ((r.导演A编号, r.导演A名), (r.导演B编号, r.导演B名)):
            entry = acc.setdefault(nid, {"名": name, "合作片数": 0, "合计人数": 0})
            entry["合作片数"] += int(r.合作电影数)
            entry["合计人数"] += int(r.总评分人数 or 0)
    ids = list(acc)
    rank_works = {nid: i for i, nid in enumerate(sorted(ids, key=lambda n: (-acc[n]["合作片数"], -acc[n]["合计人数"], n)))}
    rank_aud = {nid: i for i, nid in enumerate(sorted(ids, key=lambda n: (-acc[n]["合计人数"], -acc[n]["合作片数"], n)))}
    picked = sorted(ids, key=lambda n: (rank_works[n] + rank_aud[n], n))[:40]
    featured = {x for pair in cfg.get("共创组合", []) for x in pair}
    picked = list(dict.fromkeys(picked + sorted(featured - set(picked))))
    node_index = {nid: i for i, nid in enumerate(picked)}

    def age_band(year):
        if year is None or pd.isna(year):
            return "年代未知"
        year = int(year)
        return "1960 年前" if year < 1960 else ("1960–1979" if year < 1980 else ("1980–1999" if year < 2000 else "2000 年后"))

    dd_idx = dd.set_index("导演编号")
    nodes = []
    for nid in picked:
        row = dd_idx.loc[nid]
        nodes.append({"编号": nid, "名": acc[nid]["名"], "中文名": cn(nid, acc[nid]["名"]),
                      "x": 0.0, "y": 0.0, "类别": age_band(row["首部上映年"]),
                      "作品数": int(row["本库作品数"])})
    edges_data = []
    for r in p2.itertuples(index=False):
        a, b = r.导演A编号, r.导演B编号
        if a in node_index and b in node_index:
            mids = [int(x) for x in str(r.合作电影编号).split("|") if x]
            edges_data.append({"源索引": node_index[a], "目标索引": node_index[b],
                               "合作片数": int(r.合作电影数),
                               "片单": [movie_titles.get(m, "") for m in mids]})
    layout_edges = [(node_index[r.导演A编号], node_index[r.导演B编号], int(r.合作电影数))
                    for r in p2.itertuples(index=False)
                    if r.导演A编号 in node_index and r.导演B编号 in node_index]
    xs, ys = force_layout(len(nodes), layout_edges)
    for node, x, y in zip(nodes, xs, ys):
        node["x"], node["y"] = round(float(x), 1), round(float(y), 1)

    pair_lookup = {}
    for r in pairs.itertuples(index=False):
        pair_lookup.setdefault((r.导演A编号, r.导演B编号), r)
        pair_lookup.setdefault((r.导演B编号, r.导演A编号), r)
    cards = []
    for a, b in cfg.get("共创组合", []):
        row = pair_lookup.get((a, b))
        if row is None:
            continue
        mids = [int(x) for x in str(row.合作电影编号).split("|") if x]
        name_a, name_b = row.导演A名, row.导演B名
        if row.导演A编号 != a:
            name_a, name_b = name_b, name_a
        cards.append({
            "编号": f"{a}+{b}", "名": f"{name_a} × {name_b}",
            "中文名": f"{cn(a, name_a)} × {cn(b, name_b)}",
            "数值1": int(row.合作电影数), "数值2": int(row.总评分人数 or 0),
            "肖像": portrait_path(a, portraits) or portrait_path(b, portraits),
            "肖像A": portrait_path(a, portraits), "肖像B": portrait_path(b, portraits),
            "导演A编号": a, "导演B编号": b,
            "片单": [movie_titles.get(m, "") for m in mids],
        })
    featured_pairs = {tuple(sorted(pair)) for pair in cfg.get("共创组合", [])}
    combo_points = [{
        "导演A编号": r.导演A编号, "导演A名": r.导演A名, "中文名A": cn(r.导演A编号, r.导演A名),
        "导演B编号": r.导演B编号, "导演B名": r.导演B名, "中文名B": cn(r.导演B编号, r.导演B名),
        "合作片数": int(r.合作电影数), "合计人数": int(r.总评分人数 or 0),
        "最高平均分": num(r.最高平均分, 3),
        "精选": tuple(sorted((r.导演A编号, r.导演B编号))) in featured_pairs,
    } for r in p2.itertuples(index=False)]
    return {"节点": nodes, "边": edges_data, "组合卡": cards, "组合点": combo_points,
            "说明": "只统计合作≥2 部的组合；点=一组搭档，x=合作片数，y=合计评分人数"}


# ---------- C6 生涯跨度 ----------
def build_c6(dd, cn, portraits) -> dict:
    eligible = dd[(dd["本库作品数"] >= C6_MIN_WORKS) & (dd["总评分人数"] >= C6_MIN_VOTES)]
    eligible = eligible[eligible["首部上映年"].notna() & eligible["最近上映年"].notna()].copy()
    eligible["跨度"] = eligible["最近上映年"] - eligible["首部上映年"] + 1
    top = eligible.sort_values(["跨度", "总评分人数", "导演编号"],
                               ascending=[False, False, True]).head(C6_TOP)
    segments = [{"编号": r.导演编号, "名": r.导演名, "中文名": cn(r.导演编号, r.导演名),
                 "首年": int(r.首部上映年), "末年": int(r.最近上映年), "跨度": int(r.跨度),
                 "作品数": int(r.本库作品数), "累计人数": int(r.总评分人数)}
                for r in top.itertuples(index=False)]
    longest = segments[0]
    average = round(float(np.mean([s["跨度"] for s in segments])), 1)
    # 全库最长（不受入图门槛限制），供图注回答“为什么不是全库最长”
    universe = dd[dd["首部上映年"].notna() & dd["最近上映年"].notna()].copy()
    universe["跨度"] = universe["最近上映年"] - universe["首部上映年"] + 1
    global_longest = universe.sort_values(["跨度", "总评分人数", "导演编号"],
                                          ascending=[False, False, True]).iloc[0]
    note = (f"按生涯跨度选 Top{C6_TOP}，不是按观众选；入图门槛：本库作品≥{C6_MIN_WORKS} 且"
            f"累计评分人数≥{C6_MIN_VOTES / 10000:g} 万；跨度 = 末年 - 首年 + 1。"
            f"入图最长：{longest['名']} {longest['跨度']} 年（{longest['首年']}–{longest['末年']}）；"
            f"全库最长：{global_longest['导演名']} {int(global_longest['首部上映年'])}–"
            f"{int(global_longest['最近上映年'])} 共 {int(global_longest['跨度'])} 年，"
            f"累计仅 {int(global_longest['总评分人数']):,} 人评分，未达观众门槛，所以不在图里。")
    return {"段": segments,
            "最长": unified_card(longest["编号"], longest["名"], longest["中文名"],
                                longest["跨度"], longest["作品数"], portraits),
            "平均": average, "说明": note}


def build_chronicle(dd, long, cn, portraits) -> dict:
    eligible = dd[(dd['本库作品数'] >= 5) & (dd['总评分人数'] >= 10000)
                  & dd['首部上映年'].notna()].copy()
    eligible['代际'] = eligible['首部上映年'] // 20 * 20
    selected = eligible.sort_values('总评分人数', ascending=False).groupby('代际').head(1)
    selected = selected.sort_values('首部上映年').head(1)
    people = [{'编号': row.导演编号, '名': cn(row.导演编号, row.导演名),
               '肖像': portrait_path(row.导演编号, portraits), '作品数': int(row.本库作品数),
               '首年': int(row.首部上映年)} for row in selected.itertuples(index=False)]
    indices = {person['编号']: index for index, person in enumerate(people)}
    films = long[long['导演编号'].isin(indices) & long['上映年份'].notna()].copy()
    films = films.sort_values(['上映年份', '评分人数'], ascending=[True, False])
    groups = films.groupby(['导演编号', '上映年份'])
    films['层位'] = (groups.cumcount() - (groups['电影编号'].transform('size') - 1) / 2)
    films['层位'] *= .6 / groups['电影编号'].transform('size')
    dots = [{'导演序号': indices[row.导演编号], '电影编号': int(row.电影编号),
             '年份': int(row.上映年份), '片名': row.片名, '均分': num(row.平均分, 3),
             '评分人数': num(row.评分人数), '层位': round(float(row.层位), 4)}
            for row in films.itertuples(index=False)]
    return {'导演': people, '作品': dots}


# ---------- C7 类型偏好 ----------
def build_c7(dd, long, cn, portraits) -> dict:
    types_counter = Counter()
    for value in long["类型中文"]:
        for kind in str(value).split("|"):
            if kind and kind != "未标注":
                types_counter[kind] += 1
    types = [kind for kind, _ in types_counter.most_common(12)]
    top30 = dd.sort_values(["总评分人数", "导演编号"], ascending=[False, True]).head(30)
    names = {r.导演编号: r.导演名 for r in top30.itertuples(index=False)}
    type_counts = {nid: Counter() for nid in names}
    for r in long[long["导演编号"].isin(names)].itertuples(index=False):
        for kind in str(r.类型中文).split("|"):
            if kind in types:
                type_counts[r.导演编号][kind] += 1
    matrix = []
    for nid in names:
        counts = np.array([type_counts[nid][kind] for kind in types], dtype=float)
        matrix.append(np.round(counts / counts.sum(), 3).tolist() if counts.sum() else [0.0] * len(types))

    specialists = {}
    for j, kind in enumerate(types):
        best = None
        for i, nid in enumerate(names):
            works = type_counts[nid][kind]
            share = matrix[i][j]
            if works >= 5 and (best is None or share > best[0] or (share == best[0] and works > best[2])):
                best = (share, nid, works)
        if best:
            share, nid, works = best
            if nid not in specialists or share > specialists[nid]["占比"]:
                specialists[nid] = {"编号": nid, "名": names[nid], "中文名": cn(nid, names[nid]),
                                    "类型": kind, "占比": share, "作品数": works,
                                    "肖像": portrait_path(nid, portraits)}
    ranking = sorted(specialists.values(), key=lambda x: (-x["占比"], x["编号"]))[:10]
    return {"导演": [{"编号": nid, "名": names[nid], "中文名": cn(nid, names[nid])} for nid in names],
            "类型": types, "矩阵": matrix, "专精榜": ranking}


def build_cards(c1, c2, c3, c5, c6, c7, cn, portraits) -> dict:
    def card_from(nid, name, v1, v2):
        return unified_card(nid, name, cn(nid, name), v1, v2, portraits)
    return {
        "产量榜": [card_from(x["编号"], x["名"], x["作品数"], x["累计人数"]) for x in c1["产量榜"][:10]],
        "观众榜": [card_from(x["编号"], x["名"], x["累计人数"], x["加权均分"]) for x in c2["观众榜"]],
        "高分榜": [card_from(x["编号"], x["名"], x["加权均分"], x["累计人数"]) for x in c3["高分榜"]],
        "组合卡": c5["组合卡"],
        "最长生涯": [{**c6["最长"], "说明": c6["说明"]}],
        "类型专精": [{"编号": x["编号"], "名": x["名"], "中文名": x["中文名"],
                      "数值1": x["占比"], "数值2": x["作品数"], "肖像": x["肖像"]} for x in c7["专精榜"]],
    }


def main() -> None:
    dd = pd.read_csv(PROC / "导演表.csv", dtype=str, encoding="utf-8-sig")
    long = pd.read_csv(PROC / "导演作品表.csv", dtype=str, encoding="utf-8-sig")
    pairs = pd.read_csv(PROC / "导演合作表.csv", dtype=str, encoding="utf-8-sig")
    coverage = pd.read_csv(PROC / "导演数据覆盖.csv", dtype=str, encoding="utf-8-sig")
    rating = pd.read_csv(PROC / "电影评分汇总.csv", dtype=str, encoding="utf-8-sig")
    cfg = json.loads((SCRIPTS / "导演板块精选.json").read_text(encoding="utf-8-sig"))
    by_id, by_name, by_name_low = read_cn()
    portraits = read_portraits()

    def cn(nid: str, name: str):
        return by_id.get(nid) or by_name.get(name) or by_name_low.get(str(name).lower()) or name

    for c in ["本库作品数", "有评分作品数", "总评分人数", "加权平均分", "首部上映年", "最近上映年"]:
        dd[c] = pd.to_numeric(dd[c], errors="coerce")
    for c in ["合作电影数", "总评分人数"]:
        pairs[c] = pd.to_numeric(pairs[c], errors="coerce")
    long["电影编号"] = pd.to_numeric(long["电影编号"], errors="coerce")
    long["评分人数"] = pd.to_numeric(long["评分人数"], errors="coerce")
    long['上映年份'] = pd.to_numeric(long['上映年份'], errors='coerce')
    long['平均分'] = pd.to_numeric(long['平均分'], errors='coerce')
    movie_titles = {int(r.电影编号): r.片名 for r in long.drop_duplicates("电影编号").itertuples(index=False)}
    coverage_map = {str(k): int(float(v)) for k, v in zip(coverage["指标"], coverage["数值"])}

    c1 = build_c1(dd, cn)
    c2 = build_c2(dd, cn)
    c3 = build_c3(dd, cn)
    c4 = build_c4(dd, cn, portraits)
    c5 = build_c5(dd, pairs, movie_titles, cfg, cn, portraits)
    c6 = build_c6(dd, cn, portraits)
    c6['年谱'] = build_chronicle(dd, long, cn, portraits)
    c7 = build_c7(dd, long, cn, portraits)
    cards = build_cards(c1, c2, c3, c5, c6, c7, cn, portraits)

    data = {
        "统计": {
            "电影总数": coverage_map["电影总数"],
            "有导演电影数": coverage_map["有导演电影数"],
            "导演总数": coverage_map["导演总数"],
            "关系数": coverage_map["导演作品关系数"],
            "合作对数": coverage_map["共创组合数"],
            "有评分电影数": int(rating["评分人数"].notna().sum()),
        },
        "C1": c1, "C2": c2, "C3": c3, "C4": c4,
        "C5": c5, "C6": c6, "C7": c7, "卡片": cards,
    }
    text = "window.长页数据 = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (WEB / "导演长页数据.js").write_text(text, encoding="utf-8")
    print(f"导演长页数据 {len(text.encode('utf-8')) / 1024:.1f} KB")
    print("C1 分档", c1["分档"])
    print("C1 产量榜前3", [(x["名"], x["作品数"]) for x in c1["产量榜"][:3]])
    print("C2 关键点", c2["关键点"], "曲线点", len(c2["曲线"]))
    print("C3 档", [(x["标签"], x["样本数"], x["中位"], x["标准差"]) for x in c3["档"]], "曲线点", len(c3["档"][0]["曲线"]))
    print("C4 点数", len(c4["点"]), "四象限", c4["四象限"], "示例卡", [(x["名"], x["象限"]) for x in c4["示例卡"]])
    print("C5 节点", len(c5["节点"]), "边", len(c5["边"]), "组合卡", len(c5["组合卡"]),
          "组合点", len(c5["组合点"]), "类别", Counter(x["类别"] for x in c5["节点"]))
    print("C6 段", len(c6["段"]), "最长", c6["最长"]["名"], c6["最长"]["数值1"], "平均", c6["平均"])
    print("C7 类型", c7["类型"], "矩阵", (len(c7["矩阵"]), len(c7["矩阵"][0])), "专精", [(x["名"], x["类型"], x["占比"]) for x in c7["专精榜"][:5]])


if __name__ == "__main__":
    main()
