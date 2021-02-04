goog.provide('anychart.waterfallModule.TotalsStorage');

goog.require('anychart.scales.Ordinal');
goog.require('anychart.core.series.Cartesian');


/**
 * @constructor
 */
anychart.waterfallModule.TotalsStorage = function (chart) {
    this.chart_ = chart;
    this.series_ = new anychart.core.series.Cartesian(chart, chart, 'totals', this.getSeriesConfig(), false);
    this.totals_ = [];

    this.datasets_ = [];

}

anychart.waterfallModule.TotalsStorage.prototype.getSeries = function () {
    return this.series_;
}

/**
 *
 * @param {anychart.waterfallModule.Total} total
 */
anychart.waterfallModule.TotalsStorage.prototype.addTotal = function (total) {
    this.totals_.push(total);
}

anychart.waterfallModule.TotalsStorage.prototype.calculateTotalValue = function (dataset, total) {
    var category = total.getCategories();

    var iterator = dataset.getIterator()
    var totalValue = 0
    while (iterator.advance()) {
        var x = iterator.get('x');
        var value = iterator.get('value') || 0;

        totalValue += value;

        if (x == category.target) {
            break;
        }
    }

    return totalValue;
}


anychart.waterfallModule.TotalsStorage.prototype.prepareData = function (datasets) {
    const data = {};
    goog.array.forEach(this.datasets_, function (dataset, index) {
        var iterator = dataset.getIterator();
        while (iterator.advance()) {
            var x = iterator.get('x');
            console.log(x)
            var value = iterator.get('value');
            if (!data[x]) {
                data[x] = []
            }
            data[x].push(value);
        }
        goog.object.forEach(data, function (value) {
            var desiredLength = index + 1;
            if (desiredLength > value.length) {
                value.push(0);
            }
        })
    });

    return {
        categories: goog.object.getKeys(data),
        values: goog.object.getValues(data)
    };
}

anychart.waterfallModule.TotalsStorage.prototype.updateData = function (data) {
    this.data_.data(data)
}

anychart.waterfallModule.TotalsStorage.prototype.populateByTotal = function (data) {

}

anychart.waterfallModule.TotalsStorage.prototype.populateByTotal = function (data) {

}

anychart.waterfallModule.TotalsStorage.prototype.populateByTotals = function (data) {
    var categories = data.categories;
    var values = data.values;

    var finalValues = goog.array.map(categories, function (category) {
        return [category, 0]
    });

    var visibleTotals = goog.array.filter(this.totals_, function (total) {
        return goog.array.contains(categories, total.category_);
    });

    var categoriesToAdd = goog.array.map(visibleTotals, function (total) {
        var index = categories.indexOf(total.category_);
        var valuesForTotal = goog.array.slice(values, 0, index + 1);
        return {
            target: total.category_,
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
}

anychart.waterfallModule.TotalsStorage.prototype.calculate = function () {
    debugger
    var data = this.prepareData();
    var seriesData = this.populateByTotals(data);

    this.series_.data(seriesData)
    // goog.array.forEach(this.totals_, function (total) {
    //     goog.array.forEach(this.datasets_, function (dataset) {
    //         var iterator = dataset.getIterator();
    //
    //     })
    // })

    // var categories = this.categories;
    //
    // goog.array.forEach(this.totals, function (total) {
    //     var totalCategories = total.getCategories();
    //     var totalTargetCategory = totalCategories.target;
    //
    //     if (goog.array.contains(categories, totalTargetCategory)) {
    //         var index = goog.array.findIndex(categories, function (category) {
    //             return category == totalTargetCategory;
    //         });
    //
    //         goog.array.insertArrayAt(categories, totalCategories.totals, index + 1);
    //     }
    // });

    ///this.xScale.values(categories);
    // return categories;
}

anychart.waterfallModule.TotalsStorage.prototype.draw = function () {
    this.series_.draw();
}

anychart.waterfallModule.TotalsStorage.prototype.getSeriesConfig = function () {
    var capabilities = (
        anychart.core.series.Capabilities.ALLOW_INTERACTIVITY |
        anychart.core.series.Capabilities.ALLOW_POINT_SETTINGS |
        // anychart.core.series.Capabilities.ALLOW_ERROR |
        anychart.core.series.Capabilities.SUPPORTS_MARKERS |
        anychart.core.series.Capabilities.SUPPORTS_LABELS | 0);

    return {
        drawerType: anychart.enums.SeriesDrawerTypes.WATERFALL,
        shapeManagerType: anychart.enums.ShapeManagerTypes.PER_POINT,
        shapesConfig: [
            anychart.core.shapeManagers.pathRisingFillStrokeConfig,
            anychart.core.shapeManagers.pathRisingHatchConfig,
            anychart.core.shapeManagers.pathFallingFillStrokeConfig,
            anychart.core.shapeManagers.pathFallingHatchConfig,
            anychart.core.shapeManagers.pathFillStrokeConfig,
            anychart.core.shapeManagers.pathHatchConfig
        ],
        secondaryShapesConfig: null,
        postProcessor: null,
        capabilities: capabilities,
        anchoredPositionTop: 'value',
        anchoredPositionBottom: 'zero'
    };
}

anychart.waterfallModule.TotalsStorage.prototype.setDatasets = function (datasets) {
    this.datasets_ = datasets;
}

anychart.waterfallModule.TotalsStorage.prototype.setCategories = function (categories) {
    this.categories = goog.array.clone(categories);
}