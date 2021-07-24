require.config({
    paths: {
    	"core":"/extensions/radial-bar-chart/amcharts/core",
    	"charts":"/extensions/radial-bar-chart/amcharts/charts",
    	"animated":"/extensions/radial-bar-chart/amcharts/animated",
    },
    shim: {
        'core': {
            init: function () {
                return window.am4core;
            }
        },
        'charts': {
            deps: ['core'],
            exports: 'charts',
            init: function () {
                return window.am4charts;
            }
        },
        'animated': {
            deps: ['core'],
            exports: 'animated',
            init: function () {
                return window.am4themes_animated;
            }
        }
    }
});


define( ["qlik","jquery","css!./style.css","core","charts", "animated","./about"],
	function ( qlik, $,cssContent, core, charts, animated) {
		
		"use strict";
		return {
			initialProperties: {
				qHyperCubeDef: {
					qDimensions: [],
					qMeasures: [],
					qInitialDataFetch: [{
						qWidth: 5,
						qHeight: 50
					}]
				}
			},
			definition: {
				type: "items",
				component: "accordion",
				items: {
					dimensions: {
						uses: "dimensions",
						min: 1,
						max: 1
					},
					measures: {
						uses: "measures",
						min: 1,
						max: 4
					},
					sorting: {
						uses: "sorting"
					},
					settings: {
						uses: "settings",
						items: {
							ChartSettings: {
								label: "Chart Custom Settings",
								items: {
										CustomMinMax: {
											type: "boolean",
											label: "Custom ValueAxis Min/Max",
											ref: "CustomMinMax",
											defaultValue: false
										},
										Min: {
											type: "number",
											label: "Min",
											ref: "valueMin",
											defaultValue: 0,
											show: function(d) {
												return d.CustomMinMax
											}
										},
										Max: {
											type: "number",
											label: "Max",
											ref: "valueMax",
											defaultValue: 500,
											show: function(d) {
												return d.CustomMinMax
											}
										},
							            Measure1ColorPicker: {
							              label:"Measure 1 Color",
							              component: "color-picker",
							              ref: "measure1Color",
							              type: "object",
							              defaultValue: {
							                color: "#FE0C29",
							                index: "-1"
							              }
							            },
							            Measure2ColorPicker: {
							              label:"Measure 2 Color",
							              component: "color-picker",
							              ref: "measure2Color",
							              type: "object",
							              defaultValue: {
							                color: "#0C10FE",
							                index: "-1"
							              }
							            },
							            Measure3ColorPicker: {
							              label:"Measure 3 Color",
							              component: "color-picker",
							              ref: "measure3Color",
							              type: "object",
							              defaultValue: {
							                color: "#56A553",
							                index: "-1"
							              }
							            },
							            Measure4ColorPicker: {
							              label:"Measure 4 Color",
							              component: "color-picker",
							              ref: "measure4Color",
							              type: "object",
							              defaultValue: {
							                color: "#EFFA04",
							                index: "-1"
							              }
							            },
							            XAxisCursor: {
								            type: "boolean",
								            component: "dropdown",
								            label: "X Axis Cursor",
								            ref: "xaxiscursor",
								            options: [{
								              value: true,
								              label: "Disable"
								            }, {
								              value: false,
								              label: "Enable"
								            }],
								            defaultValue: false
								        },
								        YAxisCursor: {
								            type: "boolean",
								            component: "dropdown",
								            label: "Y Axis Cursor",
								            ref: "yaxiscursor",
								            options: [{
								              value: true,
								              label: "Disable"
								            }, {
								              value: false,
								              label: "Enable"
								            }],
								            defaultValue: true
								        },

									
								}
							}
						}
					},
					about: {
                            component: "rabout",
                            translation: "About",
                            label: "About"
                        }
				// end
				}
			},
			support: {
				snapshot: true,
				export: true,
				exportData: true
			},
			paint: function ($element, layout) {
				
				var id = "chartdiv_" + layout.qInfo.qId;
				$element.html("<div id ='"+id+"'></div>");

				var qHyperCube = layout.qHyperCube;
				var qMatrix = layout.qHyperCube.qDataPages[0].qMatrix;
				var qMeasureInfo = qHyperCube.qMeasureInfo;
				var qDimensionInfo = qHyperCube.qDimensionInfo;

				var margin = {top: 5, right: 5, bottom: 5, left: 5};
				var width = $element.width() + margin.left + margin.right;
			    var height = $element.height() + margin.top + margin.bottom;
			    
			    $("#"+id).css({"width": width, "height": height});

				am4core.useTheme(am4themes_animated);

				var chart = am4core.create(id, am4charts.RadarChart);
				
				
				if(qMeasureInfo.length == 1){
					var tempdata = [];
					qMatrix.forEach(function (d){	
					tempdata.push({
						category: d[0].qText,
				        value1: d[1].qNum,
					});		  
					});
				}
				else if(qMeasureInfo.length == 2){
					var tempdata = [];
					qMatrix.forEach(function (d){	
					tempdata.push({
						category: d[0].qText,
				        value1: d[1].qNum,
				        value2: d[2].qNum,
					});		  
					});
				}
				else if(qMeasureInfo.length == 3){
					var tempdata = [];
					qMatrix.forEach(function (d){	
					tempdata.push({
						category: d[0].qText,
				        value1: d[1].qNum,
				        value2: d[2].qNum,
				        value3: d[3].qNum,
					});		  
					});
				}
				else if(qMeasureInfo.length == 4){
					var tempdata = [];
					qMatrix.forEach(function (d){	
					tempdata.push({
						category: d[0].qText,
				        value1: d[1].qNum,
				        value2: d[2].qNum,
				        value3: d[3].qNum,
				        value4: d[4].qNum,
					});		  
					});
				}
				

				chart.data = tempdata;

				

				chart.padding(20, 20, 20, 20);
				// chart.colors.step = 4;

				chart.colors.list = [
				  am4core.color(layout.measure1Color.color),
				  am4core.color(layout.measure2Color.color),
				  am4core.color(layout.measure3Color.color),
				  am4core.color(layout.measure4Color.color), 
				];

				var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
				categoryAxis.dataFields.category = "category";
				categoryAxis.renderer.labels.template.location = 0.5;
				categoryAxis.renderer.labels.template.horizontalCenter = "right";
				categoryAxis.renderer.grid.template.location = 0;
				categoryAxis.renderer.tooltipLocation = 0.5;
				categoryAxis.renderer.grid.template.strokeOpacity = 0.07;
				categoryAxis.interactionsEnabled = false;

				var valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
				valueAxis.tooltip.disabled = true;
				valueAxis.renderer.labels.template.horizontalCenter = "left";
				// Added custom min and max for valueaxis
				valueAxis.min = layout.valueMin;
				valueAxis.max = layout.valueMax;
				valueAxis.strictMinMax = true;
				valueAxis.renderer.maxLabelPosition = 0.99;
				valueAxis.renderer.minGridDistance = 10;
				valueAxis.renderer.grid.template.strokeOpacity = 0.07;
				valueAxis.interactionsEnabled = false;

				if(qMeasureInfo.length >= 1) {
					    var series1 = chart.series.push(new am4charts.RadarColumnSeries());
						series1.columns.template.width = am4core.percent(80);
						series1.columns.template.tooltipText = "{name}: {valueX.value}";
						series1.name = qMeasureInfo[0].qFallbackTitle;
						series1.dataFields.categoryY = "category";
						series1.dataFields.valueX = "value1";
						series1.stacked = true;
				}

				if(qMeasureInfo.length >= 2) {
					    var series2 = chart.series.push(new am4charts.RadarColumnSeries());
						series2.columns.template.width = am4core.percent(80);
						series2.columns.template.tooltipText = "{name}: {valueX.value}";
						series2.name = qMeasureInfo[1].qFallbackTitle;
						series2.dataFields.categoryY = "category";
						series2.dataFields.valueX = "value2";
						series2.stacked = true;
				}
				
				if(qMeasureInfo.length >= 3) {
					    	var series3 = chart.series.push(new am4charts.RadarColumnSeries());
							series3.columns.template.width = am4core.percent(80);
							series3.columns.template.tooltipText = "{name}: {valueX.value}";
							series3.name = qMeasureInfo[2].qFallbackTitle;
							series3.dataFields.categoryY = "category";
							series3.dataFields.valueX = "value3";
							series3.stacked = true;
				}

				if(qMeasureInfo.length >= 4) {
					    	var series4 = chart.series.push(new am4charts.RadarColumnSeries());
							series4.columns.template.width = am4core.percent(80);
							series4.columns.template.tooltipText = "{name}: {valueX.value}";
							series4.name = qMeasureInfo[3].qFallbackTitle;
							series4.dataFields.categoryY = "category";
							series4.dataFields.valueX = "value4";
							series4.stacked = true;
				}
				

				

				chart.seriesContainer.zIndex = -1;

				// chart.scrollbarX = new am4core.Scrollbar();
				// chart.scrollbarY = new am4core.Scrollbar();

				chart.cursor = new am4charts.RadarCursor();
				chart.cursor.xAxis = valueAxis;
				chart.cursor.lineX.disabled = layout.xaxiscursor;
				chart.cursor.lineY.disabled = layout.yaxiscursor;
				


				
				return qlik.Promise.resolve();
			}
		};

	} );
