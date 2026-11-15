"""Build the director page charts from the existing aggregate data.

Run: conda run -n student-coursework python 脚本/生成长页图表.py
"""
import csv
import json
import math
from collections import Counter
from pathlib import Path

from pyecharts import options as opts
from pyecharts.charts import Custom, Graph, HeatMap, Line, Parallel, Radar, Scatter
from pyecharts.commons.utils import JsCode

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / "成品网页"
COLORS = ["#d87c7c", "#919e8b", "#d7ab82", "#6e7074", "#61a0a8", "#efa18d"]
VOLUME_COLORS = ["#e28a8a", "#acc09a", "#e6ba7c", "#c4cad2", "#58b9ce", "#c5a1d1"]
TEXT = {"fontSize": 16, "color": "#d7ab82", "fontFamily": "Microsoft YaHei"}


def axis(name="", kind="value", **settings):
    return {"type": kind, "name": name, "nameTextStyle": TEXT, "axisLabel": dict(TEXT),
            "axisLine": {"show": False}, "axisTick": {"show": False},
            "splitLine": {"show": kind != "category", "lineStyle": {"color": "#6e7074", "opacity": .14}},
            **settings}


def finish(chart, margin, mobile=None, tooltip=None, max_width=640):
    text_style = chart.options.get('textStyle', TEXT)
    chart.options.update({"backgroundColor": "transparent", "textStyle": text_style,
        "grid": dict(zip(["left", "right", "top", "bottom"], margin)),
        "legend": {"show": False}, "animationDuration": 1000,
        "tooltip": {"show": True, "trigger": "item", "confine": True, "borderWidth": 0,
                    "backgroundColor": "#1d1819", "textStyle": text_style, **(tooltip or {})}})
    if mobile:
        def desktop_style(base, change):
            if isinstance(change, dict):
                return {key: desktop_style(base.get(key), value) for key, value in change.items()}
            if isinstance(change, list) and change:
                return [desktop_style(base[index], value) for index, value in enumerate(change)]
            return base

        desktop = {key: desktop_style(chart.options[key], value) for key, value in mobile.items()}
        chart.options["media"] = [{"query": {"maxWidth": max_width}, "option": mobile}, {"option": desktop}]
    return chart.dump_options()


def build_volume(data):
    rows = data["C1"]["分档"]
    total = data['统计']['导演总数']
    pieces, start = [], 0
    for index, row in enumerate(rows):
        stop = round(start + row['数量'] / total * 100, 8)
        for cell in range(math.floor(start), math.ceil(stop)):
            pieces.append({'value': [cell, max(start, cell) - cell,
                min(stop, cell + 1) - max(start, cell), index],
                'name': row['标签'], 'count': row['数量'], 'share': row['数量'] / total * 100})
        start = stop
    chart = Custom()
    chart.add('导演占比', render_item=JsCode(
        "function(p,api){var i=api.value(0),w=(api.getWidth()-12)/10,h=(api.getHeight()-12)/10;"
        "return {type:'rect',shape:{x:6+(i%10)*w+api.value(1)*w*.84,y:6+Math.floor(i/10)*h+h*.18,"
        "width:api.value(2)*w*.84,height:h*.64},style:{fill:" + repr(VOLUME_COLORS) + "[api.value(3)]}};}"), data=pieces)
    chart.options['color'] = VOLUME_COLORS
    chart.options['series'][0]['coordinateSystem'] = None
    chart.options['xAxis'] = [axis(show=False)]
    chart.options['yAxis'] = [axis(show=False)]
    return finish(chart, (0, 0, 0, 0), tooltip={
        'backgroundColor': '#100d0e', 'borderColor': '#d7ab82', 'borderWidth': 1,
        'textStyle': {**TEXT, 'color': '#fff4e4'}, 'padding': [10, 14],
        'formatter': JsCode("function(p){var d=p.data;return '<b>'+d.name+'</b><br/>'"
            "+d.count.toLocaleString()+' 位　'+d.share.toFixed(2)+'%';}")})


def build_attention(data):
    head = data['C2']['头部']
    share = head['评分占比']
    cells = [{'value': [index, min(1, max(0, share - index)), int(index == 0)]}
             for index in range(100)]
    chart = Custom()
    chart.add('注意力', render_item=JsCode(
        "function(p,api){var w=api.getWidth(),h=api.getHeight(),i=api.value(0),f=api.value(1),"
        "cw=Math.min((w-16)/10,50),ch=Math.min((h-16)/10,34),left=(w-cw*10)/2,top=(h-ch*10)/2,"
        "x=left+(i%10)*cw+cw*.08,y=top+Math.floor(i/10)*ch+ch*.12,bw=cw*.84,bh=ch*.76;"
        "var children=[{type:'rect',shape:{x:x,y:y,width:bw,height:bh,r:1},style:{fill:'#3b3235'}}];"
        "if(f>0)children.push({type:'rect',shape:{x:x,y:y,width:bw*f,height:bh,r:1},style:{fill:'#d87c7c'}});"
        "if(api.value(2))children.push("
        "{type:'rect',shape:{x:x-.5,y:y-.5,width:bw+1,height:bh+1,r:2},"
        "style:{fill:null,stroke:'#0b0909',lineWidth:6}},"
        "{type:'rect',shape:{x:x-.5,y:y-.5,width:bw+1,height:bh+1,r:2},"
        "style:{fill:null,stroke:'#ffe5a6',lineWidth:4,shadowColor:'#ffe5a680',shadowBlur:8}});"
        "return {type:'group',children:children};}"), data=cells)
    chart.options['series'][0]['coordinateSystem'] = None
    chart.options['xAxis'] = [axis(show=False)]
    chart.options['yAxis'] = [axis(show=False)]
    return finish(chart, (0, 0, 0, 0), tooltip={
        'backgroundColor': '#100d0e', 'borderColor': '#d7ab82', 'borderWidth': 1,
        'textStyle': {**TEXT, 'color': '#f6ecdd'},
        'formatter': JsCode("function(p){return p.value[2]?'前 1% 导演 · "
            + f"{head['导演数']:,} 位<br/>合计 {head['评分记录数']:,} 条评分 · {share:.2f}%"
            + "':'评分记录占比 · 每个完整格为 1%<br/>前 1% 导演：" + f"{share:.2f}%"
            + "<br/>其余导演：" + f"{100-share:.2f}%" + "';}")})


