goog.provide('anychart.waterfallModule.totals.TotalStateSettings');
goog.require('anychart.core.StateSettings');

/**
 *
 * @constructor
 */
anychart.waterfallModule.totals.TotalStateSettings = function(stateHolder, descriptorsMeta, stateType) {
  anychart.waterfallModule.totals.TotalStateSettings.base(this, 'constructor', stateHolder, descriptorsMeta, stateType);
};
goog.inherits(anychart.waterfallModule.totals.TotalStateSettings, anychart.core.StateSettings);

/**
 * @type {!Object.<string, anychart.core.settings.PropertyDescriptor>}
 */
anychart.waterfallModule.totals.TotalStateSettings.prototype.PROPERTY_DESCRIPTORS = (function() {
  /** @type {!Object.<string, anychart.core.settings.PropertyDescriptor>} */
  var map = {};

  anychart.core.settings.createDescriptors(map, [
    anychart.core.settings.descriptors.STROKE,
    anychart.core.settings.descriptors.FILL,
    anychart.core.settings.descriptors.HATCH_FILL,
    [anychart.enums.PropertyHandlerType.SINGLE_ARG, 'x', anychart.core.settings.stringNormalizer],
    [anychart.enums.PropertyHandlerType.SINGLE_ARG, 'name', anychart.core.settings.stringNormalizer]
  ]);

  return map;
})();
anychart.core.settings.populate(
  anychart.waterfallModule.totals.TotalStateSettings,
  anychart.waterfallModule.totals.TotalStateSettings.prototype.PROPERTY_DESCRIPTORS
);


anychart.waterfallModule.totals.TotalStateSettings.prototype.labelInvalidated = function() {
  this.invalidate(anychart.ConsistencyState.ENABLED, anychart.Signal.NEEDS_REDRAW_APPEARANCE);
};

/**
 * Getter and setter for the tooltip.
 * @param {(Object|boolean|null)=} opt_config Tooltip settings.
 * @return {!(anychart.waterfallModule.totals.TotalStateSettings|anychart.core.ui.LabelsSettings)} LabelsSettings instance or itself for chaining call.
 */
anychart.waterfallModule.totals.TotalStateSettings.prototype.label = function(opt_config) {
  if (!this.labelsSettings_) {
    this.labelsSettings_ = new anychart.core.ui.LabelsSettings();

    this.labelsSettings_.listenSignals(this.labelInvalidated, this);
    this.setupCreated('label', this.labelsSettings_);
  }

  if (goog.isDef(opt_config)) {
    this.labelsSettings_.setup(opt_config);
    return this;
  }

  return this.labelsSettings_;
};

anychart.waterfallModule.totals.TotalStateSettings.prototype.serialize = function() {
  var json = {};
  anychart.core.settings.serialize(this, this.PROPERTY_DESCRIPTORS, json, 'State settings', this.descriptorsMeta);
  json['label'] = this.label().serialize();

  return json;
}
