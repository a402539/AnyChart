goog.provide('anychart.waterfallModule.Arrow');

goog.require('anychart.core.VisualBase');
goog.require('anychart.core.ui.LabelsSettings');
goog.require('anychart.core.ui.OptimizedText');
goog.require('anychart.math.Rect');
goog.require('anychart.waterfallModule.ArrowConnector');


/**
 * Arrow 
 * @constructor
 * @extends {anychart.core.VisualBase}
 */
anychart.waterfallModule.Arrow = function(manager) {
  anychart.waterfallModule.Arrow.base(this, 'constructor');

  this.addThemes('waterfall.arrow');

  this.arrowsManager_ = manager;

  anychart.core.settings.createDescriptorsMeta(
    this.descriptorsMeta,
    [
      // ['stroke', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
      ['from', 0, anychart.Signal.NEEDS_REDRAW],
      ['to', 0, anychart.Signal.NEEDS_REDRAW]
    ]
  );

  // TODO: handle stroke
  this.connector_ = new anychart.waterfallModule.ArrowConnector();
  this.connector_.addThemes('waterfall.arrow.connector');
};
goog.inherits(anychart.waterfallModule.Arrow, anychart.core.VisualBase);


/**
 * @typedef {{
  *   fromPoint: anychart.math.Point2D,
  *   toPoint: anychart.math.Point2D,
  *   horizontalY: number,
  *   isCorrect: boolean,
  *   isUp: boolean
  * }}
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
    // [anychart.enums.PropertyHandlerType.MULTI_ARG, 'stroke', anychart.core.settings.strokeNormalizer],
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
 *
 * @param {anychart.waterfallModule.Arrow.DrawSettings} settings 
 */
anychart.waterfallModule.Arrow.prototype.drawConnector = function(settings) {
  var path = this.getArrowPath();
  path.zIndex(anychart.waterfallModule.ArrowsController.ARROWS_ZINDEX);

  var stroke = this.connector().getOption('stroke');
  var thickness = anychart.utils.extractThickness(stroke);

  var shiftedFromPoint = new anychart.math.Point2D(
    anychart.utils.applyPixelShift(settings.fromPoint.x, thickness),
    anychart.utils.applyPixelShift(settings.fromPoint.y, thickness)
  );

  var shiftedToPoint = new anychart.math.Point2D(
    anychart.utils.applyPixelShift(settings.toPoint.x, thickness),
    anychart.utils.applyPixelShift(settings.toPoint.y, thickness)
  );

  var shiftedHorizontalY = anychart.utils.applyPixelShift(settings.horizontalY, thickness);

  path.stroke(stroke);
  path.moveTo(
    shiftedFromPoint.x,
    shiftedFromPoint.y
  );
  path.lineTo(
    shiftedFromPoint.x,
    shiftedHorizontalY
  );
  path.lineTo(
    shiftedToPoint.x,
    shiftedHorizontalY
  );
  path.lineTo(
    shiftedToPoint.x,
    shiftedToPoint.y
  );

  // Arrow head.
  var arrowHeadPath = this.getArrowHeadPath();
  var isArrowUp = settings.isUp;
  var arrowHeadSize = 10;
  var arrowHeadYDelta = isArrowUp ? -arrowHeadSize : arrowHeadSize;
  arrowHeadPath.moveTo(
    shiftedToPoint.x,
    shiftedToPoint.y
  );
  arrowHeadPath.lineTo(
    shiftedToPoint.x - (arrowHeadSize / 2),
    shiftedToPoint.y + arrowHeadYDelta
  );
  arrowHeadPath.lineTo(
    shiftedToPoint.x + (arrowHeadSize / 2),
    shiftedToPoint.y + arrowHeadYDelta
  );
  arrowHeadPath.lineTo(
    shiftedToPoint.x,
    shiftedToPoint.y
  );
  arrowHeadPath.fill(stroke);
  arrowHeadPath.stroke('none');
};


/**
 * Draws arrow label.
 *
 * @param {anychart.waterfallModule.Arrow.DrawSettings} settings - Draw settings.
 */
anychart.waterfallModule.Arrow.prototype.drawLabel = function(settings) {
  var text = this.getText();
  text.renderTo(this.arrowsManager_.labelsLayerEl_);
  text.putAt(
    new anychart.math.Rect(
      settings.fromPoint.x,
      settings.horizontalY,
      settings.toPoint.x - settings.fromPoint.x,
      0
    )
  );
  text.finalizeComplexity();
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
 *
 * @param {anychart.waterfallModule.Arrow.DrawSettings} settings - Draw settings.
 */
anychart.waterfallModule.Arrow.prototype.draw = function(settings) {
  this.clear();

  if (settings.isCorrect) {
    this.drawConnector(settings);
    this.drawLabel(settings);
  }
};


/**
 * Returns label settings.
 *
 * @param {Object=} opt_value
 * @return {anychart.core.ui.LabelsSettings}
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
 * Returns arrow connector instance.
 *
 * @return {anychart.waterfallModule.ArrowConnector}
 */
anychart.waterfallModule.Arrow.prototype.connector = function() {
  return this.connector_;
};


/** @inheritDoc */
anychart.waterfallModule.Arrow.prototype.disposeInternal = function() {
  this.arrowsManager_ = null;

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