def build_distribution(data):
    rows = data['C3']['档']
    peak = max(density for row in rows for _, density in row['曲线'])
    curves = [[[value, round(density / peak, 5)] for value, density in row['曲线']] for row in rows]
    chart = Custom()
    chart.add('口碑分布', render_item=JsCode(
        "function(p,api){var i=api.value(0),y=api.coord([3,i])[1],height=Math.min(38,Math.abs(api.size([0,1])[1])*.28),"
        "color=" + repr(COLORS) + "[i],curve=" + json.dumps(curves, separators=(',', ':')) + "[i],"
        "upper=curve.map(function(d){return [api.coord([d[0],i])[0],y-d[1]*height];}),"
        "lower=curve.map(function(d){return [api.coord([d[0],i])[0],y+d[1]*height];}).reverse(),"
        "median=api.coord([api.value(1),i])[0],q1=api.coord([api.value(2),i])[0],q3=api.coord([api.value(3),i])[0];"
        "return {type:'group',children:["
        "{type:'polygon',shape:{points:upper.concat(lower)},style:{fill:color,opacity:.22}},"
        "{type:'polyline',shape:{points:upper},style:{stroke:color,fill:null,lineWidth:1.5,opacity:.9}},"
        "{type:'polyline',shape:{points:lower},style:{stroke:color,fill:null,lineWidth:1.5,opacity:.9}},"
        "{type:'line',shape:{x1:q1,y1:y,x2:q3,y2:y},style:{stroke:'#f6ecdd',lineWidth:5,lineCap:'round',opacity:.85}},"
        "{type:'polygon',shape:{points:[[median,y-7],[median+6,y],[median,y+7],[median-6,y]]},"
        "style:{fill:'#f6ecdd',stroke:'#1d1819',lineWidth:2}},"
        "{type:'rect',shape:{x:median-27,y:y-59,width:54,height:28,r:5},style:{fill:'#211a1c',stroke:color,lineWidth:1}},"
        "{type:'text',style:{x:median,y:y-45,text:Number(api.value(1)).toFixed(2),fontSize:16,fontFamily:'Microsoft YaHei',"
        "fill:'#f6ecdd',align:'center',verticalAlign:'middle'}},"
        "{type:'text',style:{x:6,y:y-10,text:api.value(4),fontSize:16,fontFamily:'Microsoft YaHei',fill:'#f6ecdd',verticalAlign:'middle'}},"
        "{type:'text',style:{x:6,y:y+18,text:Number(api.value(5)).toLocaleString()+' 位',fontSize:16,"
        "fontFamily:'Microsoft YaHei',fill:'#c6b8a6',verticalAlign:'middle'}}]};}"),
        data=[{'value': [index, row['中位'], *row['四分位'], row['标签'], row['样本数']],
               'name': row['标签']} for index, row in enumerate(rows)])
    chart.options['series'][0]['encode'] = {'x': [1, 2, 3], 'y': 0}
    chart.options['series'][0]['clip'] = False
    chart.options['xAxis'] = [axis('导演加权均分', min=.5, max=5, interval=.5,
        nameLocation='middle', nameGap=32)]
    chart.options['yAxis'] = [axis(kind='category', data=[row['标签'] for row in rows], inverse=True,
                                  axisLabel={'show': False})]
    return finish(chart, (142, 24, 22, 56), {'grid': {'left': 98, 'right': 18},
        'xAxis': [{'interval': 1}]}, tooltip={'formatter': JsCode(
            "function(p){var v=p.value;return p.name+' · '+Number(v[5]).toLocaleString()+' 位导演<br/>'"
            "+'中位数 '+Number(v[1]).toFixed(3)+'<br/>中间 50%：'+Number(v[2]).toFixed(3)+'–'+Number(v[3]).toFixed(3);}")})


def build_discovery(data):
    rows = data["C4"]["点"]
    midpoint = data['C4']['四象限']['x切分']
    selected = sorted((row for row in rows if row['编号'] in data['C4']['推荐']),
                      key=lambda row: (-row['y'], row['x'], row['编号']))
    points = {}
    for row in selected:
        points.setdefault((row['x'], row['y']), []).append({
            'name': row['中文名'] or row['名'], 'id': row['编号'],
            'score': row['y'], 'votes': row['x'], 'works': row['作品数']})
    chart = Scatter()
    chart.add_xaxis([])
    chart.add_yaxis('全部导演', [{'value': [row['x'], row['y']], 'id': row['编号'],
        'name': row['中文名'] or row['名'], 'works': row['作品数'],
        'score': row['y'], 'votes': row['x']} for row in rows],
        symbol_size=5, itemstyle_opts=opts.ItemStyleOpts(color=COLORS[3], opacity=.35),
        label_opts=opts.LabelOpts(is_show=False))
    chart.add_yaxis('高分且较少关注', [{'value': [votes, score], 'name': ' / '.join(person['name'] for person in people),
        'id': people[0]['id'], 'members': people} for (votes, score), people in points.items()],
        symbol_size=15, itemstyle_opts=opts.ItemStyleOpts(color=COLORS[2], border_color='#f6ecdd', border_width=1),
        label_opts=opts.LabelOpts(is_show=True, position='inside', color='#171214', font_size=11,
            formatter=JsCode("function(p){return p.data.members.length>1?String(p.data.members.length):'';}")))
    chart.options['series'][1]['markArea'] = {'silent': True, 'label': {'show': False},
        'itemStyle': {'color': COLORS[2], 'opacity': .06},
        'data': [[{'xAxis': 10000, 'yAxis': 4}, {'xAxis': midpoint, 'yAxis': 4.5}]]}
    chart.options['series'][1]['markLine'] = {'silent': True, 'symbol': ['none', 'none'],
        'lineStyle': {'color': COLORS[2], 'width': 1, 'opacity': .65, 'type': 'dashed'},
        'label': {'color': '#d7ab82', 'fontSize': 14, 'lineHeight': 18, 'backgroundColor': '#1d1819', 'padding': [3, 5]},
        'data': [{'xAxis': midpoint, 'label': {'formatter': f'关注中位\n{midpoint/10000:.2f} 万', 'position': 'insideStartTop', 'rotate': 0}},
                 {'yAxis': 4, 'label': {'formatter': '4.0 分', 'position': 'insideEndTop'}}]}
    chart.options["xAxis"] = [axis("评分记录（对数）", "log", min=10000, max=1000000,
        nameLocation="middle", nameGap=46,
        axisLabel={**TEXT, "formatter": JsCode("function(v){return v/10000+'万';}")})]
    chart.options["yAxis"] = [axis("加权均分 / 5", min=2, max=4.5, interval=.5)]

    credits = Custom()
    credits.add('发现导演', render_item=JsCode(
        "function(p,api){var w=api.getWidth(),compact=w<=760,x=compact?16:w-332,cw=compact?w-32:316,"
        "step=compact?75:(api.getHeight()-70)/" + str(len(selected)) + ",y=(compact?535:40)+api.value(0)*step;"
        "return {type:'group',children:[{type:'rect',shape:{x:x-10,y:y-10,width:cw+20,height:compact?76:68,r:4},"
        "style:{fill:'#21191b',opacity:.4},emphasis:{style:{fill:'#463239',opacity:.85}}},"
        "{type:'text',style:{x:x,y:y,text:api.value(2),width:cw-82,overflow:'break',lineHeight:22,"
        "fontSize:compact?18:20,fontFamily:'Cinema WenKai, Georgia, serif',fill:'#f6ecdd'}},"
        "{type:'text',style:{x:x+cw,y:y+2,text:Number(api.value(1)).toFixed(2),"
        "fontSize:25,fontFamily:'Georgia',fill:'#d7ab82',align:'right'}},"
        "{type:'text',style:{x:x,y:y+(compact?46:32),text:Number(api.value(3)).toLocaleString()+' 条 · '+api.value(4)+' 部',"
        "fontSize:14,fontFamily:'Georgia, Cinema WenKai, serif',fill:'#c6b8a6'}},"
        "{type:'line',shape:{x1:x,y1:y+(compact?70:60),x2:x+cw,y2:y+(compact?70:60)},style:{stroke:'#705357',opacity:.35}}]};}"),
        data=[{'value': [index, row['y'], row['中文名'] or row['名'], row['x'], row['作品数']],
               'id': row['编号'], 'name': row['中文名'] or row['名'],
               'score': row['y'], 'votes': row['x'], 'works': row['作品数']} for index, row in enumerate(selected)])
    credits.options['series'][0]['coordinateSystem'] = 'none'
    chart.options['series'].append(credits.options['series'][0])
    chart.options['graphic'] = [
        {'type': 'text', 'left': 58, 'top': 8, 'silent': True,
         'style': {'text': f'{len(rows)} 位导演', 'fontSize': 14, 'fontFamily': 'Cinema WenKai', 'fill': '#c6b8a6'}},
        {'type': 'text', 'right': 16, 'top': 8, 'silent': True,
         'style': {'text': '均分 / 5', 'fontSize': 14, 'fontFamily': 'Cinema WenKai', 'fill': '#c6b8a6'}}]
    return finish(chart, (58, 390, 60, 80),
        {'grid': {'left': 48, 'right': 18, 'bottom': 720}},
        {'formatter': JsCode("function(p){var d=p.data,people=d.members||[d];return (people.length>1?people.length+' 位导演重合<br/><br/>':'')+people.map(function(person){"
            "return echarts.format.encodeHTML(person.name)+'<br/>加权均分 '+person.score.toFixed(3)+' / 5<br/>'"
            "+person.votes.toLocaleString()+' 条评分 · '+person.works+' 部作品';}).join('<br/><br/>');}")}, max_width=760)


