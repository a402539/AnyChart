goog.provide('anychart.waterfallModule.ArrowsManager');

goog.require('anychart.core.Base');
goog.require('anychart.reflow.IMeasurementsTargetProvider');
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


anychart.waterfallModule.ArrowsManager.prototype.getIndexFromValue = function(value) {
  return this.chart_.xScale().getIndexByValue(value);
};


anychart.waterfallModule.ArrowsManager.prototype.isArrowUp = function(arrow) {
  var fromIndex = this.getIndexFromValue(arrow.from());

  return this.chart_.getStackSum(fromIndex, 'diff') >= 0;
};

anychart.waterfallModule.ArrowsManager.prototype.createArrowDrawSettings = function(arrow, stackLabelsBounds) {
  var fromIndex = this.getIndexFromValue(arrow.from());
  var toIndex = this.getIndexFromValue(arrow.to());

  var stackBounds = this.getStacksBounds();

  // Minimal gap from start/end point to the horizontal line.
  var minimalGap = 15;
  
  var isCorrect = !goog.isNull(fromStackBounds) &&
    !goog.isNull(toStackBounds) &&
    !isNaN(fromIndex) &&
    !isNaN(toIndex);

  if (!isCorrect) {
    return {
      isCorrect: false
    };
  }

  var isUp = this.chart_.getStackSum(fromIndex, 'diff') >= 0;

  var fromStackBounds = stackBounds[fromIndex];
  var toStackBounds = stackBounds[toIndex];

  var fromPoint = new anychart.math.Point2D(
    fromStackBounds.getLeft() + fromStackBounds.getWidth() / 2,
    isUp ? fromStackBounds.getTop() : fromStackBounds.getBottom()
  );

  var toPoint = new anychart.math.Point2D(
    toStackBounds.getLeft() + toStackBounds.getWidth() / 2,
    isUp ? toStackBounds.getTop() : toStackBounds.getBottom()
  );

  var baseHorizontalY = isUp ?
    (Math.min(fromPoint.y, toPoint.y) - minimalGap) :
    (Math.max(fromPoint.y, toPoint.y) + minimalGap);

  return {
    fromPoint: fromPoint,
    toPoint: toPoint,
    horizontalY: baseHorizontalY,
    isCorrect: isCorrect,
    isUp: isUp
  }
};


anychart.waterfallModule.ArrowsManager.prototype.createArrowBounds = function(arrowDrawSettings, arrow) {
  var text = arrow.getText();

  var strokeThickness = anychart.utils.extractThickness(arrow.connector().getOption('stroke'));

  var gap = 2;
  // Half of the resulting rect height. 
  var halfSize = (strokeThickness / 2) + gap;

  var arrowBounds = new anychart.math.Rect(
      arrowDrawSettings.fromPoint.x,
      arrowDrawSettings.horizontalY - halfSize,
      arrowDrawSettings.toPoint.y - arrowDrawSettings.fromPoint.y,
      halfSize * 2
    );

  var textBounds = text.getBounds();

  var textPosition = text.getTextPosition(arrowBounds, textBounds.height, arrow.label().position(), arrow.label().anchor());

  var textActualBounds = new anychart.math.Rect(
    textPosition.left,
    textPosition.top,
    textBounds.width,
    textBounds.height
  );

  arrowBounds.boundingRect(textActualBounds);

  return arrowBounds;
};


anychart.waterfallModule.ArrowsManager.prototype.createArrowTextBounds = function(arrow, arrowBounds) {
  var text = arrow.getText();
  var textBounds = text.getBounds();

  var textPosition = text.getTextPosition(arrowBounds, textBounds.height, arrow.label().position(), arrow.label().anchor());

  var textActualBounds = new anychart.math.Rect(
    textPosition.left,
    textPosition.top,
    textBounds.width,
    textBounds.height
  );
  return textActualBounds;
};


