goog.provide('anychart.waterfallModule.Arrow');

goog.require('anychart.core.VisualBase');
goog.require('anychart.core.ui.LabelsSettings');
goog.require('anychart.core.ui.OptimizedText');
goog.require('anychart.math.Point2D');
goog.require('anychart.math.Rect');
goog.require('anychart.waterfallModule.ArrowConnector');



/**
 * Arrow.
 *
 * @param {anychart.waterfallModule.ArrowsController} controller
 * @constructor
 * @extends {anychart.core.VisualBase}
 */
anychart.waterfallModule.Arrow = function(controller) {
  anychart.waterfallModule.Arrow.base(this, 'constructor');

  this.addThemes('waterfall.arrow');

  this.controller_ = controller;

  anychart.core.settings.createDescriptorsMeta(
      this.descriptorsMeta,
      [
        ['from', 0, anychart.Signal.NEEDS_REDRAW],
        ['to', 0, anychart.Signal.NEEDS_REDRAW]
      ]
  );

  this.connector_ = new anychart.waterfallModule.ArrowConnector();
  this.connector_.addThemes('waterfall.arrow.connector');
  this.connector_.listenSignals(this.connectorInvalidationHandler_, this);
};
goog.inherits(anychart.waterfallModule.Arrow, anychart.core.VisualBase);


/**
 * @typedef {{
  *   fromPoint: anychart.math.Point2D,
  *   toPoint: anychart.math.Point2D,
  *   horizontalY: number,
  *   isUp: boolean
  *}}
  */
anychart.waterfallModule.Arrow.DrawSettings;


/**
 * Connectors properties.
 *
 * @type {!Object.<string, anychart.core.settings.PropertyDescriptor>}
 */
anychart.waterfallModule.Arrow.OWN_DESCRIPTORS = (function() {
  /** @type {!Object.<string, anychart.core.settings.PropertyDescriptor>} */
  var map = {};

  anychart.core.settings.createDescriptors(map, [
    [anychart.enums.PropertyHandlerType.SINGLE_ARG, 'from', anychart.core.settings.asIsNormalizer],
    [anychart.enums.PropertyHandlerType.SINGLE_ARG, 'to', anychart.core.settings.asIsNormalizer]
  ]);
  return map;
})();
anychart.core.settings.populate(anychart.waterfallModule.Arrow, anychart.waterfallModule.Arrow.OWN_DESCRIPTORS);


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.waterfallModule.Arrow.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.VisualBase.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.APPEARANCE;


/**
 * Supported signals.
 *
 * @type {number}
 */
anychart.waterfallModule.Arrow.prototype.SUPPORTED_SIGNALS =
    anychart.Signal.NEEDS_REDRAW_APPEARANCE |
    anychart.Signal.NEEDS_REDRAW |
    anychart.Signal.NEEDS_REDRAW_LABELS;


/**
 * Returns arrow connector path.
 *
 * @return {acgraph.vector.Path}
 */
anychart.waterfallModule.Arrow.prototype.getArrowPath = function() {
  if (!this.arrowPath_) {
    this.arrowPath_ = this.container().path();
  }

  return this.arrowPath_;
};


/**
 * Returns arrow head path.
 *
 * @return {acgraph.vector.Path}
 */
anychart.waterfallModule.Arrow.prototype.getArrowHeadPath = function() {
  if (!goog.isDef(this.arrowHeadPath_)) {
    this.arrowHeadPath_ = this.container().path();
  }

  return this.arrowHeadPath_;
};


/**
 * Draws arrow connector and head.
 */