def build_career(data):
    story = data['C6']['年谱']
    first = min(film['年份'] for film in story['作品']) // 5 * 5
    last = max(film['年份'] for film in story['作品']) // 5 * 5
    periods = list(range(first, last + 1, 5))
    cells = []
    for index, person in enumerate(story['导演']):
        films = [film for film in story['作品'] if film['导演序号'] == index]
        start = min(film['年份'] for film in films) // 5 * 5
        stop = max(film['年份'] for film in films) // 5 * 5
        for year in range(start, stop + 1, 5):
            selected = [film for film in films if year <= film['年份'] < year + 5]
            count = len(selected)
            cells.append({'value': [periods.index(year), index, count], 'id': f"{person['编号']}:{year}",
                'name': str(year), 'directorName': person['名'], 'period': f'{year}–{year + 4}', 'periodStart': year,
                'films': [{'movieId': str(film['电影编号']), 'name': film['片名'].removesuffix(f" ({film['年份']})"),
                           'year': film['年份'], 'mean': film['均分']} for film in selected]})
    chart = HeatMap()
    chart.add_xaxis([str(year) for year in periods])
    chart.add_yaxis('库内作品', [person['名'] for person in story['导演']], cells,
        label_opts=opts.LabelOpts(is_show=True, font_size=16,
            formatter=JsCode("function(p){return '{'+(p.value[2]>=3?'dark':'light')+'|'+p.value[2]+'}';}"),
            rich={'dark': {'color': '#20171a', 'fontSize': 16},
                  'light': {'color': '#f6ecdd', 'fontSize': 16}}))
    chart.options['series'][0]['itemStyle'] = {'borderColor': '#1b1517', 'borderWidth': 4}
    chart.options['series'][0].update({'selectedMode': 'single',
        'select': {'itemStyle': {'borderColor': '#ffe5a6', 'borderWidth': 3}},
        'emphasis': {'itemStyle': {'borderColor': '#f6ecdd', 'borderWidth': 2}}})
    chart.options.update({'periodSteps': [1, 5, 10], 'cellMinWidth': 36,
                          'minimumWidth': 360, 'rowHeight': 96})
    chart.options['visualMap'] = {'type': 'piecewise', 'seriesIndex': 0, 'dimension': 2,
        'orient': 'horizontal', 'left': 'center', 'bottom': 8, 'selectedMode': False,
        'itemWidth': 18, 'itemHeight': 12, 'itemGap': 20, 'textStyle': TEXT,
        'pieces': [{'value': 0, 'label': '0 部', 'color': '#332b2d'},
                   {'gte': 1, 'lte': 2, 'label': '1–2 部', 'color': '#8e5d68'},
                   {'gte': 3, 'lte': 5, 'label': '3–5 部', 'color': '#d89588'},
                   {'gte': 6, 'label': '6+ 部', 'color': '#efc598'}]}
    counts = Custom()
    counts.add('作品总数', render_item=JsCode(
        "function(p,api){var y=api.coord([0,api.value(1)])[1];return {type:'text',style:{"
        "x:api.getWidth()-3,y:y,text:api.value(2)+' 部',fontSize:16,fontFamily:'Microsoft YaHei',"
        "fill:'#d7ab82',align:'right',verticalAlign:'middle'}};}"),
        data=[{'value': [0, index, person['作品数']], 'id': person['编号'], 'name': person['名']}
              for index, person in enumerate(story['导演'])])
    counts.options['series'][0].update({'encode': {'x': 0, 'y': 1}, 'clip': False})
    chart.options['series'].extend(counts.options['series'])
    chart.options['xAxis'] = [axis(kind='category', data=[str(year) for year in periods], position='top',
        axisLabel={**TEXT, 'interval': 'auto', 'hideOverlap': True},
        splitArea={'show': False})]
    chart.options['yAxis'] = [axis(kind='category', data=[person['名'] for person in story['导演']],
                                  inverse=True, axisLabel={'show': False})]
    return finish(chart, (4, 54, 46, 70), tooltip={
        'backgroundColor': '#100d0e', 'borderColor': '#d7ab82', 'borderWidth': 1,
        'textStyle': {**TEXT, 'color': '#f6ecdd'},
        'extraCssText': 'max-width:380px;white-space:normal;',
        'formatter': JsCode("function(p){var d=p.data;if(!d.period)return echarts.format.encodeHTML(d.name)+' · '+d.value[2]+' 部'"
            "+(d.unknown?'（'+d.unknown+' 部年份未知）':'');"
            "return '<b>'+echarts.format.encodeHTML(d.directorName)+'</b><br/>'+d.period+' · '+d.value[2]+' 部库内作品'"
            "+(d.value[2]?'<br/>点击查看这些作品':'');}")})


