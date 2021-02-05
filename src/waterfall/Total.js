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

    var meta = [
        ['stroke', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
        ['fill', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
        ['category', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE]
    ]
    anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, meta);
};
goog.inherits(anychart.waterfallModule.Total, anychart.core.Base);

anychart.waterfallModule.Total.PROPERTY_DESCRIPTORS = (function() {
    /** @type {!Object.<string, anychart.core.settings.PropertyDescriptor>} */
    var map = {};

    anychart.core.settings.createDescriptors(map, [
        anychart.core.settings.descriptors.STROKE,
        anychart.core.settings.descriptors.FILL,
        [anychart.enums.PropertyHandlerType.SINGLE_ARG, 'category', anychart.core.settings.stringNormalizer],
    ]);

    return map;
})();
anychart.core.settings.populate(anychart.waterfallModule.Total, anychart.waterfallModule.Total.PROPERTY_DESCRIPTORS);

anychart.waterfallModule.Total.prototype.SUPPORTED_SIGNALS = anychart.Signal.NEEDS_REDRAW_APPEARANCE;


anychart.waterfallModule.Total.prototype.calculate = function (values) {
    var totalValue = goog.array.reduce(values, function (totalValue, rows) {
        return totalValue + goog.array.reduce(rows, function (rowValue, pointValue) {
            return rowValue + pointValue;
        }, 0);
    }, 0)

    return [
        {x: 'Total ' + this.getOption('category'), value: totalValue}
    ]
};

/**
 * @inheritDoc
 */
anychart.waterfallModule.Total.prototype.setupByJSON = function(json, opt_default) {
    anychart.core.settings.deserialize(this, anychart.waterfallModule.Total.PROPERTY_DESCRIPTORS, json, opt_default);
};