anychart.waterfallModule.Arrow.prototype.drawConnector = function() {
  var drawSettings = this.drawSettings();

  var path = this.getArrowPath();
  path.zIndex(anychart.waterfallModule.ArrowsController.ARROWS_ZINDEX);

  var stroke = /** @type {acgraph.vector.Stroke|string} */(this.connector().getOption('stroke'));
  var thickness = anychart.utils.extractThickness(stroke);

  var shiftedFromPoint = new anychart.math.Point2D(
      anychart.utils.applyPixelShift(drawSettings.fromPoint.x, thickness),
      anychart.utils.applyPixelShift(drawSettings.fromPoint.y, thickness)
      );

  var shiftedToPoint = new anychart.math.Point2D(
      anychart.utils.applyPixelShift(drawSettings.toPoint.x, thickness),
      anychart.utils.applyPixelShift(drawSettings.toPoint.y, thickness)
      );

  var shiftedHorizontalY = anychart.utils.applyPixelShift(drawSettings.horizontalY, thickness);

  path.stroke(stroke);

  var isVertical = this.controller_.isVertical();

  anychart.core.drawers.move(
      path,
      isVertical,
      shiftedFromPoint.x,
      shiftedFromPoint.y
  );

  anychart.core.drawers.line(
      path,
      isVertical,
      shiftedFromPoint.x,
      shiftedHorizontalY
  );

  anychart.core.drawers.line(
      path,
      isVertical,
      shiftedToPoint.x,
      shiftedHorizontalY
  );

  anychart.core.drawers.line(
      path,
      isVertical,
      shiftedToPoint.x,
      shiftedToPoint.y
  );
};


/**
 * Draws arrow head.
 */
anychart.waterfallModule.Arrow.prototype.drawHead = function() {
  var stroke = /** @type {acgraph.vector.Stroke|string} */(this.connector().getOption('stroke'));
  var thickness = anychart.utils.extractThickness(stroke);

  var drawSettings = this.drawSettings();

  var shiftedToPoint = new anychart.math.Point2D(
      anychart.utils.applyPixelShift(drawSettings.toPoint.x, thickness),
      anychart.utils.applyPixelShift(drawSettings.toPoint.y, thickness)
      );

  // Arrow head.
  var arrowHeadPath = this.getArrowHeadPath();
  var isArrowUp = drawSettings.isUp;
  var arrowHeadSize = 10;
  var arrowHeadYDelta = isArrowUp === this.controller_.normalUpDirection() ? -arrowHeadSize : arrowHeadSize;

  var isVertical = this.controller_.isVertical();

  anychart.core.drawers.move(
      arrowHeadPath,
      isVertical,
      shiftedToPoint.x,
      shiftedToPoint.y
  );
  anychart.core.drawers.line(
      arrowHeadPath,
      isVertical,
      shiftedToPoint.x - (arrowHeadSize / 2),
      shiftedToPoint.y + arrowHeadYDelta
  );
  anychart.core.drawers.line(
      arrowHeadPath,
      isVertical,
      shiftedToPoint.x + (arrowHeadSize / 2),
      shiftedToPoint.y + arrowHeadYDelta
  );
  anychart.core.drawers.line(
      arrowHeadPath,
      isVertical,
      shiftedToPoint.x,
      shiftedToPoint.y
  );

  arrowHeadPath.fill(stroke);
  arrowHeadPath.stroke('none');
};


/**
 * Returns bounds in which label is positioned.
 *
 * @return {anychart.math.Rect}
 */
anychart.waterfallModule.Arrow.prototype.getLabelParentBounds = function() {
  var drawSettings = this.drawSettings();

  if (this.controller_.isVertical()) {
    return new anychart.math.Rect(
        drawSettings.horizontalY,
        drawSettings.fromPoint.x,
        0,
        drawSettings.toPoint.x - drawSettings.fromPoint.x
    );
  } else {
    return new anychart.math.Rect(
        drawSettings.fromPoint.x,
        drawSettings.horizontalY,
        drawSettings.toPoint.x - drawSettings.fromPoint.x,
        0
    );
  }
};


/**
 * Draws arrow label.
 */
anychart.waterfallModule.Arrow.prototype.drawLabel = function() {
  var text = this.getText();

  if (this.label().enabled()) {
    text.renderTo(this.controller_.labelsLayerEl_);
  
    var labelParentBounds = this.getLabelParentBounds();
  
    text.putAt(labelParentBounds);
  
    text.finalizeComplexity();
  }
};


