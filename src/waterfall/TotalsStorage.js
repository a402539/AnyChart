goog.provide('anychart.waterfallModule.TotalsStorage');

goog.require('anychart.core.Base');
goog.require('anychart.scales.Ordinal');
goog.require('anychart.waterfallModule.TotalsSeries');


/**
 * @constructor
 */
anychart.waterfallModule.TotalsStorage = function (chart) {
    anychart.waterfallModule.TotalsStorage.base(this, 'constructor');
    this.chart_ = chart;

    this.series_ = new anychart.waterfallModule.TotalsSeries(chart);

    this.totals_ = [];
    this.datasets_ = [];
};
goog.inherits(anychart.waterfallModule.TotalsStorage, anychart.core.Base);

anychart.waterfallModule.TotalsStorage.prototype.SUPPORTED_SIGNALS = anychart.Signal.NEEDS_REDRAW_APPEARANCE;

/**
 * States that totals storage supports.
 *
 * @enum {string}
 */
anychart.waterfallModule.TotalsStorage.SUPPORTED_STATES = {
    TOTALS: 'totals'
};

anychart.waterfallModule.TotalsStorage.CONSISTENCY_STORAGE_NAME = 'waterfallTotalsStorage';

anychart.consistency.supportStates(
    anychart.waterfallModule.TotalsStorage,
    anychart.waterfallModule.TotalsStorage.CONSISTENCY_STORAGE_NAME,
    [
        anychart.waterfallModule.TotalsStorage.SUPPORTED_STATES.TOTALS
    ]
);

anychart.waterfallModule.TotalsStorage.prototype.getSeries = function () {
    return this.series_;
};

anychart.waterfallModule.TotalsStorage.prototype.prepareData = function (datasets) {
    var data = {};
    goog.array.forEach(this.datasets_, function (dataset) {
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

anychart.waterfallModule.TotalsStorage.prototype.populateByTotal = function (data) {

}


anychart.waterfallModule.TotalsStorage.prototype.populateByTotals = function (data) {
    var categories = data.categories;
    var values = data.values;

    var finalValues = goog.array.map(categories, function (category) {
        return [category]
    });

    var visibleTotals = goog.array.filter(this.totals_, function (total) {
        return goog.array.contains(categories, total.getOption('category'));
    });

    var categoriesToAdd = goog.array.map(visibleTotals, function (total) {
        var index = categories.indexOf(total.getOption('category'));
        var valuesForTotal = goog.array.slice(values, 0, index + 1);
        return {
            target: total.getOption('category'),
            categories: total.calculate(valuesForTotal)
        };
    });

    goog.array.forEach(categoriesToAdd, function (totalData) {
        var index = goog.array.findIndex(finalValues, function (pointData) {
            var category = pointData[0];
            return category == totalData.target;
        });

        goog.array.insertArrayAt(finalValues, totalData.categories, index + 1)
    });

    return finalValues;
};

anychart.waterfallModule.TotalsStorage.prototype.calculate = function () {
    var data = this.prepareData();
    var seriesData = this.populateByTotals(data);

    this.series_.data(seriesData);
}

anychart.waterfallModule.TotalsStorage.prototype.draw = function () {
    this.series_.container(this.chart_.rootElement);

    this.series_.draw();
};

anychart.waterfallModule.TotalsStorage.prototype.setDatasets = function (datasets) {
    this.datasets_ = datasets;
};

anychart.waterfallModule.TotalsStorage.prototype.setCategories = function (categories) {
    this.categories = goog.array.clone(categories);
}

anychart.waterfallModule.TotalsStorage.prototype.totalInvalidated = function () {
    console.log('signal from total');
    this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_APPEARANCE);
}

//region --- Public API
anychart.waterfallModule.TotalsStorage.prototype.addTotal = function (totalConfig) {
    var alreadyAdded = goog.array.find(this.totals_, function (total) {
        return total.getOption('category') == totalConfig.category;
    });

    if (alreadyAdded) {
        return alreadyAdded;
    }

    var total = new anychart.waterfallModule.Total();
    total.setup(totalConfig);

    total.listenSignals(this.totalInvalidated, this);

    this.totals_.push(total);

    this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_APPEARANCE);

    return total
};

anychart.waterfallModule.TotalsStorage.prototype.removeTotal = function (totalToRemove) {
    var indexOfTotalToRemove = goog.array.findIndex(this.totals_, function (currentTotal) {
        return currentTotal != totalToRemove;
    });

    this.removeTotalAt(indexOfTotalToRemove);
};

anychart.waterfallModule.TotalsStorage.prototype.removeTotalAt = function (indexToRemove) {
    this.totals_ = goog.array.filter(this.totals_, function (_, index) {
        return index !== indexToRemove;
    });

    this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_APPEARANCE);
};

anychart.waterfallModule.TotalsStorage.prototype.getTotalAt = function (index) {
    return this.totals_[index];
};

anychart.waterfallModule.TotalsStorage.prototype.getAllTotals = function () {
    return goog.array.clone(this.totals_);
};
//endregion