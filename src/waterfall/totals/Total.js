goog.provide('anychart.waterfallModule.totals.Total');

goog.require('anychart.core.Base');
goog.require('anychart.core.settings.IObjectWithSettings');
goog.require('anychart.core.ui.LabelsFactory');

/**
 * Waterfall Total settings.
 *
 * @param {anychart.waterfallModule.Chart} chart - Chart instance.
 * @constructor
 * @extends {anychart.core.Base}
 */
anychart.waterfallModule.totals.Total = function(chart) {
  anychart.waterfallModule.totals.Total.base(this, 'constructor');
  this.chart_ = chart;
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
    [anychart.enums.PropertyHandlerType.SINGLE_ARG, 'name', anychart.core.settings.stringNormalizer],
  ]);

  return map;
})();
anychart.core.settings.populate(anychart.waterfallModule.totals.Total, anychart.waterfallModule.totals.Total.PROPERTY_DESCRIPTORS);

anychart.waterfallModule.totals.Total.prototype.SUPPORTED_SIGNALS = anychart.Signal.NEEDS_REDRAW_APPEARANCE;

/**
 * @param {Array.<Array<number>>} values - Values of points that located before total value.
 * @return {[{x: string, name: *, fill: *, stroke: *, value: *, hatchFill: string}]}
 */
anychart.waterfallModule.totals.Total.prototype.calculate = function(values) {
  var totalValue = goog.array.reduce(values, function(totalValue, rows) {
    return totalValue + goog.array.reduce(rows, function(rowValue, pointValue) {
      return rowValue + pointValue;
    }, 0);
  }, 0);

  var labelSettings = this.labels().flatten();

  return [
    {
      x: 'Total ' + this.getOption('category'),
      fill: this.getOption('fill'),
      stroke: this.getOption('stroke'),
      name: this.getOption('name'),
      hatchFill: this.getOption('hatchFill'),
      label: labelSettings,
      value: totalValue
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
anychart.waterfallModule.totals.Total.prototype.labels = function(opt_config) {
  if (!this.labelsSettings_) {
    this.labelsSettings_ = new anychart.core.ui.LabelsSettings();

    this.labelsSettings_.listenSignals(this.labelsSettingsInvalidated_, this);
    this.setupCreated('labels', this.labelsSettings_);
  }

  if (goog.isDef(opt_config)) {
    this.labelsSettings_.setup(opt_config);
    return this;
  }

  return this.labelsSettings_;
};


//region --- Serialization
anychart.waterfallModule.totals.Total.prototype.serialize = function() {
  var json = anychart.waterfallModule.totals.Total.base(this, 'serialize');

  anychart.core.settings.serialize(this, anychart.waterfallModule.totals.Total.PROPERTY_DESCRIPTORS, json);

  json['labels'] = this.labels().serialize();

  return json;
};

/**
 * @inheritDoc
 */
anychart.waterfallModule.totals.Total.prototype.setupByJSON = function(json, opt_default) {
  anychart.core.settings.deserialize(this, anychart.waterfallModule.totals.Total.PROPERTY_DESCRIPTORS, json, opt_default);
  var labelsConfig = json['labels'];
  if (goog.isDef(labelsConfig)) {
    this.labels(labelsConfig);
  }
};
//endregion
