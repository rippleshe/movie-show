# -*- coding: utf-8 -*-
"""第二步：评分表。分块聚合单片口碑、全局分值分布、年度分布。"""
from __future__ import annotations

import os

import numpy as np
import pandas as pd

from 清洗公共 import 原始数据, 评分档名, 评分档位, 读加工, 质量行, 读表, 写表

分块 = 4_000_000
类型 = {"用户编号": "int32", "电影编号": "int32", "评分": "float32", "评分时间戳": "int64"}


def run() -> list[dict]:
    路径 = os.path.join(原始数据, "评分.csv")
    总行数 = 0
    分数计数 = None
    配对计数 = None
    年度计数 = None
    最早 = 最晚 = None
    重复 = 0
    乱序 = 0
    上一对 = None

    for 块 in pd.read_csv(路径, encoding="utf-8-sig", dtype=类型, chunksize=分块):
        总行数 += len(块)
        vc = 块["评分"].value_counts()
        分数计数 = vc if 分数计数 is None else 分数计数.add(vc, fill_value=0)

        gb = 块.groupby(["电影编号", "评分"], observed=True).size()
        配对计数 = gb if 配对计数 is None else 配对计数.add(gb, fill_value=0)

        yc = pd.to_datetime(块["评分时间戳"], unit="s").dt.year.value_counts()
        年度计数 = yc if 年度计数 is None else 年度计数.add(yc, fill_value=0)

        低 = int(块["评分时间戳"].min())
        高 = int(块["评分时间戳"].max())
        最早 = 低 if 最早 is None else min(最早, 低)
        最晚 = 高 if 最晚 is None else max(最晚, 高)

        u = 块["用户编号"].to_numpy()
        m = 块["电影编号"].to_numpy()
        if len(u) > 1:
            重复 += int(((u[1:] == u[:-1]) & (m[1:] == m[:-1])).sum())
            乱序 += int(((u[1:] < u[:-1]) | ((u[1:] == u[:-1]) & (m[1:] < m[:-1]))).sum())
        if 上一对 is not None:
            if (int(u[0]), int(m[0])) == 上一对:
                重复 += 1
            if (int(u[0]), int(m[0])) < 上一对:
                乱序 += 1
        上一对 = (int(u[-1]), int(m[-1]))

    分数计数 = 分数计数.reindex(评分档位, fill_value=0).astype("int64")
    if int(分数计数.sum()) != 总行数:
        raise RuntimeError("评分分布合计与总行数不一致")

    # 全局分值分布
    分布 = pd.DataFrame({"评分": 评分档位, "条数": 分数计数.to_numpy()})
    分布["占比"] = (分布["条数"] / 总行数).round(6)
    写表(分布, "评分分值分布.csv")

    # 年度分布
    年度 = (年度计数.astype("int64").sort_index()
            .rename_axis("年份").reset_index(name="条数"))
    写表(年度, "评分年度分布.csv")

    # 单片汇总
    宽 = (配对计数.unstack(fill_value=0)
          .reindex(columns=评分档位, fill_value=0)
          .astype("int64"))
    人数 = 宽.sum(axis=1)
    档 = np.array(评分档位)
    计 = 宽.to_numpy()
    人数数组 = 人数.to_numpy()
    平均 = (计 * 档).sum(axis=1) / 人数数组
    方差 = (计 * (档[None, :] - 平均[:, None]) ** 2).sum(axis=1) / 人数数组
    标准差 = np.sqrt(方差)

    累计 = 计.cumsum(axis=1)
    位1 = (人数数组 + 1) // 2
    位2 = (人数数组 + 2) // 2
    档1 = 档[(累计 >= 位1[:, None]).argmax(axis=1)]
    档2 = 档[(累计 >= 位2[:, None]).argmax(axis=1)]
    中位 = (档1 + 档2) / 2

    汇总 = pd.DataFrame({"电影编号": 宽.index.to_numpy(), "评分人数": 人数数组,
                         "平均分": 平均.round(3), "中位数": 中位.round(3),
                         "标准差": 标准差.round(3)})
    for 名, 列 in zip(评分档名, 计.T):
        汇总[名] = 列
    电影 = 读加工("电影.csv", usecols=["电影编号", "片名", "上映年份"],
                dtype={"上映年份": "Int64"})
    汇总 = 汇总.merge(电影, on="电影编号", how="left")
    汇总["上映年份"] = 汇总["上映年份"].astype("Int64")
    汇总 = 汇总[["电影编号", "片名", "上映年份", "评分人数", "平均分",
                 "中位数", "标准差"] + 评分档名]
    写表(汇总.sort_values("电影编号"), "电影评分汇总.csv")

    区间名 = ["1-9 人", "10-49 人", "50-99 人", "100-499 人", "500-999 人", "1000 人以上"]
    分箱 = pd.cut(人数, bins=[0, 9, 49, 99, 499, 999, float("inf")], labels=区间名)
    长尾 = (分箱.value_counts().reindex(区间名).rename_axis("评分人数区间")
            .reset_index(name="影片数"))
    长尾["占比"] = (长尾["影片数"] / len(汇总)).round(4)
    写表(长尾, "评分人数分布.csv")

    # 各类型均分的箱线统计，只算 50 人以上、剔除未标注
    类型表 = 读加工("电影.csv", usecols=["电影编号", "类型中文"])
    评分片 = 汇总[汇总["评分人数"] >= 50].merge(类型表, on="电影编号", how="left")
    评分片 = 评分片[评分片["类型中文"].ne("未标注")].copy()
    评分片["类型"] = 评分片["类型中文"].str.split("|", regex=False)
    长表 = 评分片.explode("类型")
    箱线 = (长表.groupby("类型")["平均分"]
            .agg(影片数="count", 最低="min",
                 下四分位=lambda s: s.quantile(0.25),
                 中位="median",
                 上四分位=lambda s: s.quantile(0.75),
                 最高="max")
            .reset_index()
            .sort_values("中位", ascending=False))
    写表(箱线.round(3), "类型评分箱线.csv")

    # 按上映年份的评分情感构成，给河流图用
    情感列 = {"正面": ["四星", "四星半", "五星"],
              "中性": ["二星半", "三星", "三星半"],
              "负面": ["半星", "一星", "一星半", "二星"]}
    有年份 = 汇总.dropna(subset=["上映年份"])
    情感行 = []
    for 年, 组 in 有年份.groupby("上映年份", observed=True):
        for 情感, 列 in 情感列.items():
            情感行.append({"年份": int(年), "情感": 情感,
                          "条数": int(组[列].to_numpy().sum())})
    情感表 = pd.DataFrame(情感行).sort_values(["年份", "情感"])
    写表(情感表, "年份评分构成.csv")

    # 口径事实
    少于门槛 = int((人数 < 50).sum())
    全集 = set(电影["电影编号"])
    有评分 = set(汇总["电影编号"])
    从未评分 = len(全集 - 有评分)

    return [
        质量行("评分.csv", "数据行", 总行数, 0, 总行数, "全部参与聚合"),
        质量行("评分.csv", "同用户同电影重复", 总行数, 重复, 总行数, "无"),
        质量行("评分.csv", "排序违例", 总行数, 乱序, 总行数, "无"),
        质量行("评分.csv", "评分越界(不在0.5-5)", 总行数, 0, 总行数, "无"),
        质量行("评分.csv", "电影从未被评分", 总行数, 从未评分, 总行数,
               "保留在电影表，不进口碑汇总", 单位="部"),
        质量行("评分.csv", "评分人数不足50", len(有评分), 少于门槛, len(有评分),
               "统计保留，榜单按50人门槛过滤", 单位="部"),
    ]
