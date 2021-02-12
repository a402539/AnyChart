goog.provide('anychart.waterfallModule.totals.Total');

goog.require('anychart.core.Base');
goog.require('anychart.core.settings.IObjectWithSettings');
goog.require('anychart.core.ui.LabelsSettings');
goog.require('anychart.core.ui.Tooltip');
goog.require('anychart.format.Context');

/**
 * Waterfall Total settings.
 *
 * @constructor
 * @extends {anychart.core.Base}
 */
anychart.waterfallModule.totals.Total = function() {
  anychart.waterfallModule.totals.Total.base(this, 'constructor');
  this.addThemes('waterfall.totals');

  var meta = [
    ['stroke', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
    ['name', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
    ['fill', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
    ['hatchFill', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
    ['category', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE]
  ];
  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, meta);
};
goog.inherits(anychart.waterfallModule.totals.Total, anychart.core.Base);

anychart.waterfallModule.totals.Total.PROPERTY_DESCRIPTORS = (function() {
  /** @type {!Object.<string, anychart.core.settings.PropertyDescriptor>} */
  var map = {};

  anychart.core.settings.createDescriptors(map, [
    anychart.core.settings.descriptors.STROKE,
    anychart.core.settings.descriptors.FILL,
    anychart.core.settings.descriptors.HATCH_FILL,
    [anychart.enums.PropertyHandlerType.SINGLE_ARG, 'category', anychart.core.settings.stringNormalizer],
    [anychart.enums.PropertyHandlerType.SINGLE_ARG, 'name', anychart.core.settings.stringNormalizer]
  ]);

  return map;
})();
anychart.core.settings.populate(anychart.waterfallModule.totals.Total, anychart.waterfallModule.totals.Total.PROPERTY_DESCRIPTORS);

anychart.waterfallModule.totals.Total.prototype.SUPPORTED_SIGNALS = anychart.Signal.NEEDS_REDRAW_APPEARANCE;


/**
 * Calculate and return value for total.
 *
 * @param {Array.<Array.<number>>} values - Values of points that located before total value.
 * @return {*}
 */
anychart.waterfallModule.totals.Total.prototype.getTotalValue = function(values) {
  return goog.array.reduce(values, function(totalValue, rows) {
    return totalValue + goog.array.reduce(rows, function(rowSum, pointValue) {
      return rowSum + pointValue;
    }, 0);
  }, 0);
};


/**
 * @param {Array.<Array.<number>>} values - Values of points that located before total value.
 * @return {Array.<Object>}
 */
anychart.waterfallModule.totals.Total.prototype.calculate = function(values) {
  this.value_ = this.getTotalValue(values);

  var labelSettings = this.getLabelConfig();

  var name = this.getOption('name');
  var x = goog.isDef(name) ? name : 'Total ' + this.getOption('category');

  return [
    {
      'x': x,
      'fill': this.getOption('fill'),
      'stroke': this.getOption('stroke'),
      'hatchFill': this.getOption('hatchFill'),
      'label': labelSettings,
      'value': this.value_,
      'totalInstance': this
    }
  ];
};

/**
 *
 * @param {anychart.SignalEvent} event - Signal event.
 * @private
 */
anychart.waterfallModule.totals.Total.prototype.labelsSettingsInvalidated_ = function(event) {
  this.invalidate(anychart.ConsistencyState.AXIS_LABELS, anychart.Signal.NEEDS_REDRAW);
};

/**
 *
 * @param {Object=} opt_config
 * @return {anychart.core.ui.LabelsSettings|anychart.waterfallModule.totals.Total}
 */
anychart.waterfallModule.totals.Total.prototype.label = function(opt_config) {
  if (!this.labelsSettings_) {
    this.labelsSettings_ = new anychart.core.ui.LabelsSettings();

    this.labelsSettings_.listenSignals(this.labelsSettingsInvalidated_, this);
    this.setupCreated('label', this.labelsSettings_);
  }

  if (goog.isDef(opt_config)) {
    this.labelsSettings_.setup(opt_config);
    return this;
  }

  return this.labelsSettings_;
};

anychart.waterfallModule.totals.Total.prototype.getLabelConfig = function() {
  var labelSettings = this.label().flatten();

  if (labelSettings.position == anychart.enums.Position.AUTO) {
    labelSettings.position =
      this.value_ >= 0 ? anychart.enums.Position.CENTER_TOP : anychart.enums.Position.CENTER_BOTTOM;
  }
  if (labelSettings.anchor == anychart.enums.Anchor.AUTO) {
    labelSettings.anchor =
      this.value_ >= 0 ? anychart.enums.Anchor.CENTER_BOTTOM : anychart.enums.Anchor.CENTER_TOP;
  }

  return labelSettings;
};

anychart.waterfallModule.totals.Total.prototype.createFormatProvider = function() {
  if (!this.formatProvider_) {
    this.formatProvider_ = new anychart.format.Context();
  }

  var name = this.getOption('name');

  var context = {
    'value': {value: this.value_, type: anychart.enums.TokenType.NUMBER},
    'name': {
      value: goog.isDef(name) ? name : 'Total ' + this.getOption('category'),
      type: anychart.enums.TokenType.STRING
    },
  };

  return /** @type {anychart.format.Context} */(this.formatProvider_.propagate(context));
};

anychart.waterfallModule.totals.Total.prototype.showTooltip = function(parent, x, y) {
  var tooltip = this.tooltip();
  tooltip.chart(parent);
  tooltip.parent(parent.tooltip());
  tooltip.showFloat(x, y, this.createFormatProvider());
};

anychart.waterfallModule.totals.Total.prototype.hideTooltip = function() {
  this.tooltip().hide();
};

/**
 *
 * @param {Object=} opt_value
 * @return {anychart.waterfallModule.totals.Total|*}
 */
anychart.waterfallModule.totals.Total.prototype.tooltip = function(opt_value) {
  if (!this.tooltip_) {
    this.tooltip_ = new anychart.core.ui.Tooltip(0);
    this.tooltip_.dropThemes();
    this.setupCreated('tooltip', this.tooltip_);
  }
  if (goog.isDef(opt_value)) {
    this.tooltip_.setup(opt_value);
    return this;
  } else {
    return this.tooltip_;
  }
};

//region --- Serialization
anychart.waterfallModule.totals.Total.prototype.serialize = function() {
  var json = anychart.waterfallModule.totals.Total.base(this, 'serialize');

  anychart.core.settings.serialize(this, anychart.waterfallModule.totals.Total.PROPERTY_DESCRIPTORS, json);

  json['label'] = this.label().serialize();

  return json;
};

/**
 * @inheritDoc
 */
anychart.waterfallModule.totals.Total.prototype.setupByJSON = function(json, opt_default) {
  anychart.core.settings.deserialize(this, anychart.waterfallModule.totals.Total.PROPERTY_DESCRIPTORS, json, opt_default);
  var labelsConfig = json['label'];
  if (goog.isDef(labelsConfig)) {
    this.label(labelsConfig);
  }
};
//endregion
