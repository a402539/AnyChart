goog.provide('anychart.waterfallModule.Total');

goog.require('anychart.core.Base');
goog.require('anychart.core.settings.IObjectWithSettings');
goog.require('anychart.core.ui.LabelsFactory');

/**
 * Waterfall Total settings.
 *
 * @constructor
 * @extends {anychart.core.Base}
 * @implements {anychart.core.settings.IObjectWithSettings}
 */
anychart.waterfallModule.Total = function () {
    anychart.waterfallModule.Total.base(this, 'constructor');

    this.series = [];


    anychart.core.settings.createDescriptorsMeta(
        this.descriptorsMeta,
        [
            ['stroke', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE]
        ]
    );
};
goog.inherits(anychart.waterfallModule.Total, anychart.core.Base);

anychart.waterfallModule.Total.prototype.setCategory = function (category) {
    this.category_ = category;
};

anychart.waterfallModule.Total.prototype.calculate = function (values) {
    var totalValue = goog.array.reduce(values, function (totalValue, rows) {
        return totalValue + goog.array.reduce(rows, function (rowValue, pointValue) {
            return rowValue + pointValue;
        }, 0);
    }, 0)

    return [
        ['Total '+ this.category_, totalValue]
    ]
};


anychart.waterfallModule.Total.prototype.getValue = function () {
    function getTotalValue(dataSet) {
        var iterator = dataSet.getIterator();
        var value = 0;
        while (iterator.advance()) {
            value += iterator.get('value');
        }

        return value;
    }

    return goog.array.reduce(this.series, function (totalValue, dataSet) {
        return totalValue + getTotalValue(dataSet);
    }, 0)
}

anychart.waterfallModule.Total.prototype.getCategories = function () {

    return {
        target: this.category_,
        totals: [this.v]
    };
};


(function () {

})();
