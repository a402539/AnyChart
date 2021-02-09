goog.provide('anychart.waterfallModule.totals.Series');

goog.require('anychart.core.series.Cartesian');
goog.require('anychart.waterfallModule.totals.ShapeManager');

/**
 * Series that draw total points.
 *
 * @param {anychart.core.Chart} chart - Chart instance.
 * @constructor
 * @extends {anychart.core.series.Cartesian}
 */
anychart.waterfallModule.totals.Series = function(chart) {
  anychart.waterfallModule.totals.Series.base(this, 'constructor', chart, chart, 'totals', this.getSeriesConfig(), false);
  this.addThemes('waterfall.totals');

  this.zIndex(anychart.core.ChartWithSeries.ZINDEX_SERIES);
};
goog.inherits(anychart.waterfallModule.totals.Series, anychart.core.series.Cartesian);

/** @inheritDoc */
anychart.waterfallModule.totals.Series.prototype.supportsStack = function() {
  return false;
};

/** @inheritDoc */
anychart.waterfallModule.totals.Series.prototype.selectPoint = function(indexOrIndexes, opt_event) {
  // Totals is not selectable yet.
  return this;
};

/** @inheritDoc */
anychart.waterfallModule.totals.Series.prototype.getShapeManager = function() {
  return anychart.waterfallModule.totals.ShapeManager;
};

anychart.waterfallModule.totals.Series.prototype.getSeriesConfig = function() {
  var capabilities = (
    anychart.core.series.Capabilities.ALLOW_INTERACTIVITY |
    anychart.core.series.Capabilities.ALLOW_POINT_SETTINGS |
    anychart.core.series.Capabilities.SUPPORTS_LABELS);

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
};
