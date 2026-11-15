"""Export each film's ten rating counts for offline director exploration."""
import csv
import json
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
SCORE_COLUMNS = ['半星', '一星', '一星半', '二星', '二星半', '三星', '三星半', '四星', '四星半', '五星']


def main():
    source = ROOT / '加工数据/电影评分汇总.csv'
    columns = ['电影编号', '评分人数', '平均分', '中位数', '标准差', *SCORE_COLUMNS]
    with source.open(encoding='utf-8-sig', newline='') as stream:
        header = next(csv.reader(stream))
    if not set(columns).issubset(header):
        raise ValueError('电影评分汇总.csv 表头与评分字段不符')
    films = pd.read_csv(source, encoding='utf-8-sig', dtype={'电影编号': str}, usecols=columns)
    counts = films[SCORE_COLUMNS].to_numpy(dtype='int64')
    assert (counts.sum(axis=1) == films['评分人数'].to_numpy()).all()
    values = counts @ (pd.Series(range(1, 11)).to_numpy() / 2) / counts.sum(axis=1)
    assert (abs(values - films['平均分'].to_numpy()) <= .000501).all()
    payload = {'分值': [index / 2 for index in range(1, 11)], '电影': {
        movie_id: [*map(int, bins), float(median), float(spread)]
        for movie_id, bins, median, spread in zip(films['电影编号'], counts, films['中位数'], films['标准差'])}}
    target = ROOT / '成品网页/单片评分数据.js'
    target.write_text('window.FILM_RATINGS=' + json.dumps(payload, ensure_ascii=False, separators=(',', ':')) + ';\n', encoding='utf-8')
    print(f'Exported {len(films):,} films, {counts.sum():,} ratings, {target.stat().st_size // 1024:,} KB')


if __name__ == '__main__':
    main()
