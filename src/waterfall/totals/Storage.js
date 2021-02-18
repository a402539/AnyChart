goog.provide('anychart.waterfallModule.totals.Storage');

goog.require('anychart.core.Base');
goog.require('anychart.scales.Ordinal');
goog.require('anychart.waterfallModule.totals.Series');
goog.require('anychart.waterfallModule.totals.Total');


/**
 * Class that creates, removes and store created totals.
 *
 * @param {anychart.waterfallModule.Chart} chart - Instance of watefall chart.
 * @constructor
 * @extends {anychart.core.Base}
 */
anychart.waterfallModule.totals.Storage = function(chart) {
  anychart.waterfallModule.totals.Storage.base(this, 'constructor');

  /**
   * Instance of watefall chart.
   *
   * @private
   */
  this.chart_ = chart;

  /**
   * Series that used to draw total values.
   *
   * @type {anychart.waterfallModule.totals.Series}
   * @private
   */
  this.series_ = new anychart.waterfallModule.totals.Series(chart);

  /**
   * Array with created totals.
   *
   * @type {Array.<anychart.waterfallModule.totals.Total>}
   * @private
   */
  this.totals_ = [];

  /**
   * Datasets of all waterfall series.
   *
   * @type {Array.<anychart.data.Mapping>}
   * @private
   */
  this.datasets_ = [];

  this.setupSeries();
};
goog.inherits(anychart.waterfallModule.totals.Storage, anychart.core.Base);

/**
 * Supported signals.
 * @type {anychart.Signal|number}
 */
anychart.waterfallModule.totals.Storage.prototype.SUPPORTED_SIGNALS = anychart.Signal.NEEDS_REDRAW_APPEARANCE;

/**
 * States that totals storage supports.
 *
 * @enum {string}
 */
anychart.waterfallModule.totals.Storage.SUPPORTED_STATES = {
  TOTALS: 'totals'
};

anychart.waterfallModule.totals.Storage.CONSISTENCY_STORAGE_NAME = 'waterfallTotalsStorage';

anychart.consistency.supportStates(
  anychart.waterfallModule.totals.Storage,
  anychart.waterfallModule.totals.Storage.CONSISTENCY_STORAGE_NAME,
  [
    anychart.waterfallModule.totals.Storage.SUPPORTED_STATES.TOTALS
  ]
);

anychart.waterfallModule.totals.Storage.prototype.getSeries = function() {
  return this.series_;
};

anychart.waterfallModule.totals.Storage.prototype.combineDatasets = function() {
  var data = {};
  goog.array.forEach(this.datasets_, function(dataset, index) {
    var iterator = dataset.getIterator();
    while (iterator.advance()) {
      var x = iterator.get('x');
      var value = iterator.get('value');

      if (!data[x]) {
        data[x] = [];
      }

      data[x].push(value);
    }

    var desiredLength = index + 1;
    goog.object.forEach(data, function(values) {
      if (values.length < desiredLength) {
        values.push(0);
      }
    });
  });

  var categories = goog.object.getKeys(data);
  var values = goog.object.getValues(data);

  return {
    categories: categories,
    values: values
  };
};

anychart.waterfallModule.totals.Storage.prototype.populateByTotal = function(data) {

};


/**
 *
 * @param data
 * @return {{
 *   categories: Array.<string>,
 *   values: Array.<Array.<number>>
 * }} data - .
 */
anychart.waterfallModule.totals.Storage.prototype.populateByTotals = function(data) {
  var categories = data.categories;
  var values = data.values;

  var finalValues = goog.array.map(categories, function(category) {
    return [category];
  });

  var visibleTotals = goog.array.filter(this.totals_, function(total) {
    return goog.array.contains(categories, total.getOption('x'));
  });

  var categoriesToAdd = goog.array.map(visibleTotals, function(total) {
    var index = categories.indexOf(total.getOption('x'));
    var valuesForTotal = goog.array.slice(values, 0, index + 1);
    return {
      target: total.getOption('x'),
      categories: total.calculate(valuesForTotal)
    };
  });

  goog.array.forEach(categoriesToAdd, function(totalData) {
    var index = goog.array.findIndex(finalValues, function(pointData) {
      var category = pointData[0];
      return category == totalData.target;
    });

    goog.array.insertArrayAt(finalValues, totalData.categories, index + 1);
  });

  return finalValues;
};

anychart.waterfallModule.totals.Storage.prototype.modifyForAbsoluteMode = function(values) {
  return goog.array.reduce(values, function(prev, categoryData, rowNo) {
    if (rowNo) {
      var row = goog.array.map(categoryData, function(value, index) {
        return value - values[rowNo - 1][index];
      });
      prev.push(row);
      return prev;
    }
    prev.push(values[rowNo]);
    return prev;
  }, []);
};