anychart.waterfallModule.ArrowsManager.prototype.getAllSeriesLabelsBounds = function(index) {
  var bounds = [];
  var chart = this.chart_;
  var seriesCount = chart.getSeriesCount();
  for (var i = 0; i < seriesCount; i++) {
    var labelsFactory = chart.getSeries(i).labels();
    var label = labelsFactory.getLabel(index);
    if (label.enabled() || labelsFactory.enabled()) {
      var labelBounds = label.bounds_;
      bounds.push(labelBounds);
    }
  }
  return bounds;
};


anychart.waterfallModule.ArrowsManager.prototype.getSeriesLabelsBounds = function() {
  var chart = this.chart_;
  var seriesCount = chart.getSeriesCount();

  var bounds = [];
  var boundingRect = null;
  for (var i = 0; i < chart.getStacksCount(); i++) {
    var allBounds = this.getAllSeriesLabelsBounds(i);
    boundingRect = goog.array.reduce(allBounds, function(accumulator, curValue) {
      return goog.math.Rect.boundingRect(accumulator, curValue);
    }, boundingRect);
  }
  return bounds;
};


anychart.waterfallModule.ArrowsManager.prototype.getStackFullBounds = function(index) {
  var chart = this.chart_;
  var bounds = chart.getStackBounds(index);
  var seriesLabelsBounds = this.getAllSeriesLabelsBounds(index);

  for (var i = 0; i < seriesLabelsBounds.length; i++) {
    var labelBounds = seriesLabelsBounds[i];
    bounds = goog.math.Rect.boundingRect(bounds, labelBounds);
  }

  return bounds;
}


/**
 * Returns not simple stack bounds, but bounds enlarged to
 * include series labels.
 *
 * @param {boolean} opt_forceUpdate - Force recalculate stacks bounds.
 */
anychart.waterfallModule.ArrowsManager.prototype.getStacksBounds = function(opt_forceUpdate) {
  if (!goog.isDef(this.stacksBounds_) || opt_forceUpdate) {
    this.stacksBounds_ = [];
    for (var i = 0; i < this.chart_.getStacksCount(); i++) {
      this.stacksBounds_.push(this.getStackFullBounds(i));
    }
  }
  return this.stacksBounds_;
};


anychart.waterfallModule.ArrowsManager.prototype.getIntersectionDelta = function(fixedBounds, freeBounds, isMovingUp) {
  if (fixedBounds.intersects(freeBounds)) {
    if (isMovingUp) {
      return fixedBounds.getTop() - freeBounds.getBottom();
    } else {
      return fixedBounds.getBottom() - freeBounds.getTop();
    }
  }

  return 0;
};


anychart.waterfallModule.ArrowsManager.prototype.fixArrowPosition = function(arrow, arrowDrawSettings, arrowsDrawSettings) {
  var stackBounds = this.getStacksBounds();
  var isUp = this.isArrowUp(arrow);
  var newDrawSettings = {
    fromPoint: arrowDrawSettings.fromPoint,
    toPoint: arrowDrawSettings.toPoint,
    horizontalY: arrowDrawSettings.horizontalY,
    isCorrect: arrowDrawSettings.isCorrect,
    isUp: arrowDrawSettings.isUp
  };

  var arrowBounds = this.createArrowBounds(newDrawSettings, arrow);
  var arrowTextBounds = this.createArrowTextBounds(arrow, arrowBounds);

  for (var i = 0; i < stackBounds.length; i++) {
    var sb = stackBounds[i];

    var delta = this.getIntersectionDelta(sb, arrowBounds, isUp);
    if (delta !== 0) {
      console.log(`Arrow: ${arrow.from()} ${arrow.to()}, delta: ${delta} with stack ${i}`)
      newDrawSettings.horizontalY += delta;

      arrowBounds = this.createArrowBounds(newDrawSettings, arrow);
      arrowTextBounds = this.createArrowTextBounds(arrow, arrowBounds);
    }
  }

  for (var i = 0; i < arrowsDrawSettings.length; i++) {
    var fixedDrawSettings = arrowsDrawSettings[i];
    if (!fixedDrawSettings.isCorrect) {
      continue;
    }
    var fixedBounds = this.createArrowBounds(fixedDrawSettings, arrow);

    var delta = this.getIntersectionDelta(fixedBounds, arrowBounds, isUp);

    if (delta !== 0) {
      console.log(`Arrow: ${arrow.from()} ${arrow.to()}, delta: ${delta} with arrow: ${this.arrows_[i].from()} ${this.arrows_[i].to()}`)
      newDrawSettings.horizontalY += delta;

      arrowBounds = this.createArrowBounds(newDrawSettings, arrow);
      arrowTextBounds = this.createArrowTextBounds(arrow, arrowBounds);
    }
  }

  return newDrawSettings;
};


