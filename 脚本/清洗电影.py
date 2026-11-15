# -*- coding: utf-8 -*-
"""第一步：电影表。片名去空白、拆上映年份、补类型中文名。"""
from __future__ import annotations

import re

import pandas as pd

from 清洗公共 import 类型中文, 质量行, 读表, 写表

年份末尾 = re.compile(r"\((\d{4})\)\s*$")
年份任意 = re.compile(r"\((\d{4})\)")


def 取年份(片名: str) -> str:
    m = 年份末尾.search(片名)
    if m:
        return m.group(1)
    # 兜底：括号畸形（如结尾多一个右括号）时取最后一个四位年份
    allm = 年份任意.findall(片名)
    return allm[-1] if allm else ""


def run() -> list[dict]:
    原 = 读表("电影.csv", dtype={"电影编号": "int64", "片名": "string", "类型": "string"})
    总数 = len(原)

    df = 原.copy()
    df["片名"] = df["片名"].str.strip()
    空白 = int((原["片名"] != df["片名"]).sum())

    严格失败 = int(df["片名"].str.extract(年份末尾, expand=False).isna().sum())
    df["上映年份"] = df["片名"].map(取年份)
    df["上映年份"] = df["上映年份"].replace("", pd.NA).astype("Int64")
    最终缺失 = int(df["上映年份"].isna().sum())
    兜底找回 = 严格失败 - 最终缺失

    拆分 = df["类型"].str.split("|", regex=False)
    未知 = sorted({x for xs in 拆分 for x in xs if x not in 类型中文})
    df["类型中文"] = 拆分.map(lambda xs: "|".join(类型中文.get(x, x) for x in xs))
    无类型 = int(df["类型"].eq("(no genres listed)").sum())

    df = df[["电影编号", "片名", "上映年份", "类型", "类型中文"]]
    写表(df, "电影.csv")

    # 给 hjp 的直用表：类型分布、年代分布、年代×类型矩阵
    有类型 = df[df["类型"].ne("(no genres listed)")]
    类型长 = 有类型["类型中文"].str.split("|", regex=False).explode()
    类型分布 = 类型长.value_counts().rename_axis("类型").reset_index(name="影片数")
    写表(类型分布, "类型分布.csv")

    有年份 = df[df["上映年份"].notna()].copy()
    有年份["年代"] = (有年份["上映年份"].astype(int) // 10 * 10).astype(int)
    年代分布 = (有年份["年代"].value_counts().sort_index()
                .rename_axis("年代").reset_index(name="影片数"))
    写表(年代分布, "年代分布.csv")

    矩阵源 = 有年份[有年份["类型"].ne("(no genres listed)")].copy()
    矩阵源["类型"] = 矩阵源["类型中文"].str.split("|", regex=False)
    矩阵 = (矩阵源.explode("类型")
            .groupby(["年代", "类型"], observed=True).size()
            .rename("影片数").reset_index())
    # 补成完整网格：没有组合的格子填 0，热力图直接可用
    网格 = pd.MultiIndex.from_product(
        [sorted(有年份["年代"].unique()), 类型分布["类型"].tolist()],
        names=["年代", "类型"]).to_frame(index=False)
    矩阵 = (网格.merge(矩阵, on=["年代", "类型"], how="left")
            .fillna({"影片数": 0}))
    矩阵["影片数"] = 矩阵["影片数"].astype(int)
    矩阵 = 矩阵.sort_values(["年代", "类型"])
    写表(矩阵, "年代类型矩阵.csv")

    # 逐年 × 类型，给动态排序柱状图用；1980 到 2022，2023 不完整不取
    年份源 = 有年份[有年份["类型"].ne("(no genres listed)")].copy()
    年份源["类型"] = 年份源["类型中文"].str.split("|", regex=False)
    年份矩阵 = (年份源.explode("类型")
                .groupby(["上映年份", "类型"], observed=True).size()
                .rename("影片数").reset_index()
                .rename(columns={"上映年份": "年份"}))
    年份矩阵["年份"] = 年份矩阵["年份"].astype(int)
    年份网格 = pd.MultiIndex.from_product(
        [range(1980, 2023), 类型分布["类型"].tolist()],
        names=["年份", "类型"]).to_frame(index=False)
    年份矩阵 = (年份网格.merge(年份矩阵, on=["年份", "类型"], how="left")
                .fillna({"影片数": 0}))
    年份矩阵["影片数"] = 年份矩阵["影片数"].astype(int)
    写表(年份矩阵, "年份类型矩阵.csv")

    return [
        质量行("电影.csv", "数据行", 总数, 0, 总数, "全部保留"),
        质量行("电影.csv", "片名首尾空白", 总数, 空白, 总数, "去首尾空格", 单位="部"),
        质量行("电影.csv", "上映年份严格解析失败", 总数, 严格失败, 总数,
               "正则兜底找回 %d 条" % 兜底找回),
        质量行("电影.csv", "上映年份最终缺失", 总数, 最终缺失, 总数,
               "留空不剔除，年代图注明未计入", 单位="部"),
        质量行("电影.csv", "类型为未标注", 总数, 无类型, 总数,
               "保留并标为未标注，类型统计时剔除", 单位="部"),
        质量行("电影.csv", "未知类型取值", 总数, len(未知), 总数, "无" if not 未知 else str(未知),
               单位="个"),
    ]