anychart.waterfallModule.totals.Storage.prototype.modifyForDataMode = function(data, mode) {
  if (mode == anychart.enums.WaterfallDataMode.ABSOLUTE) {
    var categories = data.categories;
    var values = this.modifyForAbsoluteMode(data.values);

    return {
      categories: categories,
      values: values
    };
  }

  return data;
};


anychart.waterfallModule.totals.Storage.prototype.calculate = function(mode) {
  var data = this.combineDatasets(mode);
  var modifiedData = this.modifyForDataMode(data, mode);
  var seriesData = this.populateByTotals(modifiedData);

  this.series_.data(seriesData);
};

anychart.waterfallModule.totals.Storage.prototype.draw = function(container, bounds) {
  this.series_.container(container);
  this.series_.parentBounds(bounds);
  this.series_.draw();
};

anychart.waterfallModule.totals.Storage.prototype.setDatasets = function(datasets) {
  this.datasets_ = datasets;
};

anychart.waterfallModule.totals.Storage.prototype.setCategories = function(categories) {
  this.categories = goog.array.clone(categories);
};

anychart.waterfallModule.totals.Storage.prototype.totalInvalidated = function() {
  this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_APPEARANCE);
};

/**
 * Setup series.
 */
anychart.waterfallModule.totals.Storage.prototype.setupSeries = function() {
  this.series_.setParentEventTarget(this.chart_);
};

/**
 * Setup series.
 */
anychart.waterfallModule.totals.Storage.prototype.handleEvent = function(event) {
  var tag = event['domTarget']['tag'];
  var total = tag['total'];
  var categoryIndex = tag['categoryIndex'];

  if (event.type == goog.events.EventType.MOUSEMOVE) {
    total.showTooltip(
      this.chart_,
      event['originalEvent']['clientX'],
      event['originalEvent']['clientY']);

    this.series_.hover(categoryIndex);
  } else if (event.type == goog.events.EventType.MOUSEOUT) {
    total.hideTooltip();
    this.series_.unhover();
  }
};


/**
 * Create, setup and return instance of total.
 * @param {{}} config - Configuration object for total.
 *
 * @return {anychart.waterfallModule.totals.Total}
 */
anychart.waterfallModule.totals.Storage.prototype.createTotal = function(config) {
  var total = new anychart.waterfallModule.totals.Total();
  total.suspendSignalsDispatching();
  total.setup(config);
  total.listenSignals(this.totalInvalidated, this);
  total.resumeSignalsDispatching(false);

  return total;
};

//region --- Public API
/**
 * Create instance of Total class setup it by passed config and return it.
 *
 * @param {{
 *
 * }} totalConfig - Configuration object for total
 * .
 *
 * @return {anychart.waterfallModule.totals.Total} - Total instance.
 */
anychart.waterfallModule.totals.Storage.prototype.addTotal = function(totalConfig) {
  var total = this.createTotal(totalConfig);

  this.totals_.push(total);

  this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_APPEARANCE);

  return total;
};

anychart.waterfallModule.totals.Storage.prototype.removeTotal = function(totalToRemove) {
  var indexOfTotalToRemove = goog.array.findIndex(this.totals_, function(currentTotal) {
    return currentTotal == totalToRemove;
  });

  this.removeTotalAt(indexOfTotalToRemove);
};

anychart.waterfallModule.totals.Storage.prototype.removeTotalAt = function(indexToRemove) {
  this.totals_ = goog.array.filter(this.totals_, function(_, index) {
    return index !== indexToRemove;
  });

  this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_APPEARANCE);
};

anychart.waterfallModule.totals.Storage.prototype.getTotalAt = function(index) {
  return this.totals_[index];
};

anychart.waterfallModule.totals.Storage.prototype.getAllTotals = function() {
  return goog.array.clone(this.totals_);
};


// endregion
// region --- Serialize/Deserialize
/** @inheritDoc */
anychart.waterfallModule.totals.Storage.prototype.serialize = function() {
  var json = anychart.waterfallModule.totals.Storage.base(this, 'serialize');

  json['items'] = goog.array.map(this.totals_, function(total) {
    return total.serialize();
  });

  return json;
};


/** @inheritDoc */
anychart.waterfallModule.totals.Storage.setupByJSON = function(json, opt_default) {
  var items = json['items'];
  goog.array.forEach(items, function(config) {
    this.addTotal(config);
  }, this);
};
//endregion
