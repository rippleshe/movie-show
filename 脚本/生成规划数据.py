"""SS 新图单数据底座。分块读评分；全部产物为中文表头、UTF-8 BOM。

conda run -n student-coursework python 脚本/生成规划数据.py
需在 跑清洗.py 后运行；不会修改原始数据。
"""
from __future__ import annotations

import csv
import json
import re
import sys
from collections import defaultdict
from itertools import combinations
from pathlib import Path

sys.dont_write_bytecode = True
import numpy as np
import pandas as pd
from scipy import sparse
from sklearn.cluster import KMeans
from sklearn.decomposition import TruncatedSVD
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.preprocessing import StandardScaler
from threadpoolctl import threadpool_limits
from 清洗公共 import 写表

根 = Path(__file__).resolve().parent.parent
停用词 = set("the a an of and or for with from to in on at by that this is are was were be it its but as".split())


def 读(名, 原始=False, **参数):
    路径 = 根 / ("原始数据" if 原始 else "加工数据") / 名
    with 路径.open(encoding="utf-8-sig", newline="") as f:
        首行 = next(csv.reader(f))
    if not 首行 or not all(re.search(r"[\u4e00-\u9fff]", x) for x in 首行):
        raise ValueError(f"{名} 首行不是中文表头：{首行}")
    return pd.read_csv(路径, encoding="utf-8-sig", **参数)


def 分词(文本):
    return {w for w in re.findall(r"[a-z]+(?:'[a-z]+)?", str(文本).lower()) if len(w) > 1 and w not in 停用词}


