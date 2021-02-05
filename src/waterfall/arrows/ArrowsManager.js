goog.provide('anychart.waterfallModule.ArrowsManager');

goog.require('anychart.waterfallModule.Arrow');


/**
 * 
 * @constructor
 * @extends {anychart.core.Base}
 * @implements {anychart.reflow.IMeasurementsTargetProvider}
 * @param {anychart.waterfallModule.Chart} chart 
 */
anychart.waterfallModule.ArrowsManager = function(chart) {
  anychart.waterfallModule.ArrowsManager.base(this, 'constructor');

  this.chart_ = chart;

  this.arrows_ = [];

  this.arrowsLayer_ = null;

  anychart.measuriator.register(this);
};
goog.inherits(anychart.waterfallModule.ArrowsManager, anychart.core.Base);

anychart.waterfallModule.ArrowsManager.prototype.SUPPORTED_SIGNALS = 
  anychart.core.Base.prototype.SUPPORTED_SIGNALS |
  anychart.Signal.NEEDS_REDRAW |
  anychart.Signal.MEASURE_COLLECT | //Signal for Measuriator to collect labels to measure.
  anychart.Signal.MEASURE_BOUNDS; //Signal for Measuriator to measure the bounds of collected labels.


anychart.waterfallModule.ArrowsManager.ARROWS_ZINDEX = 30;


anychart.waterfallModule.ArrowsManager.prototype.getArrowStackBounds_ = function(arrow) {
  var chart = this.chart_;
  var xScale = chart.xScale();

  var from = arrow.getOption('from');
  var to = arrow.getOption('to');

  var fromStackIndex = xScale.getIndexByValue(from);
  var toStackIndex = xScale.getIndexByValue(to);

  var fromStackBounds = anychart.utils.isNaN(fromStackIndex) ? null : chart.getStackBounds(fromStackIndex);
  var toStackBounds = anychart.utils.isNaN(toStackIndex) ? null : chart.getStackBounds(toStackIndex);

  return {
    from: fromStackBounds,
    to: toStackBounds
  }
};


anychart.waterfallModule.ArrowsManager.prototype.getArrowDrawInfo_ = function(arrow) {
  var settings = {};
  var heightCache = this.heightCache_;
  var isArrowUp = this.isArrowUp_(arrow);
  var stacksBounds = this.getArrowStackBounds_(arrow);

  if (goog.isNull(stacksBounds.from) || goog.isNull(stacksBounds.to)) {
    settings.isCorrect = false;
    return settings
  }

  settings.isCorrect = true;

  var fromStackBounds = stacksBounds.from;
  var toStackBounds = stacksBounds.to;

  var arrowStartPoint = new anychart.math.Point2D(
    fromStackBounds.left + fromStackBounds.width / 2,
    isArrowUp ? fromStackBounds.getTop() : fromStackBounds.getBottom()
  );

  var arrowEndPoint = new anychart.math.Point2D(
    toStackBounds.left + toStackBounds.width / 2,
    isArrowUp ? toStackBounds.getTop() : toStackBounds.getBottom()
  )

  settings.startPoint = arrowStartPoint;
  settings.endPoint = arrowEndPoint;

  var arrowGap = 20;
  settings.horizontalLineY = isArrowUp ?
      Math.min(fromStackBounds.getTop(), toStackBounds.getTop()) - arrowGap :
      Math.max(fromStackBounds.getBottom(), toStackBounds.getBottom()) + arrowGap;

  if (!goog.isDef(heightCache[arrow.from()])) {
    heightCache[arrow.from()] = settings.horizontalLineY;
  } else {
    settings.horizontalLineY = heightCache[arrow.from()] + (isArrowUp ? -arrowGap : arrowGap);
    heightCache[arrow.from()] = settings.horizontalLineY;
  }

  return settings;
};


anychart.waterfallModule.ArrowsManager.prototype.isArrowUp_ = function(arrow) {
  var chart = this.chart_;
  var xScale = chart.xScale();
  var from = arrow.getOption('from');
  var fromStackIndex = xScale.getIndexByValue(from);
  var fromStackDirection = chart.getStackSum(fromStackIndex, 'diff');
  return fromStackDirection >= 0;
};


anychart.waterfallModule.ArrowsManager.prototype.calculateArrows_ = function() {
  /**
   * Stores arrows precalculated values.
   * I.e. arrow start point, arrow end point, arrow horizontal line y value.
   *
   * @type {Array.<{{from: string, to: string, startPoint: {x: number, y: number}, endPoint: {x: number, y: number}}>}
   */
  this.settings_ = [];
  this.heightCache_ = {};

  for (var i = 0; i < this.arrows_.length; i++) {
    var arrow = this.arrows_[i];
    var settings = this.getArrowDrawInfo_(arrow);

    this.settings_.push(settings);
  }
};


