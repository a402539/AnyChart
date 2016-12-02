goog.provide('anychart.cartesian.series.RangeBar');

goog.require('anychart.cartesian.series.BarBase');



/**
 * @param {!(anychart.data.View|anychart.data.Set|Array|string)} data Data for the series.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings
 *    here as a hash map.
 * @constructor
 * @extends {anychart.cartesian.series.BarBase}
 */
anychart.cartesian.series.RangeBar = function(data, opt_csvSettings) {
  goog.base(this, data, opt_csvSettings);

  // Define reference points for a series
  this.referenceValueNames = ['x', 'low', 'high'];
  this.referenceValueMeanings = ['x', 'y', 'y'];
  this.referenceValuesSupportStack = false;

  var tooltip = /** @type {anychart.elements.Tooltip} */(this.tooltip());
  tooltip.suspendSignalsDispatching();
  tooltip.content().useHtml(true);
  tooltip.contentFormatter(function() {
    return this['x'] + '<br>low: ' + this['low'] + '<br>high: ' + this['high'];
  });
  tooltip.resumeSignalsDispatching(false);
};
goog.inherits(anychart.cartesian.series.RangeBar, anychart.cartesian.series.BarBase);
anychart.cartesian.series.seriesTypesMap[anychart.cartesian.series.Type.RANGE_BAR] = anychart.cartesian.series.RangeBar;


/** @inheritDoc */
anychart.cartesian.series.RangeBar.prototype.drawSubsequentPoint = function() {
  var referenceValues = this.getReferenceCoords();
  if (!referenceValues)
    return false;

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    var x = referenceValues[0];
    var low = referenceValues[1];
    var high = referenceValues[2];

    /** @type {!acgraph.vector.Rect} */
    var rect = /** @type {!acgraph.vector.Rect} */(this.rootElement.genNextChild());
    var barWidth = this.getPointWidth();

    this.getIterator().meta('x', x).meta('low', low).meta('high', high).meta('shape', rect);

    rect.setY(x - barWidth / 2).setX(Math.min(low, high)).setHeight(barWidth).setWidth(Math.abs(low - high));

    this.colorizeShape(false);

    this.makeHoverable(rect);
  }


  if (this.hasInvalidationState(anychart.ConsistencyState.HATCH_FILL)) {
    var hatchFillShape = this.hatchFillRootElement ?
        /** @type {!acgraph.vector.Rect} */(this.hatchFillRootElement.genNextChild()) :
        null;
    var iterator = this.getIterator();
    iterator.meta('hatchFillShape', hatchFillShape);
    var shape = /** @type {acgraph.vector.Shape} */(iterator.meta('shape'));
    if (goog.isDef(shape) && hatchFillShape) {
      hatchFillShape.deserialize(shape.serialize());
    }

    this.applyHatchFill(false);
  }

  return true;
};


/** @inheritDoc */
anychart.cartesian.series.RangeBar.prototype.createPositionProvider = function(position) {
  var iterator = this.getIterator();
  var shape = iterator.meta('shape');
  if (shape) {
    var shapeBounds = shape.getBounds();
    return {'value': anychart.utils.getCoordinateByAnchor(shapeBounds, position)};
  } else {
    return {'value': {'x': iterator.meta('x'), 'y': iterator.meta('high')}};
  }
};


/**
 * @inheritDoc
 */
anychart.cartesian.series.RangeBar.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  json['seriesType'] = anychart.cartesian.series.Type.RANGE_BAR;
  return json;
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Statistics
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.cartesian.series.RangeBar.prototype.calculateStatistics = function() {
  this.statistics('seriesMax', -Infinity);
  this.statistics('seriesMin', Infinity);
  this.statistics('seriesSum', 0);
  this.statistics('seriesAverage', 0);
  this.statistics('seriesPointsCount', this.getIterator().getRowsCount());
};


/**
 * @inheritDoc
 */
anychart.cartesian.series.RangeBar.prototype.deserialize = function(config) {
  return goog.base(this, 'deserialize', config);
};


/**
 * Constructor function.
 * @param {!(anychart.data.View|anychart.data.Set|Array|string)} data Data for the series.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings
 *    here as a hash map.
 * @return {!anychart.cartesian.series.RangeBar}
 */
anychart.cartesian.series.rangeBar = function(data, opt_csvSettings) {
  return new anychart.cartesian.series.RangeBar(data, opt_csvSettings);
};


//exports
goog.exportSymbol('anychart.cartesian.series.rangeBar', anychart.cartesian.series.rangeBar);
anychart.cartesian.series.RangeBar.prototype['fill'] = anychart.cartesian.series.RangeBar.prototype.fill;
anychart.cartesian.series.RangeBar.prototype['hoverFill'] = anychart.cartesian.series.RangeBar.prototype.hoverFill;
anychart.cartesian.series.RangeBar.prototype['stroke'] = anychart.cartesian.series.RangeBar.prototype.stroke;
anychart.cartesian.series.RangeBar.prototype['hoverStroke'] = anychart.cartesian.series.RangeBar.prototype.hoverStroke;
anychart.cartesian.series.RangeBar.prototype['hatchFill'] = anychart.cartesian.series.RangeBar.prototype.hatchFill;
anychart.cartesian.series.RangeBar.prototype['hoverHatchFill'] = anychart.cartesian.series.RangeBar.prototype.hoverHatchFill;