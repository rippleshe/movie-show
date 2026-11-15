# -*- coding: utf-8 -*-
"""第四步：标签关联度（genome）。分块取单片 Top10 与单标签 Top20，避免整表排序。"""
from __future__ import annotations

import os

import numpy as np
import pandas as pd

from 清洗公共 import 原始数据, 读加工, 质量行, 读表, 写表

分块 = 4_000_000
类型 = {"电影编号": "int32", "标签编号": "int16", "关联度": "float32"}
单片保留 = 10
单标保留 = 20


def run() -> list[dict]:
    路径 = os.path.join(原始数据, "标签关联度.csv")
    总行数 = 0
    电影集 = set()
    标签集 = set()
    电影候选 = []
    标签候选 = []
    档边 = np.arange(0, 1.0001, 0.1)
    直方 = np.zeros(10, dtype="int64")

    for 块 in pd.read_csv(路径, encoding="utf-8-sig", dtype=类型, chunksize=分块):
        总行数 += len(块)
        电影集.update(块["电影编号"].unique().tolist())
        标签集.update(块["标签编号"].unique().tolist())
        直方 += np.histogram(块["关联度"].to_numpy(), bins=档边)[0]
        块 = 块.sort_values("关联度", ascending=False, kind="stable")
        电影候选.append(块.groupby("电影编号", sort=False).head(单片保留))
        标签候选.append(块.groupby("标签编号", sort=False).head(单标保留))

    档名 = ["0-0.1", "0.1-0.2", "0.2-0.3", "0.3-0.4", "0.4-0.5",
            "0.5-0.6", "0.6-0.7", "0.7-0.8", "0.8-0.9", "0.9-1"]
    分布 = pd.DataFrame({"关联度区间": 档名, "条数": 直方})
    分布["占比"] = (分布["条数"] / 总行数).round(4)
    写表(分布, "关联度分布.csv")

    电影片 = (pd.concat(电影候选, ignore_index=True)
              .sort_values("关联度", ascending=False, kind="stable")
              .groupby("电影编号", sort=False).head(单片保留))
    标签片 = (pd.concat(标签候选, ignore_index=True)
              .sort_values("关联度", ascending=False, kind="stable")
              .groupby("标签编号", sort=False).head(单标保留))

    词典 = 读表("标签词典.csv", dtype={"标签编号": "int16", "标签名称": "string"})
    名称 = dict(zip(词典["标签编号"], 词典["标签名称"]))

    电影表 = 电影片[["电影编号", "标签编号", "关联度"]].copy()
    电影表["标签名称"] = 电影表["标签编号"].map(名称)
    电影表["关联度"] = 电影表["关联度"].round(4)
    电影表 = (电影表[["电影编号", "标签名称", "关联度"]]
              .sort_values(["电影编号", "关联度"], ascending=[True, False]))
    写表(电影表, "标签关联度.csv")

    标签表 = 标签片[["标签编号", "电影编号", "关联度"]].copy()
    标签表["标签名称"] = 标签表["标签编号"].map(名称)
    标签表["关联度"] = 标签表["关联度"].round(4)
    电影 = 读加工("电影.csv", usecols=["电影编号", "片名"])
    评分 = 读加工("电影评分汇总.csv", usecols=["电影编号", "评分人数"])
    标签表 = (标签表.merge(电影, on="电影编号", how="left")
              .merge(评分, on="电影编号", how="left"))
    标签表 = (标签表[["标签名称", "电影编号", "片名", "评分人数", "关联度"]]
              .sort_values(["标签名称", "关联度"], ascending=[True, False]))
    写表(标签表, "标签代表片单.csv")

    全集 = set(电影["电影编号"])
    无关联度 = len(全集 - 电影集)

    return [
        质量行("标签关联度.csv", "数据行", 总行数, 0, 总行数, "分块取Top"),
        质量行("标签关联度.csv", "覆盖电影", len(全集), 无关联度, len(电影集),
               "只输出有genome的%d部，图注必须写明覆盖率" % len(电影集), 单位="部"),
        质量行("标签关联度.csv", "关联度为0", 总行数, 0, 总行数, "无"),
        质量行("标签关联度.csv", "单片保留", 总行数, 总行数 - len(电影表), len(电影表),
               "每片Top%d" % 单片保留),
        质量行("标签关联度.csv", "单标签保留", 总行数, 总行数 - len(标签表), len(标签表),
               "每标签Top%d" % 单标保留),
    ]