/**
 * Only start/end points are calculated here.
 * Horizontal line is calculated separately.
 */
anychart.waterfallModule.ArrowsManager.prototype.createDrawSettings = function() {
  const arrowsDrawSettings = [];
  for (let i = 0; i < this.arrows_.length; i++) {
    const arrow = this.arrows_[i];
    
    const arrowDrawSettings = this.createArrowDrawSettings(arrow);

    const fixedDrawSettings = arrowDrawSettings.isCorrect ?
      this.fixArrowPosition(arrow, arrowDrawSettings, arrowsDrawSettings) :
      arrowDrawSettings;

    arrowsDrawSettings.push(fixedDrawSettings);
  }
  return arrowsDrawSettings;
};


/**
 * @returns {anychart.waterfallModule.Arrow.DrawSettings[]}
 */
anychart.waterfallModule.ArrowsManager.prototype.getDrawInfo = function() {
  this.getStacksBounds(true);
  const drawSettings = this.createDrawSettings();
  return drawSettings;
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
  var chart = this.chart_;
  var labelsLayer = this.getLabelsLayer();
  labelsLayer.parent(chart.rootElement);
  labelsLayer.zIndex(anychart.waterfallModule.ArrowsManager.ARROWS_ZINDEX + 1);
  
  if (!this.arrowsLayer_) {
    this.arrowsLayer_ = chart.rootElement.layer();
    this.arrowsLayer_.zIndex(anychart.waterfallModule.ArrowsManager.ARROWS_ZINDEX);
  }

  this.applyLabelsStyle();

  // We probably need arrows labels bounds, when calculating arrows positions.
  this.dispatchSignal(anychart.Signal.MEASURE_BOUNDS | anychart.Signal.MEASURE_COLLECT);

  anychart.measuriator.measure();

  var drawInfo = this.getDrawInfo();

  for (var i = 0; i < drawInfo.length; i++) {
    var di = drawInfo[i];
    var arrow = this.arrows_[i];
    arrow.container(this.arrowsLayer_);
    arrow.draw(di);
  }
};


anychart.waterfallModule.ArrowsManager.prototype.removeArrow = function(arrow) {
  var indexToDelete = goog.array.indexOf(this.arrows_, arrow);

  if (indexToDelete >= 0) {
    return this.removeArrowAt(indexToDelete);
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


/** @inheritDoc */
anychart.waterfallModule.ArrowsManager.prototype.disposeInternal = function() {
  goog.disposeAll(
    this.arrows_,
    this.arrowsLayer_,
    this.labelsLayer_
  );
  anychart.waterfallModule.ArrowsManager.base(this, 'disposeInternal');
};


//region --- IMeasurementsTargetProvider
anychart.waterfallModule.ArrowsManager.prototype.provideMeasurements = function() {
  var labels = [];
  for (var i = 0; i < this.arrows_.length; i++) {
    var arrow = this.arrows_[i];
    var label = arrow.getText();
    labels.push(label);
  }
  return labels;
}
//endregion
