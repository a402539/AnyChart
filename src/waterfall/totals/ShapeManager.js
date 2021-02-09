goog.provide('anychart.waterfallModule.totals.ShapeManager');
goog.require('anychart.core.shapeManagers.PerPoint');



/**
 * Series paths manager.
 * @param {anychart.core.IShapeManagerUser} series
 * @param {!Array.<anychart.core.shapeManagers.ShapeConfig>} config
 * @param {boolean} interactive
 * @param {?string=} opt_shapesFieldName
 * @param {?function(anychart.core.IShapeManagerUser, Object.<string, acgraph.vector.Shape>, number)=} opt_postProcessor
 * @param {boolean=} opt_disableStrokeScaling
 * @constructor
 * @extends {anychart.core.shapeManagers.PerPoint}
 */
anychart.waterfallModule.totals.ShapeManager = function(series, config, interactive, opt_shapesFieldName, opt_postProcessor, opt_disableStrokeScaling) {
  anychart.waterfallModule.totals.ShapeManager.base(this, 'constructor', series, config, interactive, opt_shapesFieldName, opt_postProcessor, opt_disableStrokeScaling);
};
goog.inherits(anychart.waterfallModule.totals.ShapeManager, anychart.core.shapeManagers.PerPoint);


anychart.waterfallModule.totals.ShapeManager.prototype.setupInteractivity = function(shape, nonInteractive, indexOrGlobal) {
  debugger;
  shape.tag = {
    index: indexOrGlobal
  };
}
