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
};
goog.inherits(anychart.waterfallModule.Arrow, anychart.core.VisualBase);


/**
 * @typedef {{
  *   fromPoint: anychart.math.Point2D,
  *   toPoint: anychart.math.Point2D,
  *   horizontalY: number,
  *   isCorrect: boolean
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


anychart.waterfallModule.Arrow.prototype.getArrowPath = function() {
  if (!this.arrowPath_) {
    this.arrowPath_ = this.container().path();
  }

  return this.arrowPath_;
};


anychart.waterfallModule.Arrow.prototype.drawConnector = function(settings) {
  var path = this.getArrowPath();
  path.clear();
  path.zIndex(anychart.waterfallModule.ArrowsManager.ARROWS_ZINDEX);

  var stroke = this.connector().getOption('stroke');

  path.stroke(stroke);
  path.moveTo(
    settings.startPoint.x,
    settings.startPoint.y
  );
  path.lineTo(
    settings.startPoint.x,
    settings.horizontalLineY
  );
  path.lineTo(
    settings.endPoint.x,
    settings.horizontalLineY
  );
  path.lineTo(
    settings.endPoint.x,
    settings.endPoint.y
  );

  // Arrow head.
  var isArrowUp = (settings.startPoint.y - settings.horizontalLineY) >= 0;
  var arrowHeadYDelta = isArrowUp ? -10 : 10;
  path.lineTo(
    settings.endPoint.x - 5,
    settings.endPoint.y + arrowHeadYDelta
  );
  path.lineTo(
    settings.endPoint.x + 5,
    settings.endPoint.y + arrowHeadYDelta
  );
  path.lineTo(
    settings.endPoint.x,
    settings.endPoint.y
  );
};


anychart.waterfallModule.Arrow.prototype.drawLabel = function(settings) {
  var text = this.getText();
  text.renderTo(this.arrowsManager_.labelsLayerEl_);
  text.putAt(
    new anychart.math.Rect(
      settings.startPoint.x,
      settings.horizontalLineY,
      settings.endPoint.x - settings.startPoint.x,
      0
    )
  );
  text.finalizeComplexity();
};


anychart.waterfallModule.Arrow.prototype.draw = function(settings) {
  this.drawConnector(settings);
  this.drawLabel(settings);
};


anychart.waterfallModule.Arrow.prototype.clear = function() {
  this.getText().renderTo(null);
  this.getArrowPath().clear();
};


/**
 * 
 * @param {Object=} opt_value 
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

  anychart.core.settings.deserialize(this, anychart.waterfallModule.Arrow.OWN_DESCRIPTORS, config, opt_default);
};


/** @inheritDoc */
anychart.waterfallModule.Arrow.prototype.serialize = function() {
  var json = anychart.waterfallModule.Arrow.base(this, 'serialize');
  anychart.core.settings.serialize(this, anychart.waterfallModule.Arrow.OWN_DESCRIPTORS, json, void 0, void 0, true);

  json['label'] = this.label().serialize();

  return json;
};


anychart.waterfallModule.Arrow.prototype.getText = function() {
  if (!goog.isDef(this.text_)) {
    this.text_ = new anychart.core.ui.OptimizedText();
  }

  return this.text_;
};


anychart.waterfallModule.Arrow.prototype.connector = function() {
  return this.connector_;
};


/** @inheritDoc */
anychart.waterfallModule.Arrow.prototype.disposeInternal = function() {
  this.arrowsManager_ = null;

  goog.disposeAll(
    this.arrowPath_,
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
