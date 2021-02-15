goog.provide('anychart.waterfallModule.totals.Total');

goog.require('anychart.core.Base');
goog.require('anychart.core.settings.IObjectWithSettings');
goog.require('anychart.core.ui.LabelsSettings');
goog.require('anychart.core.ui.Tooltip');
goog.require('anychart.format.Context');
goog.require('anychart.waterfallModule.totals.TotalStateSettings');

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
    ['x', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE]
  ];
  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, meta);

  this.normal_ = new anychart.waterfallModule.totals.TotalStateSettings(this, this.descriptorsMeta, anychart.SettingsState.NORMAL);
  this.hovered_ = new anychart.waterfallModule.totals.TotalStateSettings(this, this.descriptorsMeta, anychart.SettingsState.HOVERED);

  this.setupCreated('normal', this.normal_);
  this.setupCreated('hovered', this.hovered_);
};
goog.inherits(anychart.waterfallModule.totals.Total, anychart.core.Base);


anychart.core.settings.populateAliases(anychart.waterfallModule.totals.Total, [
  'stroke',
  'name',
  'fill',
  'hatchFill',
  'label',
], 'normal');


anychart.waterfallModule.totals.Total.PROPERTY_DESCRIPTORS = (function() {
  /** @type {!Object.<string, anychart.core.settings.PropertyDescriptor>} */
  var map = {};

  anychart.core.settings.createDescriptors(map, [
    [anychart.enums.PropertyHandlerType.SINGLE_ARG, 'x', anychart.core.settings.stringNormalizer],
    [anychart.enums.PropertyHandlerType.SINGLE_ARG, 'name', anychart.core.settings.stringNormalizer]
  ]);
  return map;
})();
anychart.core.settings.populate(anychart.waterfallModule.totals.Total, anychart.waterfallModule.totals.Total.PROPERTY_DESCRIPTORS);


/**
 * Supported signals.
 * @type {number}
 */
anychart.waterfallModule.totals.Total.prototype.SUPPORTED_SIGNALS = anychart.Signal.NEEDS_REDRAW_APPEARANCE;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.waterfallModule.totals.Total.prototype.SUPPORTED_CONSISTENCY_STATES = anychart.ConsistencyState.ALL;


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

  var normal = this.normal().serialize();
  var hovered = this.hovered().serialize();

  this.modifyConfig(normal);
  this.modifyConfig(hovered);

  var name = this.getOption('name');
  var x = goog.isDef(name) ? name : 'Total ' + this.getOption('x');

  return [
    {
      'x': x,
      'normal': normal,
      'hovered': hovered,
      'value': this.value_,
      'totalInstance': this
    }
  ];
};


anychart.waterfallModule.totals.Total.prototype.normal = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.normal_.setup(opt_value);
    return this;
  }
  return this.normal_;
};


anychart.waterfallModule.totals.Total.prototype.hovered = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.hovered_.setup(opt_value);
    return this;
  }
  return this.hovered_;
};

//region -- Labels
anychart.waterfallModule.totals.Total.prototype.modifyLabelConfig = function(config) {
  if (config.position == anychart.enums.Position.AUTO) {
    config.position =
      this.value_ >= 0 ? anychart.enums.Position.CENTER_TOP : anychart.enums.Position.CENTER_BOTTOM;
  }
  if (config.anchor == anychart.enums.Anchor.AUTO) {
    config.anchor =
      this.value_ >= 0 ? anychart.enums.Anchor.CENTER_BOTTOM : anychart.enums.Anchor.CENTER_TOP;
  }

  return config;
};

anychart.waterfallModule.totals.Total.prototype.modifyConfig = function(config) {
  this.modifyLabelConfig(config['label']);
};

/**
 * Creates tooltip format provider.
 * @return {Object}
 */
anychart.waterfallModule.totals.Total.prototype.createFormatProvider = function() {
  if (!this.formatProvider_) {
    this.formatProvider_ = new anychart.format.Context();
  }

  var name = this.getOption('name');

  var context = {
    'value': {value: this.value_, type: anychart.enums.TokenType.NUMBER},
    'name': {
      value: goog.isDef(name) ? name : 'Total ' + this.getOption('x'),
      type: anychart.enums.TokenType.STRING
    },
  };

  return /** @type {anychart.format.Context} */(this.formatProvider_.propagate(context));
};


//endregion
//region --- Tooltip
anychart.waterfallModule.totals.Total.prototype.showTooltip = function(parent, x, y) {
  var tooltip = this.tooltip();
  tooltip.chart(parent);
  tooltip.parent(parent.tooltip());
  tooltip.showFloat(x, y, this.createFormatProvider());
};


/**
 * Hide tooltip.
 */
anychart.waterfallModule.totals.Total.prototype.hideTooltip = function() {
  this.tooltip().hide();
};


/**
 * Getter and setter for the tooltip.
 * @param {(Object|boolean|null)=} opt_value Tooltip settings.
 * @return {!(anychart.waterfallModule.totals.Total|anychart.core.ui.Tooltip)} Tooltip instance or itself for chaining call.
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


//endregion
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