/**
 * Clear arrow paths and label.
 */
anychart.waterfallModule.Arrow.prototype.clear = function() {
  this.getText().renderTo(null);
  this.getArrowPath().clear();
  this.getArrowHeadPath().clear();
};


/**
 * Draws arrow.
 */
anychart.waterfallModule.Arrow.prototype.draw = function() {
  this.clear();

  if (this.enabled()) {
    this.drawConnector();
    this.drawHead();
    this.drawLabel();
  }
};


/**
 * Returns label settings.
 *
 * @param {Object=} opt_value
 * @return {anychart.core.ui.LabelsSettings|anychart.waterfallModule.Arrow}
 */
anychart.waterfallModule.Arrow.prototype.label = function(opt_value) {
  if (!this.labelsSettings_) {
    this.labelsSettings_ = new anychart.core.ui.LabelsSettings();

    this.labelsSettings_.addThemes('defaultFontSettings', 'waterfall.arrow.label');

    this.labelsSettings_.listenSignals(this.labelsSettingsInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    this.labelsSettings_.setup(opt_value);
    return this;
  }

  return this.labelsSettings_;
};


/**
 * Labels settings invalidation listener.
 *
 * @private
 */
anychart.waterfallModule.Arrow.prototype.labelsSettingsInvalidated_ = function() {
  this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_LABELS);
};


/** @inheritDoc */
anychart.waterfallModule.Arrow.prototype.setupByJSON = function(config, opt_default) {
  anychart.waterfallModule.Arrow.base(this, 'setupByJSON', config, opt_default);

  this.label().setupInternal(!!opt_default, config['label']);
  this.connector().setupInternal(!!opt_default, config['connector']);

  anychart.core.settings.deserialize(this, anychart.waterfallModule.Arrow.OWN_DESCRIPTORS, config, opt_default);
};


/** @inheritDoc */
anychart.waterfallModule.Arrow.prototype.serialize = function() {
  var json = anychart.waterfallModule.Arrow.base(this, 'serialize');
  anychart.core.settings.serialize(this, anychart.waterfallModule.Arrow.OWN_DESCRIPTORS, json, void 0, void 0, true);

  json['label'] = this.label().serialize();
  json['connector'] = this.connector().serialize();

  return json;
};


/**
 * Return optimized text.
 *
 * @return {anychart.core.ui.OptimizedText}
 */
anychart.waterfallModule.Arrow.prototype.getText = function() {
  if (!goog.isDef(this.text_)) {
    this.text_ = new anychart.core.ui.OptimizedText();
  }

  return this.text_;
};


/**
 * Arrow draw settings getter/setter.
 *
 * @param {anychart.waterfallModule.Arrow.DrawSettings=} opt_value - Draw settings.
 * @return {anychart.waterfallModule.Arrow.DrawSettings}
 */
anychart.waterfallModule.Arrow.prototype.drawSettings = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.drawSettings_ = opt_value;
  }

  return this.drawSettings_;
};


/**
 * Returns arrow connector instance.
 *
 * @return {anychart.waterfallModule.ArrowConnector}
 */
anychart.waterfallModule.Arrow.prototype.connector = function() {
  return this.connector_;
};


/**
 * Connector invalidation handler.
 */
anychart.waterfallModule.Arrow.prototype.connectorInvalidationHandler_ = function() {
  this.dispatchSignal(anychart.Signal.NEEDS_REDRAW);
};


/** @inheritDoc */
anychart.waterfallModule.Arrow.prototype.disposeInternal = function() {
  this.controller_ = null;

  goog.disposeAll(
      this.arrowPath_,
      this.arrowHeadPath_,
      this.text_,
      this.connector_
  );
  anychart.waterfallModule.Arrow.base(this, 'disposeInternal');
};


//region --- exports
/**
 * @suppress {deprecated}
 */
(function() {
  var proto = anychart.waterfallModule.Arrow.prototype;

  proto['connector'] = proto.connector;
  proto['label'] = proto.label;
})();
//endregion
