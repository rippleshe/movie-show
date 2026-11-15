window.DIRECTOR_TEMPLATES = {
"ratingsDots":{
    "backgroundColor": "transparent",
    "animation": true,
    "animationThreshold": 2000,
    "animationDuration": 1000,
    "animationEasing": "cubicOut",
    "animationDelay": 0,
    "animationDurationUpdate": 300,
    "animationEasingUpdate": "cubicOut",
    "animationDelayUpdate": 0,
    "aria": {
        "enabled": false
    },
    "series": [
        {
            "type": "custom",
            "name": "\u5bfc\u6f140",
            "renderItem": function(p,api){var point=api.coord([api.value(0),p.seriesIndex]);if(api.value(3)===1){var left=api.coord([api.value(1),p.seriesIndex])[0],right=api.coord([api.value(2),p.seriesIndex])[0],y=point[1]-36;return {type:'group',children:[{type:'line',shape:{x1:left,y1:y,x2:right,y2:y},style:{stroke:'#d87c7c',lineWidth:4,opacity:.6}},{type:'polygon',shape:{points:[[point[0],y-6],[point[0]+5,y],[point[0],y+6],[point[0]-5,y]]},style:{fill:'#f6ecdd',stroke:'#171214',lineWidth:1.5}},{type:'text',style:{x:point[0],y:y-20,text:Number(api.value(0)).toFixed(2),fontSize:19,fontFamily:'Georgia',fill:'#f6ecdd',align:'center',verticalAlign:'middle'}}]};}return {type:'circle',shape:{cx:point[0],cy:point[1]+(api.value(1)%5-2)*8,r:4.5},style:{fill:'#d87c7c',stroke:'#171214',lineWidth:1,opacity:.9}};},
            "colorBy": "series",
            "legendHoverLink": true,
            "coordinateSystem": "cartesian2d",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "polarIndex": 0,
            "geoIndex": 0,
            "calendarIndex": 0,
            "datasetIndex": 0,
            "seriesLayoutBy": "column",
            "selectedMode": false,
            "encode": {
                "x": 0
            },
            "data": [],
            "clip": false,
            "zlevel": 0,
            "z": 2
        },
        {
            "type": "custom",
            "name": "\u5bfc\u6f141",
            "renderItem": function(p,api){var point=api.coord([api.value(0),p.seriesIndex]);if(api.value(3)===1){var left=api.coord([api.value(1),p.seriesIndex])[0],right=api.coord([api.value(2),p.seriesIndex])[0],y=point[1]-36;return {type:'group',children:[{type:'line',shape:{x1:left,y1:y,x2:right,y2:y},style:{stroke:'#919e8b',lineWidth:4,opacity:.6}},{type:'polygon',shape:{points:[[point[0],y-6],[point[0]+5,y],[point[0],y+6],[point[0]-5,y]]},style:{fill:'#f6ecdd',stroke:'#171214',lineWidth:1.5}},{type:'text',style:{x:point[0],y:y-20,text:Number(api.value(0)).toFixed(2),fontSize:19,fontFamily:'Georgia',fill:'#f6ecdd',align:'center',verticalAlign:'middle'}}]};}return {type:'circle',shape:{cx:point[0],cy:point[1]+(api.value(1)%5-2)*8,r:4.5},style:{fill:'#919e8b',stroke:'#171214',lineWidth:1,opacity:.9}};},
            "colorBy": "series",
            "legendHoverLink": true,
            "coordinateSystem": "cartesian2d",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "polarIndex": 0,
            "geoIndex": 0,
            "calendarIndex": 0,
            "datasetIndex": 0,
            "seriesLayoutBy": "column",
            "selectedMode": false,
            "encode": {
                "x": 0
            },
            "data": [],
            "clip": false,
            "zlevel": 0,
            "z": 2
        },
        {
            "type": "custom",
            "name": "\u5bfc\u6f142",
            "renderItem": function(p,api){var point=api.coord([api.value(0),p.seriesIndex]);if(api.value(3)===1){var left=api.coord([api.value(1),p.seriesIndex])[0],right=api.coord([api.value(2),p.seriesIndex])[0],y=point[1]-36;return {type:'group',children:[{type:'line',shape:{x1:left,y1:y,x2:right,y2:y},style:{stroke:'#d7ab82',lineWidth:4,opacity:.6}},{type:'polygon',shape:{points:[[point[0],y-6],[point[0]+5,y],[point[0],y+6],[point[0]-5,y]]},style:{fill:'#f6ecdd',stroke:'#171214',lineWidth:1.5}},{type:'text',style:{x:point[0],y:y-20,text:Number(api.value(0)).toFixed(2),fontSize:19,fontFamily:'Georgia',fill:'#f6ecdd',align:'center',verticalAlign:'middle'}}]};}return {type:'circle',shape:{cx:point[0],cy:point[1]+(api.value(1)%5-2)*8,r:4.5},style:{fill:'#d7ab82',stroke:'#171214',lineWidth:1,opacity:.9}};},
            "colorBy": "series",
            "legendHoverLink": true,
            "coordinateSystem": "cartesian2d",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "polarIndex": 0,
            "geoIndex": 0,
            "calendarIndex": 0,
            "datasetIndex": 0,
            "seriesLayoutBy": "column",
            "selectedMode": false,
            "encode": {
                "x": 0
            },
            "data": [],
            "clip": false,
            "zlevel": 0,
            "z": 2
        }
    ],
    "legend": {
        "show": false
    },
    "tooltip": {
        "show": true,
        "trigger": "item",
        "confine": true,
        "borderWidth": 0,
        "backgroundColor": "#1d1819",
        "textStyle": {
            "fontFamily": "Georgia, Cinema WenKai, serif",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){var d=p.data;return d.statistic?'\u5f71\u7247\u5747\u5206\u4e2d\u4f4d '+p.value[0].toFixed(2)+'<br/>\u4e2d\u95f4 50% '+p.value[1].toFixed(2)+'\u2013'+p.value[2].toFixed(2):echarts.format.encodeHTML(d.name)+'<br/>'+d.year+' \u00b7 '+d.mean+' \u5206 \u00b7 '+d.count.toLocaleString()+' \u6761\u8bc4\u5206';}
    },
    "xAxis": [
        {
            "type": "value",
            "name": "\u4f5c\u54c1\u5747\u5206",
            "nameTextStyle": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "formatter": function(v){return Number.isInteger(v)?String(v):'';},
                "hideOverlap": true
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": "#c6b8a6",
                    "opacity": 0.09
                }
            },
            "min": 0.5,
            "max": 5,
            "interval": 0.5,
            "nameLocation": "middle",
            "nameGap": 28
        }
    ],
    "yAxis": [
        {
            "type": "category",
            "nameTextStyle": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6",
                "formatter": function(v){return v==='\u5f53\u524d'?'':v;},
                "hideOverlap": true
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": "#c6b8a6",
                    "opacity": 0.09
                }
            },
            "data": [],
            "inverse": true
        }
    ],
    "textStyle": {
        "fontFamily": "Georgia, Cinema WenKai, serif",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 52,
        "right": 24,
        "top": 44,
        "bottom": 44
    }
},
"ratingsCurve":{
    "backgroundColor": "transparent",
    "animation": true,
    "animationThreshold": 2000,
    "animationDuration": 1000,
    "animationEasing": "cubicOut",
    "animationDelay": 0,
    "animationDurationUpdate": 300,
    "animationEasingUpdate": "cubicOut",
    "animationDelayUpdate": 0,
    "aria": {
        "enabled": false
    },
    "series": [
        {
            "type": "line",
            "connectNulls": false,
            "symbol": "circle",
            "symbolSize": 6,
            "showSymbol": true,
            "smooth": false,
            "clip": true,
            "step": "middle",
            "stackStrategy": "samesign",
            "data": [],
            "hoverAnimation": true,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "logBase": 10,
            "seriesLayoutBy": "column",
            "lineStyle": {
                "show": false,
                "width": 2,
                "type": "solid"
            },
            "areaStyle": {
                "opacity": 0.06
            },
            "zlevel": 0,
            "z": 0
        },
        {
            "type": "line",
            "connectNulls": false,
            "symbol": "diamond",
            "symbolSize": 6,
            "showSymbol": true,
            "smooth": false,
            "clip": true,
            "step": "middle",
            "stackStrategy": "samesign",
            "data": [],
            "hoverAnimation": true,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "logBase": 10,
            "seriesLayoutBy": "column",
            "lineStyle": {
                "show": false,
                "width": 2,
                "type": "dashed"
            },
            "areaStyle": {
                "opacity": 0.06
            },
            "zlevel": 0,
            "z": 0
        },
        {
            "type": "line",
            "connectNulls": false,
            "symbol": "triangle",
            "symbolSize": 6,
            "showSymbol": true,
            "smooth": false,
            "clip": true,
            "step": "middle",
            "stackStrategy": "samesign",
            "data": [],
            "hoverAnimation": true,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "logBase": 10,
            "seriesLayoutBy": "column",
            "lineStyle": {
                "show": false,
                "width": 2,
                "type": "dotted"
            },
            "areaStyle": {
                "opacity": 0.06
            },
            "zlevel": 0,
            "z": 0
        }
    ],
    "legend": {
        "show": false
    },
    "tooltip": {
        "show": true,
        "trigger": "item",
        "confine": true,
        "borderWidth": 0,
        "backgroundColor": "#1d1819",
        "textStyle": {
            "fontFamily": "Georgia, Cinema WenKai, serif",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){return echarts.format.encodeHTML(p.seriesName)+'<br/>'+p.data.bin+' \u5206 \u00b7 '+p.data.count+' \u90e8 \u00b7 '+p.data.share.toFixed(1)+'%';}
    },
    "xAxis": [
        {
            "type": "value",
            "name": "\u4f5c\u54c1\u5747\u5206",
            "nameTextStyle": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "formatter": function(v){return Number.isInteger(v)?String(v):'';},
                "hideOverlap": true
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": "#c6b8a6",
                    "opacity": 0.09
                }
            },
            "min": 0.5,
            "max": 5,
            "interval": 0.5,
            "nameLocation": "middle",
            "nameGap": 28
        }
    ],
    "yAxis": [
        {
            "type": "value",
            "name": "\u4f5c\u54c1\u6570",
            "nameTextStyle": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "hideOverlap": true
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": "#c6b8a6",
                    "opacity": 0.09
                }
            },
            "min": 0,
            "minInterval": 1,
            "boundaryGap": [
                0,
                0.15
            ]
        }
    ],
    "color": [
        "#d87c7c",
        "#919e8b",
        "#d7ab82"
    ],
    "textStyle": {
        "fontFamily": "Georgia, Cinema WenKai, serif",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 42,
        "right": 22,
        "top": 24,
        "bottom": 46
    }
},
"ratingsShare":{
    "backgroundColor": "transparent",
    "animation": true,
    "animationThreshold": 2000,
    "animationDuration": 1000,
    "animationEasing": "cubicOut",
    "animationDelay": 0,
    "animationDurationUpdate": 300,
    "animationEasingUpdate": "cubicOut",
    "animationDelayUpdate": 0,
    "aria": {
        "enabled": false
    },
    "series": [
        {
            "type": "line",
            "connectNulls": false,
            "symbol": "circle",
            "symbolSize": 6,
            "showSymbol": true,
            "smooth": false,
            "clip": true,
            "step": "middle",
            "stackStrategy": "samesign",
            "data": [],
            "hoverAnimation": true,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "logBase": 10,
            "seriesLayoutBy": "column",
            "lineStyle": {
                "show": false,
                "width": 2,
                "type": "solid"
            },
            "areaStyle": {
                "opacity": 0.06
            },
            "zlevel": 0,
            "z": 0
        },
        {
            "type": "line",
            "connectNulls": false,
            "symbol": "diamond",
            "symbolSize": 6,
            "showSymbol": true,
            "smooth": false,
            "clip": true,
            "step": "middle",
            "stackStrategy": "samesign",
            "data": [],
            "hoverAnimation": true,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "logBase": 10,
            "seriesLayoutBy": "column",
            "lineStyle": {
                "show": false,
                "width": 2,
                "type": "dashed"
            },
            "areaStyle": {
                "opacity": 0.06
            },
            "zlevel": 0,
            "z": 0
        },
        {
            "type": "line",
            "connectNulls": false,
            "symbol": "triangle",
            "symbolSize": 6,
            "showSymbol": true,
            "smooth": false,
            "clip": true,
            "step": "middle",
            "stackStrategy": "samesign",
            "data": [],
            "hoverAnimation": true,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "logBase": 10,
            "seriesLayoutBy": "column",
            "lineStyle": {
                "show": false,
                "width": 2,
                "type": "dotted"
            },
            "areaStyle": {
                "opacity": 0.06
            },
            "zlevel": 0,
            "z": 0
        }
    ],
    "legend": {
        "show": false
    },
    "tooltip": {
        "show": true,
        "trigger": "item",
        "confine": true,
        "borderWidth": 0,
        "backgroundColor": "#1d1819",
        "textStyle": {
            "fontFamily": "Georgia, Cinema WenKai, serif",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){return echarts.format.encodeHTML(p.seriesName)+'<br/>'+p.data.bin+' \u5206 \u00b7 '+p.data.count+' \u90e8 \u00b7 '+p.data.share.toFixed(1)+'%';}
    },
    "xAxis": [
        {
            "type": "value",
            "name": "\u4f5c\u54c1\u5747\u5206",
            "nameTextStyle": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "formatter": function(v){return Number.isInteger(v)?String(v):'';},
                "hideOverlap": true
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": "#c6b8a6",
                    "opacity": 0.09
                }
            },
            "min": 0.5,
            "max": 5,
            "interval": 0.5,
            "nameLocation": "middle",
            "nameGap": 28
        }
    ],
    "yAxis": [
        {
            "type": "value",
            "name": "\u4f5c\u54c1\u5360\u6bd4",
            "nameTextStyle": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6",
                "formatter": "{value}%"
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "lineStyle": {
                    "color": "#c6b8a6",
                    "opacity": 0.09
                }
            },
            "min": 0,
            "max": 100,
            "interval": 25
        }
    ],
    "color": [
        "#d87c7c",
        "#919e8b",
        "#d7ab82"
    ],
    "textStyle": {
        "fontFamily": "Georgia, Cinema WenKai, serif",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 42,
        "right": 22,
        "top": 24,
        "bottom": 46
    }
},
"careerVotes":{
    "backgroundColor": "transparent",
    "animation": true,
    "animationThreshold": 2000,
    "animationDuration": 1000,
    "animationEasing": "cubicOut",
    "animationDelay": 0,
    "animationDurationUpdate": 300,
    "animationEasingUpdate": "cubicOut",
    "animationDelayUpdate": 0,
    "aria": {
        "enabled": false
    },
    "series": [
        {
            "type": "custom",
            "renderItem": function(p,api){var point=api.coord([api.value(0),api.value(1)]),base=api.coord([api.value(0),0]);var children=[{type:'line',shape:{x1:point[0],y1:base[1],x2:point[0],y2:point[1]},style:{stroke:'#d87c7c',lineWidth:1,opacity:.22}},{type:'circle',shape:{cx:point[0],cy:point[1],r:4.5},style:{fill:'#d87c7c',stroke:'#171214',lineWidth:1}}];if(api.value(2)===1)children.push({type:'text',style:{x:point[0],y:point[1]-15,text:api.value(0)+' \u00b7 '+(api.value(1)>=10000?(api.value(1)/10000).toFixed(1)+'\u4e07':api.value(1)),fontSize:14,fontFamily:'Georgia, Cinema WenKai, serif',fill:'#f6ecdd',align:'center',verticalAlign:'bottom'}});return {type:'group',children:children};},
            "colorBy": "series",
            "legendHoverLink": true,
            "coordinateSystem": "cartesian2d",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "polarIndex": 0,
            "geoIndex": 0,
            "calendarIndex": 0,
            "datasetIndex": 0,
            "seriesLayoutBy": "column",
            "selectedMode": false,
            "encode": {
                "x": 0,
                "y": 1
            },
            "data": [],
            "clip": false,
            "zlevel": 0,
            "z": 2
        },
        {
            "type": "custom",
            "renderItem": function(p,api){var point=api.coord([api.value(0),api.value(1)]),base=api.coord([api.value(0),0]);var children=[{type:'line',shape:{x1:point[0],y1:base[1],x2:point[0],y2:point[1]},style:{stroke:'#919e8b',lineWidth:1,opacity:.22}},{type:'circle',shape:{cx:point[0],cy:point[1],r:4.5},style:{fill:'#919e8b',stroke:'#171214',lineWidth:1}}];if(api.value(2)===1)children.push({type:'text',style:{x:point[0],y:point[1]-15,text:api.value(0)+' \u00b7 '+(api.value(1)>=10000?(api.value(1)/10000).toFixed(1)+'\u4e07':api.value(1)),fontSize:14,fontFamily:'Georgia, Cinema WenKai, serif',fill:'#f6ecdd',align:'center',verticalAlign:'bottom'}});return {type:'group',children:children};},
            "colorBy": "series",
            "legendHoverLink": true,
            "coordinateSystem": "cartesian2d",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "polarIndex": 0,
            "geoIndex": 0,
            "calendarIndex": 0,
            "datasetIndex": 0,
            "seriesLayoutBy": "column",
            "selectedMode": false,
            "encode": {
                "x": 0,
                "y": 1
            },
            "data": [],
            "clip": false,
            "zlevel": 0,
            "z": 2
        },
        {
            "type": "custom",
            "renderItem": function(p,api){var point=api.coord([api.value(0),api.value(1)]),base=api.coord([api.value(0),0]);var children=[{type:'line',shape:{x1:point[0],y1:base[1],x2:point[0],y2:point[1]},style:{stroke:'#d7ab82',lineWidth:1,opacity:.22}},{type:'circle',shape:{cx:point[0],cy:point[1],r:4.5},style:{fill:'#d7ab82',stroke:'#171214',lineWidth:1}}];if(api.value(2)===1)children.push({type:'text',style:{x:point[0],y:point[1]-15,text:api.value(0)+' \u00b7 '+(api.value(1)>=10000?(api.value(1)/10000).toFixed(1)+'\u4e07':api.value(1)),fontSize:14,fontFamily:'Georgia, Cinema WenKai, serif',fill:'#f6ecdd',align:'center',verticalAlign:'bottom'}});return {type:'group',children:children};},
            "colorBy": "series",
            "legendHoverLink": true,
            "coordinateSystem": "cartesian2d",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "polarIndex": 0,
            "geoIndex": 0,
            "calendarIndex": 0,
            "datasetIndex": 0,
            "seriesLayoutBy": "column",
            "selectedMode": false,
            "encode": {
                "x": 0,
                "y": 1
            },
            "data": [],
            "clip": false,
            "zlevel": 0,
            "z": 2
        }
    ],
    "legend": {
        "show": false
    },
    "tooltip": {
        "show": true,
        "trigger": "item",
        "confine": true,
        "borderWidth": 0,
        "backgroundColor": "#1d1819",
        "textStyle": {
            "fontFamily": "Georgia, Cinema WenKai, serif",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){var d=p.data;return echarts.format.encodeHTML(d.name)+'<br/>'+d.year+' \u00b7 '+d.count.toLocaleString()+' \u6761\u8bc4\u5206 \u00b7 '+(d.mean===null?'\u2014':d.mean)+' \u5206';}
    },
    "xAxis": [
        {
            "type": "value",
            "name": "\u4e0a\u6620\u5e74\u4efd",
            "nameTextStyle": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "hideOverlap": true,
                "formatter": function(v){return String(v);}
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": "#c6b8a6",
                    "opacity": 0.09
                }
            },
            "min": "dataMin",
            "max": "dataMax",
            "minInterval": 1,
            "nameLocation": "middle",
            "nameGap": 28
        }
    ],
    "yAxis": [
        {
            "type": "value",
            "name": "\u8bc4\u5206\u8bb0\u5f55",
            "nameTextStyle": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "formatter": function(v){return v>=10000?v/10000+'\u4e07':String(v);},
                "hideOverlap": true
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": "#c6b8a6",
                    "opacity": 0.09
                }
            },
            "min": 0,
            "splitNumber": 4,
            "boundaryGap": [
                0,
                0.12
            ]
        }
    ],
    "textStyle": {
        "fontFamily": "Georgia, Cinema WenKai, serif",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 48,
        "right": 28,
        "top": 42,
        "bottom": 44
    }
},
"careerScores":{
    "backgroundColor": "transparent",
    "animation": true,
    "animationThreshold": 2000,
    "animationDuration": 1000,
    "animationEasing": "cubicOut",
    "animationDelay": 0,
    "animationDurationUpdate": 300,
    "animationEasingUpdate": "cubicOut",
    "animationDelayUpdate": 0,
    "aria": {
        "enabled": false
    },
    "series": [
        {
            "type": "scatter",
            "symbol": "circle",
            "symbolSize": 9,
            "data": [],
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "silent": false,
            "itemStyle": {
                "color": "#d87c7c",
                "borderColor": "#171214",
                "borderWidth": 1,
                "opacity": 0.9
            }
        },
        {
            "type": "scatter",
            "symbol": "diamond",
            "symbolSize": 9,
            "data": [],
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "silent": false,
            "itemStyle": {
                "color": "#919e8b",
                "borderColor": "#171214",
                "borderWidth": 1,
                "opacity": 0.9
            }
        },
        {
            "type": "scatter",
            "symbol": "triangle",
            "symbolSize": 9,
            "data": [],
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "silent": false,
            "itemStyle": {
                "color": "#d7ab82",
                "borderColor": "#171214",
                "borderWidth": 1,
                "opacity": 0.9
            }
        }
    ],
    "legend": {
        "show": false
    },
    "tooltip": {
        "show": true,
        "trigger": "item",
        "confine": true,
        "borderWidth": 0,
        "backgroundColor": "#1d1819",
        "textStyle": {
            "fontFamily": "Georgia, Cinema WenKai, serif",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){var d=p.data;return echarts.format.encodeHTML(d.name)+'<br/>'+d.year+' \u00b7 '+d.mean+' \u5206 \u00b7 '+d.count.toLocaleString()+' \u6761\u8bc4\u5206';}
    },
    "xAxis": [
        {
            "type": "value",
            "name": "\u4e0a\u6620\u5e74\u4efd",
            "nameTextStyle": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "hideOverlap": true,
                "formatter": function(v){return String(v);}
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": "#c6b8a6",
                    "opacity": 0.09
                }
            },
            "min": "dataMin",
            "max": "dataMax",
            "minInterval": 1,
            "nameLocation": "middle",
            "nameGap": 28
        }
    ],
    "yAxis": [
        {
            "type": "value",
            "name": "\u4f5c\u54c1\u5747\u5206",
            "nameTextStyle": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6",
                "formatter": function(v){return Number.isInteger(v)?String(v):'';},
                "hideOverlap": true
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": "#c6b8a6",
                    "opacity": 0.09
                }
            },
            "min": 0.5,
            "max": 5,
            "interval": 0.5
        }
    ],
    "textStyle": {
        "fontFamily": "Georgia, Cinema WenKai, serif",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 42,
        "right": 24,
        "top": 28,
        "bottom": 44
    }
},
"partnersNetwork":{
    "backgroundColor": "transparent",
    "animation": true,
    "animationThreshold": 2000,
    "animationDuration": 1000,
    "animationEasing": "cubicOut",
    "animationDelay": 0,
    "animationDurationUpdate": 300,
    "animationEasingUpdate": "cubicOut",
    "animationDelayUpdate": 0,
    "aria": {
        "enabled": false
    },
    "series": [
        {
            "type": "graph",
            "name": "\u5171\u521b",
            "layout": "circular",
            "symbolSize": 16,
            "circular": {
                "rotateLabel": false
            },
            "force": {
                "repulsion": 50,
                "gravity": 0.2,
                "edgeLength": 30,
                "friction": 0.6,
                "layoutAnimation": true
            },
            "label": {
                "show": true,
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#e0d2c0",
                "width": 180,
                "lineHeight": 19,
                "overflow": "break",
                "position": "right",
                "distance": 9
            },
            "lineStyle": {
                "show": false,
                "width": 1.5,
                "opacity": 0.5,
                "color": "#919e8b"
            },
            "roam": true,
            "nodeScaleRatio": 0.6,
            "draggable": true,
            "focusNodeAdjacency": true,
            "data": [],
            "categories": [
                {
                    "name": "\u5bfc\u6f140",
                    "itemStyle": {
                        "color": "#d87c7c"
                    }
                },
                {
                    "name": "\u5bfc\u6f141",
                    "itemStyle": {
                        "color": "#919e8b"
                    }
                },
                {
                    "name": "\u5bfc\u6f142",
                    "itemStyle": {
                        "color": "#d7ab82"
                    }
                },
                {
                    "name": "\u5bfc\u6f143",
                    "itemStyle": {
                        "color": "#6e7074"
                    }
                }
            ],
            "edgeLabel": {
                "show": true,
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 13,
                "color": "#c6b8a6",
                "formatter": "{c}",
                "rotate": 0,
                "backgroundColor": "#171214",
                "padding": [
                    2,
                    4
                ],
                "borderRadius": 2
            },
            "edgeSymbol": [
                null,
                null
            ],
            "edgeSymbolSize": 10,
            "links": [],
            "emphasis": {
                "focus": "adjacency",
                "label": {
                    "width": 180,
                    "formatter": "{b}"
                },
                "lineStyle": {
                    "width": 3,
                    "opacity": 1
                }
            },
            "preserveAspect": false,
            "left": "22%",
            "right": "22%",
            "top": "28%",
            "bottom": "28%",
            "labelLayout": {
                "hideOverlap": false
            }
        }
    ],
    "legend": {
        "show": false
    },
    "tooltip": {
        "show": true,
        "trigger": "item",
        "confine": true,
        "borderWidth": 0,
        "backgroundColor": "#1d1819",
        "textStyle": {
            "fontFamily": "Georgia, Cinema WenKai, serif",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){return p.dataType==='edge'?'\u5171\u540c\u6267\u5bfc '+p.value+' \u90e8':echarts.format.encodeHTML(p.name);}
    },
    "textStyle": {
        "fontFamily": "Georgia, Cinema WenKai, serif",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 20,
        "right": 20,
        "top": 20,
        "bottom": 20
    },
    "media": [
        {
            "query": {
                "maxWidth": 640
            },
            "option": {
                "series": [
                    {
                        "label": {
                            "width": 124
                        }
                    }
                ]
            }
        },
        {
            "option": {
                "series": [
                    {
                        "label": {
                            "width": 180
                        }
                    }
                ]
            }
        }
    ]
},
"partnersOrbit":{
    "backgroundColor": "transparent",
    "animation": true,
    "animationThreshold": 2000,
    "animationDuration": 1000,
    "animationEasing": "cubicOut",
    "animationDelay": 0,
    "animationDurationUpdate": 300,
    "animationEasingUpdate": "cubicOut",
    "animationDelayUpdate": 0,
    "aria": {
        "enabled": false
    },
    "series": [
        {
            "type": "graph",
            "name": "\u5171\u521b",
            "layout": "circular",
            "symbolSize": 16,
            "circular": {
                "rotateLabel": true
            },
            "force": {
                "repulsion": 50,
                "gravity": 0.2,
                "edgeLength": 30,
                "friction": 0.6,
                "layoutAnimation": true
            },
            "label": {
                "show": true,
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#e0d2c0",
                "width": 180,
                "lineHeight": 19,
                "overflow": "break",
                "position": "right",
                "distance": 9
            },
            "lineStyle": {
                "show": false,
                "width": 1.5,
                "opacity": 0.5,
                "color": "#919e8b"
            },
            "roam": true,
            "nodeScaleRatio": 0.6,
            "draggable": true,
            "focusNodeAdjacency": true,
            "data": [],
            "categories": [
                {
                    "name": "\u5bfc\u6f140",
                    "itemStyle": {
                        "color": "#d87c7c"
                    }
                },
                {
                    "name": "\u5bfc\u6f141",
                    "itemStyle": {
                        "color": "#919e8b"
                    }
                },
                {
                    "name": "\u5bfc\u6f142",
                    "itemStyle": {
                        "color": "#d7ab82"
                    }
                },
                {
                    "name": "\u5bfc\u6f143",
                    "itemStyle": {
                        "color": "#6e7074"
                    }
                }
            ],
            "edgeLabel": {
                "show": true,
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 13,
                "color": "#c6b8a6",
                "formatter": "{c}",
                "rotate": 0,
                "backgroundColor": "#171214",
                "padding": [
                    2,
                    4
                ],
                "borderRadius": 2
            },
            "edgeSymbol": [
                null,
                null
            ],
            "edgeSymbolSize": 10,
            "links": [],
            "emphasis": {
                "focus": "adjacency",
                "label": {
                    "width": 180,
                    "formatter": "{b}"
                },
                "lineStyle": {
                    "width": 3,
                    "opacity": 1
                }
            },
            "preserveAspect": false,
            "left": "22%",
            "right": "22%",
            "top": "28%",
            "bottom": "28%",
            "labelLayout": {
                "hideOverlap": false
            }
        }
    ],
    "legend": {
        "show": false
    },
    "tooltip": {
        "show": true,
        "trigger": "item",
        "confine": true,
        "borderWidth": 0,
        "backgroundColor": "#1d1819",
        "textStyle": {
            "fontFamily": "Georgia, Cinema WenKai, serif",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){return p.dataType==='edge'?'\u5171\u540c\u6267\u5bfc '+p.value+' \u90e8':echarts.format.encodeHTML(p.name);}
    },
    "textStyle": {
        "fontFamily": "Georgia, Cinema WenKai, serif",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 20,
        "right": 20,
        "top": 20,
        "bottom": 20
    },
    "media": [
        {
            "query": {
                "maxWidth": 640
            },
            "option": {
                "series": [
                    {
                        "left": "32%",
                        "right": "32%",
                        "top": "32%",
                        "bottom": "32%",
                        "label": {
                            "width": 110,
                            "formatter": function(p){return p.data.category<3||p.data.showLabel?p.name:'';}
                        }
                    }
                ]
            }
        },
        {
            "option": {
                "series": [
                    {
                        "left": "22%",
                        "right": "22%",
                        "top": "28%",
                        "bottom": "28%",
                        "label": {
                            "width": 180
                        }
                    }
                ]
            }
        }
    ]
},
"partnersMatrix":{
    "backgroundColor": "transparent",
    "animation": true,
    "animationThreshold": 2000,
    "animationDuration": 1000,
    "animationEasing": "cubicOut",
    "animationDelay": 0,
    "animationDurationUpdate": 300,
    "animationEasingUpdate": "cubicOut",
    "animationDelayUpdate": 0,
    "aria": {
        "enabled": false
    },
    "series": [
        {
            "type": "custom",
            "name": "\u5408\u4f5c\u90e8\u6570",
            "renderItem": function(p,api){var point=api.coord([api.value(0),api.value(1)]),w=Math.min(62,api.size([1,0])[0]*.7),h=Math.min(34,Math.abs(api.size([0,1])[1])*.75);return {type:'group',children:[{type:'rect',shape:{x:point[0]-w/2,y:point[1]-h/2,width:w,height:h,r:3},style:{fill:api.visual('color'),stroke:'#574249',lineWidth:1}},{type:'text',style:{x:point[0],y:point[1],text:api.value(2)?String(api.value(2)):'\u2014',fontSize:17,fontFamily:'Georgia',fill:'#f6ecdd',align:'center',verticalAlign:'middle'}}]};},
            "colorBy": "series",
            "legendHoverLink": true,
            "coordinateSystem": "cartesian2d",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "polarIndex": 0,
            "geoIndex": 0,
            "calendarIndex": 0,
            "datasetIndex": 0,
            "seriesLayoutBy": "column",
            "selectedMode": false,
            "encode": {
                "x": 0,
                "y": 1,
                "tooltip": 2
            },
            "data": [],
            "clip": true,
            "zlevel": 0,
            "z": 2
        }
    ],
    "legend": {
        "show": false
    },
    "tooltip": {
        "show": true,
        "trigger": "item",
        "confine": true,
        "borderWidth": 0,
        "backgroundColor": "#1d1819",
        "textStyle": {
            "fontFamily": "Georgia, Cinema WenKai, serif",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){var d=p.data;return echarts.format.encodeHTML(d.director)+' \u00d7 '+echarts.format.encodeHTML(d.partner)+'<br/>\u5171\u540c\u6267\u5bfc '+p.value[2]+' \u90e8';}
    },
    "xAxis": [
        {
            "type": "category",
            "nameTextStyle": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "hideOverlap": true
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": "#c6b8a6",
                    "opacity": 0.09
                }
            },
            "data": []
        }
    ],
    "yAxis": [
        {
            "type": "category",
            "nameTextStyle": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6",
                "width": 180,
                "overflow": "break",
                "lineHeight": 18,
                "hideOverlap": true
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": "#c6b8a6",
                    "opacity": 0.09
                }
            },
            "data": [],
            "inverse": true
        }
    ],
    "visualMap": {
        "show": true,
        "min": 0,
        "max": 10,
        "dimension": 2,
        "orient": "horizontal",
        "left": "center",
        "bottom": 4,
        "itemWidth": 8,
        "itemHeight": 90,
        "textStyle": {
            "fontFamily": "Georgia, Cinema WenKai, serif",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "textGap": 8,
        "padding": 0,
        "inRange": {
            "color": [
                "#231c1e",
                "#d87c7c"
            ]
        }
    },
    "textStyle": {
        "fontFamily": "Georgia, Cinema WenKai, serif",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 194,
        "right": 18,
        "top": 16,
        "bottom": 64
    },
    "media": [
        {
            "query": {
                "maxWidth": 640
            },
            "option": {
                "grid": {
                    "left": 118,
                    "right": 12
                },
                "yAxis": [
                    {
                        "axisLabel": {
                            "width": 100
                        }
                    }
                ]
            }
        },
        {
            "option": {
                "grid": {
                    "left": 194,
                    "right": 18
                },
                "yAxis": [
                    {
                        "axisLabel": {
                            "width": 180
                        }
                    }
                ]
            }
        }
    ]
},
"genresRadar":{
    "backgroundColor": "transparent",
    "animation": true,
    "animationThreshold": 2000,
    "animationDuration": 1000,
    "animationEasing": "cubicOut",
    "animationDelay": 0,
    "animationDurationUpdate": 300,
    "animationEasingUpdate": "cubicOut",
    "animationDelayUpdate": 0,
    "aria": {
        "enabled": false
    },
    "series": [
        {
            "type": "radar",
            "data": [],
            "symbolSize": 5,
            "lineStyle": {
                "color": "#d87c7c",
                "width": 2.5,
                "type": "solid"
            },
            "itemStyle": {
                "color": "#d87c7c"
            },
            "symbol": "circle",
            "areaStyle": {
                "color": "#d87c7c",
                "opacity": 0.08
            }
        },
        {
            "type": "radar",
            "data": [],
            "symbolSize": 5,
            "lineStyle": {
                "color": "#919e8b",
                "width": 2.5,
                "type": "dashed"
            },
            "itemStyle": {
                "color": "#919e8b"
            },
            "symbol": "diamond",
            "areaStyle": {
                "color": "#919e8b",
                "opacity": 0.08
            }
        },
        {
            "type": "radar",
            "data": [],
            "symbolSize": 5,
            "lineStyle": {
                "color": "#d7ab82",
                "width": 2.5,
                "type": "dotted"
            },
            "itemStyle": {
                "color": "#d7ab82"
            },
            "symbol": "triangle",
            "areaStyle": {
                "color": "#d7ab82",
                "opacity": 0.08
            }
        }
    ],
    "legend": {
        "show": false
    },
    "tooltip": {
        "show": true,
        "trigger": "item",
        "confine": true,
        "borderWidth": 0,
        "backgroundColor": "#1d1819",
        "textStyle": {
            "fontFamily": "Georgia, Cinema WenKai, serif",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){return echarts.format.encodeHTML(p.name)+'<br/>'+p.data.genres.map(function(n,i){return n+' '+p.value[i].toFixed(1)+'%';}).join('<br/>');}
    },
    "radar": {
        "indicator": [
            {
                "max": 100
            },
            {
                "max": 100
            },
            {
                "max": 100
            },
            {
                "max": 100
            },
            {
                "max": 100
            },
            {
                "max": 100
            },
            {
                "max": 100
            },
            {
                "max": 100
            }
        ],
        "center": [
            "50%",
            "50%"
        ],
        "radius": "54%",
        "splitNumber": 3,
        "axisName": {
            "fontFamily": "Georgia, Cinema WenKai, serif",
            "fontSize": 15,
            "color": "#e0d2c0",
            "lineHeight": 22
        },
        "axisNameGap": 12,
        "axisLine": {
            "lineStyle": {
                "color": "#70575e",
                "opacity": 0.45
            }
        },
        "splitLine": {
            "lineStyle": {
                "color": "#70575e",
                "opacity": 0.45
            }
        },
        "splitArea": {
            "show": false
        }
    },
    "textStyle": {
        "fontFamily": "Georgia, Cinema WenKai, serif",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 0,
        "right": 0,
        "top": 0,
        "bottom": 0
    }
},
"genresRank":{
    "backgroundColor": "transparent",
    "animation": true,
    "animationThreshold": 2000,
    "animationDuration": 1000,
    "animationEasing": "cubicOut",
    "animationDelay": 0,
    "animationDurationUpdate": 300,
    "animationEasingUpdate": "cubicOut",
    "animationDelayUpdate": 0,
    "aria": {
        "enabled": false
    },
    "series": [
        {
            "type": "custom",
            "renderItem": function(p,api){var point=api.coord([api.value(1),api.value(0)]),base=api.coord([0,api.value(0)]),dy=(p.seriesIndex-(api.value(2)-1)/2)*13;return {type:'group',children:[{type:'line',shape:{x1:base[0],y1:base[1]+dy,x2:point[0],y2:point[1]+dy},style:{stroke:'#d87c7c',lineWidth:1,opacity:.4}},{type:'circle',shape:{cx:point[0],cy:point[1]+dy,r:4},style:{fill:'#d87c7c'}},{type:'text',style:{x:point[0]+9,y:point[1]+dy,text:Number(api.value(1)).toFixed(1)+'%',fontSize:13,fontFamily:'Georgia',fill:'#d87c7c',verticalAlign:'middle'}}]};},
            "colorBy": "series",
            "legendHoverLink": true,
            "coordinateSystem": "cartesian2d",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "polarIndex": 0,
            "geoIndex": 0,
            "calendarIndex": 0,
            "datasetIndex": 0,
            "seriesLayoutBy": "column",
            "selectedMode": false,
            "data": [],
            "clip": true,
            "zlevel": 0,
            "z": 2
        },
        {
            "type": "custom",
            "renderItem": function(p,api){var point=api.coord([api.value(1),api.value(0)]),base=api.coord([0,api.value(0)]),dy=(p.seriesIndex-(api.value(2)-1)/2)*13;return {type:'group',children:[{type:'line',shape:{x1:base[0],y1:base[1]+dy,x2:point[0],y2:point[1]+dy},style:{stroke:'#919e8b',lineWidth:1,opacity:.4}},{type:'circle',shape:{cx:point[0],cy:point[1]+dy,r:4},style:{fill:'#919e8b'}},{type:'text',style:{x:point[0]+9,y:point[1]+dy,text:Number(api.value(1)).toFixed(1)+'%',fontSize:13,fontFamily:'Georgia',fill:'#919e8b',verticalAlign:'middle'}}]};},
            "colorBy": "series",
            "legendHoverLink": true,
            "coordinateSystem": "cartesian2d",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "polarIndex": 0,
            "geoIndex": 0,
            "calendarIndex": 0,
            "datasetIndex": 0,
            "seriesLayoutBy": "column",
            "selectedMode": false,
            "data": [],
            "clip": true,
            "zlevel": 0,
            "z": 2
        },
        {
            "type": "custom",
            "renderItem": function(p,api){var point=api.coord([api.value(1),api.value(0)]),base=api.coord([0,api.value(0)]),dy=(p.seriesIndex-(api.value(2)-1)/2)*13;return {type:'group',children:[{type:'line',shape:{x1:base[0],y1:base[1]+dy,x2:point[0],y2:point[1]+dy},style:{stroke:'#d7ab82',lineWidth:1,opacity:.4}},{type:'circle',shape:{cx:point[0],cy:point[1]+dy,r:4},style:{fill:'#d7ab82'}},{type:'text',style:{x:point[0]+9,y:point[1]+dy,text:Number(api.value(1)).toFixed(1)+'%',fontSize:13,fontFamily:'Georgia',fill:'#d7ab82',verticalAlign:'middle'}}]};},
            "colorBy": "series",
            "legendHoverLink": true,
            "coordinateSystem": "cartesian2d",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "polarIndex": 0,
            "geoIndex": 0,
            "calendarIndex": 0,
            "datasetIndex": 0,
            "seriesLayoutBy": "column",
            "selectedMode": false,
            "data": [],
            "clip": true,
            "zlevel": 0,
            "z": 2
        }
    ],
    "legend": {
        "show": false
    },
    "tooltip": {
        "show": true,
        "trigger": "item",
        "confine": true,
        "borderWidth": 0,
        "backgroundColor": "#1d1819",
        "textStyle": {
            "fontFamily": "Georgia, Cinema WenKai, serif",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){return echarts.format.encodeHTML(p.seriesName)+'<br/>'+p.data.name+' '+p.value[1].toFixed(1)+'%';}
    },
    "xAxis": [
        {
            "type": "value",
            "name": "\u6807\u7b7e\u5360\u6bd4",
            "nameTextStyle": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "formatter": "{value}%",
                "hideOverlap": true
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": "#c6b8a6",
                    "opacity": 0.09
                }
            },
            "min": 0,
            "max": 100,
            "interval": 50,
            "nameLocation": "middle",
            "nameGap": 28
        }
    ],
    "yAxis": [
        {
            "type": "category",
            "nameTextStyle": {
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Georgia, Cinema WenKai, serif",
                "hideOverlap": true
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": "#c6b8a6",
                    "opacity": 0.09
                }
            },
            "data": [],
            "inverse": true
        }
    ],
    "textStyle": {
        "fontFamily": "Georgia, Cinema WenKai, serif",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 44,
        "right": 62,
        "top": 16,
        "bottom": 44
    }
},
"filmRatings":{
    "backgroundColor": "transparent",
    "animation": true,
    "animationThreshold": 2000,
    "animationDuration": 1000,
    "animationEasing": "cubicOut",
    "animationDelay": 0,
    "animationDurationUpdate": 300,
    "animationEasingUpdate": "cubicOut",
    "animationDelayUpdate": 0,
    "aria": {
        "enabled": false
    },
    "series": [
        {
            "type": "custom",
            "name": "\u8bc4\u5206\u8bb0\u5f55",
            "renderItem": function(p,api){var point=api.coord([api.value(0),api.value(1)]),base=api.coord([api.value(0),0]);return {type:'group',children:[{type:'line',shape:{x1:point[0],y1:base[1],x2:point[0],y2:point[1]},style:{stroke:'#d87c7c',lineWidth:1.5,opacity:.65}},{type:'circle',shape:{cx:point[0],cy:point[1],r:4},style:{fill:'#d87c7c'}}]};},
            "colorBy": "series",
            "legendHoverLink": true,
            "coordinateSystem": "cartesian2d",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "polarIndex": 0,
            "geoIndex": 0,
            "calendarIndex": 0,
            "datasetIndex": 0,
            "seriesLayoutBy": "column",
            "selectedMode": false,
            "encode": {
                "x": 0,
                "y": 1
            },
            "data": [],
            "clip": true,
            "zlevel": 0,
            "z": 2
        }
    ],
    "legend": {
        "show": false
    },
    "tooltip": {
        "show": true,
        "trigger": "item",
        "confine": true,
        "borderWidth": 0,
        "backgroundColor": "#1d1819",
        "textStyle": {
            "fontSize": 16,
            "color": "#d7ab82",
            "fontFamily": "Microsoft YaHei"
        },
        "formatter": function(p){return p.name+' \u5206<br/>'+p.value[1].toLocaleString()+' \u6761\u8bc4\u5206'+(p.data.share===undefined?'':' \u00b7 '+p.data.share.toFixed(1)+'%');}
    },
    "xAxis": [
        {
            "type": "category",
            "name": "\u8bc4\u5206",
            "nameTextStyle": {
                "fontSize": 16,
                "color": "#d7ab82",
                "fontFamily": "Microsoft YaHei"
            },
            "axisLabel": {
                "fontSize": 16,
                "color": "#d7ab82",
                "fontFamily": "Microsoft YaHei",
                "interval": 0
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": "#6e7074",
                    "opacity": 0.14
                }
            },
            "data": [
                "0.5",
                "1",
                "1.5",
                "2",
                "2.5",
                "3",
                "3.5",
                "4",
                "4.5",
                "5"
            ],
            "nameLocation": "middle",
            "nameGap": 30
        }
    ],
    "yAxis": [
        {
            "type": "value",
            "name": "\u8bc4\u5206\u8bb0\u5f55",
            "nameTextStyle": {
                "fontSize": 16,
                "color": "#d7ab82",
                "fontFamily": "Microsoft YaHei"
            },
            "axisLabel": {
                "fontSize": 16,
                "color": "#d7ab82",
                "fontFamily": "Microsoft YaHei",
                "formatter": function(v){return v>=10000?v/10000+'\u4e07':String(v);}
            },
            "axisLine": {
                "show": false
            },
            "axisTick": {
                "show": false
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": "#6e7074",
                    "opacity": 0.14
                }
            },
            "min": 0,
            "minInterval": 1,
            "boundaryGap": [
                0,
                0.15
            ]
        }
    ],
    "textStyle": {
        "fontSize": 16,
        "color": "#d7ab82",
        "fontFamily": "Microsoft YaHei"
    },
    "grid": {
        "left": 52,
        "right": 24,
        "top": 32,
        "bottom": 50
    }
}
};