def build_genres(data):
    rows = data["C7"]
    matrix = rows["矩阵"][:12]
    names = [row["中文名"] or row["名"] for row in rows["导演"][:12]]
    maximum = math.ceil(max(value for values in matrix for value in values) * 10) / 10
    colors = COLORS + ['#787464', '#cc7e63', '#724e58', '#4b565b', '#b79ac6', '#7ca5bf']
    cells = [{"value": [column, index, value, int(value == max(values))],
              "id": rows["导演"][index]["编号"], "name": names[index], "genre": rows["类型"][column],
              "itemStyle": {"color": colors[column]}}
             for index, values in enumerate(matrix) for column, value in enumerate(values)]
    chart = Custom()
    chart.add("类型占比", render_item=JsCode(
        "function(p,api){var pos=api.coord([api.value(0),api.value(1)]),v=api.value(2),"
        "color=api.visual('color'),r=18*Math.sqrt(v/" + str(maximum) + ");"
        "if(!v)return {type:'line',shape:{x1:pos[0]-3,y1:pos[1],x2:pos[0]+3,y2:pos[1]},"
        "style:{stroke:'#6e7074',lineWidth:1.5}};"
        "return {type:'circle',shape:{cx:pos[0],cy:pos[1],r:r},"
        "style:{fill:color,stroke:api.value(3)?'#f6ecdd':color,lineWidth:api.value(3)?1.5:0},"
        "emphasis:{style:{stroke:'#f6ecdd',lineWidth:2.5}}};}"), data=cells)
    chart.options["series"][0]["clip"] = False
    chart.options["xAxis"] = [axis(kind="category", data=rows["类型"], position="top",
        axisLabel={**TEXT, "interval": 0, "margin": 20})]
    chart.options["yAxis"] = [axis(kind="category", data=names, inverse=True,
        axisLabel={**TEXT, "margin": 24},
        splitLine={"show": True, "lineStyle": {"color": "#6e7074", "opacity": .12}})]
    legend = [
        {"type": "line", "shape": {"x1": 0, "y1": 0, "x2": 6, "y2": 0}, "style": {"stroke": "#6e7074", "lineWidth": 1.5}},
        {"type": "text", "style": {"x": 14, "y": 0, "text": "未出现", "fill": "#c6b8a6", "fontSize": 14, "verticalAlign": "middle"}},
    ]
    for index, share in enumerate([.05, .15, .30]):
        legend.append({"type": "circle", "shape": {"cx": 100 + index * 40, "cy": 0,
            "r": 18 * math.sqrt(share / maximum)}, "style": {"fill": "#c6b8a6"}})
    legend.extend([
        {"type": "text", "style": {"x": 208, "y": 0, "text": "占比由小到大", "fill": "#c6b8a6", "fontSize": 14, "verticalAlign": "middle"}},
        {"type": "circle", "shape": {"cx": 340, "cy": 0, "r": 6}, "style": {"fill": None, "stroke": "#f6ecdd", "lineWidth": 1.5}},
        {"type": "text", "style": {"x": 354, "y": 0, "text": "行内最高", "fill": "#c6b8a6", "fontSize": 14, "verticalAlign": "middle"}},
    ])
    chart.options["graphic"] = [{"type": "group", "right": 24, "bottom": 16, "children": legend}]
    return finish(chart, (220, 20, 54, 88), tooltip={"backgroundColor": "#100d0e",
        "borderWidth": 1, "borderColor": "#846662", "textStyle": {**TEXT, "color": "#f6ecdd"},
        "formatter": JsCode("function(p){var d=p.data;return echarts.format.encodeHTML(d.name)"
            "+'<br/>'+d.genre+'　'+(d.value[2]*100).toFixed(1)+'%';}")})


def build_collaboration():
    with (ROOT / '加工数据/导演合作表.csv').open(encoding='utf-8-sig', newline='') as stream:
        degree = Counter(person for row in csv.DictReader(stream)
                         for person in (row['导演A编号'], row['导演B编号']))
    maximum = max(degree.values())
    chart = Graph()
    chart.add('全部搭档', [], [], categories=[{'name': '当前导演'}, {'name': '合作导演'}],
        layout='none', symbol='circle', symbol_size=16, node_scale_ratio=0, is_roam=True, is_draggable=True,
        label_opts=opts.LabelOpts(is_show=True, position='right', color='#f6ecdd',
            font_size=15, font_family='Microsoft YaHei'),
        linestyle_opts=opts.LineStyleOpts(color='#9b8c80', width=1.5, opacity=.5, curve=.05),
        emphasis_opts={'focus': 'adjacency', 'label': {'show': True, 'fontSize': 18},
                       'lineStyle': {'color': '#f6ecdd', 'width': 3, 'opacity': 1}})
    chart.options['color'] = COLORS[:2]
    chart.options['series'][0].update({'center': None, 'zoom': 1,
        'left': 'center', 'top': 'middle', 'right': None, 'bottom': None, 'width': 520, 'height': 520,
        'scaleLimit': {'min': .3, 'max': 5}, 'labelLayout': {'hideOverlap': True}})
    chart.options['series'][0].pop('force')
    chart.options['media'] = [
        {'query': {'maxWidth': 600}, 'option': {'series': [{'width': 240, 'height': 240}]}},
        {'query': {'minWidth': 601, 'maxWidth': 1000}, 'option': {'series': [{'width': 420, 'height': 420}]}},
        {'query': {'minWidth': 1001}, 'option': {'series': [{'width': 520, 'height': 520}]}},
    ]
    chart.options['layoutPositions'] = [{'x': 0, 'y': 0, 'symbolSize': 52,
        'label': {'position': 'bottom', 'align': 'center'}}]
    for index in range(maximum):
        angle = -math.pi / 4 + index * 2 * math.pi / maximum
        position = ('top' if math.sin(angle) < 0 else 'bottom') if abs(math.sin(angle)) > .85 else ('right' if math.cos(angle) >= 0 else 'left')
        chart.options['layoutPositions'].append({'x': round(260 * math.cos(angle), 2), 'y': round(260 * math.sin(angle), 2),
            'label': {'position': position, 'align': 'center' if position in ('top', 'bottom') else ('left' if position == 'right' else 'right')}})
    return finish(chart, (24, 24, 24, 24), tooltip={'backgroundColor': '#100d0e',
        'borderWidth': 1, 'borderColor': '#846662', 'textStyle': {**TEXT, 'color': '#f6ecdd'},
        'extraCssText': 'max-width:calc(100% - 16px);white-space:normal;overflow-wrap:anywhere;',
        'formatter': JsCode("function(p){var d=p.data,name=echarts.format.encodeHTML(d.name);"
            "if(p.dataType==='edge')return name+'<br/>共同执导 '+d.value+' 部<br/>'"
            "+d.ratings.toLocaleString()+' 条评分记录';"
            "return name+'<br/>'+(d.category===0?'全部 '+d.value+' 位搭档':'共同执导 '+d.value+' 部');}")})


