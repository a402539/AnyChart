goog.provide('anychart.themes.dark_provence');


/**
 * @this {*}
 * @return {*}
 */
var returnDarkenSourceColor = function() {
  return window['anychart']['color']['darken'](this['sourceColor']);
};


/**
 * @this {*}
 * @return {*}
 */
var returnLightenSourceColor = function() {
  return window['anychart']['color']['lighten'](this['sourceColor']);
};


window['anychart'] = window['anychart'] || {};
window['anychart']['themes'] = window['anychart']['themes'] || {};
window['anychart']['themes']['darkProvence'] = {
  'palette': {
    'type': 'distinct',
    'items': ['#aa8ab3', '#b7cbe2', '#cdd18e', '#938d9c', '#6f5264', '#96246a', '#519790', '#6aabcc', '#61687d', '#7b8030']
  },
  'ordinalColor': {
    'autoColors': function(rangesCount) {
      return window['anychart']['color']['blendedHueProgression']('#e1bee7', '#9656a1', rangesCount);
    }
  },
  'defaultFontSettings': {
    'fontFamily': '"Source Sans Pro", sans-serif',
    'fontSize': 13,
    'fontColor': '#b2aab5'
  },
  'defaultBackground': {
    'fill': '#464646',
    'stroke': '#363636',
    'cornerType': 'round',
    'corners': 0
  },
  'defaultAxis': {
    'stroke': '#5f5b61 0.8',
    'title': {
      'fontSize': 15
    },
    'ticks': {
      'stroke': '#5f5b61 0.8'
    },
    'minorTicks': {
      'stroke': '#534f54 0.8'
    }
  },
  'defaultGridSettings': {
    'stroke': '#5f5b61 0.8'
  },
  'defaultMinorGridSettings': {
    'stroke': '#534f54 0.8'
  },
  'defaultSeparator': {
    'fill': '#5f5b61'
  },
  'defaultTooltip': {
    'title': {
      'fontColor': '#745c65',
      'padding': {'bottom': 5},
      'fontSize': 15
    },
    'content': {
      'fontColor': '#997f89'
    },
    'separator': {
      'enabled': false
    },
    'fontColor': '#997f89',
    'fontSize': 13,
    'background': {
      'fill': '#ffffff 0.9',
      'stroke': '1 #ebebeb',
      'corners': 0
    },
    'offsetX': 15,
    'offsetY': 0,
    'padding': {'top': 5, 'right': 15, 'bottom': 5, 'left': 15}
  },
  'defaultColorRange': {
    'stroke': '#8e8691',
    'ticks': {
      'stroke': '#8e8691', 'position': 'outside', 'length': 7, 'enabled': true
    },
    'minorTicks': {
      'stroke': '#8e8691', 'position': 'outside', 'length': 5, 'enabled': true
    },
    'marker': {
      'padding': {'top': 3, 'right': 3, 'bottom': 3, 'left': 3},
      'fill': '#b2aab5',
      'hoverFill': '#b2aab5'
    }
  },
  'defaultScroller': {
    'fill': '#616161',
    'selectedFill': '#757575',
    'thumbs': {
      'fill': '#b2aab5',
      'stroke': '#616161',
      'hoverFill': '#cec6d1',
      'hoverStroke': '#757575'
    }
  },
  'defaultLegend': {
    'fontSize': 13
  },
  'chart': {
    'defaultSeriesSettings': {
      'base': {
        'selectStroke': '1.5 #fafafa',
        'selectMarkers': {
          'stroke': '1.5 #fafafa'
        }
      },
      'lineLike': {
        'selectStroke': '3 #fafafa'
      },
      'areaLike': {
        'selectStroke': '3 #fafafa'
      },
      'marker': {
        'selectStroke': '1.5 #fafafa'
      }
    },
    'title': {
      'fontSize': 17
    },
    'padding': {'top': 20, 'right': 25, 'bottom': 15, 'left': 15}
  },
  'cartesianBase': {
    'defaultSeriesSettings': {
      'box': {
        'selectMedianStroke': '#fafafa',
        'selectStemStroke': '#fafafa',
        'selectWhiskerStroke': '#fafafa',
        'selectOutlierMarkers': {
          'enabled': null,
          'size': 4,
          'fill': '#fafafa',
          'stroke': '#fafafa'
        }
      },
      'candlestick': {
        'risingFill': '#aa8ab3',
        'risingStroke': '#aa8ab3',
        'hoverRisingFill': returnLightenSourceColor,
        'hoverRisingStroke': returnDarkenSourceColor,
        'fallingFill': '#b7cbe2',
        'fallingStroke': '#b7cbe2',
        'hoverFallingFill': returnLightenSourceColor,
        'hoverFallingStroke': returnDarkenSourceColor,
        'selectRisingStroke': '3 #aa8ab3',
        'selectFallingStroke': '3 #b7cbe2',
        'selectRisingFill': '#333333 0.85',
        'selectFallingFill': '#333333 0.85'
      },
      'ohlc': {
        'risingStroke': '#aa8ab3',
        'hoverRisingStroke': returnDarkenSourceColor,
        'fallingStroke': '#b7cbe2',
        'hoverFallingStroke': returnDarkenSourceColor,
        'selectRisingStroke': '3 #aa8ab3',
        'selectFallingStroke': '3 #b7cbe2'
      }
    }
  },
  'pieFunnelPyramidBase': {
    'labels': {
      'fontColor': null
    },
    'selectStroke': '1.5 #fafafa',
    'connectorStroke': '#5f5b61',
    'outsideLabels': {'autoColor': '#b2aab5'},
    'insideLabels': {'autoColor': '#212121'}
  },
  'map': {
    'unboundRegions': {'enabled': true, 'fill': '#616161', 'stroke': '#757575'},
    'linearColor': {'colors': ['#e1bee7', '#aa8ab3', '#9656a1']},
    'defaultSeriesSettings': {
      'base': {
        'stroke': '#b2aab5',
        'hoverFill': '#b0bec5',
        'selectStroke': '1.5 #fafafa',
        'labels': {
          'fontColor': '#212121'
        }
      },
      'connector': {
        'selectStroke': '1.5 #000',
        'hoverStroke': '1.5 #b0bec5',
        'stroke': '1.5 #aa8ab3',
        'markers': {
          'fill': '#b7cbe2',
          'stroke': '1.5 #616161'
        },
        'hoverMarkers': {
          'fill': '#b7cbe2'
        }
      },
      'marker': {
        'labels': {
          'fontColor': '#b2aab5'
        }
      }
    }
  },
  'sparkline': {
    'padding': 0,
    'background': {'stroke': '#464646'},
    'defaultSeriesSettings': {
      'area': {
        'stroke': '1.5 #aa8ab3',
        'fill': '#aa8ab3 0.5'
      },
      'column': {
        'fill': '#aa8ab3',
        'negativeFill': '#b7cbe2'
      },
      'line': {
        'stroke': '1.5 #aa8ab3'
      },
      'winLoss': {
        'fill': '#aa8ab3',
        'negativeFill': '#b7cbe2'
      }
    }
  },
  'bullet': {
    'background': {'stroke': '#464646'},
    'defaultMarkerSettings': {
      'fill': '#aa8ab3',
      'stroke': '2 #aa8ab3'
    },
    'padding': {'top': 5, 'right': 10, 'bottom': 5, 'left': 10},
    'margin': {'top': 0, 'right': 0, 'bottom': 0, 'left': 0},
    'rangePalette': {
      'items': ['#757575', '#696969', '#606060', '#545454', '#4B4B4B']
    }
  },
  'heatMap': {
    'stroke': '1 #464646',
    'hoverStroke': '1.5 #464646',
    'selectStroke': '2 #fafafa',
    'labels': {
      'fontColor': '#212121'
    }
  },
  'treeMap': {
    'headers': {
      'background': {
        'enabled': true,
        'fill': '#616161',
        'stroke': '#414141'
      }
    },
    'hoverHeaders': {
      'fontColor': '#b2aab5',
      'background': {
        'fill': '#b2aab5'
      }
    },
    'labels': {
      'fontColor': '#212121'
    },
    'selectLabels': {
      'fontColor': '#fafafa'
    },
    'stroke': '#414141',
    'selectStroke': '2 #eceff1'
  }
};