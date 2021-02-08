goog.provide('anychart.waterfallModule.totals.Storage');

goog.require('anychart.core.Base');
goog.require('anychart.scales.Ordinal');
goog.require('anychart.waterfallModule.totals.Series');
goog.require('anychart.waterfallModule.totals.Total');


/**
 * @constructor
 * @extends {anychart.core.Base}
 */
anychart.waterfallModule.totals.Storage = function(chart) {
  anychart.waterfallModule.totals.Storage.base(this, 'constructor');
  this.chart_ = chart;

  this.series_ = new anychart.waterfallModule.totals.Series(chart);

  this.totals_ = [];
  this.datasets_ = [];

  this.setupSeries();
};
goog.inherits(anychart.waterfallModule.totals.Storage, anychart.core.Base);

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

anychart.waterfallModule.totals.Storage.prototype.prepareData = function() {
  var data = {};
  goog.array.forEach(this.datasets_, function(dataset) {
    var iterator = dataset.getIterator();
    while (iterator.advance()) {
      var x = iterator.get('x');
      var value = iterator.get('value');

      if (!data[x]) {
        data[x] = [];
      }

      data[x].push(value);
    }
  });

  return {
    categories: goog.object.getKeys(data),
    values: goog.object.getValues(data)
  };
};

anychart.waterfallModule.totals.Storage.prototype.populateByTotal = function(data) {

};


anychart.waterfallModule.totals.Storage.prototype.populateByTotals = function(data) {
  var categories = data.categories;
  var values = data.values;

  var finalValues = goog.array.map(categories, function(category) {
    return [category];
  });

  var visibleTotals = goog.array.filter(this.totals_, function(total) {
    return goog.array.contains(categories, total.getOption('category'));
  });

  var categoriesToAdd = goog.array.map(visibleTotals, function(total) {
    var index = categories.indexOf(total.getOption('category'));
    var valuesForTotal = goog.array.slice(values, 0, index + 1);
    return {
      target: total.getOption('category'),
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

anychart.waterfallModule.totals.Storage.prototype.calculate = function() {
  var data = this.prepareData();
  var seriesData = this.populateByTotals(data);

  this.series_.data(seriesData);
};

anychart.waterfallModule.totals.Storage.prototype.draw = function() {
  this.series_.container(this.chart_.rootElement);
  this.series_.parentBounds(this.chart_.dataBounds);
  this.series_.draw();
};

anychart.waterfallModule.totals.Storage.prototype.setDatasets = function(datasets) {
  this.datasets_ = datasets;
};

anychart.waterfallModule.totals.Storage.prototype.setCategories = function(categories) {
  this.categories = goog.array.clone(categories);
};

anychart.waterfallModule.totals.Storage.prototype.totalInvalidated = function() {
  console.log('signal from total');
  this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_APPEARANCE);
};

anychart.waterfallModule.totals.Storage.prototype.setupSeries = function() {
  this.series_.setParentEventTarget(this.chart_);
};

//region --- Public API

anychart.waterfallModule.totals.Storage.prototype.createTotal = function(config) {
  var total = new anychart.waterfallModule.totals.Total();
  total.suspendSignalsDispatching();
  total.setup(config);
  total.listenSignals(this.totalInvalidated, this);
  total.resumeSignalsDispatching(false);

  return total;
};


/**
 * Create instance of Total class setup it by passed config and return it.
 *
 * @param {{
 *
 * }} totalConfig - Configuration object for total.
 *
 * @return {anychart.waterfallModule.totals.Total} - Total instance.
 */
anychart.waterfallModule.totals.Storage.prototype.addTotal = function(totalConfig) {
  var alreadyAdded = goog.array.find(this.totals_, function(total) {
    return total.getOption('category') == totalConfig.category;
  });

  if (alreadyAdded) {
    return alreadyAdded;
  }

  var total = this.createTotal(totalConfig);

  this.totals_.push(total);

  this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_APPEARANCE);

  return total;
};

anychart.waterfallModule.totals.Storage.prototype.removeTotal = function(totalToRemove) {
  var indexOfTotalToRemove = goog.array.findIndex(this.totals_, function(currentTotal) {
    return currentTotal != totalToRemove;
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
//endregion


anychart.waterfallModule.totals.Storage.prototype.serialize = function() {
  var json = anychart.waterfallModule.totals.Storage.base(this, 'serialize');

  json['totals'] = goog.array.map(this.totals_, function(total) {
    return total.serialize();
  });

  return json;
}