def build_ranking(rows, unit, maximum=None, numbered=True):
    rows = rows[:10]
    detailed = 'detail' in rows[0]
    maximum = maximum or max(row['value'] for row in rows)
    for index, row in enumerate(rows):
        row['amount'] = row['value']
        row['display'] = f"{row['value']:.2f} 分" if unit == '分' else (
            f"{row['value'] / 10000:.1f}万条" if unit == '条' else (
            f"{row['value']:.1f}%" if unit == '%' else f"{row['value']:,} 部"))
        row['value'] = [index, row['value'], maximum, row['name'], row['display']]
        if detailed:
            row['value'].append(row['detail'])
    chart = Custom()
    chart.add('榜单', render_item=JsCode(
        "function(p,api){var w=api.getWidth(),i=api.value(0),v=api.value(1),"
        "y=api.coord([0,i])[1],n=w<440?126:170,left=" + ('(w<440?28:38)' if numbered else '4') + ","
        "start=left+n+14,end=w-76,x=start+(end-start)*v/api.value(2);"
        "var children=[{type:'line',shape:{x1:0,y1:y+25,x2:w,y2:y+25},style:{stroke:'#3b3233',lineWidth:.5}},"
        "{type:'text',style:{x:left,y:y" + ('-9' if detailed else '') + ",text:api.value(3),fontSize:16,fontFamily:'Microsoft YaHei',fill:'#f6ecdd',"
        "width:n,overflow:'truncate',lineHeight:22,verticalAlign:'middle'}},"
        "{type:'line',shape:{x1:start,y1:y,x2:x,y2:y},style:{stroke:'#d87c7c',lineWidth:1.5,opacity:.5}},"
        "{type:'circle',shape:{cx:x,cy:y,r:4},style:{fill:'#d87c7c'}},"
        "{type:'text',style:{x:w-2,y:y,text:api.value(4),fontSize:16,fontFamily:'Microsoft YaHei',fill:'#d87c7c',"
        "align:'right',verticalAlign:'middle'}}];" +
        ("children.push({type:'text',style:{x:left,y:y+15,text:api.value(5),fontSize:14,fontFamily:'Microsoft YaHei',fill:'#c6b8a6',verticalAlign:'middle'}});" if detailed else '') +
        ("children.push({type:'text',style:{x:3,y:y,text:String(i+1),fontSize:16,fontFamily:'Microsoft YaHei',fill:'#9a8d80',verticalAlign:'middle'}});" if numbered else '') +
        "return {type:'group',children:children};}"), data=rows)
    chart.options['series'][0]['encode'] = {'x': 1, 'y': 0}
    chart.options['xAxis'] = [axis(show=False, min=0, max=maximum)]
    chart.options['yAxis'] = [axis(kind='category', data=[row['name'] for row in rows],
                                  inverse=True, axisLabel={'show': False})]
    return finish(chart, (0, 0, 4, 8), tooltip={'formatter': JsCode(
        "function(p){return echarts.format.encodeHTML(p.data.name)+'<br/>'+p.data.display"
        + ("+'<br/>'+p.data.detail" if detailed else '') + ";}")})


def build_score_comparison(data):
    chart = Parallel()
    chart.add_schema([
        {'dim': 0, 'name': '口碑 / 5\n局部 4.00–4.30', 'min': 4, 'max': 4.3, 'interval': .05,
         'axisLabel': {**TEXT, 'formatter': JsCode('function(v){return v.toFixed(2);}') }},
        {'dim': 1, 'name': '作品 / 部', 'min': 0, 'max': 35, 'interval': 5},
        {'dim': 2, 'name': '评分记录 / 万', 'min': 0, 'max': 40, 'interval': 5},
    ], parallel_opts={'left': 250, 'right': 80, 'top': 112, 'bottom': 64,
        'parallelAxisDefault': {'type': 'value', 'nameLocation': 'end', 'nameGap': 24,
            'nameTextStyle': {**TEXT, 'fontSize': 18, 'lineHeight': 28, 'color': '#f6ecdd'},
            'axisLine': {'lineStyle': {'color': '#8a7265', 'width': 1}},
            'axisTick': {'show': True, 'length': 5, 'lineStyle': {'color': '#8a7265'}},
            'axisLabel': {**TEXT, 'margin': 12}, 'areaSelectStyle': {'width': 0}}})
    colors = COLORS + ['#787464', '#cc7e63', '#724e58', '#4b565b']
    for index, row in enumerate(data['C3']['高分榜']):
        name = row['中文名'] or row['名']
        chart.add(name, [{'id': row['编号'], 'name': name, 'rank': index + 1,
            'value': [row['加权均分'], row['作品数'], row['累计人数'] / 10000],
            'ratings': row['累计人数']}],
            linestyle_opts=opts.LineStyleOpts(color=colors[index], width=3 if index == 0 else 2, opacity=.9),
            emphasis_opts={'focus': 'series', 'lineStyle': {'width': 4, 'opacity': 1, 'color': '#f6ecdd'}})
    chart.options.update({'backgroundColor': 'transparent', 'color': colors, 'textStyle': TEXT,
        'animationDuration': 900,
        'legend': {'show': True, 'orient': 'vertical', 'left': 8, 'top': 112,
            'itemWidth': 24, 'itemHeight': 3, 'itemGap': 27, 'icon': 'rect', 'selectedMode': False,
            'textStyle': {'fontSize': 16, 'lineHeight': 24, 'color': '#f6ecdd', 'fontFamily': 'Microsoft YaHei'},
            'data': [row['中文名'] or row['名'] for row in data['C3']['高分榜']]},
        'tooltip': {'trigger': 'item', 'confine': True, 'backgroundColor': '#1d1819',
            'borderColor': '#846662', 'borderWidth': 1, 'textStyle': {**TEXT, 'color': '#f6ecdd'},
            'formatter': JsCode("function(p){var d=p.data;return echarts.format.encodeHTML(d.name)"
                "+'<br/>加权均分 '+d.value[0].toFixed(3)+' / 5<br/>'+d.value[1]+' 部作品<br/>'"
                "+d.ratings.toLocaleString()+' 条评分记录';}")}})
    return chart.dump_options()


