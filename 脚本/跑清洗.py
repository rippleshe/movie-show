# -*- coding: utf-8 -*-
"""清洗流水线入口：按顺序跑四步，写出加工数据与两张记录表。

用法：conda run -n student-coursework python 脚本/跑清洗.py
"""
from __future__ import annotations

import os
import sys
import time

import pandas as pd

# 不生成 __pycache__，保持 脚本/ 扁平干净
sys.dont_write_bytecode = True

import 清洗电影
import 清洗标签
import 清洗评分
import 清洗关联度
from 清洗公共 import 加工数据, 原始数据, 质量行, 写表

文件顺序 = ["电影.csv", "评分.csv", "标签.csv", "链接.csv", "标签关联度.csv", "标签词典.csv"]


def 规模表() -> pd.DataFrame:
    行 = []
    for 名 in 文件顺序:
        路径 = os.path.join(原始数据, 名)
        with open(路径, "rb") as f:
            首行 = f.readline().decode("utf-8-sig").strip()
            字段数 = len(首行.split(","))
            行数 = sum(1 for _ in f)
        行.append({"文件名": 名, "行数": 行数, "字段数": 字段数,
                   "大小MB": round(os.path.getsize(路径) / 1048576, 2)})
    return pd.DataFrame(行)


def main() -> int:
    步骤 = [("电影", 清洗电影.run), ("评分", 清洗评分.run),
            ("标签", 清洗标签.run), ("关联度", 清洗关联度.run)]
    质量: list[dict] = []
    for 名, 函数 in 步骤:
        开始 = time.time()
        print("[%s] 开始" % 名)
        质量.extend(函数())
        print("[%s] 完成，用时 %.1f 秒" % (名, time.time() - 开始))

    os.makedirs(加工数据, exist_ok=True)
    print("[记录] 数据规模")
    写表(规模表(), "数据规模.csv")

    # 关联完整性：加工后的表都能回到电影表
    电影 = pd.read_csv(os.path.join(加工数据, "电影.csv"), encoding="utf-8-sig")
    编号集 = set(电影["电影编号"])
    检查 = [("电影.csv", len(电影), len(编号集), 0)]
    for 名, 列 in [("电影评分汇总.csv", "电影编号"), ("电影标签.csv", "电影编号"),
                   ("标签关联度.csv", "电影编号")]:
        表 = pd.read_csv(os.path.join(加工数据, 名), encoding="utf-8-sig", usecols=[列])
        集合 = set(表[列])
        检查.append((名, len(表), len(集合), len(集合 - 编号集)))
    for 名, 条数, 唯一, 孤儿 in 检查:
        质量.append(质量行(名, "电影编号可回连电影表", 条数, 孤儿, 条数,
                           "无孤儿" if 孤儿 == 0 else "存在孤儿，需修"))
        print("  %s 行数=%d 唯一编号=%d 孤儿=%d" % (名, 条数, 唯一, 孤儿))

    链接 = pd.read_csv(os.path.join(原始数据, "链接.csv"), encoding="utf-8-sig",
                      dtype={"TMDB编号": "string"}, usecols=["TMDB编号"])
    缺TMDB = int(链接["TMDB编号"].isna().sum())
    质量.append(质量行("链接.csv", "TMDB编号为空", len(链接), 缺TMDB, len(链接),
                      "留空，不参与图表编号展示", 单位="部"))

    # 数据覆盖：三个下游板块各能覆盖多少部电影
    有评分数 = len(pd.read_csv(os.path.join(加工数据, "电影评分汇总.csv"),
                              encoding="utf-8-sig", usecols=["电影编号"]))
    有标签数 = int(pd.read_csv(os.path.join(加工数据, "电影标签.csv"),
                             encoding="utf-8-sig", usecols=["电影编号"])["电影编号"].nunique())
    有关联数 = int(pd.read_csv(os.path.join(加工数据, "标签关联度.csv"),
                             encoding="utf-8-sig", usecols=["电影编号"])["电影编号"].nunique())
    覆盖 = pd.DataFrame([
        {"范围": "有评分", "影片数": 有评分数},
        {"范围": "有用户标签", "影片数": 有标签数},
        {"范围": "有关联度", "影片数": 有关联数},
    ])
    覆盖["占比"] = (覆盖["影片数"] / len(电影) * 100).round(1)
    写表(覆盖, "数据覆盖.csv")

    写表(pd.DataFrame(质量), "数据质量.csv")
    print("全部完成。加工数据：", os.path.abspath(加工数据))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
