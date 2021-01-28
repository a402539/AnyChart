goog.provide('anychart.waterfallModule.Arrow');


/**
 * Arrow 
 * @constructor
 * @extends {anychart.core.Base}
 */
anychart.waterfallModule.Arrow = function() {
  anychart.waterfallModule.Arrow.base(this, 'constructor');

  anychart.core.settings.createDescriptorsMeta(
    this.descriptorsMeta,
    [
      ['stroke', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
      ['from', 0, anychart.Signal.NEEDS_REDRAW],
      ['to', 0, anychart.Signal.NEEDS_REDRAW]
    ]
);
};
goog.inherits(anychart.waterfallModule.Arrow, anychart.core.Base);


/**
 * Connectors properties.
 *
 * @type {!Object.<string, anychart.core.settings.PropertyDescriptor>}
 */
anychart.waterfallModule.Arrow.OWN_DESCRIPTORS = (function() {
  /** @type {!Object.<string, anychart.core.settings.PropertyDescriptor>} */
  var map = {};

  anychart.core.settings.createDescriptors(map, [
    [anychart.enums.PropertyHandlerType.MULTI_ARG, 'stroke', anychart.core.settings.strokeNormalizer],
    [anychart.enums.PropertyHandlerType.SINGLE_ARG, 'from', anychart.core.settings.asIsNormalizer],
    [anychart.enums.PropertyHandlerType.SINGLE_ARG, 'to', anychart.core.settings.asIsNormalizer]
  ]);
  return map;
})();
anychart.core.settings.populate(anychart.waterfallModule.Arrow, anychart.waterfallModule.Arrow.OWN_DESCRIPTORS);


/**
 * Supported signals.
 *
 * @type {number}
 */
anychart.waterfallModule.Arrow.prototype.SUPPORTED_SIGNALS =
    anychart.Signal.NEEDS_REDRAW_APPEARANCE |
    anychart.Signal.NEEDS_REDRAW |
    anychart.Signal.NEEDS_REDRAW_LABELS;


anychart.waterfallModule.Arrow.prototype.draw = function(settings, layer) {
  if (!this.arrowPath_) {
    this.arrowPath_ = layer.path();
  }

  var path = this.arrowPath_;
  path.clear();
  path.zIndex(9000);

  var stroke = this.getOption('stroke');
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
};


anychart.waterfallModule.Arrow.prototype.label = function(opt_value) {
  if (!this.labels_) {
    this.labels_ = new anychart.core.ui.LabelsFactory();
    this.setupCreated('labels', this.labels_);
    this.labels_.listenSignals(this.labelsInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.labels_.setup(opt_value);
    return this;
  }

  return this.labels_;
};


/**
 * Labels invalidation listener.
 *
 * @private
 */
anychart.waterfallModule.Arrow.prototype.labelsInvalidated_ = function() {
  this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_LABELS);
};


/** @inheritDoc */
anychart.waterfallModule.Arrow.prototype.setupByJSON = function(config, opt_default) {
  anychart.waterfallModule.Arrow.base(this, 'setupByJSON', config, opt_default);

  this.label().setupInternal(!!opt_default, config['label']);

  anychart.core.settings.deserialize(this, anychart.waterfallModule.Arrow.OWN_DESCRIPTORS, config, opt_default);
};