def build_score_distribution(single_film=False):
    labels = [f'{index / 2:g}' for index in range(1, 11)] if single_film else [
        f'{index / 2:g}–{(index + 1) / 2:g}' for index in range(1, 10)]
    chart = Custom()
    chart.add('评分记录' if single_film else '作品数', render_item=JsCode(
        "function(p,api){var point=api.coord([api.value(0),api.value(1)]),base=api.coord([api.value(0),0]);"
        "return {type:'group',children:[{type:'line',shape:{x1:point[0],y1:base[1],x2:point[0],y2:point[1]},"
        "style:{stroke:'#d87c7c',lineWidth:1.5,opacity:.65}},"
        "{type:'circle',shape:{cx:point[0],cy:point[1],r:4},style:{fill:'#d87c7c'}}]};}"), data=[])
    chart.options['series'][0]['encode'] = {'x': 0, 'y': 1}
    chart.options['xAxis'] = [axis('评分' if single_film else '作品均分', kind='category', data=labels,
        axisLabel={**TEXT, 'interval': 0 if single_film else 1}, nameLocation='middle', nameGap=30)]
    chart.options['yAxis'] = [axis('评分记录' if single_film else '作品数', min=0, minInterval=1, boundaryGap=[0, .15],
        axisLabel={**TEXT, 'formatter': JsCode("function(v){return v>=10000?v/10000+'万':String(v);}")})]
    unit = '条评分' if single_film else '部作品'
    return finish(chart, (52, 24, 32, 50), tooltip={'formatter': JsCode(
        "function(p){return p.name+' 分<br/>'+p.value[1].toLocaleString()+' " + unit + "'"
        "+(p.data.share===undefined?'':' · '+p.data.share.toFixed(1)+'%');}")})


