# -*- coding: utf-8 -*-
"""第三步：标签表。去空、去空白、统一小写，输出标签频次与单片标签。"""
from __future__ import annotations

import itertools

import pandas as pd

from 清洗公共 import 规范化标签, 质量行, 读表, 写表


def run() -> list[dict]:
    原 = 读表("标签.csv", dtype={"用户编号": "int64", "电影编号": "int64",
                                 "标签": "string", "标注时间戳": "int64"})
    总数 = len(原)
    空值 = int(原["标签"].isna().sum())
    原始唯一 = int(原["标签"].nunique())

    df = 原.dropna(subset=["标签"]).copy()
    空白 = int(df["标签"].str.strip().ne(df["标签"]).sum())
    规范化 = 规范化标签(df["标签"])
    需规范 = int((df["标签"] != 规范化).sum())
    df["标签"] = 规范化
    纯空白 = int(df["标签"].eq("").sum())
    df = df[df["标签"].ne("")]

    去重前 = len(df)
    df = df.drop_duplicates(subset=["用户编号", "电影编号", "标签"])
    重复 = 去重前 - len(df)
    规范后唯一 = int(df["标签"].nunique())

    # 新图单：界面字段和过长影评不能进入标签词图。记录实际行数与词项数。
    界面 = df["标签"].str.contains(r"sortby|tagscore|explore|movielens", regex=True, na=False)
    界面行, 界面词 = int(界面.sum()), int(df.loc[界面, "标签"].nunique())
    df = df.loc[~界面].copy()
    影评 = df["标签"].str.len().gt(60)
    影评行, 影评词 = int(影评.sum()), int(df.loc[影评, "标签"].nunique())
    df = df.loc[~影评].copy()

    规范化唯一 = int(df["标签"].nunique())
    合并数 = 原始唯一 - 规范后唯一
    单次 = int((df.groupby("标签", observed=True).size() == 1).sum())

    频次 = (df.groupby("标签", observed=True)
            .agg(标注次数=("标签", "size"), 覆盖影片数=("电影编号", "nunique"))
            .reset_index()
            .sort_values(["标注次数", "标签"], ascending=[False, True]))
    写表(频次, "标签频次.csv")

    单片 = (df.groupby(["电影编号", "标签"], observed=True)
            .agg(标注人数=("用户编号", "nunique"))
            .reset_index()
            .sort_values(["电影编号", "标注人数"], ascending=[True, False]))
    写表(单片, "电影标签.csv")

    区间名 = ["1 次", "2 次", "3-5 次", "6-10 次", "11-50 次", "51-100 次", "100 次以上"]
    次数 = 频次["标注次数"]
    分箱 = pd.cut(次数, bins=[0, 1, 2, 5, 10, 50, 100, float("inf")], labels=区间名)
    次数分布 = (分箱.value_counts().reindex(区间名).rename_axis("次数区间")
                .reset_index(name="标签数"))
    次数分布["占比"] = (次数分布["标签数"] / len(频次)).round(4)
    写表(次数分布, "标签次数分布.csv")

    # Top30 标签的电影级共现，供关系图用
    头部 = 频次.head(30)["标签"].tolist()
    头集 = set(头部)
    对 = {}
    for _, 组 in df[df["标签"].isin(头集)].groupby("电影编号", observed=True)["标签"]:
        标签们 = sorted(set(组))
        for a, b in itertools.combinations(标签们, 2):
            对[(a, b)] = 对.get((a, b), 0) + 1
    共现 = pd.DataFrame([{"标签甲": a, "标签乙": b, "共同影片数": n}
                        for (a, b), n in 对.items()])
    共现 = 共现.sort_values("共同影片数", ascending=False)
    写表(共现, "标签共现.csv")

    return [
        质量行("标签.csv", "数据行", 总数, 0, 总数, "全部读取"),
        质量行("标签.csv", "标签为空", 总数, 空值, len(df), "删除该行"),
        质量行("标签.csv", "标签纯空白", 总数, 纯空白, len(df), "删除该行"),
        质量行("标签.csv", "标签首尾空白", 总数, 空白, len(df), "去空白并合并连续空格"),
        质量行("标签.csv", "标签写法需规范化", 总数, 需规范, len(df),
               "去空白、合并连续空格、统一小写"),
        质量行("标签.csv", "大小写/空白造成重复", 原始唯一, 合并数, 规范后唯一,
               "统一小写后合并", 单位="个标签"),
        质量行("标签.csv", "同用户同片同标签重复", 总数, 重复, len(df), "保留一条"),
        质量行("标签.csv", "标签界面残留", 总数, 界面行, len(df),
               f"剔除含sortby、tagscore、explore、movielens的{界面词}个词项"),
        质量行("标签.csv", "标签长影评", 总数, 影评行, len(df),
               f"剔除超过60字符的{影评词}个词项"),
        质量行("标签.csv", "只出现一次的标签", 规范化唯一, 单次, 规范化唯一,
               "保留，排行需设门槛或图注说明", 单位="个标签"),
    ]