def 评分用户(电影):
    编号 = 电影["电影编号"].to_numpy()
    类型 = sorted(set("|".join(电影["类型中文"].fillna("")).split("|")) - {"", "未标注"})
    类型序 = {g: i for i, g in enumerate(类型)}
    行, 列 = [], []
    for i, s in enumerate(电影["类型中文"]):
        for g in s.split("|"):
            if g in 类型序:
                行.append(i)
                列.append(类型序[g])
    G = sparse.csr_matrix((np.ones(len(行), dtype="float32"), (行, 列)), shape=(len(电影), len(类型)))
    # MovieLens 用户编号是正整数，先按编号上界留余量，最后只保留实际出现者。
    上限 = 400_001
    n = np.zeros(上限, dtype="int64")
    总和 = np.zeros(上限)
    平方和 = np.zeros(上限)
    高 = np.zeros(上限, dtype="int64")
    低 = 高.copy()
    最早 = np.full(上限, np.iinfo(np.int64).max, dtype="int64")
    最晚 = np.zeros(上限, dtype="int64")
    类型数 = np.zeros((上限, len(类型)), dtype="float32")
    类型和 = 类型数.copy()
    喜欢 = 类型数.copy()
    年代 = (电影["上映年份"].fillna(-1).to_numpy(dtype=int) // 10 * 10)
    年代档 = sorted(set(年代))
    年代序 = {int(d): i for i, d in enumerate(年代档)}
    电影年代 = np.array([年代序[int(d)] for d in 年代])
    矩阵 = np.zeros((29, len(年代档)), dtype="int64")
    代表 = defaultdict(lambda: defaultdict(int))
    for 块 in 读("评分.csv", 原始=True, chunksize=1_000_000,
                 dtype={"用户编号": "int32", "电影编号": "int32", "评分": "float32", "评分时间戳": "int64"}):
        u, r, ts = (块[c].to_numpy() for c in ["用户编号", "评分", "评分时间戳"])
        if u.max() >= 上限:
            raise ValueError("用户编号超过分块缓冲区上限，需扩大上限")
        m = np.searchsorted(编号, 块["电影编号"].to_numpy())
        assert np.array_equal(编号[m], 块["电影编号"].to_numpy()), "评分含孤儿编号"
        n += np.bincount(u, minlength=上限)
        总和 += np.bincount(u, weights=r, minlength=上限)
        平方和 += np.bincount(u, weights=r * r, minlength=上限)
        高 += np.bincount(u[r >= 4], minlength=上限)
        低 += np.bincount(u[r <= 2], minlength=上限)
        np.minimum.at(最早, u, ts)
        np.maximum.at(最晚, u, ts)
        R = sparse.csr_matrix((np.ones(len(u), dtype="float32"), (u, m)), shape=(上限, len(电影)))
        类型数 += (R @ G).toarray()
        R = sparse.csr_matrix((r, (u, m)), shape=(上限, len(电影)))
        类型和 += (R @ G).toarray()
        sel = r >= 4
        R = sparse.csr_matrix((np.ones(int(sel.sum()), dtype="float32"), (u[sel], m[sel])), shape=(上限, len(电影)))
        喜欢 += (R @ G).toarray()
        年 = pd.to_datetime(ts, unit="s", utc=True).year.to_numpy() - 1995
        np.add.at(矩阵, (年, 电影年代[m]), 1)
        b = pd.DataFrame({"评分年": 年 + 1995, "上映年代": 年代[m], "电影编号": 编号[m]})
        for (y, d, mid), v in b.value_counts(sort=False).items():
            代表[(int(y), int(d))][int(mid)] += int(v)
        print(f"评分聚合 {int(n.sum()):,} 行", flush=True)

    有 = np.flatnonzero(n)
    均 = 总和[有] / n[有]
    类型均 = np.divide(类型和[有], 类型数[有], out=np.full_like(类型和[有], np.nan), where=类型数[有] > 0)
    # 未看过保持 NaN；主导类型要求至少评过5部，不满足时明确写样本不足。
    候选 = np.where(类型数[有] >= 5, 类型均, -np.inf)
    主导 = 候选.argmax(axis=1)
    足够 = np.isfinite(候选.max(axis=1))
    名 = np.array(类型, dtype=object)[主导]
    名[~足够] = "样本不足"
    占比 = 类型数[有, 主导] / n[有]
    用户 = pd.DataFrame({"用户编号": 有, "评分数": n[有],
        "首评时间": pd.to_datetime(最早[有], unit="s", utc=True).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "末评时间": pd.to_datetime(最晚[有], unit="s", utc=True).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "活跃跨度天数": np.round((最晚[有] - 最早[有]) / 86400, 3),
        "均分": 均.round(6), "标准差": np.sqrt(np.maximum(平方和[有] / n[有] - 均 ** 2, 0)).round(6),
        "高分率": (高[有] / n[有]).round(6), "低分率": (低[有] / n[有]).round(6),
        "主导类型": 名, "主导类型占比": np.where(足够, 占比, np.nan).round(6)})
    写表(用户, "用户画像.csv")
    liked = 喜欢[有]
    liked[liked < 3] = 0
    # 先按用户总评分数归一，避免五组只是在区分打分数量。
    # 多类型片分别计数，各维是“该类型被喜欢的部数 / 全部评分数”。
    偏好 = liked / n[有, None]
    z = StandardScaler().fit_transform(偏好)
    模型 = KMeans(n_clusters=5, random_state=2026, n_init=10, max_iter=150).fit(z)
    簇 = 模型.labels_
    簇名 = []
    for c in 模型.cluster_centers_:
        top = np.argsort(c)[-2:][::-1]
        簇名.append("·".join(类型[i] for i in top) + "偏好组" if c.max() > 0 else "偏好未定组")
    写表(pd.DataFrame({"用户编号": 有, "簇编号": 簇, "簇名": np.array(簇名)[簇]}), "用户类型.csv")
    画像 = []
    for k in range(5):
        sel = 簇 == k
        row = {"簇编号": k, "簇名": 簇名[k], "用户数": int(sel.sum()),
               "均分": round(float(均[sel].mean()), 6), "评分数中位": float(np.median(n[有][sel]))}
        row.update({g + "偏好": round(float(偏好[sel, i].mean()), 6) for i, g in enumerate(类型)})
        画像.append(row)
    写表(pd.DataFrame(画像), "用户类型画像.csv")
    活跃 = n[有] >= 20
    seen = (类型数[有][活跃] > 0).astype("int64")
    love = (liked[活跃] >= 3).astype("int64")
    A, B = seen.T @ seen, love.T @ love
    总 = int(活跃.sum())
    行 = []
    for i, j in combinations(range(len(类型)), 2):
        a, b, c, d = int(A[i, i]), int(A[j, j]), int(B[i, i]), int(B[j, j])
        行.append({"类型甲": 类型[i], "类型乙": 类型[j], "共同用户数": int(A[i, j]),
            "看甲也看乙比例": round(float(A[i, j] / a), 6), "看过提升度": round(float(A[i, j] * 总 / (a * b)), 6),
            "喜欢提升度": round(float(B[i, j] * 总 / (c * d)), 6) if c * d else None,
            "类型甲覆盖率": round(a / 总, 6), "类型乙覆盖率": round(b / 总, 6), "活跃用户基数": 总})
    写表(pd.DataFrame(行), "类型共偏好.csv")
    分箱 = 用户.assign(评分数区间=pd.cut(用户["评分数"], bins=np.unique(np.rint(np.geomspace(1, n.max() + 1, 24))), right=False, include_lowest=True).astype(str),
                     均分区间=pd.cut(用户["均分"], bins=np.arange(.5, 5.26, .25), right=False, include_lowest=True).astype(str))
    写表(分箱.groupby(["评分数区间", "均分区间"]).agg(用户数=("用户编号", "size"), 均分均值=("均分", "mean")).reset_index().round(6), "用户活跃分箱.csv")
    写表(pd.DataFrame([{"评分年": y + 1995, "上映年代": "未知" if d < 0 else f"{d}年代", "条数": int(矩阵[y, j])}
                      for y in range(29) for j, d in enumerate(年代档)]), "评分年代矩阵.csv")
    片名 = 电影.set_index("电影编号")["片名"].to_dict()
    写表(pd.DataFrame([{"评分年": y, "上映年代": "未知" if d < 0 else f"{d}年代", "电影编号": mid, "片名": 片名[mid], "条数": v}
         for (y, d), counter in 代表.items() for mid, v in sorted(counter.items(), key=lambda x: (-x[1], x[0]))[:3]]), "评分年代代表片.csv")
    assert int(矩阵.sum()) == int(用户["评分数"].sum()) == 33_832_162


def 内容数据(电影):
    genome = 读("标签关联度.csv")
    清 = genome.loc[~genome["标签名称"].str.lower().isin(["original", "criterion", "imdb top 250"])].copy()
    ids = np.sort(genome["电影编号"].unique())
    tags = sorted(清["标签名称"].unique())
    X = sparse.coo_matrix((清["关联度"].to_numpy(dtype="float32"),
                          (np.searchsorted(ids, 清["电影编号"]), pd.Categorical(清["标签名称"], categories=tags).codes)), shape=(len(ids), len(tags))).tocsr()
    tf = TfidfTransformer().fit_transform(X)
    emb = TruncatedSVD(n_components=24, random_state=2026).fit_transform(tf)
    模型 = KMeans(n_clusters=8, random_state=2026, n_init=10).fit(emb)
    labels = 模型.labels_
    films = 电影.set_index("电影编号").loc[ids]
    scores = 读("电影评分汇总.csv").set_index("电影编号")["评分人数"].reindex(ids).fillna(0)
    images, names = [], []
    for k in range(8):
        sel = labels == k
        top = np.argsort(np.asarray(X[sel].mean(axis=0)).ravel())[-10:][::-1]
        genres = films.loc[sel, "类型中文"].str.split("|").explode().value_counts()
        # 两个最常见类型组合为可复算的中文簇名，英文标签保留供队友解释。
        name = "·".join(genres.index[:2]) + "内容组"
        if name in names:
            name = "·".join(genres.index[:3]) + "内容组"
        names.append(name)
        representatives = scores.loc[ids[sel]].sort_values(ascending=False).head(5).index
        images.append({"簇编号": k, "簇名": name, "影片数": int(sel.sum()),
            "代表片": json.dumps([{"电影编号": int(i), "片名": films.at[i, "片名"]} for i in representatives], ensure_ascii=False),
            "高频类型": json.dumps({g: int(v) for g, v in genres.head(5).items()}, ensure_ascii=False),
            "高关联标签": json.dumps([tags[i] for i in top], ensure_ascii=False)})
    写表(pd.DataFrame({"电影编号": ids, "片名": films["片名"].to_numpy(), "簇编号": labels,
        "簇名": np.array(names)[labels], "横坐标": emb[:, 0].round(6), "纵坐标": emb[:, 1].round(6)}), "电影聚类.csv")
    写表(pd.DataFrame(images), "电影聚类画像.csv")

    标签 = 读("标签.csv", 原始=True, dtype={"标签": "string"})
    from 清洗公共 import 规范化标签
    标签 = 标签.dropna(subset=["标签"]).copy()
    标签["标签"] = 规范化标签(标签["标签"])
    标签 = 标签.loc[标签["标签"].ne("") & 标签["标签"].str.len().le(60) & ~标签["标签"].str.contains("sortby|tagscore|explore|movielens", regex=True)].drop_duplicates(["用户编号", "电影编号", "标签"])
    标签["年"] = pd.to_datetime(标签["标注时间戳"], unit="s", utc=True).dt.year
    标签["单词"] = 标签["标签"].map(分词)
    长 = 标签.explode("单词").dropna(subset=["单词"])
    词 = 长.groupby("单词").agg(出现次数=("单词", "size"), 加权次数=("用户编号", "size"), 覆盖影片数=("电影编号", "nunique"),
             覆盖标签数=("标签", "nunique"), 首次使用年=("年", "min"), 最近使用年=("年", "max")).reset_index()
    # 出现次数数词项，加权次数数去重后的用户标注，二者含义分开。
    词["出现次数"] = 长.groupby("单词")["标签"].nunique().reindex(词["单词"]).to_numpy()
    写表(词.sort_values(["加权次数", "单词"], ascending=[False, True]).head(1000), "标签词频.csv")
    单片 = 读("电影标签.csv")
    头 = 读("标签频次.csv").head(20)["标签"]
    长 = 单片.loc[单片["标签"].isin(头)].merge(电影[["电影编号", "类型中文"]], on="电影编号")
    长["类型"] = 长["类型中文"].str.split("|")
    长 = 长.explode("类型").query("类型 != '未标注'")
    写表(长.groupby(["标签", "类型"])["电影编号"].nunique().reset_index(name="共同影片数"), "标签类型矩阵.csv")


def 轻量数据(电影):
    评分 = 读("电影评分汇总.csv")
    标签 = 读("电影标签.csv", usecols=["电影编号"])
    关联 = 读("标签关联度.csv", usecols=["电影编号"])
    ids = 电影["电影编号"]
    c = pd.DataFrame({"有评分": ids.isin(评分["电影编号"]), "有标签": ids.isin(标签["电影编号"]), "有特征": ids.isin(关联["电影编号"])})
    c["覆盖组合"] = ["、".join(g for g, b in zip(["评分", "标签", "内容特征"], row) if b) or "三项全缺" for row in c.to_numpy()]
    覆盖 = c.groupby("覆盖组合").size().reset_index(name="影片数")
    覆盖["占比"] = (覆盖["影片数"] / len(电影) * 100).round(6)
    写表(覆盖, "覆盖交叉.csv")
    数据 = defaultdict(list)
    for row in 电影.itertuples(index=False):
        for word in 分词(re.sub(r"\(\d{4}\)", "", row.片名)):
            数据[word].append((row.电影编号, row.上映年份, row.片名))
    rows = []
    for word, films in 数据.items():
        年 = [int(f[1]) for f in films if pd.notna(f[1])]
        rows.append({"单词": word, "出现片数": len(films), "占比": round(len(films) / len(电影), 8),
            "中位上映年": float(np.median(年)) if 年 else None, "最早": min(年) if 年 else None,
            "最晚": max(年) if 年 else None, "代表片": films[0][2]})
    写表(pd.DataFrame(rows).sort_values(["出现片数", "单词"], ascending=[False, True]).head(5000), "片名词频.csv")
    基准 = set(评分.loc[评分["评分人数"] >= 50].sort_values(["平均分", "评分人数", "电影编号"], ascending=[False, False, True]).head(20)["电影编号"])
    rows = []
    for 门槛 in [1, 5, 10, 20, 30, 50, 100, 200, 500, 1000]:
        t = 评分.loc[评分["评分人数"] >= 门槛]
        top = set(t.sort_values(["平均分", "评分人数", "电影编号"], ascending=[False, False, True]).head(20)["电影编号"])
        rows.append({"门槛人数": 门槛, "达标影片数": len(t), "榜单重合数": len(top & 基准), "均分中位": t["平均分"].median()})
    写表(pd.DataFrame(rows), "评分门槛影响.csv")
    c["上映年代"] = (电影["上映年份"] // 10 * 10).astype("Int64")
    rows = []
    for 年, group in c.dropna(subset=["上映年代"]).groupby("上映年代"):
        rows.append({"上映年代": int(年), "影片数": len(group), **{f"缺{名}率": round(float((~group[col]).mean()), 6) for 名, col in [("评分", "有评分"), ("标签", "有标签"), ("内容特征", "有特征")]}})
    写表(pd.DataFrame(rows), "缺失率年代.csv")


def main():
    电影 = 读("电影.csv", dtype={"上映年份": "Int64"}).sort_values("电影编号").reset_index(drop=True)
    with threadpool_limits(limits=2):
        评分用户(电影)
        内容数据(电影)
        轻量数据(电影)
    print("规划 P0 12表、代表片表和2张备选表全部生成。", flush=True)


if __name__ == "__main__":
    main()