def build_templates():
    text = {'fontFamily': 'Georgia, Cinema WenKai, serif', 'fontSize': 14, 'color': '#c6b8a6'}

    # Each dot remains one film; the diamond and rail show median and middle 50%.
    dots = Custom()
    for index, color in enumerate(COLORS[:3]):
        dots.add(f'导演{index}', render_item=JsCode(
            "function(p,api){var point=api.coord([api.value(0),p.seriesIndex]);"
            "if(api.value(3)===1){var left=api.coord([api.value(1),p.seriesIndex])[0],"
            "right=api.coord([api.value(2),p.seriesIndex])[0],y=point[1]-36;return {type:'group',children:["
            "{type:'line',shape:{x1:left,y1:y,x2:right,y2:y},style:{stroke:'" + color + "',lineWidth:4,opacity:.6}},"
            "{type:'polygon',shape:{points:[[point[0],y-6],[point[0]+5,y],[point[0],y+6],[point[0]-5,y]]},"
            "style:{fill:'#f6ecdd',stroke:'#171214',lineWidth:1.5}},"
            "{type:'text',style:{x:point[0],y:y-20,text:Number(api.value(0)).toFixed(2),"
            "fontSize:19,fontFamily:'Georgia',fill:'#f6ecdd',align:'center',verticalAlign:'middle'}}]};}"
            "return {type:'circle',shape:{cx:point[0],cy:point[1]+(api.value(1)%5-2)*8,r:4.5},"
            "style:{fill:'" + color + "',stroke:'#171214',lineWidth:1,opacity:.9}};}"), data=[])
    dots.options['xAxis'] = [axis('作品均分', min=.5, max=5, interval=.5, nameLocation='middle', nameGap=28,
        axisLabel={**TEXT, 'formatter': JsCode("function(v){return Number.isInteger(v)?String(v):'';}")})]
    dots.options['yAxis'] = [axis(kind='category', data=[], inverse=True, axisLabel={**text,
        'formatter': JsCode("function(v){return v==='当前'?'':v;}")})]
    dots.options['series'] = [{**series, 'encode': {'x': 0}, 'clip': False} for series in dots.options['series']]

    profiles = Line()
    profiles.add_xaxis([])
    for index, color in enumerate(COLORS[:3]):
        profiles.add_yaxis('', [], color=color, symbol=['circle', 'diamond', 'triangle'][index], symbol_size=6,
            is_step='middle', label_opts=opts.LabelOpts(is_show=False),
            linestyle_opts=opts.LineStyleOpts(width=2, type_=['solid', 'dashed', 'dotted'][index]),
            areastyle_opts=opts.AreaStyleOpts(opacity=.06))
    profiles.options['xAxis'] = [axis('作品均分', min=.5, max=5, interval=.5, nameLocation='middle', nameGap=28,
        axisLabel={**TEXT, 'formatter': JsCode("function(v){return Number.isInteger(v)?String(v):'';}")})]
    profiles.options['yAxis'] = [axis('作品数', min=0, minInterval=1, boundaryGap=[0, .15])]

    # Stems locate individual films in time without connecting missing years.
    career = Custom()
    for color in COLORS[:3]:
        career.add('', render_item=JsCode(
            "function(p,api){var point=api.coord([api.value(0),api.value(1)]),base=api.coord([api.value(0),0]);"
            "var children=[{type:'line',shape:{x1:point[0],y1:base[1],x2:point[0],y2:point[1]},"
            "style:{stroke:'" + color + "',lineWidth:1,opacity:.22}},"
            "{type:'circle',shape:{cx:point[0],cy:point[1],r:4.5},"
            "style:{fill:'" + color + "',stroke:'#171214',lineWidth:1}}];"
            "if(api.value(2)===1)children.push({type:'text',style:{x:point[0],y:point[1]-15,"
            "text:api.value(0)+' · '+(api.value(1)>=10000?(api.value(1)/10000).toFixed(1)+'万':api.value(1)),"
            "fontSize:14,fontFamily:'Georgia, Cinema WenKai, serif',fill:'#f6ecdd',align:'center',verticalAlign:'bottom'}});"
            "return {type:'group',children:children};}"), data=[])
    career.options['series'] = [{**series, 'encode': {'x': 0, 'y': 1}, 'clip': False} for series in career.options['series']]
    career.options['xAxis'] = [axis('上映年份', min='dataMin', max='dataMax', minInterval=1,
        nameLocation='middle', nameGap=28,
        axisLabel={**TEXT, 'hideOverlap': True, 'formatter': JsCode('function(v){return String(v);}')})]
    career.options['yAxis'] = [axis('评分记录', min=0, splitNumber=4, boundaryGap=[0, .12],
        axisLabel={**TEXT, 'formatter': JsCode("function(v){return v>=10000?v/10000+'万':String(v);}")})]
    career_scores = Scatter()
    career_scores.add_xaxis([])
    for index, color in enumerate(COLORS[:3]):
        career_scores.add_yaxis('', [], symbol=['circle', 'diamond', 'triangle'][index], symbol_size=9,
            itemstyle_opts=opts.ItemStyleOpts(color=color, opacity=.9, border_color='#171214', border_width=1),
            label_opts=opts.LabelOpts(is_show=False))
    career_scores.options['xAxis'] = career.options['xAxis']
    career_scores.options['yAxis'] = [axis('作品均分', min=.5, max=5, interval=.5,
        axisLabel={**text, 'formatter': JsCode("function(v){return Number.isInteger(v)?String(v):'';}")})]

    partners = Graph()
    partners.add('共创', [], [], layout='circular', is_draggable=True,
        symbol_size=16, label_opts=opts.LabelOpts(is_show=True, font_size=14, color='#e0d2c0'),
        linestyle_opts=opts.LineStyleOpts(color='#919e8b', width=1.5, opacity=.5))
    partners.options['series'][0].update({'categories': [
        {'name': f'导演{index}', 'itemStyle': {'color': color}} for index, color in enumerate(COLORS[:4])],
        'left': '22%', 'right': '22%', 'top': '28%', 'bottom': '28%',
        'circular': {'rotateLabel': False},
        'labelLayout': {'hideOverlap': False},
        'symbolSize': 16,
        'label': {'show': True, **text, 'color': '#e0d2c0', 'width': 180, 'lineHeight': 19,
                  'overflow': 'break', 'position': 'right', 'distance': 9},
        'edgeLabel': {'show': True, **text, 'fontSize': 13, 'formatter': '{c}', 'rotate': 0,
                      'backgroundColor': '#171214', 'padding': [2, 4], 'borderRadius': 2},
        'emphasis': {'focus': 'adjacency', 'label': {'width': 180, 'formatter': '{b}'},
                    'lineStyle': {'width': 3, 'opacity': 1}}})

    matrix = Custom()
    matrix.add('合作部数', render_item=JsCode(
        "function(p,api){var point=api.coord([api.value(0),api.value(1)]),"
        "w=Math.min(62,api.size([1,0])[0]*.7),h=Math.min(34,Math.abs(api.size([0,1])[1])*.75);"
        "return {type:'group',children:[{type:'rect',shape:{x:point[0]-w/2,y:point[1]-h/2,width:w,height:h,r:3},"
        "style:{fill:api.visual('color'),stroke:'#574249',lineWidth:1}},"
        "{type:'text',style:{x:point[0],y:point[1],text:api.value(2)?String(api.value(2)):'—',"
        "fontSize:17,fontFamily:'Georgia',fill:'#f6ecdd',align:'center',verticalAlign:'middle'}}]};}"), data=[])
    matrix.options['series'][0]['encode'] = {'x': 0, 'y': 1, 'tooltip': 2}
    matrix.options['xAxis'] = [axis(kind='category', data=[])]
    matrix.options['yAxis'] = [axis(kind='category', data=[], inverse=True,
        axisLabel={**text, 'width': 180, 'overflow': 'break', 'lineHeight': 18})]
    matrix.options['visualMap'] = {'show': True, 'min': 0, 'max': 10, 'dimension': 2,
        'orient': 'horizontal', 'left': 'center', 'bottom': 4, 'itemWidth': 8, 'itemHeight': 90,
        'textStyle': text, 'textGap': 8, 'padding': 0,
        'inRange': {'color': ['#231c1e', COLORS[0]]}}

    radar = Radar()
    radar.options['radar'] = {'indicator': [{'name': '', 'max': 100} for _ in range(8)],
        'center': ['50%', '50%'], 'radius': '54%', 'splitNumber': 3,
        'axisName': {**text, 'fontSize': 15, 'color': '#e0d2c0', 'lineHeight': 22},
        'axisNameGap': 12,
        'axisLine': {'lineStyle': {'color': '#70575e', 'opacity': .45}},
        'splitLine': {'lineStyle': {'color': '#70575e', 'opacity': .45}},
        'splitArea': {'show': False}}
    radar.options['series'] = [{'type': 'radar', 'data': [], 'symbolSize': 5,
        'lineStyle': {'color': color, 'width': 2.5, 'type': ['solid', 'dashed', 'dotted'][index]},
        'itemStyle': {'color': color}, 'symbol': ['circle', 'diamond', 'triangle'][index],
        'areaStyle': {'color': color, 'opacity': .08}} for index, color in enumerate(COLORS[:3])]

    genres = Custom()
    for color in COLORS[:3]:
        genres.add('', render_item=JsCode(
            "function(p,api){var point=api.coord([api.value(1),api.value(0)]),base=api.coord([0,api.value(0)]),"
            "dy=(p.seriesIndex-(api.value(2)-1)/2)*13;return {type:'group',children:["
            "{type:'line',shape:{x1:base[0],y1:base[1]+dy,x2:point[0],y2:point[1]+dy},"
            "style:{stroke:'" + color + "',lineWidth:1,opacity:.4}},"
            "{type:'circle',shape:{cx:point[0],cy:point[1]+dy,r:4},style:{fill:'" + color + "'}},"
            "{type:'text',style:{x:point[0]+9,y:point[1]+dy,text:Number(api.value(1)).toFixed(1)+'%',"
            "fontSize:13,fontFamily:'Georgia',fill:'" + color + "',verticalAlign:'middle'}}]};}"), data=[])
    genres.options['xAxis'] = [axis('标签占比', min=0, max=100, interval=50, nameLocation='middle', nameGap=28,
        axisLabel={**TEXT, 'formatter': '{value}%'})]
    genres.options['yAxis'] = [axis(kind='category', data=[], inverse=True)]

    # Typography and ruler styles are shared; data geometry stays beside each chart.
    for chart in [dots, profiles, career, career_scores, matrix, radar, partners, genres]:
        chart.options['textStyle'] = text
        for key in ['xAxis', 'yAxis']:
            for item in chart.options.get(key, []):
                item['nameTextStyle'] = text
                item['axisLabel'] = {**item['axisLabel'], **text, 'hideOverlap': True}
                item['splitLine'] = {'show': key == 'yAxis' and item['type'] != 'category',
                                     'lineStyle': {'color': '#c6b8a6', 'opacity': .09}}

    profile_counts = finish(profiles, (42, 22, 24, 46), tooltip={'formatter': JsCode(
        "function(p){return echarts.format.encodeHTML(p.seriesName)+'<br/>'+p.data.bin+' 分 · '+p.data.count+' 部 · '+p.data.share.toFixed(1)+'%';}")})
    profiles.options['yAxis'] = [axis('作品占比', min=0, max=100, interval=25, nameTextStyle=text,
        axisLabel={**text, 'formatter': '{value}%'}, splitLine={'lineStyle': {'color': '#c6b8a6', 'opacity': .09}})]
    partner_tooltip = {'formatter': JsCode(
        "function(p){return p.dataType==='edge'?'共同执导 '+p.value+' 部':echarts.format.encodeHTML(p.name);}")}
    plain_network = finish(partners, (20, 20, 20, 20),
        {'series': [{'label': {'width': 124}}]}, tooltip=partner_tooltip)
    partners.options['series'][0]['circular']['rotateLabel'] = True

    return {
        'ratingsDots': finish(dots, (52, 24, 44, 44), tooltip={'formatter': JsCode(
            "function(p){var d=p.data;return d.statistic?'影片均分中位 '+p.value[0].toFixed(2)+'<br/>中间 50% '+p.value[1].toFixed(2)+'–'+p.value[2].toFixed(2):"
            "echarts.format.encodeHTML(d.name)+'<br/>'+d.year+' · '+d.mean+' 分 · '+d.count.toLocaleString()+' 条评分';}")}),
        'ratingsCurve': profile_counts,
        'ratingsShare': finish(profiles, (42, 22, 24, 46), tooltip={'formatter': JsCode(
            "function(p){return echarts.format.encodeHTML(p.seriesName)+'<br/>'+p.data.bin+' 分 · '+p.data.count+' 部 · '+p.data.share.toFixed(1)+'%';}")}),
        'careerVotes': finish(career, (48, 28, 42, 44), tooltip={'formatter': JsCode(
            "function(p){var d=p.data;return echarts.format.encodeHTML(d.name)+'<br/>'+d.year+' · '"
            "+d.count.toLocaleString()+' 条评分 · '+(d.mean===null?'—':d.mean)+' 分';}")}),
        'careerScores': finish(career_scores, (42, 24, 28, 44), tooltip={'formatter': JsCode(
            "function(p){var d=p.data;return echarts.format.encodeHTML(d.name)+'<br/>'+d.year+' · '+d.mean+' 分 · '+d.count.toLocaleString()+' 条评分';}")}),
        'partnersNetwork': plain_network,
        'partnersOrbit': finish(partners, (20, 20, 20, 20),
            {'series': [{'left': '32%', 'right': '32%', 'top': '32%', 'bottom': '32%',
                        'label': {'width': 110, 'formatter': JsCode(
                "function(p){return p.data.category<3||p.data.showLabel?p.name:'';}")}}]}, tooltip=partner_tooltip),
        'partnersMatrix': finish(matrix, (194, 18, 16, 64),
            {'grid': {'left': 118, 'right': 12}, 'yAxis': [{'axisLabel': {'width': 100}}]}, tooltip={'formatter': JsCode(
            "function(p){var d=p.data;return echarts.format.encodeHTML(d.director)+' × '+echarts.format.encodeHTML(d.partner)+'<br/>共同执导 '+p.value[2]+' 部';}")}),
        'genresRadar': finish(radar, (0, 0, 0, 0), tooltip={'formatter': JsCode(
            "function(p){return echarts.format.encodeHTML(p.name)+'<br/>'+p.data.genres.map(function(n,i){return n+' '+p.value[i].toFixed(1)+'%';}).join('<br/>');}")}),
        'genresRank': finish(genres, (44, 62, 16, 44), tooltip={'formatter': JsCode(
            "function(p){return echarts.format.encodeHTML(p.seriesName)+'<br/>'+p.data.name+' '+p.value[1].toFixed(1)+'%';}")}),
        'filmRatings': build_score_distribution(True)}


