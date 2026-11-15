#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""抓取导演板块图片与补充资料（IMDb 官方 suggestion 接口 + Amazon 图床）。

电影按「电影编号 -> 原始数据/链接.csv 的 IMDb编号 -> ttxxxxxxx」定位，导演按 nmxxxxxxx 定位，
不按片名搜索。图片仅课程非商业展示，版权归原权利人。

用法（项目根目录执行，固定 conda student-coursework 环境）：
    conda run -n student-coursework python 脚本/抓取导演图片.py --stage all
    conda run -n student-coursework python 脚本/抓取导演图片.py --stage page
    conda run -n student-coursework python 脚本/抓取导演图片.py --stage filmography --director-id nm0000813
    conda run -n student-coursework python 脚本/抓取导演图片.py --stage catalogue --batch-size 100
    conda run -n student-coursework python 脚本/抓取导演图片.py --recompress --max-width 500
阶段：page 按当前长屏推荐导演补齐完整片单；catalogue 按全量电影表续抓；
      posters 抓评分人数 TopN；directors 抓 TopN 肖像；patch 补精选片单。
成功图片断点跳过；每次完成自动发布 CSV 清单和网页图片索引。
"""

import argparse, io, json, re, sys, time
from datetime import datetime
from pathlib import Path

import pandas as pd
import requests
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
IMG_DIR = ROOT / '成品网页' / '图片'
DATA_DIR = ROOT / '加工数据'
CACHE_DIR = ROOT / '.archive' / '图片抓取缓存'
MANIFEST = DATA_DIR / '导演图片清单.csv'
DIRECTOR_SUPP = DATA_DIR / '导演补充.csv'

IMDB_SUGGEST = 'https://v3.sg.media-imdb.com/suggestion/x/%s.json'
MIN_INTERVAL = 0.35                    # 相邻请求最小间隔（秒）
MIN_BYTES = 2000                       # 小于该字节视为坏图
POSTER_MAX_WIDTH, PORTRAIT_MAX_WIDTH = 450, 400
JPEG_QUALITY = 72
MANIFEST_COLS = ['类型', '编号', '名称', '文件名', '来源页面', '来源图片URL', '宽', '高', '字节', '获取时间', '许可']
DIRECTOR_COLS = ['导演编号', '导演名', '国籍', '出生日期', '出生地', '简介', '维基页面', '图片文件']
LICENSE_NOTE = 'IMDb 官方接口·课程非商业'
# 8 位精选 + 4 组共创的 8 位导演；置空则按 导演表 总评分人数取 TopN
LEAD_DIRECTOR_IDS = ['nm0000229', 'nm0000709', 'nm0000233', 'nm0634240', 'nm0000116', 'nm0001392',
                     'nm0000631', 'nm0000217', 'nm0001054', 'nm0001053', 'nm0905154', 'nm0905152',
                     'nm0751577', 'nm0751648', 'nm0520488', 'nm0588087']

SESSION = requests.Session()
SESSION.headers.update({'User-Agent': 'MovieShow-coursework/1.0 (educational data-viz project)',
                        'Accept': '*/*'})
_last_req = [0.0]

def now():
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')

def fetch(url, as_json=False, tries=5):
    """GET：全局节流 + 429/5xx/403 指数退避；404 返回 None。"""
    for attempt in range(tries):
        wait = MIN_INTERVAL - (time.monotonic() - _last_req[0])
        if wait > 0:
            time.sleep(wait)
        _last_req[0] = time.monotonic()
        try:
            r = SESSION.get(url, timeout=40)
        except requests.RequestException:
            time.sleep(min(2 ** attempt, 15))
            continue
        if r.status_code == 200:
            if not as_json:
                return r.content
            try:
                return r.json()
            except ValueError:
                return None
        if r.status_code == 404:
            return None
        if r.status_code in (403, 429) or r.status_code >= 500:
            time.sleep(min(2 ** (attempt + 1), 30))
            continue
        return None
    return None

def load_cache(name):
    path = CACHE_DIR / ('%s.json' % name)
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else {}

def save_cache(name, data):
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    (CACHE_DIR / ('%s.json' % name)).write_text(
        json.dumps(data, ensure_ascii=False, indent=1), encoding='utf-8')

def load_imdb_links():
    """电影编号 -> IMDb编号（字符串，保留前导零）。"""
    df = pd.read_csv(ROOT / '原始数据' / '链接.csv', encoding='utf-8-sig',
                     dtype=str, keep_default_na=False)
    return {r['电影编号'].strip(): r['IMDb编号'].strip() for r in df.to_dict('records')
            if re.fullmatch(r'\d{5,9}', r['IMDb编号'].strip())}

def imdb_lookup(imdb_id):
    """按 IMDb 编号取主图，返回 (图片URL, 原图宽, 接口URL)；无图时 URL 为空。"""
    url = IMDB_SUGGEST % imdb_id
    for item in (fetch(url, as_json=True) or {}).get('d') or []:
        img = item.get('i') or {}
        if str(item.get('id', '')).lower() == imdb_id.lower() and img.get('imageUrl'):
            return img['imageUrl'], int(img.get('width') or 0), url
    return '', 0, url

def download_best(image_url, orig_w, target_w):
    """原图比目标宽时直接向图床要 UX{target}_ 尺寸（省流量）；失败回退原图。"""
    if orig_w and orig_w > target_w:
        m = re.match(r'^(.*\._V\d+_)(.*)(\.[a-zA-Z]{3,4})$', image_url)
        content = fetch(m.group(1) + 'UX%d_' % target_w + m.group(3)) if m else None
        if content:
            return content
    return fetch(image_url)

def record_image(content, dest, source_page, image_url, max_width):
    """下载内容 -> 最大宽 max_width -> JPEG 落盘，返回清单所需字段。"""
    img = Image.open(io.BytesIO(content))
    img.load()
    img = img.convert('RGB')
    if img.width > max_width:
        img = img.resize((max_width, round(img.height * max_width / img.width)), Image.LANCZOS)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    tmp = CACHE_DIR / (dest.stem + '.part')
    img.save(tmp, 'JPEG', quality=JPEG_QUALITY, optimize=True, progressive=True)
    tmp.replace(dest)
    return {'ok': True, '文件名': '图片/%s' % dest.name, '来源页面': source_page,
            '来源图片URL': image_url, '宽': img.width, '高': img.height,
            '字节': dest.stat().st_size, '获取时间': now()}

def grab(imdb_id, dest, max_width):
    """按 IMDb 编号取图落盘；成功返回记录 dict，失败返回 {'ok': False, 'reason': ...}。"""
    img_url, width, api_url = imdb_lookup(imdb_id)
    content = download_best(img_url, width, max_width) if img_url else None
    if not content:
        return {'ok': False, 'reason': '无图或下载失败'}
    try:
        return record_image(content, dest, api_url, img_url, max_width)
    except Exception as exc:
        return {'ok': False, 'reason': '图片处理失败: %s' % exc}

def write_manifest():
    """旧清单只保留文件仍存在的有效行，再按缓存重建；排序稳定，可重复执行。"""
    rows = {}
    if MANIFEST.exists():
        for rec in pd.read_csv(MANIFEST, encoding='utf-8-sig', dtype=str,
                               keep_default_na=False).to_dict('records'):
            if rec.get('类型') and rec.get('文件名') and (ROOT / '成品网页' / rec['文件名']).exists():
                rows[(rec['类型'], rec['编号'])] = {k: str(rec.get(k, '') or '') for k in MANIFEST_COLS}
    for typ in ('电影海报', '导演肖像'):
        for no, rec in load_cache(typ).items():
            if rec.get('ok') and rec.get('文件名') and (ROOT / '成品网页' / rec['文件名']).is_file():
                rows[(typ, str(no))] = dict(
                    {k: str(rec.get(k, '') or '') for k in MANIFEST_COLS[2:-1]},
                    类型=typ, 编号=str(no), 许可=LICENSE_NOTE)
    df = pd.DataFrame([rows[k] for k in sorted(rows, key=lambda k: (
        0 if k[0] == '电影海报' else 1, '%010d' % int(k[1]) if k[1].isdigit() else k[1]))],
        columns=MANIFEST_COLS)
    df.to_csv(MANIFEST, index=False, encoding='utf-8-sig')
    counts = df['类型'].value_counts()
    print('[清单] %s 共 %d 行（电影海报 %d / 导演肖像 %d）' % (
        MANIFEST.name, len(df), counts.get('电影海报', 0), counts.get('导演肖像', 0)), flush=True)

def load_top_movies(limit):
    movies = pd.read_csv(DATA_DIR / '电影.csv', encoding='utf-8-sig', dtype={'电影编号': str},
                         usecols=['电影编号', '片名', '上映年份'])
    ratings = pd.read_csv(DATA_DIR / '电影评分汇总.csv', encoding='utf-8-sig', dtype={'电影编号': str},
                          usecols=['电影编号', '评分人数', '平均分'])
    df = movies.merge(ratings, on='电影编号', how='left')
    df = df.sort_values(['评分人数', '平均分'], ascending=[False, False]).head(limit)
    links = load_imdb_links()
    return [dict(r, 电影编号=str(r['电影编号']), IMDb编号=links.get(str(r['电影编号']), ''))
            for r in df.to_dict('records')]

def fetch_poster(movie_no, imdb_id, name, cache, force=False):
    dest = IMG_DIR / ('电影-%s.jpg' % movie_no)
    old = cache.get(movie_no) or {}
    if not force and old.get('ok') and dest.exists() and dest.stat().st_size > MIN_BYTES:
        return 'skip'
    rec = grab('tt%s' % imdb_id, dest, POSTER_MAX_WIDTH) if imdb_id else {'ok': False, 'reason': '缺 IMDb 编号'}
    if not rec.get('ok'):
        if old.get('ok') and dest.exists():
            return 'keep'
        cache[movie_no] = dict(rec, 名称=name, 时间=now())
        return 'fail'
    rec.update({'名称': name, 'IMDb编号': imdb_id})
    cache[movie_no] = rec
    return 'new'

def run_posters(limit=1000, force=False, batch_size=None):
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    cache, movies = load_cache('电影海报'), load_top_movies(limit)
    stat, failed, t0 = {'new': 0, 'skip': 0, 'keep': 0, 'fail': 0}, [], time.time()
    if batch_size:
        movies = [row for row in movies if force or not (
            cache.get(row['电影编号'], {}).get('ok') and
            (IMG_DIR / f"电影-{row['电影编号']}.jpg").is_file())]
        movies.sort(key=lambda row: row['电影编号'] in cache)
        movies = movies[:batch_size]
    print('== 电影海报：本次 %d 部（%s）==' % (len(movies), '全量续抓' if limit is None else f'Top{limit}'), flush=True)
    for i, mv in enumerate(movies, 1):
        no, name = str(mv['电影编号']), str(mv['片名'])
        res = fetch_poster(no, str(mv.get('IMDb编号') or ''), name, cache, force)
        stat[res] += 1
        if res == 'fail':
            failed.append((no, name, (cache.get(no) or {}).get('reason', '')))
        if i % 10 == 0 or i == len(movies):
            print('[%3d/%d] 新增 %d 跳过 %d 保留 %d 失败 %d | %.0fs' % (
                i, len(movies), stat['new'], stat['skip'], stat['keep'], stat['fail'],
                time.time() - t0), flush=True)
            save_cache('电影海报', cache)
    save_cache('电影海报', cache)
    ok = stat['new'] + stat['skip'] + stat['keep']
    print('== T2 完成：成功 %d / %d（%.1f%%），失败 %d ==' % (
        ok, len(movies), 100.0 * ok / max(1, len(movies)), stat['fail']), flush=True)
    for no, name, reason in failed[:30]:
        print('  [失败] %s  %s  -> %s' % (no, name, reason), flush=True)
    return stat['fail']

def run_filmography(director_ids, force=False):
    works = pd.read_csv(DATA_DIR / '导演作品表.csv', encoding='utf-8-sig', dtype=str,
                        keep_default_na=False)
    movies = works[works['导演编号'].isin(director_ids)].copy()
    movies['评分人数'] = pd.to_numeric(movies['评分人数'], errors='coerce').fillna(0)
    movies['平均分'] = pd.to_numeric(movies['平均分'], errors='coerce')
    movies['导演顺序'] = pd.Categorical(movies['导演编号'], categories=director_ids, ordered=True)
    movies = movies.sort_values(['导演顺序', '评分人数', '平均分'], ascending=[True, False, False]).drop_duplicates('电影编号')
    links, cache = load_imdb_links(), load_cache('电影海报')
    stat = {'new': 0, 'skip': 0, 'keep': 0, 'fail': 0}
    print(f'== Filmography {len(director_ids)} directors: {len(movies)} films ==', flush=True)
    for index, row in enumerate(movies.to_dict('records'), 1):
        movie_id = row['电影编号']
        result = fetch_poster(movie_id, links.get(movie_id, ''), row['片名'], cache, force)
        stat[result] += 1
        if result == 'fail':
            print(f"  Missing: {movie_id} {row['片名']} — {cache[movie_id]['reason']}", flush=True)
        if index % 10 == 0 or index == len(movies):
            save_cache('电影海报', cache)
        if index % 100 == 0 or index == len(movies):
            print(f'  {index}/{len(movies)}: {stat}', flush=True)
    return stat['fail']


def page_director_ids():
    """推荐范围来自当前页面数据；C4 的推荐名单与绘图共用，不另写固定导演列表。"""
    text = (ROOT / '成品网页/导演长页数据.js').read_text(encoding='utf-8')
    data = json.loads(text.split('=', 1)[1].strip().rstrip(';'))
    text = (ROOT / '成品网页/导演数据.js').read_text(encoding='utf-8')
    selected = json.loads(text.split('=', 1)[1].strip().rstrip(';'))
    ids = {row['导演编号'] for row in selected['精选']}
    for section, key in (('C1', '产量榜'), ('C2', '观众榜'), ('C3', '高分榜')):
        ids.update(row['编号'] for row in data[section][key][:10])
    ids.update(row['编号'] for row in data['C7']['导演'][:12])
    ids.update(data['C4']['推荐'])
    ids.update(row['编号'] for row in data['C6']['年谱']['导演'])
    for row in data['C5']['组合卡'][:1]:
        ids.update((row['导演A编号'], row['导演B编号']))
    return sorted(ids)


def run_directors(limit=200, force=False):
    path = DATA_DIR / '导演表.csv'
    if not path.exists():
        print('!! 加工数据/导演表.csv 不存在，T3 跳过。', flush=True)
        return
    df = pd.read_csv(path, encoding='utf-8-sig', dtype={'导演编号': str}, keep_default_na=False)
    if '总评分人数' not in df.columns:
        print('!! 导演表.csv 缺「总评分人数」列：%s' % list(df.columns), flush=True)
        return
    df = df.sort_values('总评分人数', ascending=False)
    top = df.head(limit)
    if LEAD_DIRECTOR_IDS:
        df = pd.concat([top, df[df['导演编号'].isin(set(LEAD_DIRECTOR_IDS) - set(top['导演编号']))]])
    else:
        df = top
    cache, got = load_cache('导演肖像'), 0
    print('== T3 导演肖像：目标 %d 位 ==' % len(df), flush=True)
    for i, row in enumerate(df.to_dict('records'), 1):
        dno, dname = str(row['导演编号']).strip(), str(row.get('导演名') or '')
        dest = IMG_DIR / ('导演-%s.jpg' % dno)
        old = cache.get(dno) or {}
        if not force and old.get('ok') and dest.exists() and dest.stat().st_size > MIN_BYTES:
            got += 1
            continue
        print('[%2d/%d] %s (%s)' % (i, len(df), dname, dno), flush=True)
        rec = grab(dno, dest, PORTRAIT_MAX_WIDTH) if re.fullmatch(r'nm\d{5,9}', dno) \
            else {'ok': False, 'reason': '导演编号不是 nm 格式'}
        rec['导演名'] = dname
        cache[dno] = rec
        got += bool(rec.get('ok'))
        if i % 10 == 0:
            save_cache('导演肖像', cache)
    save_cache('导演肖像', cache)
    # 补充表只保留 16 位精选导演（顺序固定），不随扩图变成 200 行
    rows = [{'导演编号': dno, '导演名': cache[dno].get('导演名', ''), '国籍': '', '出生日期': '',
             '出生地': '', '简介': '', '维基页面': '', '图片文件': cache[dno].get('文件名', '')}
            for dno in LEAD_DIRECTOR_IDS if (cache.get(dno) or {}).get('ok')]
    pd.DataFrame(rows, columns=DIRECTOR_COLS).to_csv(DIRECTOR_SUPP, index=False, encoding='utf-8-sig')
    print('== T3 完成：有肖像 %d / %d（%.1f%%）==' % (
        got, len(df), 100.0 * got / max(1, len(df))), flush=True)
    print('[补充表] %s 共 %d 行（国籍/出生日期/出生地/简介/维基页面留空，待人工补）' % (
        DIRECTOR_SUPP.name, len(rows)), flush=True)

def collect_needed_movie_ids():
    """只读 成品网页/导演数据.js（精选前十 + 共创片单 + 榜单热门），不存在退回 导演候选.json。
    不要读 导演前十作品.csv——那是全量导演的前十，会多抓几万张。"""
    js = ROOT / '成品网页' / '导演数据.js'
    path = js if js.exists() else DATA_DIR / '导演候选.json'
    if not path.exists():
        return set()
    ids = set(re.findall(r'"电影编号"\s*:\s*"?(\d+)"?',
                         path.read_text(encoding='utf-8', errors='ignore')))
    print('  [片单] 从 %s 取到 %d 部电影编号' % (path.name, len(ids)), flush=True)
    return ids

def run_patch(force=False):
    needed = collect_needed_movie_ids()
    if not needed:
        print('== 补海报：没有片单来源，跳过 ==', flush=True)
        return
    df = pd.read_csv(DATA_DIR / '电影评分汇总.csv', encoding='utf-8-sig', dtype={'电影编号': str},
                     usecols=['电影编号', '片名', '上映年份', '评分人数', '平均分'])
    names, links = {str(r['电影编号']): r for r in df.to_dict('records')}, load_imdb_links()
    have = lambda m: (IMG_DIR / ('电影-%s.jpg' % m)).exists() \
        and (IMG_DIR / ('电影-%s.jpg' % m)).stat().st_size > MIN_BYTES
    missing = [dict(names[m], 电影编号=m, IMDb编号=links.get(m, ''))
               for m in sorted(needed, key=int) if m in names and not have(m)]
    print('== 补海报：片单 %d 部，缺图 %d 部 ==' % (len(needed), len(missing)), flush=True)
    cache, added = load_cache('电影海报'), 0
    for i, mv in enumerate(missing, 1):
        added += fetch_poster(str(mv['电影编号']), str(mv.get('IMDb编号') or ''),
                              str(mv['片名']), cache, force) in ('new', 'keep')
        if i % 10 == 0:
            save_cache('电影海报', cache)
            print('  [%d/%d] 补到 %d' % (i, len(missing), added), flush=True)
    save_cache('电影海报', cache)
    print('== 补海报完成：补到 %d / 缺 %d ==' % (added, len(missing)), flush=True)

def recompress_quality(quality, poster_width):
    """不重新下载，把缓存里的图按 quality 重压，并回写宽/高/字节。"""
    before = after = done = 0
    for name, max_w in (('电影海报', poster_width), ('导演肖像', PORTRAIT_MAX_WIDTH)):
        cache = load_cache(name)
        for rec in cache.values():
            path = ROOT / '成品网页' / str(rec.get('文件名', ''))
            if not rec.get('ok') or not rec.get('文件名') or not path.exists():
                continue
            old = path.stat().st_size
            try:
                img = Image.open(path).convert('RGB')
                if img.width > max_w:
                    img = img.resize((max_w, round(img.height * max_w / img.width)), Image.LANCZOS)
                CACHE_DIR.mkdir(parents=True, exist_ok=True)
                tmp = CACHE_DIR / (path.stem + '.part')
                img.save(tmp, 'JPEG', quality=quality, optimize=True, progressive=True)
                tmp.replace(path)
            except Exception as exc:
                print('  [跳过] %s: %s' % (path.name, exc), flush=True)
                continue
            rec.update({'宽': img.width, '高': img.height, '字节': path.stat().st_size})
            before, after, done = before + old, after + path.stat().st_size, done + 1
        save_cache(name, cache)
    print('[重压] %d 张，%.1f MB -> %.1f MB（q%d）' % (
        done, before / 1048576.0, after / 1048576.0, quality), flush=True)

def main():
    ap = argparse.ArgumentParser(description='抓取导演板块电影海报与导演肖像（IMDb 接口）')
    ap.add_argument('--stage', default='page', choices=['page', 'catalogue', 'posters', 'directors', 'patch', 'filmography', 'all'])
    ap.add_argument('--director-id', nargs='+', help='filmography 阶段要补图的一位或多位导演编号')
    ap.add_argument('--limit', type=int, default=1000, help='海报数量（评分人数降序），默认 1000')
    ap.add_argument('--director-limit', type=int, default=200, help='肖像数量（总评分人数降序），默认 200')
    ap.add_argument('--batch-size', type=int, help='catalogue 每次尝试的缺图数量；省略则抓全量，重跑续抓')
    ap.add_argument('--force', action='store_true', help='忽略缓存与已存在图片，全部重抓')
    ap.add_argument('--recompress', action='store_true', help='不重新下载，按 quality 重压已有图片')
    ap.add_argument('--quality', type=int, default=JPEG_QUALITY, help='重压质量，默认 %d' % JPEG_QUALITY)
    ap.add_argument('--max-width', type=int, default=0, help='重压时海报最大宽，0=默认 %d' % POSTER_MAX_WIDTH)
    args = ap.parse_args()
    if args.stage == 'filmography' and not args.director_id:
        ap.error('filmography 需要 --director-id')
    if args.batch_size is not None and args.batch_size < 1:
        ap.error('--batch-size 必须大于零')
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    print('项目根: %s' % ROOT, flush=True)
    failures = 0
    if args.recompress:
        recompress_quality(args.quality, args.max_width or POSTER_MAX_WIDTH)
    else:
        if args.stage in ('page', 'all'):
            failures += run_filmography(page_director_ids(), args.force)
        if args.stage == 'catalogue':
            failures += run_posters(None, args.force, args.batch_size)
        if args.stage == 'filmography':
            failures += run_filmography(args.director_id, args.force)
        if args.stage in ('posters', 'all'):
            failures += run_posters(args.limit, args.force)
        if args.stage in ('directors', 'all'):
            run_directors(args.director_limit, args.force)
        if args.stage in ('patch', 'all'):
            run_patch(args.force)
    write_manifest()
    from 生成全量数据 import read_images, write_js
    images = read_images()
    write_js(ROOT / '成品网页/图片清单.js', 'window.图片 = ', images)
    print(f"[索引] 电影 {len(images['电影'])} / 导演 {len(images['导演'])}", flush=True)
    files = list(IMG_DIR.glob('*.jpg'))
    print('[体积] 合计 %.1f MB' % (sum(f.stat().st_size for f in files) / 1048576.0), flush=True)
    for label, prefix in (('电影海报', '电影-'), ('导演肖像', '导演-')):
        print('        %s %.1f MB' % (label, sum(f.stat().st_size for f in files
                                             if f.name.startswith(prefix)) / 1048576.0), flush=True)
    return 1 if failures else 0

if __name__ == '__main__':
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print('\n[中断] 已完成部分已写入缓存，重跑即可续抓。', flush=True)
        sys.exit(130)