anychart.waterfallModule.ArrowsManager.prototype.applyLabelsStyle = function() {
  for (var i = 0; i < this.arrows_.length; i++) {
    var arrow = this.arrows_[i];
    var flatSettings = arrow.label().flatten();
    var text = this.arrows_[i].getText();

    var from = arrow.getOption('from');
    var to = arrow.getOption('to');

    var xScale = this.chart_.xScale();
  
    var fromStackIndex = xScale.getIndexByValue(from);
    var toStackIndex = xScale.getIndexByValue(to);

    var formatProvider = this.chart_.getFormatProviderForArrow(toStackIndex, fromStackIndex);
    var textValue = arrow.label().getText(formatProvider);

    text.text(textValue);
    text.style(flatSettings);
    text.prepareComplexity();
    text.applySettings();
  }
};


anychart.waterfallModule.ArrowsManager.prototype.draw = function() {
  console.log('Arrows manager draw()');
  var chart = this.chart_;
  var labelsLayer = this.getLabelsLayer();
  labelsLayer.parent(chart.rootElement);
  labelsLayer.zIndex(anychart.waterfallModule.ArrowsManager.ARROWS_ZINDEX + 1);
  
  if (!this.arrowsLayer_) {
    this.arrowsLayer_ = chart.rootElement.layer();
    this.arrowsLayer_.zIndex(anychart.waterfallModule.ArrowsManager.ARROWS_ZINDEX);
  }

  this.calculateArrows_();

  this.applyLabelsStyle();

  for (var i = 0; i < this.arrows_.length; i++) {
    var arrow = this.arrows_[i];
    var settings = this.settings_[i];

    // TODO: Check container invalidation state
    arrow.container(this.arrowsLayer_);

    arrow.clear();
    if (settings.isCorrect) {
      arrow.draw(settings);
    }
  }
};


anychart.waterfallModule.ArrowsManager.prototype.removeArrow = function(arrow) {
  var indexToDelete = this.arrows_.indexOf(arrow);
  if (indexToDelete >= 0) {
    this.arrows_.splice(indexToDelete, 1);
    goog.dispose(arrow);
    return true;
  }
  return false;
};


anychart.waterfallModule.ArrowsManager.prototype.removeArrowAt = function(index) {
  var arrow = this.arrows_[index];

  if (goog.isDef(arrow)) {
    goog.array.splice(this.arrows_, index, 1);
    goog.dispose(arrow);
    return true;
  }

  return false;
};


anychart.waterfallModule.ArrowsManager.prototype.getArrow = function(index) {
  return this.arrows_[index] || null;
};


anychart.waterfallModule.ArrowsManager.prototype.addArrow = function(options) {
  var arrow = new anychart.waterfallModule.Arrow(this);
  if (goog.isDef(options)) {
    arrow.setup(options);
    arrow.listenSignals(this.arrowInvalidationHandler_, this);
  }
  this.arrows_.push(arrow);
  return arrow;
};


anychart.waterfallModule.ArrowsManager.prototype.getAllArrows = function() {
  return goog.array.clone(this.arrows_);
};


anychart.waterfallModule.ArrowsManager.prototype.arrowInvalidationHandler_ = function() {
  console.log('Arrow invalidated');
  this.dispatchSignal(
    anychart.Signal.NEEDS_REDRAW |
    anychart.Signal.MEASURE_BOUNDS |
    anychart.Signal.MEASURE_COLLECT
  );
};


/**
 * Getter for labels layer.
 * @return {acgraph.vector.UnmanagedLayer}
 */
anychart.waterfallModule.ArrowsManager.prototype.getLabelsLayer = function() {
  if (!this.labelsLayer_) {
    this.labelsLayerEl_ = /** @type {Element} */(acgraph.getRenderer().createLayerElement());
    this.labelsLayer_ = acgraph.unmanagedLayer(this.labelsLayerEl_);
  }
  return this.labelsLayer_;
};


//region --- IMeasurementsTargetProvider
anychart.waterfallModule.ArrowsManager.prototype.provideMeasurements = function() {
  console.log('Arrows manager is providing measurements');
  var labels = [];
  for (var i = 0; i < this.arrows_.length; i++) {
    var arrow = this.arrows_[i];
    var label = arrow.getText();
    labels.push(label);
  }
  return labels;
}
//endregion