def main():
    source = (WEB / "导演长页数据.js").read_text(encoding="utf-8-sig")
    data = json.loads(source.split("=", 1)[1].strip().rstrip(";"))
    charts = {"C1": build_volume(data), "C2": build_attention(data),
              "C3": build_distribution(data), "C4": build_discovery(data),
              "C5": build_collaboration(), "C6": build_career(data), "C7": build_genres(data)}
    for key, rows, field, unit, maximum in [
        ('R1', data['C1']['产量榜'], '作品数', '部', None),
        ('R2', data['C2']['观众榜'], '累计人数', '条', None),
    ]:
        chart_rows = [{'id': row['编号'], 'name': row['中文名'] or row['名'], 'value': row[field]} for row in rows]
        if key == 'R2':
            for item, row in zip(chart_rows, rows):
                item['detail'] = f"{row['作品数']} 部 · {row['加权均分']:.2f} 分"
        charts[key] = build_ranking(chart_rows, unit, maximum)
    charts['R3'] = build_score_comparison(data)
    output = "window.DIRECTOR_CHARTS = {\n" + ",\n".join(f'"{key}":{value}' for key, value in charts.items()) + "\n};\n"
    target = WEB / "导演长页图表.js"
    target.write_text(output, encoding="utf-8")
    print(f"Built {len(charts)} charts: {target.name} ({target.stat().st_size // 1024} KB)")
    templates = build_templates()
    (WEB / "导演浮层模板.js").write_text("window.DIRECTOR_TEMPLATES = {\n" + ",\n".join(
        f'"{key}":{value}' for key, value in templates.items()) + "\n};\n", encoding="utf-8")


if __name__ == "__main__":
    main()
