goog.provide('anychart.waterfallModule.TotalsSeries');

goog.require('anychart.core.series.Cartesian');

anychart.waterfallModule.TotalsSeries = function (chart) {
    anychart.waterfallModule.TotalsSeries.base(this, 'constructor', chart, chart, 'totals', this.getSeriesConfig(), false);

    this.totals_ = [];

    this.datasets_ = [];

    this.zIndex(1000);
}
goog.inherits(anychart.waterfallModule.TotalsSeries, anychart.core.series.Cartesian);

anychart.waterfallModule.TotalsSeries.prototype.supportsStack = function () {
    return false;
}

anychart.waterfallModule.TotalsSeries.prototype.getSeriesConfig = function () {
    var capabilities = (
        anychart.core.series.Capabilities.ALLOW_INTERACTIVITY |
        anychart.core.series.Capabilities.ALLOW_POINT_SETTINGS |
        anychart.core.series.Capabilities.SUPPORTS_MARKERS |
        anychart.core.series.Capabilities.SUPPORTS_LABELS | 0);

    return {
        drawerType: anychart.enums.SeriesDrawerTypes.COLUMN,
        shapeManagerType: anychart.enums.ShapeManagerTypes.PER_POINT,
        shapesConfig: [
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