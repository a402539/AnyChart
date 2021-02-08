goog.provide('anychart.waterfallModule.totals.Series');

goog.require('anychart.core.series.Cartesian');

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

  this.zIndex(1000);
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

anychart.waterfallModule.totals.Series.prototype.getSeriesConfig = function() {
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
};
