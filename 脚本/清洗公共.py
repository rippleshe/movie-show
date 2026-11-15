# -*- coding: utf-8 -*-
"""清洗流水线公共部分：路径、类型中文名、标签规范化、写表、质量记录。"""
from __future__ import annotations

import os

import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
根目录 = os.path.normpath(os.path.join(HERE, ".."))
原始数据 = os.path.join(根目录, "原始数据")
加工数据 = os.path.join(根目录, "加工数据")

编码 = "utf-8-sig"

# 类型英文 -> 中文图例名。以实测的 20 个取值为准，见 原始数据/数据集说明.txt。
类型中文 = {
    "Action": "动作",
    "Adventure": "冒险",
    "Animation": "动画",
    "Children": "儿童",
    "Comedy": "喜剧",
    "Crime": "犯罪",
    "Documentary": "纪录片",
    "Drama": "剧情",
    "Fantasy": "奇幻",
    "Film-Noir": "黑色电影",
    "Horror": "恐怖",
    "IMAX": "IMAX",
    "Musical": "音乐",
    "Mystery": "悬疑",
    "Romance": "爱情",
    "Sci-Fi": "科幻",
    "Thriller": "惊悚",
    "War": "战争",
    "Western": "西部",
    "(no genres listed)": "未标注",
}

评分档位 = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0]
评分档名 = ["半星", "一星", "一星半", "二星", "二星半",
            "三星", "三星半", "四星", "四星半", "五星"]
榜单门槛 = 50


def 读表(文件名: str, **kwargs) -> pd.DataFrame:
    return pd.read_csv(os.path.join(原始数据, 文件名), encoding=编码, **kwargs)


def 读加工(文件名: str, **kwargs) -> pd.DataFrame:
    return pd.read_csv(os.path.join(加工数据, 文件名), encoding=编码, **kwargs)


def 写表(df: pd.DataFrame, 文件名: str) -> None:
    os.makedirs(加工数据, exist_ok=True)
    路径 = os.path.join(加工数据, 文件名)
    df.to_csv(路径, index=False, encoding=编码)
    print("  写出 %s（%d 行）" % (文件名, len(df)))


def 规范化标签(s: pd.Series) -> pd.Series:
    """去首尾空白、合并连续空白、统一小写。不做词干化，避免误合并。"""
    return (s.astype("string")
             .str.replace(r"\s+", " ", regex=True)
             .str.strip()
             .str.lower())


def 质量行(文件: str, 检查项: str, 原始条数: int, 问题条数: int,
           处理后条数: int, 处理方式: str, 单位: str = "行") -> dict:
    return {
        "文件": 文件,
        "检查项": 检查项,
        "单位": 单位,
        "原始条数": int(原始条数),
        "问题条数": int(问题条数),
        "处理后条数": int(处理后条数),
        "处理方式": 处理方式,
    }
