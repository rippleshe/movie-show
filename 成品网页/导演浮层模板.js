window.DIRECTOR_TEMPLATES = {
"ratingsBox":{
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
            "type": "boxplot",
            "name": "\u53e3\u7891\u8303\u56f4",
            "legendHoverLink": true,
            "hoverAnimation": true,
            "layout": "horizontal",
            "boxWidth": [
                16,
                26
            ],
            "selectedMode": false,
            "data": [],
            "label": {
                "show": true,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "markPoint": {},
            "markLine": {
                "silent": false,
                "precision": 2,
                "label": {
                    "show": true,
                    "margin": 8,
                    "richInheritPlainLabel": true,
                    "valueAnimation": false
                }
            },
            "zlevel": 0,
            "z": 2,
            "itemStyle": {
                "borderWidth": 2
            }
        },
        {
            "type": "custom",
            "name": "\u9010\u7247\u523b\u5ea6",
            "renderItem": function(p,api){var q=api.coord([api.value(0),api.value(1)]),c=['#d87c7c', '#919e8b', '#d7ab82'][api.value(1)];return {type:'rect',shape:{x:q[0]-2,y:q[1]+25+(api.value(2)%3)*4,width:4,height:9},style:{fill:c,opacity:.8},emphasis:{style:{fill:'#f6ecdd',shadowBlur:8,shadowColor:c}}};},
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
            "fontFamily": "Microsoft YaHei",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){var d=p.data;if(d.statistic)return echarts.format.encodeHTML(d.name)+'<br/>\u4e2d\u4f4d\u6570 '+d.value[2].toFixed(2)+' \u00b7 \u4e2d\u95f4 50% '+d.value[1].toFixed(2)+'\u2013'+d.value[3].toFixed(2)+'<br/>'+d.sample+' \u90e8\u4f5c\u54c1';return echarts.format.encodeHTML(d.name)+'<br/>'+d.mean.toFixed(2)+' / 5 \u00b7 '+d.year;}
    },
    "xAxis": [
        {
            "type": "value",
            "name": "\u5f71\u7247\u5747\u5206 / 5",
            "nameTextStyle": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Microsoft YaHei"
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
            "min": 0.5,
            "max": 5,
            "interval": 0.5,
            "nameLocation": "middle",
            "nameGap": 30
        }
    ],
    "yAxis": [
        {
            "type": "category",
            "nameTextStyle": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6"
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
            "data": [],
            "inverse": true
        }
    ],
    "color": [
        "#d87c7c",
        "#919e8b",
        "#d7ab82"
    ],
    "roleStyles": [
        {
            "color": "rgba(216,124,124,.25)",
            "borderColor": "#d87c7c"
        },
        {
            "color": "rgba(145,158,139,.25)",
            "borderColor": "#919e8b"
        },
        {
            "color": "rgba(215,171,130,.25)",
            "borderColor": "#d7ab82"
        }
    ],
    "textStyle": {
        "fontFamily": "Microsoft YaHei",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 74,
        "right": 24,
        "top": 28,
        "bottom": 62
    },
    "media": [
        {
            "query": {
                "maxWidth": 480
            },
            "option": {
                "grid": {
                    "left": 50,
                    "right": 16
                },
                "xAxis": [
                    {
                        "axisLabel": {
                            "fontSize": 12,
                            "hideOverlap": true,
                            "formatter": function(v){return v===.5||Number.isInteger(v)?String(v):'';}
                        }
                    }
                ],
                "yAxis": [
                    {
                        "axisLabel": {
                            "fontSize": 12
                        }
                    }
                ]
            }
        },
        {
            "option": {
                "grid": {
                    "left": 74,
                    "right": 24
                },
                "xAxis": [
                    {
                        "axisLabel": {
                            "fontSize": 14
                        }
                    }
                ],
                "yAxis": [
                    {
                        "axisLabel": {
                            "fontSize": 14
                        }
                    }
                ]
            }
        }
    ]
},
"ratingsThreshold":{
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
            "symbol": "none",
            "symbolSize": 6,
            "showSymbol": false,
            "smooth": false,
            "clip": true,
            "step": "start",
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
                "width": 2.5,
                "type": "solid"
            },
            "areaStyle": {
                "opacity": 0.05
            },
            "markPoint": {
                "symbol": "circle",
                "symbolSize": 12,
                "label": {
                    "show": false
                },
                "itemStyle": {
                    "color": "#d87c7c",
                    "borderColor": "#f6ecdd",
                    "borderWidth": 1.5
                },
                "data": []
            },
            "markLine": {
                "silent": true,
                "symbol": [
                    "none",
                    "none"
                ],
                "lineStyle": {
                    "color": "#f0dfbd",
                    "width": 1,
                    "type": "dashed"
                },
                "label": {
                    "fontFamily": "Microsoft YaHei",
                    "fontSize": 14,
                    "color": "#f0dfbd",
                    "formatter": function(p){return '\u2265 '+Number(p.value).toFixed(2);}
                },
                "data": [
                    {
                        "xAxis": 4
                    }
                ]
            },
            "zlevel": 0,
            "z": 0
        },
        {
            "type": "line",
            "connectNulls": false,
            "symbol": "none",
            "symbolSize": 6,
            "showSymbol": false,
            "smooth": false,
            "clip": true,
            "step": "start",
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
                "width": 2.5,
                "type": "dashed"
            },
            "areaStyle": {
                "opacity": 0.05
            },
            "markPoint": {
                "symbol": "diamond",
                "symbolSize": 12,
                "label": {
                    "show": false
                },
                "itemStyle": {
                    "color": "#919e8b",
                    "borderColor": "#f6ecdd",
                    "borderWidth": 1.5
                },
                "data": []
            },
            "zlevel": 0,
            "z": 0
        },
        {
            "type": "line",
            "connectNulls": false,
            "symbol": "none",
            "symbolSize": 6,
            "showSymbol": false,
            "smooth": false,
            "clip": true,
            "step": "start",
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
                "width": 2.5,
                "type": "dotted"
            },
            "areaStyle": {
                "opacity": 0.05
            },
            "markPoint": {
                "symbol": "triangle",
                "symbolSize": 12,
                "label": {
                    "show": false
                },
                "itemStyle": {
                    "color": "#d7ab82",
                    "borderColor": "#f6ecdd",
                    "borderWidth": 1.5
                },
                "data": []
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
            "fontFamily": "Microsoft YaHei",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){var d=p.data;return echarts.format.encodeHTML(p.seriesName)+'<br/>\u2265 '+d.value[0].toFixed(3)+' \u5206 \u00b7 '+d.count+' / '+d.total+' \u90e8<br/>'+d.value[1].toFixed(1)+'%';}
    },
    "xAxis": [
        {
            "type": "value",
            "name": "\u8bc4\u5206\u95e8\u69db / 5",
            "nameTextStyle": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Microsoft YaHei"
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
            "min": 0.5,
            "max": 5,
            "interval": 0.5,
            "nameLocation": "middle",
            "nameGap": 30
        }
    ],
    "yAxis": [
        {
            "type": "value",
            "name": "\u8fbe\u5230\u95e8\u69db\u7684\u4f5c\u54c1",
            "nameTextStyle": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontFamily": "Microsoft YaHei",
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
                "show": true,
                "lineStyle": {
                    "color": "#6e7074",
                    "opacity": 0.14
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
        "fontFamily": "Microsoft YaHei",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 50,
        "right": 24,
        "top": 34,
        "bottom": 62
    },
    "media": [
        {
            "query": {
                "maxWidth": 480
            },
            "option": {
                "xAxis": [
                    {
                        "axisLabel": {
                            "fontSize": 12,
                            "hideOverlap": true,
                            "formatter": function(v){return v===.5||Number.isInteger(v)?String(v):'';}
                        }
                    }
                ]
            }
        },
        {
            "option": {
                "xAxis": [
                    {
                        "axisLabel": {
                            "fontSize": 14
                        }
                    }
                ]
            }
        }
    ]
},
"careerPosters":{
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
            "name": "\u53d1\u884c\u4f5c\u54c1",
            "renderItem": function(p,api){var q=api.coord([api.value(0),api.value(1)]),c=['#d87c7c', '#919e8b', '#d7ab82'][api.value(2)],image=api.value(4),ratio=api.value(5),w=42,h=62,children=[{type:'rect',shape:{x:q[0]-25,y:q[1]-37,width:50,height:74,r:2},style:{fill:'#100d0e',stroke:c,lineWidth:1.5},emphasis:{style:{stroke:'#f6ecdd',lineWidth:2,shadowBlur:12,shadowColor:c}}}];if(image){if(ratio>w/h)h=w/ratio;else w=h*ratio;children.push({type:'image',style:{image:image,x:q[0]-w/2,y:q[1]-h/2,width:w,height:h}});}else children.push({type:'text',style:{x:q[0],y:q[1],text:'\u25a5',fill:c,fontSize:24,align:'center',verticalAlign:'middle'}});children.push({type:'text',style:{x:q[0],y:q[1]+48,text:api.value(3),fontSize:14,fontFamily:'Microsoft YaHei',fill:'#f6ecdd',align:'center',verticalAlign:'middle'}});return {type:'group',children:children};},
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
            "dimensions": [
                {
                    "name": "year",
                    "type": "float"
                },
                {
                    "name": "lane",
                    "type": "float"
                },
                {
                    "name": "role",
                    "type": "int"
                },
                {
                    "name": "badge",
                    "type": "ordinal"
                },
                {
                    "name": "image",
                    "type": "ordinal"
                },
                {
                    "name": "ratio",
                    "type": "float"
                }
            ],
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
            "name": "\u7814\u7a76\u5bf9\u8c61",
            "renderItem": function(p,api){return {type:'text',silent:true,style:{x:6,y:api.coord([0,api.value(0)])[1],text:api.value(1),fontSize:14,fontFamily:'Microsoft YaHei',fill:['#d87c7c', '#919e8b', '#d7ab82'][p.dataIndex],verticalAlign:'middle'}};},
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
            "dimensions": [
                {
                    "name": "lane",
                    "type": "float"
                },
                {
                    "name": "role",
                    "type": "ordinal"
                }
            ],
            "encode": {
                "x": -1,
                "y": 0
            },
            "data": [],
            "clip": false,
            "zlevel": 0,
            "z": 2,
            "silent": true
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
            "fontFamily": "Microsoft YaHei",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){var d=p.data;return echarts.format.encodeHTML(d.name)+'<br/>'+(d.year||'\u5e74\u4efd\u672a\u77e5')+' \u00b7 '+(d.mean===null?'\u6682\u65e0\u8bc4\u5206':d.mean.toFixed(2)+' / 5')+'<br/>'+d.count.toLocaleString()+' \u6761\u8bc4\u5206';}
    },
    "xAxis": [
        {
            "type": "value",
            "name": "\u4e0a\u6620\u5e74\u4efd",
            "nameTextStyle": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6",
                "hideOverlap": true,
                "showMaxLabel": false,
                "formatter": function(v){return String(v);}
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
            "min": "dataMin",
            "max": "dataMax",
            "minInterval": 1,
            "position": "top",
            "nameLocation": "middle",
            "nameGap": 30
        }
    ],
    "yAxis": [
        {
            "type": "value",
            "nameTextStyle": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Microsoft YaHei"
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
            "show": false,
            "inverse": true,
            "min": 0,
            "max": 144
        }
    ],
    "posterRatios": {
        "1": 0.6696,
        "2": 0.7541,
        "3": 0.6706,
        "5": 0.6757,
        "6": 0.6964,
        "7": 0.687,
        "10": 0.6667,
        "11": 0.6757,
        "16": 0.6667,
        "17": 0.6793,
        "18": 0.7075,
        "19": 0.6676,
        "21": 0.6667,
        "22": 0.6667,
        "24": 0.6579,
        "25": 0.6667,
        "29": 0.6747,
        "31": 0.6757,
        "32": 0.6716,
        "34": 0.6716,
        "36": 0.6667,
        "39": 0.6693,
        "44": 0.6401,
        "45": 0.6737,
        "47": 0.6401,
        "48": 0.6711,
        "50": 0.6706,
        "52": 0.656,
        "58": 0.6988,
        "62": 0.6702,
        "70": 0.6649,
        "86": 0.6757,
        "95": 0.6757,
        "104": 0.6739,
        "105": 0.7438,
        "110": 0.6777,
        "111": 0.6579,
        "112": 0.6608,
        "141": 0.6667,
        "145": 0.6757,
        "150": 0.656,
        "151": 0.6757,
        "153": 0.6757,
        "158": 0.6706,
        "160": 0.6757,
        "161": 0.6748,
        "163": 0.6702,
        "165": 0.6696,
        "168": 0.6716,
        "170": 0.6757,
        "172": 0.6757,
        "173": 0.6757,
        "180": 0.6716,
        "185": 0.6729,
        "186": 0.6767,
        "193": 0.6737,
        "196": 0.6667,
        "198": 0.6598,
        "204": 0.6726,
        "208": 0.6711,
        "215": 0.6726,
        "216": 0.6716,
        "223": 0.6667,
        "224": 0.6757,
        "225": 0.6686,
        "231": 0.6798,
        "235": 0.6757,
        "236": 0.6747,
        "246": 0.6579,
        "247": 0.6596,
        "252": 0.7463,
        "253": 0.6676,
        "256": 0.6686,
        "260": 0.6541,
        "261": 0.6966,
        "265": 0.7009,
        "266": 0.6739,
        "272": 0.6726,
        "273": 0.6737,
        "277": 0.6747,
        "282": 0.686,
        "288": 0.6667,
        "292": 0.6739,
        "293": 0.6696,
        "296": 0.687,
        "300": 0.6784,
        "306": 0.6667,
        "307": 0.6419,
        "315": 0.6667,
        "316": 0.6667,
        "317": 0.7418,
        "318": 0.6667,
        "319": 0.6667,
        "327": 0.6747,
        "329": 0.6729,
        "333": 0.6747,
        "337": 0.6739,
        "339": 0.672,
        "342": 0.6767,
        "344": 0.6798,
        "345": 0.6667,
        "348": 0.6667,
        "349": 0.672,
        "350": 0.6684,
        "353": 0.6667,
        "355": 0.6667,
        "356": 0.6902,
        "357": 0.6667,
        "362": 0.6657,
        "364": 0.6726,
        "367": 0.6726,
        "368": 0.6775,
        "370": 0.6812,
        "372": 0.6667,
        "376": 0.6716,
        "377": 0.6757,
        "380": 0.6716,
        "410": 0.6693,
        "412": 0.6657,
        "420": 0.6737,
        "431": 0.6737,
        "432": 0.6747,
        "434": 0.6667,
        "435": 0.6747,
        "440": 0.6623,
        "441": 0.6747,
        "442": 0.6693,
        "454": 0.6729,
        "455": 0.6667,
        "457": 0.6637,
        "466": 0.6667,
        "471": 0.6748,
        "474": 0.6702,
        "475": 0.6696,
        "480": 0.6667,
        "485": 0.6667,
        "494": 0.6737,
        "497": 0.6757,
        "500": 0.6686,
        "508": 0.6667,
        "509": 0.6536,
        "515": 0.6706,
        "520": 0.6784,
        "524": 0.6706,
        "527": 0.6667,
        "529": 0.6757,
        "531": 0.6726,
        "539": 0.6766,
        "541": 0.6716,
        "543": 0.6737,
        "551": 0.6667,
        "552": 0.6787,
        "553": 0.6748,
        "555": 0.6702,
        "585": 0.6808,
        "586": 0.6729,
        "587": 0.6748,
        "588": 0.6466,
        "589": 0.6726,
        "590": 0.6667,
        "592": 0.6686,
        "593": 0.6777,
        "594": 0.6684,
        "595": 0.6737,
        "596": 0.6553,
        "597": 0.6608,
        "608": 0.6777,
        "610": 0.6706,
        "616": 0.6747,
        "628": 0.6686,
        "647": 0.6696,
        "648": 0.6737,
        "653": 0.6757,
        "661": 0.6818,
        "673": 0.6737,
        "680": 0.7475,
        "708": 0.6667,
        "719": 0.6667,
        "724": 0.6716,
        "733": 0.6757,
        "736": 0.6667,
        "741": 0.6747,
        "745": 0.7329,
        "750": 0.6435,
        "762": 0.6757,
        "765": 0.702,
        "778": 0.6748,
        "780": 0.6667,
        "783": 0.6667,
        "784": 0.6775,
        "785": 0.6667,
        "786": 0.6693,
        "788": 0.6631,
        "799": 0.6729,
        "802": 0.672,
        "805": 0.6716,
        "832": 0.7519,
        "838": 0.6839,
        "849": 0.6657,
        "852": 0.6686,
        "858": 0.7042,
        "866": 0.6649,
        "899": 0.6839,
        "902": 0.6522,
        "903": 0.6452,
        "904": 0.6831,
        "908": 0.6649,
        "909": 0.6338,
        "910": 0.6456,
        "912": 0.6631,
        "913": 0.6647,
        "914": 0.7282,
        "915": 0.6667,
        "919": 0.6631,
        "920": 0.6527,
        "922": 0.6637,
        "923": 0.6676,
        "924": 0.6747,
        "928": 0.6747,
        "929": 0.6647,
        "930": 0.6541,
        "931": 0.6747,
        "933": 0.6767,
        "937": 0.6541,
        "940": 0.6429,
        "953": 0.6868,
        "965": 0.6737,
        "968": 0.6808,
        "969": 0.6667,
        "1020": 0.6696,
        "1022": 0.6878,
        "1023": 0.6598,
        "1024": 0.6667,
        "1025": 0.655,
        "1026": 0.6475,
        "1027": 0.6696,
        "1028": 0.6579,
        "1029": 0.6614,
        "1032": 0.672,
        "1035": 0.6667,
        "1036": 0.6667,
        "1042": 0.6757,
        "1047": 0.6747,
        "1059": 0.6747,
        "1060": 0.6767,
        "1061": 0.7075,
        "1073": 0.6748,
        "1079": 0.6667,
        "1080": 0.6588,
        "1084": 0.6598,
        "1086": 0.7377,
        "1088": 0.6667,
        "1089": 0.6706,
        "1090": 0.6394,
        "1092": 0.6757,
        "1093": 0.6657,
        "1094": 0.6392,
        "1097": 0.641,
        "1101": 0.6468,
        "1120": 0.6447,
        "1127": 0.672,
        "1129": 0.6541,
        "1136": 0.6667,
        "1148": 0.7013,
        "1149": 0.7329,
        "1164": 0.7075,
        "1172": 0.6757,
        "1175": 0.6923,
        "1178": 0.6531,
        "1183": 0.6739,
        "1186": 0.6757,
        "1188": 0.6438,
        "1193": 0.6726,
        "1196": 0.641,
        "1197": 0.686,
        "1198": 0.6798,
        "1199": 0.6849,
        "1200": 0.641,
        "1201": 0.6667,
        "1203": 0.6494,
        "1204": 0.6935,
        "1206": 0.6757,
        "1207": 0.6562,
        "1208": 0.651,
        "1209": 0.6686,
        "1210": 0.6447,
        "1212": 0.6757,
        "1213": 0.6677,
        "1214": 0.6618,
        "1215": 0.6716,
        "1217": 0.6569,
        "1219": 0.6729,
        "1220": 0.6562,
        "1221": 0.6657,
        "1222": 0.6658,
        "1223": 0.6667,
        "1225": 0.641,
        "1226": 0.6737,
        "1227": 0.6667,
        "1228": 0.6784,
        "1230": 0.6527,
        "1231": 0.6696,
        "1233": 0.6589,
        "1234": 0.6667,
        "1235": 0.6512,
        "1240": 0.6667,
        "1241": 0.6739,
        "1242": 0.687,
        "1244": 0.6598,
        "1245": 0.6693,
        "1246": 0.6775,
        "1247": 0.6667,
        "1248": 0.6447,
        "1249": 0.6757,
        "1250": 0.6456,
        "1252": 0.6596,
        "1255": 0.7031,
        "1258": 0.6579,
        "1259": 0.6345,
        "1261": 0.6456,
        "1262": 0.6392,
        "1263": 0.6777,
        "1265": 0.6716,
        "1266": 0.6658,
        "1267": 0.6589,
        "1270": 0.6438,
        "1271": 0.6677,
        "1272": 0.6484,
        "1274": 0.687,
        "1275": 0.6579,
        "1276": 0.6503,
        "1278": 0.646,
        "1281": 0.6767,
        "1282": 0.6916,
        "1285": 0.6757,
        "1287": 0.6589,
        "1288": 0.6667,
        "1291": 0.6726,
        "1293": 0.656,
        "1302": 0.6657,
        "1304": 0.6748,
        "1307": 0.6667,
        "1320": 0.6667,
        "1321": 0.6374,
        "1333": 0.6522,
        "1339": 0.6726,
        "1343": 0.6588,
        "1345": 0.6667,
        "1347": 0.6503,
        "1356": 0.6775,
        "1357": 0.6706,
        "1358": 0.6757,
        "1367": 0.6757,
        "1370": 0.6757,
        "1371": 0.6657,
        "1372": 0.6706,
        "1373": 0.6777,
        "1374": 0.6775,
        "1375": 0.6737,
        "1376": 0.6737,
        "1377": 0.6747,
        "1380": 0.6345,
        "1387": 0.651,
        "1391": 0.6614,
        "1393": 0.6748,
        "1394": 0.664,
        "1396": 0.6747,
        "1405": 0.6757,
        "1407": 0.6739,
        "1408": 0.6696,
        "1466": 0.6667,
        "1479": 0.6657,
        "1485": 0.6766,
        "1500": 0.6677,
        "1513": 0.6747,
        "1517": 0.6588,
        "1527": 0.6966,
        "1544": 0.6667,
        "1552": 0.6757,
        "1562": 0.6716,
        "1566": 0.6748,
        "1569": 0.6706,
        "1572": 0.6737,
        "1573": 0.6693,
        "1579": 0.7389,
        "1580": 0.6667,
        "1584": 0.672,
        "1586": 0.6739,
        "1587": 0.6618,
        "1590": 0.6696,
        "1597": 0.6726,
        "1608": 0.6739,
        "1610": 0.6775,
        "1617": 0.6821,
        "1625": 0.6658,
        "1639": 0.6627,
        "1641": 0.672,
        "1644": 0.6419,
        "1645": 0.7032,
        "1653": 0.6667,
        "1663": 0.6522,
        "1672": 0.6757,
        "1673": 0.6739,
        "1674": 0.6747,
        "1676": 0.6711,
        "1680": 0.6747,
        "1682": 0.6737,
        "1690": 0.6891,
        "1693": 0.6726,
        "1704": 0.655,
        "1717": 0.6757,
        "1721": 0.6716,
        "1722": 0.6667,
        "1729": 0.6831,
        "1730": 0.6667,
        "1732": 0.6777,
        "1747": 0.6747,
        "1748": 0.6667,
        "1777": 0.6389,
        "1784": 0.6757,
        "1805": 0.6767,
        "1819": 0.6777,
        "1831": 0.6647,
        "1876": 0.6657,
        "1882": 0.6737,
        "1884": 0.6767,
        "1907": 0.6737,
        "1909": 0.6667,
        "1911": 0.6747,
        "1912": 0.6647,
        "1917": 0.6935,
        "1918": 0.6726,
        "1921": 0.6747,
        "1923": 0.6667,
        "1935": 0.6747,
        "1938": 0.6747,
        "1947": 0.6667,
        "1953": 0.7132,
        "1954": 0.6579,
        "1960": 0.6667,
        "1961": 0.6353,
        "1962": 0.6569,
        "1967": 0.6484,
        "1968": 0.6394,
        "1982": 0.6541,
        "1994": 0.6757,
        "1997": 0.657,
        "2000": 0.6793,
        "2001": 0.6706,
        "2002": 0.6716,
        "2003": 0.6667,
        "2005": 0.6579,
        "2006": 0.6693,
        "2011": 0.6588,
        "2012": 0.6766,
        "2018": 0.6623,
        "2019": 0.7067,
        "2020": 0.6706,
        "2021": 0.6401,
        "2022": 0.6747,
        "2023": 0.6747,
        "2028": 0.6798,
        "2048": 0.657,
        "2054": 0.6748,
        "2058": 0.6667,
        "2076": 0.6808,
        "2078": 0.6667,
        "2080": 0.6878,
        "2081": 0.6667,
        "2085": 0.6667,
        "2087": 0.6684,
        "2096": 0.6784,
        "2099": 0.6618,
        "2100": 0.6569,
        "2105": 0.6589,
        "2109": 0.6618,
        "2114": 0.656,
        "2115": 0.6729,
        "2124": 0.6757,
        "2140": 0.6579,
        "2143": 0.656,
        "2144": 0.6747,
        "2145": 0.6419,
        "2150": 0.6608,
        "2160": 0.6627,
        "2161": 0.6798,
        "2167": 0.6667,
        "2174": 0.6693,
        "2176": 0.6667,
        "2177": 0.6767,
        "2178": 0.6589,
        "2179": 0.6608,
        "2180": 0.6677,
        "2181": 0.6706,
        "2182": 0.6677,
        "2183": 0.6569,
        "2184": 0.6494,
        "2185": 0.6589,
        "2186": 0.6747,
        "2187": 0.6696,
        "2193": 0.6706,
        "2194": 0.646,
        "2200": 0.6579,
        "2201": 0.6747,
        "2202": 0.6747,
        "2203": 0.6696,
        "2204": 0.6503,
        "2205": 0.6667,
        "2206": 0.6777,
        "2207": 0.6667,
        "2208": 0.6767,
        "2209": 0.7282,
        "2210": 0.7223,
        "2211": 0.6686,
        "2212": 0.6647,
        "2213": 0.6881,
        "2214": 0.6881,
        "2215": 0.7075,
        "2216": 0.6891,
        "2217": 0.7042,
        "2218": 0.72,
        "2219": 0.6934,
        "2220": 0.7692,
        "2221": 0.7732,
        "2222": 0.7538,
        "2223": 0.7377,
        "2224": 0.6667,
        "2225": 0.6667,
        "2226": 0.6667,
        "2227": 0.7305,
        "2229": 0.6541,
        "2231": 0.6757,
        "2232": 0.6657,
        "2247": 0.6598,
        "2248": 0.6598,
        "2268": 0.6757,
        "2273": 0.6787,
        "2278": 0.6767,
        "2288": 0.6667,
        "2289": 0.6747,
        "2291": 0.6757,
        "2294": 0.6686,
        "2302": 0.6739,
        "2313": 0.6618,
        "2314": 0.6667,
        "2321": 0.6767,
        "2324": 0.6693,
        "2329": 0.6737,
        "2335": 0.6667,
        "2336": 0.6737,
        "2353": 0.6667,
        "2355": 0.646,
        "2366": 0.75,
        "2393": 0.6696,
        "2394": 0.6716,
        "2395": 0.6757,
        "2396": 0.7032,
        "2403": 0.6667,
        "2406": 0.6596,
        "2407": 0.641,
        "2420": 0.641,
        "2424": 0.6747,
        "2427": 0.6737,
        "2431": 0.6706,
        "2455": 0.6667,
        "2463": 0.6562,
        "2469": 0.6598,
        "2470": 0.656,
        "2474": 0.6747,
        "2490": 0.6716,
        "2501": 0.6706,
        "2502": 0.6757,
        "2529": 0.6667,
        "2539": 0.6667,
        "2541": 0.6747,
        "2542": 0.6667,
        "2571": 0.6657,
        "2572": 0.672,
        "2579": 0.6747,
        "2580": 0.6747,
        "2581": 0.6757,
        "2593": 0.7098,
        "2599": 0.6356,
        "2605": 0.6767,
        "2612": 0.6627,
        "2617": 0.672,
        "2628": 0.6667,
        "2640": 0.6684,
        "2641": 0.6667,
        "2657": 0.6747,
        "2671": 0.6711,
        "2683": 0.6553,
        "2687": 0.6737,
        "2692": 0.6748,
        "2694": 0.6512,
        "2699": 0.6747,
        "2700": 0.6693,
        "2701": 0.6667,
        "2706": 0.6757,
        "2707": 0.6726,
        "2710": 0.6711,
        "2712": 0.6757,
        "2716": 0.6667,
        "2717": 0.6637,
        "2722": 0.6757,
        "2723": 0.6677,
        "2724": 0.6608,
        "2726": 0.6667,
        "2727": 0.6747,
        "2728": 0.6608,
        "2729": 0.6598,
        "2730": 0.6579,
        "2739": 0.6647,
        "2746": 0.6419,
        "2761": 0.6747,
        "2762": 0.6767,
        "2763": 0.6808,
        "2770": 0.6747,
        "2791": 0.6684,
        "2797": 0.6831,
        "2804": 0.6569,
        "2826": 0.6716,
        "2848": 0.6747,
        "2858": 0.6747,
        "2859": 0.6579,
        "2871": 0.6541,
        "2881": 0.7317,
        "2890": 0.6716,
        "2905": 0.6625,
        "2908": 0.6677,
        "2915": 0.6494,
        "2916": 0.6739,
        "2918": 0.6468,
        "2923": 0.6589,
        "2944": 0.655,
        "2947": 0.6667,
        "2948": 0.6512,
        "2949": 0.6598,
        "2951": 0.6667,
        "2953": 0.6757,
        "2956": 0.6808,
        "2959": 0.6667,
        "2968": 0.6798,
        "2976": 0.6798,
        "2985": 0.6452,
        "2987": 0.6766,
        "2988": 0.6392,
        "2997": 0.6747,
        "3000": 0.6667,
        "3005": 0.6757,
        "3006": 0.6966,
        "3020": 0.6798,
        "3030": 0.6657,
        "3033": 0.6737,
        "3035": 0.6579,
        "3039": 0.6598,
        "3052": 0.7321,
        "3066": 0.6667,
        "3072": 0.6798,
        "3076": 0.6757,
        "3081": 0.672,
        "3082": 0.6747,
        "3091": 0.6569,
        "3095": 0.6667,
        "3101": 0.6747,
        "3105": 0.6716,
        "3107": 0.6737,
        "3108": 0.6667,
        "3114": 0.6775,
        "3122": 0.6667,
        "3147": 0.6757,
        "3148": 0.6667,
        "3160": 0.632,
        "3174": 0.6716,
        "3175": 0.7062,
        "3176": 0.6729,
        "3190": 0.6677,
        "3196": 0.6531,
        "3210": 0.6637,
        "3217": 0.6667,
        "3247": 0.6747,
        "3252": 0.6667,
        "3253": 0.6702,
        "3255": 0.6737,
        "3256": 0.6726,
        "3258": 0.6618,
        "3273": 0.6667,
        "3275": 0.6747,
        "3285": 0.6757,
        "3300": 0.6777,
        "3301": 0.6747,
        "3306": 0.6757,
        "3307": 0.6657,
        "3309": 0.6881,
        "3310": 0.6637,
        "3354": 0.6767,
        "3362": 0.6667,
        "3363": 0.6531,
        "3365": 0.6541,
        "3386": 0.6787,
        "3408": 0.6757,
        "3409": 0.6829,
        "3418": 0.672,
        "3421": 0.6667,
        "3435": 0.6598,
        "3447": 0.702,
        "3448": 0.6747,
        "3462": 0.6726,
        "3470": 0.6747,
        "3471": 0.6748,
        "3481": 0.7267,
        "3489": 0.6627,
        "3499": 0.6677,
        "3510": 0.6726,
        "3527": 0.672,
        "3535": 0.6748,
        "3552": 0.6667,
        "3555": 0.6706,
        "3559": 0.6647,
        "3578": 0.6757,
        "3605": 0.6447,
        "3608": 0.6579,
        "3611": 0.6667,
        "3617": 0.6747,
        "3623": 0.6667,
        "3624": 0.6667,
        "3629": 0.6747,
        "3632": 0.6637,
        "3640": 0.6747,
        "3641": 0.6747,
        "3671": 0.6798,
        "3675": 0.6608,
        "3681": 0.6589,
        "3683": 0.6562,
        "3698": 0.6881,
        "3702": 0.6667,
        "3703": 0.6618,
        "3714": 0.6637,
        "3717": 0.6808,
        "3730": 0.6627,
        "3736": 0.6569,
        "3738": 0.6569,
        "3751": 0.6676,
        "3752": 0.6757,
        "3753": 0.6711,
        "3755": 0.6637,
        "3759": 0.6693,
        "3775": 0.6667,
        "3776": 0.6748,
        "3785": 0.6757,
        "3793": 0.6757,
        "3798": 0.6748,
        "3826": 0.6737,
        "3863": 0.6667,
        "3868": 0.6365,
        "3897": 0.6757,
        "3911": 0.6757,
        "3916": 0.6798,
        "3948": 0.6739,
        "3949": 0.6667,
        "3964": 0.6667,
        "3967": 0.6757,
        "3969": 0.6777,
        "3977": 0.6623,
        "3988": 0.6757,
        "3994": 0.6757,
        "3996": 0.6748,
        "4002": 0.6618,
        "4011": 0.684,
        "4014": 0.6787,
        "4016": 0.6747,
        "4018": 0.7075,
        "4022": 0.6748,
        "4025": 0.6757,
        "4027": 0.6748,
        "4034": 0.6925,
        "4061": 0.6726,
        "4085": 0.6798,
        "4103": 0.6696,
        "4111": 0.6777,
        "4148": 0.6944,
        "4176": 0.7075,
        "4186": 0.6589,
        "4223": 0.6696,
        "4226": 0.6657,
        "4239": 0.6998,
        "4246": 0.6757,
        "4262": 0.6667,
        "4270": 0.6716,
        "4299": 0.6627,
        "4306": 0.6716,
        "4308": 0.6739,
        "4310": 0.6777,
        "4321": 0.6667,
        "4323": 0.6512,
        "4344": 0.6737,
        "4350": 0.6667,
        "4359": 0.6716,
        "4361": 0.6706,
        "4366": 0.6775,
        "4367": 0.6726,
        "4369": 0.6726,
        "4370": 0.6667,
        "4401": 0.7488,
        "4406": 0.6747,
        "4410": 0.6569,
        "4446": 0.6767,
        "4447": 0.6667,
        "4557": 0.6667,
        "4564": 0.6757,
        "4571": 0.6667,
        "4572": 0.6787,
        "4591": 0.655,
        "4624": 0.6401,
        "4628": 0.6726,
        "4638": 0.6787,
        "4641": 0.6726,
        "4643": 0.6667,
        "4690": 0.6667,
        "4701": 0.6737,
        "4718": 0.6747,
        "4719": 0.672,
        "4720": 0.6747,
        "4734": 0.6787,
        "4776": 0.6667,
        "4816": 0.6747,
        "4848": 0.6747,
        "4874": 0.6767,
        "4878": 0.6658,
        "4881": 0.6684,
        "4886": 0.6747,
        "4890": 0.6757,
        "4896": 0.6793,
        "4908": 0.6977,
        "4914": 0.7246,
        "4963": 0.6757,
        "4973": 0.6667,
        "4975": 0.6726,
        "4979": 0.6196,
        "4993": 0.6737,
        "4994": 0.6757,
        "4995": 0.6737,
        "5008": 0.6531,
        "5010": 0.6748,
        "5037": 0.6579,
        "5060": 0.6618,
        "5084": 0.6569,
        "5122": 0.6747,
        "5125": 0.6686,
        "5142": 0.72,
        "5145": 0.702,
        "5177": 0.6598,
        "5218": 0.6748,
        "5219": 0.687,
        "5254": 0.6657,
        "5266": 0.6716,
        "5275": 0.6737,
        "5291": 0.7031,
        "5299": 0.702,
        "5327": 0.7414,
        "5349": 0.6767,
        "5377": 0.6726,
        "5378": 0.6596,
        "5385": 0.656,
        "5388": 0.6757,
        "5418": 0.6667,
        "5440": 0.6747,
        "5444": 0.6747,
        "5445": 0.6667,
        "5459": 0.6739,
        "5464": 0.6757,
        "5481": 0.6667,
        "5498": 0.6988,
        "5500": 0.6667,
        "5502": 0.6745,
        "5618": 0.6739,
        "5630": 0.6726,
        "5636": 0.6768,
        "5646": 0.6667,
        "5669": 0.6667,
        "5673": 0.6767,
        "5679": 0.6767,
        "5714": 0.6747,
        "5765": 0.6374,
        "5779": 0.6803,
        "5787": 0.6198,
        "5810": 0.6747,
        "5816": 0.6954,
        "5826": 0.6618,
        "5847": 0.6475,
        "5872": 0.6757,
        "5882": 0.6748,
        "5902": 0.6747,
        "5903": 0.6767,
        "5952": 0.6429,
        "5956": 0.6784,
        "5965": 0.6589,
        "5971": 0.6757,
        "5989": 0.6747,
        "5990": 0.6667,
        "5991": 0.6777,
        "5995": 0.7236,
        "6001": 0.6667,
        "6016": 0.6775,
        "6023": 0.7098,
        "6029": 0.6579,
        "6083": 0.6419,
        "6090": 0.6447,
        "6109": 0.6747,
        "6113": 0.6579,
        "6157": 0.6777,
        "6172": 0.6598,
        "6188": 0.6466,
        "6218": 0.6757,
        "6236": 0.6618,
        "6270": 0.6657,
        "6281": 0.6618,
        "6289": 0.6755,
        "6333": 0.6774,
        "6350": 0.6757,
        "6365": 0.6667,
        "6373": 0.6757,
        "6377": 0.6757,
        "6378": 0.6667,
        "6396": 0.6356,
        "6411": 0.6627,
        "6440": 0.6748,
        "6446": 0.6747,
        "6460": 0.6757,
        "6502": 0.6658,
        "6520": 0.6667,
        "6526": 0.6608,
        "6534": 0.6808,
        "6537": 0.6767,
        "6539": 0.6706,
        "6573": 0.6667,
        "6578": 0.6667,
        "6579": 0.6512,
        "6581": 0.656,
        "6669": 0.7064,
        "6708": 0.6747,
        "6711": 0.6485,
        "6747": 0.6726,
        "6754": 0.6747,
        "6779": 0.6667,
        "6807": 0.6392,
        "6856": 0.6657,
        "6863": 0.6793,
        "6870": 0.6747,
        "6873": 0.6519,
        "6874": 0.6667,
        "6934": 0.6766,
        "6936": 0.6737,
        "6942": 0.7042,
        "6947": 0.6657,
        "6953": 0.6747,
        "7043": 0.6657,
        "7052": 0.6657,
        "7058": 0.6686,
        "7072": 0.6686,
        "7090": 0.6747,
        "7093": 0.6667,
        "7099": 0.6757,
        "7104": 0.6667,
        "7143": 0.6748,
        "7147": 0.6729,
        "7150": 0.6748,
        "7153": 0.6747,
        "7208": 0.6608,
        "7210": 0.6737,
        "7254": 0.6897,
        "7283": 0.6667,
        "7293": 0.6726,
        "7355": 1.3433,
        "7361": 0.6747,
        "7367": 0.6745,
        "7373": 0.7293,
        "7397": 0.687,
        "7419": 0.6747,
        "7438": 0.6757,
        "7445": 0.6798,
        "7451": 0.7064,
        "7458": 0.6777,
        "7478": 0.6608,
        "7748": 0.7426,
        "7749": 0.7341,
        "7766": 0.687,
        "7822": 0.655,
        "7832": 0.6512,
        "7894": 0.6627,
        "7919": 0.7053,
        "7924": 0.6667,
        "7925": 0.7042,
        "7926": 0.6667,
        "8015": 0.6429,
        "8042": 0.6696,
        "8141": 0.6531,
        "8167": 0.6114,
        "8206": 0.6747,
        "8220": 0.6541,
        "8222": 0.6608,
        "8227": 0.6696,
        "8252": 0.6475,
        "8253": 0.6757,
        "8292": 0.7317,
        "8336": 0.6657,
        "8360": 0.6775,
        "8361": 0.6757,
        "8368": 0.6766,
        "8376": 0.6569,
        "8450": 0.6589,
        "8464": 0.7042,
        "8503": 0.6419,
        "8511": 0.687,
        "8528": 0.6747,
        "8529": 0.7377,
        "8533": 0.6667,
        "8600": 0.6767,
        "8622": 0.6432,
        "8636": 0.7289,
        "8641": 0.6747,
        "8644": 0.7375,
        "8661": 0.6541,
        "8662": 0.6531,
        "8665": 0.6757,
        "8693": 0.6657,
        "8714": 0.6589,
        "8738": 0.6747,
        "8740": 0.6716,
        "8755": 0.6747,
        "8781": 0.6988,
        "8783": 0.6747,
        "8784": 0.6757,
        "8798": 0.6747,
        "8838": 0.6589,
        "8840": 0.656,
        "8874": 0.6693,
        "8903": 0.6589,
        "8905": 0.6706,
        "8917": 0.7132,
        "8924": 0.6569,
        "8949": 0.6475,
        "8950": 0.6757,
        "8957": 0.6757,
        "8961": 0.6747,
        "8965": 0.6766,
        "8970": 0.75,
        "8972": 0.6747,
        "8980": 0.7053,
        "8984": 0.6757,
        "25739": 0.6657,
        "25783": 0.6716,
        "25810": 0.6677,
        "25818": 0.6598,
        "25834": 0.6579,
        "25837": 0.6667,
        "25866": 0.6667,
        "25890": 0.6757,
        "25908": 0.6512,
        "25916": 0.6447,
        "25927": 0.6747,
        "25934": 0.6618,
        "25938": 0.6706,
        "25940": 0.6747,
        "25964": 0.686,
        "25970": 0.6567,
        "25974": 0.6618,
        "26002": 0.687,
        "26021": 0.6747,
        "26025": 0.6429,
        "26034": 0.6598,
        "26064": 0.6988,
        "26095": 0.7463,
        "26100": 0.656,
        "26180": 0.6589,
        "26195": 0.7414,
        "26222": 0.6923,
        "26242": 0.6579,
        "26391": 0.6503,
        "26422": 0.6667,
        "26481": 0.6135,
        "26485": 0.6531,
        "26492": 0.656,
        "26662": 0.6667,
        "26732": 0.7009,
        "26776": 0.6757,
        "27773": 0.6667,
        "27835": 0.6902,
        "30701": 0.6569,
        "30707": 0.6784,
        "30749": 0.6777,
        "30793": 0.6775,
        "30810": 0.6839,
        "30812": 0.6729,
        "30825": 0.6747,
        "31011": 0.6777,
        "31193": 0.6618,
        "31351": 0.6706,
        "31429": 0.6757,
        "31658": 0.6747,
        "31685": 0.6589,
        "31696": 0.6747,
        "31930": 0.7414,
        "32345": 0.6667,
        "32383": 0.6718,
        "32469": 0.7679,
        "32587": 0.7102,
        "32598": 0.6775,
        "32834": 0.6747,
        "32840": 0.6667,
        "32898": 0.7513,
        "33004": 0.6777,
        "33072": 0.6686,
        "33162": 0.6757,
        "33166": 0.6757,
        "33255": 0.656,
        "33401": 0.6608,
        "33493": 0.7496,
        "33608": 0.75,
        "33615": 0.6667,
        "33679": 0.6784,
        "33794": 0.6757,
        "34048": 0.6767,
        "34150": 0.6747,
        "34162": 0.6747,
        "34306": 0.6726,
        "34319": 0.6747,
        "34405": 0.6747,
        "35836": 0.6757,
        "36517": 0.6757,
        "36529": 0.6696,
        "37729": 0.6767,
        "38061": 0.6732,
        "38304": 0.6667,
        "39183": 0.6667,
        "39474": 0.7188,
        "40629": 0.6747,
        "40815": 0.6764,
        "40819": 0.6726,
        "41566": 0.6767,
        "41569": 0.6757,
        "41997": 0.6747,
        "42794": 0.6637,
        "43039": 0.6747,
        "43910": 0.6757,
        "44124": 0.7438,
        "44191": 0.6793,
        "44195": 0.6849,
        "44199": 0.6757,
        "44421": 0.6667,
        "44555": 0.6696,
        "44665": 0.6747,
        "45000": 0.7438,
        "45447": 0.6726,
        "45499": 0.6891,
        "45517": 0.6747,
        "45720": 0.6767,
        "45722": 0.6757,
        "45726": 0.6775,
        "45952": 0.6589,
        "46258": 0.6849,
        "46578": 0.6775,
        "46803": 0.6747,
        "46972": 0.6767,
        "46976": 0.6726,
        "47099": 0.6726,
        "47239": 0.6608,
        "47610": 0.6998,
        "48032": 0.6998,
        "48123": 0.655,
        "48385": 0.6766,
        "48394": 0.6702,
        "48516": 0.6767,
        "48774": 0.6757,
        "48780": 0.6748,
        "48957": 0.6667,
        "49050": 0.7064,
        "49079": 0.6944,
        "49130": 0.6787,
        "49200": 0.6541,
        "49272": 0.6729,
        "49379": 0.654,
        "49530": 0.6757,
        "50872": 0.6748,
        "50912": 0.684,
        "51255": 0.6729,
        "51540": 0.6777,
        "51662": 0.6748,
        "52101": 0.6777,
        "52281": 0.657,
        "52352": 0.6608,
        "52435": 0.6667,
        "52448": 0.6787,
        "52722": 0.6726,
        "52973": 0.6737,
        "53038": 0.6466,
        "53125": 0.6757,
        "53322": 0.6757,
        "53519": 0.7064,
        "53582": 0.6303,
        "53972": 0.6798,
        "53996": 0.7132,
        "54001": 0.6667,
        "54259": 0.6747,
        "54272": 0.6787,
        "54286": 0.6748,
        "54503": 0.6702,
        "54922": 0.6589,
        "54997": 0.6637,
        "55247": 0.6777,
        "55261": 0.6739,
        "55373": 0.6667,
        "55671": 0.6686,
        "55765": 0.6667,
        "55820": 0.6793,
        "55854": 0.6657,
        "55995": 0.6747,
        "56145": 0.6808,
        "56174": 0.6748,
        "56367": 0.6419,
        "56757": 0.6747,
        "56782": 0.6757,
        "57368": 0.6686,
        "57480": 0.6777,
        "57482": 0.672,
        "57484": 0.6234,
        "57669": 0.6747,
        "57868": 0.6667,
        "58059": 0.7109,
        "58061": 0.755,
        "58081": 0.687,
        "58120": 0.7475,
        "58130": 0.6392,
        "58180": 0.6647,
        "58282": 0.6589,
        "58559": 0.6757,
        "58564": 0.6667,
        "58576": 0.7401,
        "58783": 0.6667,
        "58879": 0.6829,
        "58895": 0.712,
        "58998": 0.6747,
        "59037": 0.6757,
        "59178": 0.6657,
        "59180": 0.687,
        "59182": 0.687,
        "59184": 0.6747,
        "59315": 0.6747,
        "59369": 0.6777,
        "59501": 0.6767,
        "59615": 0.6747,
        "59784": 0.6902,
        "59854": 0.6541,
        "59858": 0.6667,
        "59861": 0.7212,
        "59865": 0.686,
        "60069": 0.6747,
        "60074": 0.6726,
        "60314": 0.6569,
        "60343": 0.6667,
        "60484": 0.7031,
        "60666": 0.6777,
        "60684": 0.6667,
        "61024": 0.6726,
        "61132": 0.7109,
        "61323": 0.6775,
        "61396": 0.6531,
        "61414": 0.6667,
        "62344": 0.6757,
        "62374": 0.6747,
        "62925": 0.6531,
        "63033": 0.7177,
        "63082": 0.6757,
        "63113": 0.6726,
        "63283": 0.6589,
        "63793": 0.6657,
        "63810": 0.6667,
        "63992": 0.6747,
        "64249": 0.7087,
        "64365": 0.6608,
        "64408": 0.6569,
        "64410": 0.6667,
        "64614": 0.6759,
        "64839": 0.6747,
        "64957": 0.6747,
        "64969": 0.6767,
        "65261": 0.6747,
        "65288": 0.6512,
        "66097": 0.6747,
        "66662": 0.6647,
        "66686": 0.656,
        "67929": 0.6677,
        "67931": 0.6737,
        "68157": 0.6748,
        "68237": 0.6787,
        "68319": 0.6767,
        "68358": 0.6748,
        "68954": 0.6747,
        "69005": 0.7589,
        "69122": 0.6748,
        "69481": 0.6667,
        "69757": 0.6485,
        "69766": 0.7009,
        "69844": 0.6485,
        "70286": 0.6757,
        "70708": 0.7513,
        "70792": 0.655,
        "70880": 0.6737,
        "70927": 0.7496,
        "71011": 0.6637,
        "71096": 0.75,
        "71170": 0.7853,
        "71187": 0.6667,
        "71264": 0.6729,
        "71464": 0.6485,
        "71535": 0.7163,
        "71792": 0.662,
        "72011": 0.6747,
        "72226": 0.6747,
        "72294": 0.6767,
        "72378": 0.6726,
        "72641": 0.6716,
        "72731": 0.6757,
        "72737": 0.6748,
        "72751": 0.6737,
        "72998": 0.6775,
        "73017": 0.6693,
        "73790": 0.6767,
        "74099": 0.6667,
        "74382": 0.6608,
        "74458": 0.6757,
        "74789": 0.6767,
        "75950": 0.6589,
        "76093": 0.672,
        "76251": 0.6747,
        "76823": 0.7177,
        "76836": 1.372,
        "77291": 0.6522,
        "77435": 0.656,
        "77493": 0.6667,
        "77509": 0.6608,
        "77561": 0.6784,
        "77866": 0.6757,
        "78276": 0.7042,
        "78463": 0.6686,
        "78465": 0.6667,
        "78499": 0.7062,
        "78955": 0.6618,
        "79003": 0.6647,
        "79091": 0.6757,
        "79109": 0.6608,
        "79132": 0.6747,
        "79285": 0.63,
        "79477": 0.6579,
        "79528": 0.6647,
        "79533": 0.656,
        "79603": 0.6667,
        "79656": 0.6747,
        "79702": 0.712,
        "80191": 0.6747,
        "80463": 0.6748,
        "80487": 0.7488,
        "80549": 0.6767,
        "81396": 0.6494,
        "81562": 0.6757,
        "81568": 0.6667,
        "81591": 0.6748,
        "81613": 0.6747,
        "81658": 0.6594,
        "81667": 0.636,
        "81711": 0.6667,
        "81834": 0.6757,
        "81845": 0.684,
        "81847": 0.6747,
        "82337": 0.687,
        "82362": 0.7533,
        "82459": 0.6748,
        "82584": 0.6667,
        "82984": 0.6531,
        "83437": 0.6456,
        "84152": 0.6923,
        "84646": 0.6569,
        "84691": 0.6589,
        "84832": 0.71,
        "84989": 0.6667,
        "85022": 0.6775,
        "85190": 0.6747,
        "85414": 0.6747,
        "85618": 0.6447,
        "86286": 0.6677,
        "86332": 0.6747,
        "86626": 0.7365,
        "86854": 0.6798,
        "86860": 0.6618,
        "86882": 0.6777,
        "87232": 0.6757,
        "87511": 0.75,
        "88047": 0.6787,
        "88092": 0.6696,
        "88125": 0.6667,
        "88129": 0.6747,
        "88140": 0.7031,
        "88163": 0.6747,
        "88682": 0.6466,
        "88697": 0.6998,
        "88740": 0.6677,
        "88744": 0.6757,
        "88810": 0.6747,
        "89069": 0.6716,
        "89100": 0.6652,
        "89492": 0.6757,
        "89745": 0.6757,
        "90746": 0.6747,
        "90863": 0.6747,
        "90866": 0.6747,
        "90897": 0.6198,
        "90958": 0.6522,
        "91126": 0.6757,
        "91268": 0.6512,
        "91500": 0.6667,
        "91529": 0.675,
        "91542": 0.6747,
        "91630": 0.6757,
        "91658": 0.6747,
        "91854": 0.6808,
        "92259": 0.6748,
        "92847": 0.7,
        "93029": 0.6757,
        "93037": 0.6447,
        "93328": 0.6696,
        "93330": 0.654,
        "93333": 0.65,
        "93336": 0.6998,
        "93367": 0.6475,
        "93408": 0.692,
        "93418": 0.687,
        "93510": 0.6748,
        "93840": 0.6747,
        "93980": 0.6658,
        "94478": 0.6757,
        "94864": 0.6748,
        "94959": 0.6747,
        "95109": 0.6531,
        "95167": 0.6757,
        "95441": 0.6311,
        "95510": 0.6747,
        "96052": 0.6667,
        "96058": 0.6767,
        "96079": 0.6747,
        "96610": 0.6757,
        "96700": 0.6757,
        "96706": 0.6849,
        "96821": 0.6767,
        "96962": 0.6934,
        "97026": 1.312,
        "97172": 0.6747,
        "97304": 0.6747,
        "97752": 0.6748,
        "97913": 0.6747,
        "97921": 0.6747,
        "97923": 0.6747,
        "97938": 0.6737,
        "98154": 0.6757,
        "98246": 0.6667,
        "98809": 0.6748,
        "98840": 0.7109,
        "98943": 0.6667,
        "98994": 0.7719,
        "98996": 0.6747,
        "99114": 0.6748,
        "99143": 0.6737,
        "99246": 0.6667,
        "100083": 0.6747,
        "101074": 0.6829,
        "101864": 0.632,
        "102125": 0.6747,
        "102325": 0.7455,
        "102445": 0.6747,
        "102747": 0.687,
        "102901": 0.6569,
        "102903": 0.6419,
        "103249": 0.6503,
        "104283": 0.6747,
        "104489": 0.6579,
        "104733": 0.6757,
        "104841": 0.6757,
        "104879": 0.6757,
        "105017": 0.6469,
        "105049": 0.6737,
        "105755": 0.6757,
        "105844": 0.6747,
        "106100": 0.6747,
        "106382": 0.6294,
        "106487": 0.6747,
        "106489": 0.6757,
        "106696": 0.6747,
        "106766": 0.6468,
        "106782": 0.6748,
        "106920": 0.6757,
        "107039": 0.6667,
        "107406": 0.6747,
        "108046": 1.2857,
        "108932": 0.6748,
        "109374": 0.6748,
        "109487": 0.6747,
        "109680": 0.6608,
        "109708": 0.6531,
        "109733": 0.6531,
        "110102": 0.6748,
        "110151": 0.6392,
        "110339": 1.2894,
        "110759": 0.6374,
        "110761": 1.2748,
        "111362": 0.6757,
        "111759": 0.6748,
        "112138": 0.6748,
        "112183": 0.6747,
        "112552": 0.6748,
        "112556": 0.6784,
        "112852": 0.6748,
        "113132": 0.6777,
        "113139": 0.687,
        "113345": 0.6748,
        "114172": 1.2605,
        "114188": 0.6309,
        "114721": 0.6818,
        "115078": 0.6589,
        "115139": 0.6579,
        "115149": 0.6667,
        "115569": 0.6923,
        "115617": 0.6998,
        "115713": 0.6748,
        "116082": 1.3554,
        "116084": 0.6667,
        "116086": 1.3314,
        "116088": 0.75,
        "116090": 0.6667,
        "116092": 0.655,
        "116285": 0.666,
        "116321": 0.6667,
        "116429": 0.704,
        "116710": 0.656,
        "116716": 0.6667,
        "116797": 0.6803,
        "116823": 0.6579,
        "116881": 0.7212,
        "116887": 0.6737,
        "116977": 0.6313,
        "117368": 0.687,
        "117529": 0.632,
        "117744": 0.6767,
        "117883": 0.75,
        "118448": 0.6667,
        "118696": 0.6739,
        "118985": 0.6747,
        "119145": 0.6667,
        "119456": 0.5453,
        "119593": 0.6347,
        "119788": 0.6456,
        "119794": 0.656,
        "120220": 0.6627,
        "120238": 0.6467,
        "120262": 0.6667,
        "120268": 0.6541,
        "120414": 0.6988,
        "120534": 0.6747,
        "120795": 0.6667,
        "121069": 0.687,
        "121308": 0.7365,
        "121600": 1.3314,
        "121897": 0.6608,
        "122013": 0.722,
        "122078": 0.6589,
        "122171": 0.6475,
        "122189": 0.6512,
        "122191": 0.6667,
        "122547": 0.6589,
        "122882": 0.6748,
        "122886": 0.6775,
        "122892": 0.6747,
        "122900": 0.6726,
        "122904": 0.6667,
        "122906": 0.6747,
        "122912": 0.6748,
        "122914": 0.6748,
        "122916": 0.6747,
        "122918": 0.6747,
        "122920": 0.6748,
        "122922": 0.6747,
        "122926": 0.6757,
        "123182": 0.6902,
        "123355": 0.6716,
        "123375": 0.6706,
        "123379": 0.6579,
        "123401": 0.6608,
        "123419": 0.6645,
        "123814": 0.6667,
        "124215": 0.6569,
        "124308": 0.5474,
        "124458": 1.2894,
        "124641": 0.5799,
        "124701": 0.6569,
        "124809": 0.666,
        "124979": 0.6657,
        "124985": 0.6667,
        "125073": 0.6608,
        "125089": 0.6569,
        "125195": 0.6579,
        "125279": 0.6777,
        "125553": 0.6475,
        "125583": 0.6667,
        "125585": 0.6383,
        "125587": 0.75,
        "125589": 0.6647,
        "125591": 0.656,
        "125593": 0.7064,
        "125862": 0.7031,
        "125884": 0.9872,
        "125982": 0.6667,
        "125996": 0.687,
        "126016": 0.6667,
        "126048": 0.6667,
        "126066": 1.3043,
        "126092": 0.6667,
        "128151": 0.6998,
        "128297": 0.6589,
        "128360": 0.6748,
        "129262": 0.7438,
        "129836": 0.687,
        "130382": 0.6747,
        "131120": 0.805,
        "131830": 0.6747,
        "131852": 0.6367,
        "132723": 0.7098,
        "132733": 0.6633,
        "133281": 0.6747,
        "133445": 0.6667,
        "134130": 0.6757,
        "134314": 0.6667,
        "134849": 1.2064,
        "134853": 0.6748,
        "135867": 1.2329,
        "135885": 0.6747,
        "135907": 0.6608,
        "135909": 0.6716,
        "135911": 0.6374,
        "135913": 0.625,
        "136453": 0.6541,
        "136477": 1.3761,
        "136596": 0.7812,
        "136610": 0.75,
        "137484": 0.7525,
        "137898": 0.6419,
        "138026": 0.6977,
        "138208": 0.6747,
        "138706": 0.6569,
        "139385": 0.6726,
        "140367": 0.6168,
        "140551": 0.687,
        "140956": 0.6747,
        "141472": 0.6747,
        "141725": 0.75,
        "141868": 0.6726,
        "142050": 0.7073,
        "142052": 0.6667,
        "142062": 0.687,
        "142180": 0.6419,
        "142488": 0.6757,
        "143013": 0.7353,
        "143367": 0.641,
        "143385": 0.6747,
        "143859": 0.6748,
        "144088": 0.6912,
        "144682": 0.6767,
        "144690": 0.687,
        "144694": 0.6475,
        "144696": 0.687,
        "145196": 0.6667,
        "145206": 0.657,
        "146702": 0.6757,
        "146906": 0.6767,
        "147142": 0.7098,
        "148288": 0.692,
        "148448": 0.6667,
        "148626": 0.6401,
        "149300": 0.7072,
        "149618": 0.6747,
        "150962": 1.257,
        "151757": 0.6494,
        "152081": 0.6747,
        "152202": 0.6608,
        "152216": 1.0,
        "152549": 0.6667,
        "153524": 0.6764,
        "153865": 0.6726,
        "155026": 0.6569,
        "156599": 0.7,
        "156801": 0.687,
        "156815": 0.7525,
        "157028": 0.7009,
        "157034": 0.6541,
        "157417": 0.5238,
        "158830": 0.6747,
        "159163": 0.7212,
        "159632": 0.6729,
        "159634": 0.8079,
        "160333": 0.6667,
        "160335": 0.6647,
        "160588": 0.6747,
        "160846": 0.6667,
        "161372": 0.6667,
        "161388": 0.6569,
        "162600": 0.7979,
        "162716": 0.6438,
        "163066": 0.6998,
        "163132": 0.6818,
        "163154": 0.6667,
        "163286": 0.687,
        "163444": 0.7109,
        "163823": 0.6541,
        "163861": 0.6686,
        "164047": 0.6667,
        "164179": 0.6402,
        "164909": 0.6667,
        "164981": 0.641,
        "165257": 0.6667,
        "165369": 0.6667,
        "165397": 0.687,
        "165753": 0.6241,
        "165855": 0.6787,
        "165941": 0.462,
        "166022": 0.6747,
        "166024": 0.6747,
        "166461": 0.6748,
        "166528": 0.6747,
        "166822": 0.6881,
        "167276": 0.6667,
        "167792": 1.3636,
        "168140": 0.6778,
        "168142": 1.1936,
        "168238": 0.687,
        "168250": 0.6757,
        "168252": 0.6667,
        "169246": 0.6569,
        "169408": 0.6475,
        "169984": 0.6747,
        "170395": 0.7,
        "171167": 0.6608,
        "171169": 0.6667,
        "171191": 0.6667,
        "171465": 0.687,
        "171763": 0.6747,
        "171995": 1.7794,
        "172497": 0.6667,
        "172935": 0.6964,
        "173441": 0.6598,
        "173909": 0.687,
        "173921": 0.687,
        "173945": 1.2535,
        "173949": 1.2431,
        "173951": 1.3387,
        "173953": 0.6998,
        "173955": 1.2342,
        "173957": 1.3043,
        "173977": 0.687,
        "173979": 0.687,
        "173981": 0.687,
        "173989": 0.6747,
        "173991": 0.6579,
        "173995": 0.6618,
        "173997": 0.687,
        "174021": 0.687,
        "174025": 0.687,
        "174027": 0.687,
        "174029": 0.687,
        "174041": 0.687,
        "174055": 0.6748,
        "174085": 1.1421,
        "174087": 0.6998,
        "174091": 1.2712,
        "174093": 1.3975,
        "174113": 0.7533,
        "174115": 0.7533,
        "174117": 0.7533,
        "174149": 0.687,
        "174151": 0.7533,
        "174153": 0.6881,
        "174157": 0.687,
        "174159": 0.6934,
        "174161": 0.7533,
        "174163": 0.7533,
        "174165": 0.7533,
        "174167": 0.7533,
        "174169": 0.7533,
        "174171": 0.687,
        "174173": 0.7533,
        "174175": 0.7533,
        "174179": 0.687,
        "174535": 0.704,
        "174867": 0.6503,
        "175219": 0.6667,
        "175241": 0.6667,
        "175259": 0.687,
        "175261": 0.7614,
        "175797": 0.687,
        "175803": 0.687,
        "175805": 0.7533,
        "175977": 0.687,
        "176221": 0.687,
        "176223": 0.687,
        "176225": 0.687,
        "176227": 0.687,
        "176229": 0.687,
        "176231": 0.687,
        "176233": 0.7533,
        "176237": 0.687,
        "176239": 0.687,
        "176371": 0.6747,
        "176867": 0.5535,
        "177383": 0.6466,
        "177765": 0.6998,
        "179041": 0.6637,
        "179145": 0.687,
        "179173": 1.2129,
        "179421": 0.7353,
        "179941": 0.7377,
        "180139": 0.6777,
        "180497": 0.6747,
        "180519": 0.75,
        "180687": 0.6484,
        "180799": 0.6579,
        "180815": 0.6667,
        "180947": 0.6494,
        "181093": 0.6618,
        "181761": 0.6667,
        "181771": 0.656,
        "181779": 1.2605,
        "181781": 0.6667,
        "181783": 0.6667,
        "181785": 0.7166,
        "181787": 0.6438,
        "181789": 0.6494,
        "181791": 0.6667,
        "181793": 0.6667,
        "181795": 0.6998,
        "181797": 0.6503,
        "181799": 0.6494,
        "181801": 0.6667,
        "181803": 0.6577,
        "181805": 0.6656,
        "181807": 0.6598,
        "181809": 0.6598,
        "181811": 0.6429,
        "181813": 0.6667,
        "181817": 0.6667,
        "181819": 0.6401,
        "181837": 0.6198,
        "181839": 0.6657,
        "181843": 0.655,
        "181845": 0.6686,
        "181847": 0.6658,
        "181849": 0.6438,
        "181853": 0.655,
        "181855": 0.6647,
        "181857": 0.6638,
        "181859": 0.6579,
        "181861": 0.6303,
        "181863": 0.686,
        "181865": 0.6627,
        "181867": 0.6503,
        "181869": 0.6494,
        "181871": 0.67,
        "181873": 0.6637,
        "181875": 0.6522,
        "181877": 0.7009,
        "181879": 0.6512,
        "181881": 0.6747,
        "181885": 0.6716,
        "181887": 0.6689,
        "181889": 0.6633,
        "181891": 0.655,
        "181893": 0.6716,
        "181897": 0.6494,
        "181903": 0.6569,
        "181905": 0.6557,
        "181911": 0.6618,
        "181913": 0.6657,
        "181917": 0.6503,
        "181919": 0.6667,
        "181923": 0.6441,
        "181925": 0.7132,
        "181927": 0.6374,
        "181931": 0.6777,
        "181933": 0.6338,
        "181935": 0.6706,
        "181937": 0.6686,
        "181949": 0.6522,
        "181951": 0.6598,
        "181955": 0.6503,
        "181957": 0.6608,
        "181961": 0.6579,
        "181963": 0.6829,
        "181967": 0.6579,
        "181997": 0.6667,
        "181999": 0.6737,
        "182017": 0.6494,
        "182023": 0.6623,
        "182027": 0.6667,
        "182029": 0.6667,
        "182035": 0.6818,
        "182037": 0.6716,
        "182039": 0.6667,
        "182043": 0.6757,
        "182051": 0.6579,
        "182053": 0.6891,
        "182057": 0.6747,
        "182059": 0.6579,
        "182065": 0.6294,
        "182067": 0.641,
        "182071": 0.6715,
        "182077": 0.6618,
        "182087": 0.6757,
        "182089": 0.6475,
        "182091": 0.6608,
        "182093": 0.6747,
        "182095": 0.6504,
        "182117": 0.6647,
        "182123": 0.6484,
        "182131": 0.6466,
        "182137": 0.5508,
        "182139": 0.6829,
        "182141": 0.6737,
        "182143": 0.6569,
        "182145": 0.6579,
        "182149": 0.6608,
        "182151": 0.6598,
        "182159": 0.7188,
        "182163": 0.6522,
        "182169": 0.7098,
        "182171": 0.6589,
        "182173": 0.6923,
        "182175": 0.7305,
        "182177": 0.6667,
        "182183": 0.6775,
        "182185": 0.7475,
        "182187": 0.6798,
        "182189": 0.7488,
        "182191": 0.635,
        "182195": 0.7109,
        "182197": 0.7341,
        "182199": 0.6737,
        "182201": 0.6494,
        "182203": 0.7098,
        "182213": 0.6667,
        "182219": 0.6667,
        "182221": 0.6667,
        "182227": 0.6737,
        "182229": 0.6647,
        "182231": 0.7679,
        "182233": 0.6667,
        "182235": 0.6686,
        "182239": 0.6618,
        "182253": 0.6667,
        "182263": 1.2262,
        "182265": 0.9956,
        "182271": 1.3043,
        "182275": 1.2064,
        "182277": 0.6667,
        "182279": 1.2465,
        "182281": 1.0817,
        "182283": 1.2097,
        "182285": 1.2262,
        "182289": 1.2,
        "182291": 1.2535,
        "182295": 1.2397,
        "182301": 1.312,
        "182307": 0.6726,
        "182337": 0.6653,
        "182363": 0.75,
        "182383": 0.75,
        "182413": 0.6988,
        "182665": 0.75,
        "182825": 0.6747,
        "183577": 1.2821,
        "184065": 0.8021,
        "184167": 0.7732,
        "184341": 0.6618,
        "186593": 0.6667,
        "186793": 0.6716,
        "187261": 1.3975,
        "187269": 0.6447,
        "187281": 1.2712,
        "187283": 1.3473,
        "187289": 0.6998,
        "187297": 0.75,
        "187299": 0.6957,
        "187301": 0.7075,
        "187323": 1.2605,
        "187325": 0.6456,
        "187331": 1.2712,
        "187335": 0.687,
        "187341": 0.6618,
        "187347": 0.745,
        "187351": 0.6503,
        "187353": 1.3678,
        "187375": 0.6977,
        "187377": 0.6531,
        "187383": 1.7787,
        "187389": 0.6008,
        "187409": 1.3889,
        "187593": 0.6747,
        "188499": 1.2605,
        "188589": 0.6503,
        "189717": 0.7389,
        "189793": 0.7365,
        "190025": 0.75,
        "190113": 0.6667,
        "190173": 0.75,
        "190239": 0.75,
        "190253": 0.7026,
        "190405": 0.6667,
        "192379": 0.632,
        "193217": 0.6637,
        "193944": 0.6748,
        "194448": 0.6667,
        "194664": 0.6657,
        "194720": 0.6667,
        "195011": 0.7101,
        "195159": 0.6747,
        "196025": 1.2636,
        "196175": 0.632,
        "196189": 0.6667,
        "196215": 1.2821,
        "196217": 1.2465,
        "197755": 1.2748,
        "197757": 1.323,
        "197759": 1.3514,
        "197761": 1.2748,
        "197763": 1.25,
        "197767": 0.6484,
        "197769": 1.264,
        "197771": 1.264,
        "197773": 0.6569,
        "197775": 1.2329,
        "197781": 1.2397,
        "197783": 0.7042,
        "197785": 1.3761,
        "197789": 1.2605,
        "197793": 1.2894,
        "197795": 0.7009,
        "197797": 1.2784,
        "197799": 1.1873,
        "197801": 1.2535,
        "197803": 1.2162,
        "197805": 1.3314,
        "197809": 0.9978,
        "197813": 1.2228,
        "197815": 1.2064,
        "197819": 0.6494,
        "197821": 1.3353,
        "197825": 1.2857,
        "197827": 0.6657,
        "197829": 0.6531,
        "197831": 0.6667,
        "197833": 0.6438,
        "197835": 1.3554,
        "197837": 1.2295,
        "197843": 1.4151,
        "197845": 1.2329,
        "197849": 1.257,
        "197919": 0.75,
        "197921": 0.6213,
        "197923": 0.662,
        "197925": 0.75,
        "197927": 0.75,
        "197929": 0.75,
        "197931": 0.75,
        "197933": 0.7414,
        "197935": 0.75,
        "197949": 0.6677,
        "197963": 1.3433,
        "198121": 0.6747,
        "198135": 1.1968,
        "198263": 1.3761,
        "198301": 1.3235,
        "198325": 1.7787,
        "198327": 1.25,
        "198333": 0.655,
        "198341": 1.2195,
        "198343": 1.5734,
        "198345": 0.6998,
        "198349": 1.0817,
        "198351": 1.7787,
        "198365": 1.2465,
        "198369": 1.2968,
        "198371": 1.2397,
        "198373": 1.3353,
        "198375": 0.9934,
        "198381": 1.3514,
        "198387": 1.2931,
        "198395": 1.1811,
        "198399": 1.2032,
        "198403": 0.6667,
        "198411": 1.2605,
        "198413": 1.25,
        "198417": 1.2605,
        "198639": 1.2748,
        "198693": 1.2244,
        "198695": 1.2295,
        "198853": 1.2931,
        "199129": 0.6667,
        "199297": 0.6618,
        "200256": 0.6757,
        "201334": 0.7053,
        "201618": 1.5901,
        "201676": 1.2295,
        "201682": 0.6667,
        "202429": 0.6748,
        "202439": 0.6747,
        "203154": 0.6747,
        "203599": 0.6447,
        "204698": 0.6747,
        "205435": 0.6667,
        "205485": 0.6667,
        "205547": 1.25,
        "205663": 0.7317,
        "205775": 1.5,
        "206012": 0.6625,
        "206014": 0.6657,
        "206419": 0.6747,
        "206857": 0.6829,
        "206973": 0.687,
        "206975": 0.75,
        "207313": 0.6747,
        "207477": 0.687,
        "208887": 0.8007,
        "208923": 0.7533,
        "209021": 0.6369,
        "209089": 0.7533,
        "209815": 0.6419,
        "209883": 0.6667,
        "210073": 0.6667,
        "210123": 1.2162,
        "210327": 1.3514,
        "210807": 1.6667,
        "210813": 1.2582,
        "210815": 1.2712,
        "210817": 1.2143,
        "210819": 0.702,
        "210821": 1.372,
        "210823": 1.2821,
        "210825": 1.2397,
        "211624": 1.0896,
        "211658": 0.687,
        "212134": 1.3314,
        "212657": 0.6531,
        "212661": 0.6541,
        "213017": 0.75,
        "213159": 0.651,
        "213479": 0.6934,
        "214380": 0.6503,
        "214484": 0.7,
        "214488": 0.7401,
        "215077": 1.3043,
        "215191": 0.704,
        "216819": 0.6522,
        "217174": 0.6338,
        "217465": 0.6748,
        "218479": 0.6329,
        "218987": 0.6667,
        "219075": 1.25,
        "219408": 0.7533,
        "221816": 0.6677,
        "222897": 0.6419,
        "223750": 0.7533,
        "223814": 0.75,
        "224933": 1.2032,
        "225187": 0.687,
        "225970": 0.6747,
        "226758": 0.6747,
        "229603": 0.7533,
        "229985": 0.7533,
        "230015": 0.7042,
        "230627": 1.312,
        "230853": 1.3158,
        "231091": 1.1864,
        "231409": 1.3314,
        "231515": 0.6667,
        "231555": 1.7787,
        "231701": 0.6667,
        "232143": 1.4107,
        "233257": 0.7533,
        "233617": 0.7533,
        "234625": 1.2465,
        "234631": 0.7075,
        "235471": 0.6748,
        "235843": 1.2676,
        "235993": 0.6667,
        "236707": 0.6667,
        "236709": 0.6686,
        "236713": 0.6667,
        "238022": 1.257,
        "239532": 0.6667,
        "242198": 0.6667,
        "243710": 0.5537,
        "243846": 1.7787,
        "243852": 1.3433,
        "245006": 0.727,
        "245342": 1.3314,
        "245552": 0.6618,
        "246466": 0.6667,
        "248714": 1.2064,
        "249694": 1.3081,
        "250128": 0.6686,
        "250130": 0.6466,
        "250132": 0.641,
        "250134": 0.6374,
        "250136": 0.6726,
        "250138": 0.6589,
        "250140": 0.6522,
        "250142": 0.6484,
        "250144": 0.641,
        "250146": 0.6514,
        "250148": 0.6466,
        "250150": 0.6541,
        "250152": 0.6374,
        "250162": 0.6667,
        "250164": 0.6419,
        "250166": 0.6419,
        "250168": 0.6466,
        "250170": 0.6374,
        "250172": 0.6447,
        "250174": 0.6589,
        "250176": 0.6392,
        "250178": 0.6429,
        "250180": 0.6531,
        "250182": 0.6608,
        "250184": 0.6667,
        "250186": 0.6667,
        "250188": 1.7787,
        "250190": 0.6891,
        "250192": 1.7787,
        "250194": 0.6276,
        "250562": 1.2363,
        "250566": 1.2465,
        "250568": 1.2894,
        "250574": 1.2129,
        "250578": 1.2535,
        "250580": 0.8637,
        "250586": 0.8637,
        "250598": 1.2431,
        "250600": 1.2329,
        "250602": 0.8637,
        "250606": 0.8637,
        "250608": 1.3333,
        "250612": 1.2397,
        "250614": 1.2605,
        "250616": 1.3274,
        "250618": 1.4901,
        "250620": 1.3353,
        "250622": 1.3043,
        "250626": 0.8637,
        "250628": 1.4062,
        "250630": 1.2329,
        "250634": 1.3043,
        "250636": 1.2605,
        "250640": 1.2431,
        "250646": 1.2482,
        "250648": 1.2465,
        "250650": 1.2431,
        "250654": 0.8637,
        "250660": 0.8637,
        "251318": 0.6737,
        "251320": 0.6737,
        "251624": 0.6696,
        "251652": 0.6504,
        "251654": 0.6627,
        "251728": 0.6647,
        "251742": 0.7179,
        "251752": 0.7533,
        "252100": 1.3314,
        "253380": 1.4151,
        "253392": 1.2195,
        "256221": 0.6904,
        "257281": 0.6747,
        "257813": 0.6868,
        "258705": 1.2535,
        "259659": 0.6757,
        "260061": 0.6657,
        "260853": 0.656,
        "260937": 0.6667,
        "260939": 0.7341,
        "260941": 0.6598,
        "260947": 0.6456,
        "260949": 0.656,
        "260951": 0.6429,
        "260953": 0.6912,
        "260957": 0.6667,
        "260959": 0.6494,
        "260963": 0.6438,
        "260965": 0.6429,
        "260967": 0.6565,
        "260969": 0.6654,
        "260971": 0.8491,
        "260973": 0.6667,
        "260975": 1.3081,
        "260977": 1.3554,
        "261375": 0.6285,
        "261825": 0.6447,
        "261975": 0.6798,
        "263005": 0.6747,
        "263009": 0.6747,
        "263503": 0.687,
        "263505": 0.75,
        "263507": 0.687,
        "263515": 0.7533,
        "263517": 0.7488,
        "263519": 0.7533,
        "263533": 0.75,
        "263535": 0.7533,
        "263973": 0.6747,
        "264233": 0.6667,
        "264480": 0.7154,
        "264666": 0.6747,
        "264952": 0.657,
        "264964": 0.7533,
        "264966": 0.7533,
        "264968": 0.7533,
        "264970": 0.7533,
        "264972": 0.7533,
        "264978": 0.7533,
        "264982": 0.7533,
        "264984": 0.7533,
        "264986": 0.7533,
        "265788": 1.3353,
        "265790": 1.3433,
        "265948": 1.2712,
        "266002": 0.6667,
        "266844": 1.7787,
        "266858": 1.2676,
        "267258": 0.75,
        "267980": 1.2129,
        "267992": 0.75,
        "268002": 0.7533,
        "268024": 0.7533,
        "268200": 0.6667,
        "268202": 0.6667,
        "268204": 0.687,
        "268206": 0.7533,
        "268328": 1.2329,
        "268728": 1.2397,
        "268926": 1.3274,
        "269230": 0.7533,
        "269232": 0.7533,
        "270366": 0.6747,
        "270592": 0.687,
        "270916": 0.6947,
        "270920": 0.6364,
        "271016": 0.6667,
        "271471": 0.6667,
        "271509": 0.687,
        "271511": 0.687,
        "271513": 0.75,
        "271515": 0.7143,
        "271621": 0.7533,
        "271937": 1.2162,
        "271945": 1.264,
        "272475": 0.687,
        "274091": 1.2931,
        "274151": 0.6456,
        "275467": 0.6748,
        "275495": 1.1749,
        "275649": 1.7787,
        "276415": 0.7533,
        "276417": 0.6667,
        "276419": 0.687,
        "276457": 0.6667,
        "276971": 1.2032,
        "277188": 0.6998,
        "278584": 0.7533,
        "278640": 0.6757,
        "278684": 0.687,
        "278980": 0.632,
        "279284": 0.7533,
        "279306": 0.6667,
        "279470": 1.2676,
        "280218": 0.6983,
        "280832": 0.6686,
        "281190": 0.6747,
        "281216": 1.3314,
        "281222": 0.6677,
        "281230": 0.6667,
        "281336": 1.2295,
        "281356": 1.2968,
        "281872": 0.7533,
        "283697": 0.687,
        "284411": 0.6747,
        "284635": 1.7787,
        "284637": 1.3473,
        "285189": 1.2465,
        "285191": 1.2363,
        "285871": 0.709,
        "286121": 0.75,
        "286747": 0.6667,
        "286749": 0.6579,
        "286751": 0.6633,
        "286753": 0.6608,
        "286755": 0.651,
        "286757": 0.641,
        "286759": 0.6419,
        "286839": 0.6667,
        "286925": 0.6667,
        "286927": 0.6667,
        "286929": 1.2097,
        "286937": 0.6839,
        "286939": 0.6579,
        "286941": 0.6667,
        "287203": 1.2535,
        "287205": 0.709,
        "287209": 1.1749,
        "287235": 0.709,
        "287237": 1.3043,
        "287239": 1.2712,
        "287243": 1.2605,
        "287515": 1.2129,
        "287699": 0.6747,
        "287743": 0.6839,
        "288063": 1.1905,
        "288067": 1.2363,
        "288425": 1.312,
        "288429": 1.2295,
        "288587": 1.1538,
        "288589": 1.3761,
        "288591": 1.264,
        "288837": 1.3158,
        "288841": 1.25
    },
    "prepareData": function(groups,width,metric){var all=groups.flatMap(function(g){return g.films.filter(function(f){return f.year!==null;});}),first=Math.min.apply(null,all.map(function(f){return f.year;})),last=Math.max.apply(null,all.map(function(f){return f.year;})),span=Math.max(1,last-first+2),offset=0,nodes=[],labels=[];groups.forEach(function(g,role){var lanes=[],start=offset,films=g.films.filter(function(f){return f.year!==null;}).slice().sort(function(a,b){return a.year-b.year||b.ratingCount-a.ratingCount;});films.forEach(function(f){var x=(f.year-first+1)/span*Math.max(120,width-(width<480?80:104)),lane=lanes.findIndex(function(end){return x-end>=62;});if(lane<0)lane=lanes.length;lanes[lane]=x;nodes.push({name:f.title,movieId:f.id,movieIds:[f.id],year:f.year,mean:f.mean,count:f.ratingCount,value:[f.year,offset+48+lane*108,role,metric==='mean'?(f.mean===null?'\u2014':f.mean.toFixed(2)):(f.ratingCount>=10000?(f.ratingCount/10000).toFixed(1)+'\u4e07':String(f.ratingCount)),f.image||'',f.ratio||1]});});offset+=Math.max(108,lanes.length*108)+24;labels.push({value:[(start+offset)/2,g.role]});});return {nodes:nodes,labels:labels,height:Math.max(132,offset),first:first-1,last:last+1};},
    "textStyle": {
        "fontFamily": "Microsoft YaHei",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 76,
        "right": 28,
        "top": 48,
        "bottom": 44
    },
    "media": [
        {
            "query": {
                "maxWidth": 480
            },
            "option": {
                "grid": {
                    "left": 50,
                    "right": 30
                }
            }
        },
        {
            "option": {
                "grid": {
                    "left": 76,
                    "right": 28
                }
            }
        }
    ]
},
"careerGaps":{
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
            "name": "\u53d1\u884c\u95f4\u9694",
            "renderItem": function(p,api){var a=api.coord([api.value(0),api.value(2)]),b=api.coord([api.value(1),api.value(2)]),c=['#d87c7c', '#919e8b', '#d7ab82'][api.value(2)],span=b[0]-a[0],h=Math.min(52,span*.35),children=[{type:'line',shape:{x1:a[0],y1:a[1],x2:b[0],y2:b[1]},style:{stroke:c,opacity:.25}},{type:'bezierCurve',shape:{x1:a[0],y1:a[1],x2:b[0],y2:b[1],cpx1:a[0]+span*.3,cpy1:a[1]-h,cpx2:b[0]-span*.3,cpy2:b[1]-h},style:{stroke:c,lineWidth:2,fill:null,opacity:.65},emphasis:{style:{stroke:'#f6ecdd',lineWidth:3,opacity:1}}}];if(api.value(4)&&span>62)children.push({type:'text',silent:true,style:{x:(a[0]+b[0])/2,y:a[1]-h*.75-12,text:api.value(3)+' \u5e74',fontSize:14,fontFamily:'Georgia',fill:'#e2d3bd',align:'center',verticalAlign:'bottom'}});return {type:'group',children:children};},
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
                "x": [
                    0,
                    1
                ],
                "y": 2
            },
            "data": [],
            "clip": false,
            "zlevel": 0,
            "z": 2
        },
        {
            "type": "custom",
            "name": "\u53d1\u884c\u5e74\u4efd",
            "renderItem": function(p,api){var q=api.coord([api.value(0),api.value(1)]),n=api.value(2),c=['#d87c7c', '#919e8b', '#d7ab82'][api.value(1)],r=4+Math.min(4,Math.sqrt(n-1)*2);return {type:'group',children:[{type:'line',shape:{x1:q[0],y1:q[1]+r,x2:q[0],y2:q[1]+18},style:{stroke:c,opacity:.5}}, {type:'circle',shape:{cx:q[0],cy:q[1],r:r},style:{fill:c,stroke:'#171214',lineWidth:2},emphasis:{style:{fill:'#f6ecdd',shadowBlur:10,shadowColor:c}}}]};},
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
            "fontFamily": "Microsoft YaHei",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){var d=p.data,title=echarts.format.encodeHTML(d.director)+'<br/>';if(d.films)return title+d.value[0]+' \u5e74 \u00b7 '+d.films.length+' \u90e8<br/>'+d.films.map(echarts.format.encodeHTML).join('<br/>');return title+d.value[0]+' \u5e74 \u00b7 '+d.before+' \u90e8<br/>\u2192 '+d.value[1]+' \u5e74 \u00b7 '+d.after+' \u90e8<br/>\u4e0a\u6620\u5e74\u76f8\u5dee '+d.value[3]+' \u5e74';}
    },
    "minimumWidth": 480,
    "xAxis": [
        {
            "type": "value",
            "nameTextStyle": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6",
                "hideOverlap": true,
                "showMaxLabel": false,
                "formatter": function(v){return String(v);}
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
            "min": "dataMin",
            "max": "dataMax",
            "minInterval": 1,
            "position": "top"
        }
    ],
    "graphic": [
        {
            "type": "text",
            "left": 72,
            "top": 16,
            "silent": true,
            "style": {
                "text": "\u4e0a\u6620\u5e74\u4efd",
                "fontSize": 14,
                "fontFamily": "Microsoft YaHei",
                "fill": "#c6b8a6"
            }
        }
    ],
    "yAxis": [
        {
            "type": "category",
            "nameTextStyle": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6"
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
            "data": [],
            "inverse": true
        }
    ],
    "textStyle": {
        "fontFamily": "Microsoft YaHei",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 72,
        "right": 28,
        "top": 70,
        "bottom": 34
    }
},
"creditsNetwork":{
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
            "name": "\u8054\u5408\u7f72\u540d",
            "layout": "none",
            "symbolSize": 10,
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
                "color": "#eadbc8",
                "margin": 8,
                "fontSize": 14,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "lineStyle": {
                "show": false,
                "width": 1.5,
                "opacity": 0.3,
                "color": "#919e8b"
            },
            "roam": true,
            "nodeScaleRatio": 0,
            "draggable": true,
            "focusNodeAdjacency": true,
            "data": [],
            "edgeLabel": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "edgeSymbol": [
                null,
                null
            ],
            "edgeSymbolSize": 10,
            "links": [],
            "emphasis": {
                "focus": "adjacency",
                "lineStyle": {
                    "opacity": 1,
                    "width": 3
                },
                "itemStyle": {
                    "shadowBlur": 12,
                    "shadowColor": "#d7ab8266"
                }
            },
            "preserveAspect": false,
            "zoom": 1,
            "left": 90,
            "right": 150,
            "top": "middle",
            "labelLayout": {
                "hideOverlap": true
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
            "fontFamily": "Microsoft YaHei",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){var d=p.data;return echarts.format.encodeHTML(d.name)+(d.movieIds?'<br/>'+d.movieIds.length+' \u90e8\u8054\u5408\u6267\u5bfc\u5f71\u7247':'');}
    },
    "minimumWidth": 620,
    "prepareData": function(groups,films,others,links,width){var colors=['#d87c7c', '#919e8b', '#d7ab82', '#6e7074'],nodes=[],steps=[68,120,40],columns=[groups,films,others],scale=(width-240)/800,height=Math.max(280,Math.max.apply(null,columns.map(function(items,i){return Math.max(0,items.length-1)*steps[i];}))+100);[groups,films,others].forEach(function(items,column){items.forEach(function(item,index){var role=item.roleIndex===undefined?3:item.roleIndex,film=column===1;var offset=(index-(items.length-1)/2)*steps[column];nodes.push(Object.assign({},item,{x:column*400,y:offset/scale,scrollX:90+column*400*scale,scrollY:height/2+offset,symbol:film?(item.image?'image://'+item.image:'rect'):column===0?'roundRect':'circle',symbolKeepAspect:true,symbolSize:film?[36,52]:column===0?[140,46]:16,itemStyle:{color:film?'#d7ab82':colors[role],borderColor:'#f6ecdd',borderWidth:column===0?1:0},label:{position:film?'bottom':column===0?'inside':'right',width:film?140:120,height:film?54:36,overflow:'break',lineOverflow:'truncate',lineHeight:18,fontSize:14,color:column===0?'#fff5e7':'#dfd0bd'}}));});});return {nodes:nodes,height:height,links:links.map(function(link){return Object.assign({},link,{lineStyle:{color:colors[link.roleIndex||0],opacity:.3}});})};},
    "textStyle": {
        "fontFamily": "Microsoft YaHei",
        "fontSize": 14,
        "color": "#c6b8a6"
    },
    "grid": {
        "left": 16,
        "right": 16,
        "top": 20,
        "bottom": 20
    }
},
"creditsChord":{
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
            "name": "\u5408\u4f5c\u5173\u7cfb",
            "renderItem": function(p,api){var cx=api.getWidth()/2,cy=api.getHeight()/2,r=Math.min(api.getWidth(),api.getHeight())*.28,a=api.value(0),b=api.value(1),c=api.value(2),d=api.value(3),color=['#d87c7c', '#919e8b', '#d7ab82', '#6e7074'][api.value(4)];function xy(t){return r*Math.cos(t)+','+r*Math.sin(t);}return {type:'path',x:cx,y:cy,shape:{pathData:'M'+xy(a)+' A'+r+','+r+' 0 0 1 '+xy(b)+' Q0,0 '+xy(c)+' A'+r+','+r+' 0 0 1 '+xy(d)+' Q0,0 '+xy(a)+' Z'},style:{fill:color,opacity:.6},emphasis:{style:{opacity:1,stroke:'#f6ecdd',lineWidth:1}}};},
            "colorBy": "series",
            "legendHoverLink": true,
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
            "type": "pie",
            "name": "\u5bfc\u6f14",
            "colorBy": "data",
            "legendHoverLink": true,
            "selectedMode": false,
            "selectedOffset": 10,
            "clockwise": true,
            "startAngle": 90,
            "minAngle": 0,
            "minShowLabelAngle": 0,
            "avoidLabelOverlap": true,
            "stillShowZeroSum": true,
            "percentPrecision": 2,
            "showEmptyCircle": true,
            "emptyCircleStyle": {
                "color": "lightgray",
                "borderColor": "#000",
                "borderWidth": 0,
                "borderType": "solid",
                "borderDashOffset": 0,
                "borderCap": "butt",
                "borderJoin": "bevel",
                "borderMiterLimit": 10,
                "opacity": 1
            },
            "data": [],
            "radius": [
                "57%",
                "63%"
            ],
            "center": [
                "50%",
                "50%"
            ],
            "label": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#eadbc8",
                "show": true,
                "width": 108,
                "overflow": "break",
                "lineHeight": 18
            },
            "labelLine": {
                "length": 10,
                "length2": 10
            },
            "itemStyle": {
                "borderColor": "#171214",
                "borderWidth": 3
            },
            "emphasis": {
                "scale": false
            },
            "labelLayout": {
                "hideOverlap": true
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
            "fontFamily": "Microsoft YaHei",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){var d=p.data;return echarts.format.encodeHTML(d.name)+'<br/>'+d.movieIds.length+' \u90e8\u8054\u5408\u6267\u5bfc\u5f71\u7247';}
    },
    "xAxis": [
        {
            "type": "value",
            "nameTextStyle": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Microsoft YaHei"
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
            "show": false
        }
    ],
    "yAxis": [
        {
            "type": "value",
            "nameTextStyle": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6"
            },
            "axisLabel": {
                "fontSize": 14,
                "color": "#c6b8a6",
                "fontFamily": "Microsoft YaHei"
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
            "show": false
        }
    ],
    "prepareData": function(people,links){var colors=['#d87c7c', '#919e8b', '#d7ab82', '#6e7074'],strength=new Map(),offset=new Map();people.forEach(function(p){strength.set(p.id,0);});links.forEach(function(e){strength.set(e.source,strength.get(e.source)+e.count);strength.set(e.target,strength.get(e.target)+e.count);});var total=Array.from(strength.values()).reduce(function(a,b){return a+b;},0),angle=-Math.PI/2,scale=2*Math.PI/total;var nodes=people.map(function(person){offset.set(person.id,angle);angle+=strength.get(person.id)*scale;return Object.assign({},person,{value:strength.get(person.id),itemStyle:{color:colors[person.roleIndex===undefined?3:person.roleIndex]}});});var ribbons=links.map(function(e){var a=offset.get(e.source),b=offset.get(e.target),size=e.count*scale;offset.set(e.source,a+size);offset.set(e.target,b+size);return Object.assign({},e,{value:[a,a+size,b,b+size,e.roleIndex||0]});});return {nodes:nodes,ribbons:ribbons};},
    "textStyle": {
        "fontFamily": "Microsoft YaHei",
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
"genresBlocks":{
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
            "type": "treemap",
            "name": "\u7c7b\u578b\u6784\u6210",
            "data": [],
            "left": 6,
            "right": 6,
            "top": 8,
            "bottom": 8,
            "label": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#f7eee1",
                "show": true,
                "formatter": function(p){return p.data.genre||p.name;},
                "overflow": "truncate"
            },
            "upperLabel": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#f7eee1",
                "show": true,
                "height": 28
            },
            "drillDownIcon": "\u25b6",
            "roam": false,
            "nodeClick": false,
            "zoomToNodeRatio": 0.1024,
            "levels": [
                {
                    "upperLabel": {
                        "show": false
                    },
                    "itemStyle": {
                        "borderWidth": 0,
                        "gapWidth": 8
                    }
                },
                {
                    "upperLabel": {
                        "show": true
                    },
                    "itemStyle": {
                        "borderWidth": 2,
                        "gapWidth": 3
                    }
                },
                {
                    "upperLabel": {
                        "show": false
                    },
                    "itemStyle": {
                        "borderWidth": 1,
                        "gapWidth": 1
                    }
                }
            ],
            "colorMappingBy": "index",
            "visibleMin": 10,
            "itemStyle": {
                "borderColor": "#171214",
                "borderWidth": 3,
                "gapWidth": 3
            },
            "breadcrumb": {
                "show": false
            },
            "sort": false
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
            "fontFamily": "Microsoft YaHei",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "formatter": function(p){var d=p.data;return echarts.format.encodeHTML(d.director||d.name)+(d.genre?'<br/>'+echarts.format.encodeHTML(d.genre)+' \u00b7 '+d.value.toFixed(1)+'%<br/>'+d.movieIds.length+' \u90e8\u5f71\u7247':'');}
    },
    "genreOrder": [
        "IMAX",
        "\u513f\u7ae5",
        "\u5192\u9669",
        "\u5267\u60c5",
        "\u52a8\u4f5c",
        "\u52a8\u753b",
        "\u559c\u5267",
        "\u5947\u5e7b",
        "\u6050\u6016",
        "\u60ac\u7591",
        "\u60ca\u609a",
        "\u6218\u4e89",
        "\u672a\u6807\u6ce8",
        "\u7231\u60c5",
        "\u72af\u7f6a",
        "\u79d1\u5e7b",
        "\u7eaa\u5f55\u7247",
        "\u897f\u90e8",
        "\u97f3\u4e50",
        "\u9ed1\u8272\u7535\u5f71"
    ],
    "roleStyles": [
        {
            "borderColor": "#d87c7c",
            "color": "#21191c"
        },
        {
            "borderColor": "#919e8b",
            "color": "#21191c"
        },
        {
            "borderColor": "#d7ab82",
            "color": "#21191c"
        }
    ],
    "genreStyles": {
        "IMAX": {
            "color": "#d87c7c"
        },
        "\u513f\u7ae5": {
            "color": "#919e8b"
        },
        "\u5192\u9669": {
            "color": "#d7ab82"
        },
        "\u5267\u60c5": {
            "color": "#6e7074"
        },
        "\u52a8\u4f5c": {
            "color": "#61a0a8"
        },
        "\u52a8\u753b": {
            "color": "#efa18d"
        },
        "\u559c\u5267": {
            "color": "#787464"
        },
        "\u5947\u5e7b": {
            "color": "#cc7e63"
        },
        "\u6050\u6016": {
            "color": "#724e58"
        },
        "\u60ac\u7591": {
            "color": "#4b565b"
        },
        "\u60ca\u609a": {
            "color": "#d87c7c",
            "decal": {
                "symbol": "rect",
                "dashArrayX": [
                    1,
                    0
                ],
                "dashArrayY": [
                    2,
                    5
                ],
                "rotation": 0.785,
                "color": "#ffffff20"
            }
        },
        "\u6218\u4e89": {
            "color": "#919e8b",
            "decal": {
                "symbol": "rect",
                "dashArrayX": [
                    1,
                    0
                ],
                "dashArrayY": [
                    2,
                    5
                ],
                "rotation": 0.785,
                "color": "#ffffff20"
            }
        },
        "\u672a\u6807\u6ce8": {
            "color": "#d7ab82",
            "decal": {
                "symbol": "rect",
                "dashArrayX": [
                    1,
                    0
                ],
                "dashArrayY": [
                    2,
                    5
                ],
                "rotation": 0.785,
                "color": "#ffffff20"
            }
        },
        "\u7231\u60c5": {
            "color": "#6e7074",
            "decal": {
                "symbol": "rect",
                "dashArrayX": [
                    1,
                    0
                ],
                "dashArrayY": [
                    2,
                    5
                ],
                "rotation": 0.785,
                "color": "#ffffff20"
            }
        },
        "\u72af\u7f6a": {
            "color": "#61a0a8",
            "decal": {
                "symbol": "rect",
                "dashArrayX": [
                    1,
                    0
                ],
                "dashArrayY": [
                    2,
                    5
                ],
                "rotation": 0.785,
                "color": "#ffffff20"
            }
        },
        "\u79d1\u5e7b": {
            "color": "#efa18d",
            "decal": {
                "symbol": "rect",
                "dashArrayX": [
                    1,
                    0
                ],
                "dashArrayY": [
                    2,
                    5
                ],
                "rotation": 0.785,
                "color": "#ffffff20"
            }
        },
        "\u7eaa\u5f55\u7247": {
            "color": "#787464",
            "decal": {
                "symbol": "rect",
                "dashArrayX": [
                    1,
                    0
                ],
                "dashArrayY": [
                    2,
                    5
                ],
                "rotation": 0.785,
                "color": "#ffffff20"
            }
        },
        "\u897f\u90e8": {
            "color": "#cc7e63",
            "decal": {
                "symbol": "rect",
                "dashArrayX": [
                    1,
                    0
                ],
                "dashArrayY": [
                    2,
                    5
                ],
                "rotation": 0.785,
                "color": "#ffffff20"
            }
        },
        "\u97f3\u4e50": {
            "color": "#724e58",
            "decal": {
                "symbol": "rect",
                "dashArrayX": [
                    1,
                    0
                ],
                "dashArrayY": [
                    2,
                    5
                ],
                "rotation": 0.785,
                "color": "#ffffff20"
            }
        },
        "\u9ed1\u8272\u7535\u5f71": {
            "color": "#4b565b",
            "decal": {
                "symbol": "rect",
                "dashArrayX": [
                    1,
                    0
                ],
                "dashArrayY": [
                    2,
                    5
                ],
                "rotation": 0.785,
                "color": "#ffffff20"
            }
        }
    },
    "textStyle": {
        "fontFamily": "Microsoft YaHei",
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
"genresHistory":{
    "backgroundColor": "transparent",
    "animation": true,
    "animationThreshold": 2000,
    "animationDuration": 350,
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
            "type": "bar",
            "name": "IMAX",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#d87c7c",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u513f\u7ae5",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#919e8b",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u5192\u9669",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#d7ab82",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u5267\u60c5",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#6e7074",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u52a8\u4f5c",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#61a0a8",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u52a8\u753b",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#efa18d",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u559c\u5267",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#787464",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u5947\u5e7b",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#cc7e63",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u6050\u6016",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#724e58",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u60ac\u7591",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#4b565b",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u60ca\u609a",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#d87c7c",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u6218\u4e89",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#919e8b",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u672a\u6807\u6ce8",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#d7ab82",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u7231\u60c5",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#6e7074",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u72af\u7f6a",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#61a0a8",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u79d1\u5e7b",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#efa18d",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u7eaa\u5f55\u7247",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#787464",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u897f\u90e8",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#cc7e63",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u97f3\u4e50",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#724e58",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u9ed1\u8272\u7535\u5f71",
            "xAxisIndex": 0,
            "yAxisIndex": 0,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f140",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#4b565b",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "IMAX",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#d87c7c",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u513f\u7ae5",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#919e8b",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u5192\u9669",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#d7ab82",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u5267\u60c5",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#6e7074",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u52a8\u4f5c",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#61a0a8",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u52a8\u753b",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#efa18d",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u559c\u5267",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#787464",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u5947\u5e7b",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#cc7e63",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u6050\u6016",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#724e58",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u60ac\u7591",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#4b565b",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u60ca\u609a",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#d87c7c",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u6218\u4e89",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#919e8b",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u672a\u6807\u6ce8",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#d7ab82",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u7231\u60c5",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#6e7074",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u72af\u7f6a",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#61a0a8",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u79d1\u5e7b",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#efa18d",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u7eaa\u5f55\u7247",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#787464",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u897f\u90e8",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#cc7e63",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u97f3\u4e50",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#724e58",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u9ed1\u8272\u7535\u5f71",
            "xAxisIndex": 1,
            "yAxisIndex": 1,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f141",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#4b565b",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "IMAX",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#d87c7c",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u513f\u7ae5",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#919e8b",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u5192\u9669",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#d7ab82",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u5267\u60c5",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#6e7074",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u52a8\u4f5c",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#61a0a8",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u52a8\u753b",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#efa18d",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u559c\u5267",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#787464",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u5947\u5e7b",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#cc7e63",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u6050\u6016",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#724e58",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u60ac\u7591",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#4b565b",
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u60ca\u609a",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#d87c7c",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u6218\u4e89",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#919e8b",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u672a\u6807\u6ce8",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#d7ab82",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u7231\u60c5",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#6e7074",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u72af\u7f6a",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#61a0a8",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u79d1\u5e7b",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#efa18d",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u7eaa\u5f55\u7247",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#787464",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u897f\u90e8",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#cc7e63",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u97f3\u4e50",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#724e58",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        },
        {
            "type": "bar",
            "name": "\u9ed1\u8272\u7535\u5f71",
            "xAxisIndex": 2,
            "yAxisIndex": 2,
            "legendHoverLink": true,
            "data": [],
            "realtimeSort": false,
            "showBackground": false,
            "stack": "\u5bfc\u6f142",
            "stackStrategy": "samesign",
            "cursor": "pointer",
            "barMaxWidth": 54,
            "barMinHeight": 0,
            "barCategoryGap": "24%",
            "barGap": "30%",
            "large": false,
            "largeThreshold": 400,
            "seriesLayoutBy": "column",
            "datasetIndex": 0,
            "clip": true,
            "zlevel": 0,
            "z": 2,
            "label": {
                "show": false,
                "margin": 8,
                "richInheritPlainLabel": true,
                "valueAnimation": false
            },
            "itemStyle": {
                "color": "#4b565b",
                "decal": {
                    "symbol": "rect",
                    "dashArrayX": [
                        1,
                        0
                    ],
                    "dashArrayY": [
                        2,
                        5
                    ],
                    "rotation": 0.785,
                    "color": "#ffffff20"
                },
                "opacity": 0.9,
                "borderColor": "#171214",
                "borderWidth": 0.5
            },
            "emphasis": {
                "focus": "series"
            }
        }
    ],
    "legend": {
        "show": true,
        "type": "scroll",
        "bottom": 4,
        "left": 30,
        "right": 20,
        "selectedMode": false,
        "icon": "rect",
        "textStyle": {
            "fontFamily": "Microsoft YaHei",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "pageTextStyle": {
            "fontFamily": "Microsoft YaHei",
            "fontSize": 14,
            "color": "#c6b8a6"
        },
        "pageIconColor": "#d7ab82",
        "pageIconInactiveColor": "#5a4349",
        "itemWidth": 12,
        "itemHeight": 9
    },
    "tooltip": {
        "show": true,
        "trigger": "item",
        "confine": true,
        "backgroundColor": "#171214",
        "borderColor": "#846662",
        "textStyle": {
            "fontFamily": "Microsoft YaHei",
            "fontSize": 14,
            "color": "#f6ecdd"
        },
        "formatter": function(p){var d=p.data;return echarts.format.encodeHTML(d.director)+'<br/>'+d.period+' \u00b7 '+echarts.format.encodeHTML(d.genre)+'<br/>'+d.value[1].toFixed(1)+'% \u00b7 '+d.movieIds.length+' \u90e8\u5f71\u7247';}
    },
    "xAxis": [
        {
            "type": "category",
            "nameTextStyle": {
                "fontSize": 16,
                "color": "#c6b8a6",
                "fontFamily": "Microsoft YaHei"
            },
            "axisLabel": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6",
                "hideOverlap": true,
                "showMaxLabel": false
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
            "data": [],
            "gridIndex": 0,
            "boundaryGap": true,
            "show": true
        },
        {
            "type": "category",
            "nameTextStyle": {
                "fontSize": 16,
                "color": "#c6b8a6",
                "fontFamily": "Microsoft YaHei"
            },
            "axisLabel": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6",
                "hideOverlap": true,
                "showMaxLabel": false
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
            "data": [],
            "gridIndex": 1,
            "boundaryGap": true,
            "show": false
        },
        {
            "type": "category",
            "nameTextStyle": {
                "fontSize": 16,
                "color": "#c6b8a6",
                "fontFamily": "Microsoft YaHei"
            },
            "axisLabel": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#c6b8a6",
                "hideOverlap": true,
                "showMaxLabel": false
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
            "data": [],
            "gridIndex": 2,
            "boundaryGap": true,
            "show": false
        }
    ],
    "yAxis": [
        {
            "type": "value",
            "nameTextStyle": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#d87c7c"
            },
            "axisLabel": {
                "fontFamily": "Microsoft YaHei",
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
                "show": true,
                "lineStyle": {
                    "color": "#6e7074",
                    "opacity": 0.14
                }
            },
            "min": 0,
            "max": 100,
            "interval": 50,
            "gridIndex": 0,
            "show": true
        },
        {
            "type": "value",
            "nameTextStyle": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#919e8b"
            },
            "axisLabel": {
                "fontFamily": "Microsoft YaHei",
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
                "show": true,
                "lineStyle": {
                    "color": "#6e7074",
                    "opacity": 0.14
                }
            },
            "min": 0,
            "max": 100,
            "interval": 50,
            "gridIndex": 1,
            "show": false
        },
        {
            "type": "value",
            "nameTextStyle": {
                "fontFamily": "Microsoft YaHei",
                "fontSize": 14,
                "color": "#d7ab82"
            },
            "axisLabel": {
                "fontFamily": "Microsoft YaHei",
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
                "show": true,
                "lineStyle": {
                    "color": "#6e7074",
                    "opacity": 0.14
                }
            },
            "min": 0,
            "max": 100,
            "interval": 50,
            "gridIndex": 2,
            "show": false
        }
    ],
    "color": [
        "#d87c7c",
        "#919e8b",
        "#d7ab82",
        "#6e7074",
        "#61a0a8",
        "#efa18d",
        "#787464",
        "#cc7e63",
        "#724e58",
        "#4b565b",
        "#d87c7c",
        "#919e8b",
        "#d7ab82",
        "#6e7074",
        "#61a0a8",
        "#efa18d",
        "#787464",
        "#cc7e63",
        "#724e58",
        "#4b565b",
        "#d87c7c",
        "#919e8b",
        "#d7ab82",
        "#6e7074",
        "#61a0a8",
        "#efa18d",
        "#787464",
        "#cc7e63",
        "#724e58",
        "#4b565b",
        "#d87c7c",
        "#919e8b",
        "#d7ab82",
        "#6e7074",
        "#61a0a8",
        "#efa18d",
        "#787464",
        "#cc7e63",
        "#724e58",
        "#4b565b",
        "#d87c7c",
        "#919e8b",
        "#d7ab82",
        "#6e7074",
        "#61a0a8",
        "#efa18d",
        "#787464",
        "#cc7e63",
        "#724e58",
        "#4b565b",
        "#d87c7c",
        "#919e8b",
        "#d7ab82",
        "#6e7074",
        "#61a0a8",
        "#efa18d",
        "#787464",
        "#cc7e63",
        "#724e58",
        "#4b565b"
    ],
    "genreOrder": [
        "IMAX",
        "\u513f\u7ae5",
        "\u5192\u9669",
        "\u5267\u60c5",
        "\u52a8\u4f5c",
        "\u52a8\u753b",
        "\u559c\u5267",
        "\u5947\u5e7b",
        "\u6050\u6016",
        "\u60ac\u7591",
        "\u60ca\u609a",
        "\u6218\u4e89",
        "\u672a\u6807\u6ce8",
        "\u7231\u60c5",
        "\u72af\u7f6a",
        "\u79d1\u5e7b",
        "\u7eaa\u5f55\u7247",
        "\u897f\u90e8",
        "\u97f3\u4e50",
        "\u9ed1\u8272\u7535\u5f71"
    ],
    "facetHeight": 276,
    "minimumWidth": 640,
    "grid": [
        {
            "left": 46,
            "right": 18,
            "top": 34,
            "height": 204
        },
        {
            "left": 46,
            "right": 18,
            "top": 310,
            "height": 204
        },
        {
            "left": 46,
            "right": 18,
            "top": 586,
            "height": 204
        }
    ]
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
            "color": "#c6b8a6",
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
                "color": "#c6b8a6",
                "fontFamily": "Microsoft YaHei"
            },
            "axisLabel": {
                "fontSize": 16,
                "color": "#c6b8a6",
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
                "color": "#c6b8a6",
                "fontFamily": "Microsoft YaHei"
            },
            "axisLabel": {
                "fontSize": 16,
                "color": "#c6b8a6",
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
        "color": "#c6b8a6",
        "fontFamily": "Microsoft YaHei"
    },
    "grid": {
        "left": 52,
        "right": 24,
        "top": 32,
        "bottom": 50
    },
    "media": [
        {
            "query": {
                "maxWidth": 480
            },
            "option": {
                "grid": {
                    "left": 42,
                    "right": 10
                },
                "xAxis": [
                    {
                        "axisLabel": {
                            "fontSize": 12,
                            "formatter": function(v){return Number(v)<1?v.replace('0.','.'):v;}
                        }
                    }
                ],
                "yAxis": [
                    {
                        "axisLabel": {
                            "fontSize": 12
                        }
                    }
                ]
            }
        },
        {
            "option": {
                "grid": {
                    "left": 52,
                    "right": 24
                },
                "xAxis": [
                    {
                        "axisLabel": {
                            "fontSize": 16
                        }
                    }
                ],
                "yAxis": [
                    {
                        "axisLabel": {
                            "fontSize": 16
                        }
                    }
                ]
            }
        }
    ]
}
};
