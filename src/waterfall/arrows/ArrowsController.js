goog.provide('anychart.waterfallModule.ArrowsController');

goog.require('anychart.core.VisualBase');
goog.require('anychart.math.Point2D');
goog.require('anychart.math.Rect');
goog.require('anychart.reflow.IMeasurementsTargetProvider');
goog.require('anychart.waterfallModule.Arrow');


/**
 *
 * @constructor
 * @extends {anychart.core.VisualBase}
 * @implements {anychart.reflow.IMeasurementsTargetProvider}
 * @param {anychart.waterfallModule.Chart} chart
 */
anychart.waterfallModule.ArrowsController = function(chart) {
  anychart.waterfallModule.ArrowsController.base(this, 'constructor');

  this.chart_ = chart;

  this.arrows_ = [];

  this.arrowsLayer_ = null;

  /**
   * Each element of the array is the index of xScale value.
   * It contains array of arrows with from/to values mapped to this value.
   * This array is used to position from/to points so, that they do not overlap.
   *
   * @type {Array.<Array.<anychart.waterfallModule.Arrow>>}
   */
  this.xScaleValueToArrows_ = [];

  this.singleInOut_ = false;

  anychart.measuriator.register(this);
};
goog.inherits(anychart.waterfallModule.ArrowsController, anychart.core.VisualBase);

anychart.waterfallModule.ArrowsController.prototype.SUPPORTED_SIGNALS =
  anychart.core.Base.prototype.SUPPORTED_SIGNALS |
  anychart.Signal.NEEDS_REDRAW |
  anychart.Signal.MEASURE_COLLECT | //Signal for Measuriator to collect labels to measure.
  anychart.Signal.MEASURE_BOUNDS; //Signal for Measuriator to measure the bounds of collected labels.


anychart.waterfallModule.ArrowsController.ARROWS_ZINDEX = 41;

anychart.waterfallModule.ArrowsController.ARROWS_LABELS_ZINDEX = 42;


/**
 * If chart is in vertical mode.
 *
 * @return {boolean}
 */
anychart.waterfallModule.ArrowsController.prototype.isVertical = function() {
  return /** @type {boolean} */(this.chart_.isVertical());
};


/**
 * If Y scale is inverted.
 *
 * @return {boolean}
 */
anychart.waterfallModule.ArrowsController.prototype.yScaleInverted = function() {
  return /** @type {boolean} */(this.chart_.yScale().inverted());
};


/**
 * If up direction is normal - Y value decreases with Y pixel coordinate increase.
 *
 * @return {boolean}
 */
anychart.waterfallModule.ArrowsController.prototype.normalUpDirection = function() {
  return this.isVertical() === this.yScaleInverted();
};


/**
 * Checks if right direction is not inverted.
 *
 * @return {boolean}
 */
anychart.waterfallModule.ArrowsController.prototype.normalRightDirection = function() {
  return this.isVertical() === this.chart_.xScale().inverted();
};


/**
 * Is single positions for in and out points should be used.
 * @param {boolean=} opt_value - If single positions on stack for in/out.
 * @return {boolean}
 */
anychart.waterfallModule.ArrowsController.prototype.singleInOut = function(opt_value) {
  if (goog.isDef(opt_value) && this.singleInOut_ !== opt_value) {
    this.singleInOut_ = opt_value;
    this.dispatchSignal(anychart.Signal.NEEDS_REDRAW);
  }

  return this.singleInOut_;
};


/**
 * Returns index of the given value on X scale.
 *
 * @param {string} value - From/to arrow value.
 * @return {number}
 */
anychart.waterfallModule.ArrowsController.prototype.getIndexFromValue = function(value) {
  return this.chart_.xScale().getIndexByValue(value);
};


/**
 * Checks if arrow is looking up.
 * It does so, if 'from' stack has positive diff value.
 *
 * @param {anychart.waterfallModule.Arrow} arrow - Arrow instance.
 * @return {boolean}
 */
anychart.waterfallModule.ArrowsController.prototype.isArrowUp = function(arrow) {
  var fromIndex = this.getIndexFromValue(/** @type {string} */(arrow.getOption('from')));

  return this.chart_.getStackSum(fromIndex, 'diff') >= 0;
};


/**
 * If arrow is drawn left to right.
 *
 * @param {anychart.waterfallModule.Arrow} arrow - Arrow instance.
 * @return {boolean} - Whether arrow is drawn left to right.
 */
anychart.waterfallModule.ArrowsController.prototype.isArrowRight = function(arrow) {
  var fromIndex = this.getIndexFromValue(/** @type {string} */(arrow.getOption('from')));
  var toIndex = this.getIndexFromValue(/** @type {string} */(arrow.getOption('to')));

  return toIndex > fromIndex;
};


/**
 * Group arrows by their from/to values, for in/out points positioning.
 *
 * @param {anychart.waterfallModule.Arrow} arrow - Arrow instance.
 */
anychart.waterfallModule.ArrowsController.prototype.addArrowToScaleValuesArray = function(arrow) {
  var fromIndex = this.getIndexFromValue(/** @type {string} */(arrow.getOption('from')));
  var toIndex = this.getIndexFromValue(/** @type {string} */(arrow.getOption('to')));

  this.xScaleValueToArrows_[fromIndex] = this.xScaleValueToArrows_[fromIndex] || [];
  this.xScaleValueToArrows_[toIndex] = this.xScaleValueToArrows_[toIndex] || [];

  var isRightDirection = this.isArrowRight(arrow);

  if (arrow.enabled()) {
    if (isRightDirection) {
      this.xScaleValueToArrows_[fromIndex].push(arrow);
      this.xScaleValueToArrows_[toIndex].unshift(arrow);
    } else {
      this.xScaleValueToArrows_[fromIndex].unshift(arrow);
      this.xScaleValueToArrows_[toIndex].push(arrow);
    }
  }
};


/**
 * Returns arrows draw settings.
 *
 * @param {anychart.waterfallModule.Arrow} arrow - Arrow instance.
 */
anychart.waterfallModule.ArrowsController.prototype.createArrowDrawSettings = function(arrow) {
  var fromIndex = this.getIndexFromValue(/** @type {string} */(arrow.getOption('from')));
  var toIndex = this.getIndexFromValue(/** @type {string} */(arrow.getOption('to')));

  var stackBounds = this.getStacksBounds();

  var fromStackBounds = stackBounds[fromIndex];
  var toStackBounds = stackBounds[toIndex];

  var drawSettings;

  if (arrow.enabled()) {
    // Minimal gap from start/end point to the horizontal line.
    var minimalGap = 15;
    var isUp = this.chart_.getStackSum(fromIndex, 'diff') >= 0;
    var normalUpDirection = this.normalUpDirection();
  
    var fromPoint = new anychart.math.Point2D(
      fromStackBounds.getLeft() + fromStackBounds.getWidth() / 2,
      isUp === normalUpDirection ? fromStackBounds.getTop() : fromStackBounds.getBottom()
    );
  
    var toPoint = new anychart.math.Point2D(
      toStackBounds.getLeft() + toStackBounds.getWidth() / 2,
      isUp === normalUpDirection ? toStackBounds.getTop() : toStackBounds.getBottom()
    );
  
    var baseHorizontalY = isUp && this.normalUpDirection() ?
      (Math.min(fromPoint.y, toPoint.y) - minimalGap) :
      (Math.max(fromPoint.y, toPoint.y) + minimalGap);
  
    drawSettings = {
      fromPoint: fromPoint,
      toPoint: toPoint,
      horizontalY: baseHorizontalY,
      isUp: isUp
    };
  } else {
    drawSettings = {
      fromPoint: null,
      toPoint: null,
      horizontalY: 0,
      isUp: false
    };
  }

  arrow.drawSettings(drawSettings);
};


/**
 * Returns arrow bounds to be used while arrow positioning.
 * Bounds cover horizontal line and label.
 *
 * @param {anychart.waterfallModule.Arrow.DrawSettings} arrowDrawSettings - Arrow draw settings.
 * @param {anychart.waterfallModule.Arrow} arrow - Arrow instance.
 * @return {anychart.math.Rect}
 */
anychart.waterfallModule.ArrowsController.prototype.createArrowBounds = function(arrowDrawSettings, arrow) {
  var stroke = /** @type {acgraph.vector.Stroke|string} */(arrow.connector().getOption('stroke'));

  var strokeThickness = anychart.utils.extractThickness(stroke);

  var gap = 2;

  // Half of the resulting rect height.
  var halfSize = (strokeThickness / 2) + gap;

  var isRightDirection = arrowDrawSettings.toPoint.x > arrowDrawSettings.fromPoint.x;

  var startX = isRightDirection ? arrowDrawSettings.fromPoint.x : arrowDrawSettings.toPoint.x;
  var width = isRightDirection ?
    arrowDrawSettings.toPoint.x - arrowDrawSettings.fromPoint.x :
    arrowDrawSettings.fromPoint.x - arrowDrawSettings.toPoint.x;

  var arrowBounds = new anychart.math.Rect(
      startX,
      arrowDrawSettings.horizontalY - halfSize,
      width,
      halfSize * 2
    );

  var textActualBounds = this.createArrowTextBounds(arrow, arrowBounds);

  arrowBounds.boundingRect(textActualBounds);

  return arrowBounds;
};


/**
 *
 * @param {anychart.waterfallModule.Arrow} arrow
 * @param {anychart.math.Rect} arrowBounds
 * @return {anychart.math.Rect}
 */
anychart.waterfallModule.ArrowsController.prototype.createArrowTextBounds = function(arrow, arrowBounds) {
  var text = arrow.getText();
  var textBounds = text.getBounds();
  var label = arrow.label();

  var position = /** @type {anychart.enums.Position} */(label.getOption('position'));
  var anchor = /** @type {anychart.enums.Anchor} */(label.getOption('anchor'));

  var textPosition = text.getTextPosition(
    arrowBounds.clone(),
    textBounds.height,
    position,
    anchor
  );

  // TODO: this.isVertical() check.
  var textActualBounds = new anychart.math.Rect(
    textPosition.left,
    textPosition.top,
    textBounds.width,
    textBounds.height
  );
  return textActualBounds;
};


/**
 * Fixes labels bounds in vertical mode.
 *
 * @param {anychart.math.Rect} bounds - Labels bounds.
 * @return {anychart.math.Rect}
 */
anychart.waterfallModule.ArrowsController.prototype.fixLabelsBounds = function(bounds) {
  if (this.isVertical()) {
    // In vertical mode bounds need to be rotated.
    return new anychart.math.Rect(
      bounds.getTop(),
      bounds.getLeft(),
      bounds.getHeight(),
      bounds.getWidth()
    );
  } else {
    return bounds;
  }
};


/**
 * Returns labels factory label bounds.
 *
 * @param {anychart.core.ui.LabelsFactory.Label} label - Labels factory label to be measured.
 * @return {anychart.math.Rect}
 */
anychart.waterfallModule.ArrowsController.prototype.getLabelBounds = function(label) {
  return label.getTextElement().getBounds();
};


/**
 * Return series and stack labels bounds.
 *
 * @param {number} index - X scale point index.
 * @return {Array.<anychart.math.Rect>}
 */
anychart.waterfallModule.ArrowsController.prototype.getAllStackLabelsBounds = function(index) {
  var bounds = [];
  var chart = this.chart_;
  var seriesCount = chart.getSeriesCount();

  for (var i = 0; i < seriesCount; i++) {
    var labelsFactory = chart.getSeries(i).labels();
    var label = labelsFactory.getLabel(index);
    if (label) {
      var labelBounds = this.fixLabelsBounds(this.getLabelBounds(label));
      bounds.push(labelBounds);
    }
  }

  if (chart.stackLabels().enabled()) {
    var label = chart.stackLabels().getLabel(index);
    if (label) {
      var labelBounds = this.fixLabelsBounds(this.getLabelBounds(label));
      bounds.push(labelBounds);
    }
  }

  return bounds;
};


/**
 * Return stack bounds, expanded by all of its labels bounds.
 *
 * @param {number} index - Stack index.
 * @return {anychart.math.Rect}
 */
anychart.waterfallModule.ArrowsController.prototype.getStackFullBounds = function(index) {
  var chart = this.chart_;
  var stackBounds = chart.getStackBounds(index);

  // Fix negative height, as it breaks some Rect api.
  if (stackBounds.getHeight() < 0) {
    stackBounds = new anychart.math.Rect(
      stackBounds.getLeft(),
      stackBounds.getTop() + stackBounds.getHeight(),
      stackBounds.getWidth(),
      -stackBounds.getHeight()
    );
  }
  var seriesLabelsBounds = this.getAllStackLabelsBounds(index);

  for (var i = 0; i < seriesLabelsBounds.length; i++) {
    var labelBounds = seriesLabelsBounds[i];
    stackBounds = goog.math.Rect.boundingRect(stackBounds, labelBounds);
  }

  return stackBounds;
};


/**
 * Updates stacks bounds to use them for arrow positioning.
 */
anychart.waterfallModule.ArrowsController.prototype.updateStacksBounds = function() {
  this.stacksBounds_ = [];
  for (var i = 0; i < this.chart_.getStacksCount(); i++) {
    this.stacksBounds_.push(this.getStackFullBounds(i));
  }
};


/**
 * Returns not simple stack bounds, but bounds enlarged to
 * include series labels.
 *
 * @return {Array.<anychart.math.Rect>}
 */
anychart.waterfallModule.ArrowsController.prototype.getStacksBounds = function() {
  if (!goog.isDef(this.stacksBounds_)) {
    this.updateStacksBounds();
  }
  return this.stacksBounds_;
};


/**
 *
 * @param {anychart.math.Rect} fixedBounds
 * @param {anychart.math.Rect} freeBounds
 * @param {boolean} isMovingUp
 * @return {number}
 */
anychart.waterfallModule.ArrowsController.prototype.getIntersectionDelta = function(fixedBounds, freeBounds, isMovingUp) {
  if (fixedBounds.intersects(freeBounds)) {
    if (isMovingUp === this.normalUpDirection()) {
      return fixedBounds.getTop() - freeBounds.getBottom();
    } else {
      return fixedBounds.getBottom() - freeBounds.getTop();
    }
  }

  return 0;
};


/**
 * Checks if arrow has correct from/to values.
 * They resolve to correct index values on xScale and are not same.
 *
 * @param {anychart.waterfallModule.Arrow} arrow - Arrow instance.
 * @return {boolean}
 */
anychart.waterfallModule.ArrowsController.prototype.arrowCorrectFromTo = function(arrow) {
  var from = arrow.getOption('from');
  var to = arrow.getOption('to');

  var xScale = this.chart_.xScale();

  var fromStackIndex = xScale.getIndexByValue(from);
  var toStackIndex = xScale.getIndexByValue(to);

  var fromToNotEqual = from !== to;

  return !isNaN(fromStackIndex) && !isNaN(toStackIndex) && fromToNotEqual;
};


/**
 * Returns true if arrow with same from & to values found in the array.
 *
 * @param {Array.<anychart.waterfallModule.Arrow>} array - Arrows array.
 * @param {anychart.waterfallModule.Arrow} arrow - Arrow instance.
 * @return {boolean} - Whether arrow has unique from/to combination.
 */
anychart.waterfallModule.ArrowsController.prototype.isArrowUnique = function(array, arrow) {
  var duplicate = goog.array.find(array, function(item) {
    return arrow.getOption('from') === item.getOption('from') &&
      arrow.getOption('to') === item.getOption('to');
  });

  return goog.isNull(duplicate);
};


/**
 * Checks if arrows are correct and disables them if they are not.
 * Incorrect arrows are:
 *  1) referencing non-existent/missing xScale values
 *  2) duplicates, with from & to values similar to already existing arrow
 *  3) with same from & to values
 */
anychart.waterfallModule.ArrowsController.prototype.checkArrowsCorrectness = function() {
  var previousArrows = [];

  for (var i = 0; i < this.arrows_.length; i++) {
    var arrow = this.arrows_[i];
    var correctFromTo = this.arrowCorrectFromTo(arrow);
    var isUnique = this.isArrowUnique(previousArrows, arrow);

    var isArrowCorrect = correctFromTo && isUnique;

    arrow.enabled(isArrowCorrect);

    previousArrows.push(arrow);
  }
};


/**
 * Checks arrow for intersection with stacks and other arrows.
 * Updates arrow draw settings.
 *
 * @param {anychart.waterfallModule.Arrow} arrow - Arrow to position.
 * @param {Array.<anychart.waterfallModule.Arrow>} positionedArrows - Already positioned arrows.
 */
anychart.waterfallModule.ArrowsController.prototype.positionArrow = function(arrow, positionedArrows) {
  /*
    Clone array, because we are going to sort it and it might break other
    parts, which relay on strict order of bounds.
   */
  var stackBounds = goog.array.clone(this.getStacksBounds());
  var isUp = this.isArrowUp(arrow);
  var isNormalUpDirection = this.normalUpDirection();

  var arrowDrawSettings = arrow.drawSettings();

  var newDrawSettings = {
    fromPoint: arrowDrawSettings.fromPoint,
    toPoint: arrowDrawSettings.toPoint,
    horizontalY: arrowDrawSettings.horizontalY,
    isUp: arrowDrawSettings.isUp
  };

  var arrowBounds = this.createArrowBounds(newDrawSettings, arrow);

  /*
    Ensure we always go from the lowest lying to highest lying stack bounds.
   */
  stackBounds.sort(function(prev, next) {
    return isUp === isNormalUpDirection ?
      next.getBottom() - prev.getBottom() :
      prev.getTop() - next.getTop();
  });

  for (var i = 0; i < stackBounds.length; i++) {
    var sb = stackBounds[i];

    var delta = this.getIntersectionDelta(sb, arrowBounds, isUp);
    if (delta !== 0) {
      newDrawSettings.horizontalY += delta;

      arrowBounds = this.createArrowBounds(newDrawSettings, arrow);
    }
  }

  /*
    Our current arrow bounds must be compared to other (fixed) bounds
    in following order:
      1) if arrow is looking up, then in descending order (remember Y values are lowest at the top)
      2) if arrow is looking down, then in ascending order
    Doing it like this ensures bounds are poped up/pushed down as far as it is needed.
   */
  positionedArrows.sort(function(prev, next) {
    var prevDrawSettings = prev.drawSettings();
    var nextDrawSettings = next.drawSettings();
    return isUp ?
      nextDrawSettings.horizontalY - prevDrawSettings.horizontalY :
      prevDrawSettings.horizontalY - nextDrawSettings.horizontalY;
  });

  for (var i = 0; i < positionedArrows.length; i++) {
    var positionedArrowDrawSettings = positionedArrows[i].drawSettings();

    var fixedBounds = this.createArrowBounds(positionedArrowDrawSettings, arrow);

    var delta = this.getIntersectionDelta(fixedBounds, arrowBounds, isUp);

    if (delta !== 0) {
      newDrawSettings.horizontalY += delta;

      arrowBounds = this.createArrowBounds(newDrawSettings, arrow);
    }
  }

  arrow.drawSettings(newDrawSettings);
};


/**
 * Sort function for arrows from/to points positioning.
 *
 * @param {anychart.waterfallModule.Arrow} prev - Previous arrow.
 * @param {anychart.waterfallModule.Arrow} next - Next arrow.
 * @return {number}
 */
anychart.waterfallModule.ArrowsController.prototype.sortArrowsForPointsPositioning = function(prev, next) {
  var prevIsRight = this.isArrowRight(prev);
  var nextIsRight = this.isArrowRight(next);

  var isArrowUp = this.isArrowUp(prev);

  // If arrows look in different direction.
  if (prevIsRight !== nextIsRight) {
    // Left looking arrows go before right looking arrows.
    return prevIsRight ? 1 : -1;
  } else {
    return isArrowUp ?
      prev.drawSettings().horizontalY - next.drawSettings().horizontalY :
      next.drawSettings().horizontalY - prev.drawSettings().horizontalY;
  }
};


/**
 * If arrow is going right out of stack with given index.
 *
 * @param {anychart.waterfallModule.Arrow} arrow - Arrow instance.
 * @param {number} stackIndex - Index of the xScale item, against which we check rightness.
 * @return {boolean}
 */
anychart.waterfallModule.ArrowsController.prototype.isArrowGoingRightFromStack = function(arrow, stackIndex) {
  var fromIndex = this.getIndexFromValue(/** @type {string} */(arrow.getOption('from')));
  var toIndex = this.getIndexFromValue(/** @type {string} */(arrow.getOption('to')));

  return Math.min(fromIndex, toIndex, stackIndex) === stackIndex;
};


/**
 * Returns sort function used for from/to points positioning.
 *
 * @param {number} xScaleIndex - Index of the stack on X scale.
 * @return {function(anychart.waterfallModule.Arrow, anychart.waterfallModule.Arrow): number}
 */
anychart.waterfallModule.ArrowsController.prototype.getArrowsSortFunction = function(xScaleIndex) {
  var sortFn = function arrowsSortFunction(prev, next) {
    var isPrevRight = this.isArrowGoingRightFromStack(prev, xScaleIndex);
    var isNextRight = this.isArrowGoingRightFromStack(next, xScaleIndex);
    var isArrowUp = this.isArrowUp(prev);

    if (isPrevRight !== isNextRight) {
      return isPrevRight === this.normalRightDirection() ? 1 : -1;
    } else {
      return isArrowUp === this.normalUpDirection() ?
        prev.drawSettings().horizontalY - next.drawSettings().horizontalY :
        next.drawSettings().horizontalY - prev.drawSettings().horizontalY;
    }
  };

  return goog.bind(sortFn, this);
};


/**
 *
 * @param {Array.<anychart.waterfallModule.Arrow>} arrows - Array of arrows.
 * @param {number} xScaleIndex - Index of the point where arrows intersect.
 */
anychart.waterfallModule.ArrowsController.prototype.modifyArrowsFromToPoint = function(arrows, xScaleIndex) {
  var stackBounds = this.chart_.getStackBounds(xScaleIndex);
  var width = stackBounds.getWidth();
  var step = width / (arrows.length + 1);

  // goog.array.sort(arrows, bindedSortFunction);
  goog.array.sort(arrows, this.getArrowsSortFunction(xScaleIndex));

  var singleInOut = this.singleInOut_;
  var inPosition = stackBounds.getLeft() + (stackBounds.getWidth() / 3);
  var outPosition = stackBounds.getLeft() + (stackBounds.getWidth() * 0.666);

  for (var i = 0; i < arrows.length; i++) {
    var arrow = arrows[i];
    var fromIndex = this.getIndexFromValue(/** @type {string} */(arrow.getOption('from')));

    var xValue = stackBounds.getLeft() + ((i + 1) * step);
    if (fromIndex === xScaleIndex) {
      arrow.drawSettings().fromPoint.x = singleInOut ? outPosition : xValue;
    } else {
      arrow.drawSettings().toPoint.x = singleInOut ? inPosition : xValue;
    }
  }
};


/**
 * Positions from/to points of arrows so, that they do not overlap.
 */
anychart.waterfallModule.ArrowsController.prototype.positionFromToPoints = function() {
  for (var i = 0; i < this.xScaleValueToArrows_.length; i++) {
    var arrows = this.xScaleValueToArrows_[i];
    if (arrows && !this.singleInOut_ && arrows.length > 1) {
      var upArrows = goog.array.filter(arrows, function(arrow) {
        return this.isArrowUp(arrow);
      }, this);

      var downArrows = goog.array.filter(arrows, function(arrow) {
        return !this.isArrowUp(arrow);
      }, this);

      this.modifyArrowsFromToPoint(upArrows, i);
      this.modifyArrowsFromToPoint(downArrows, i);
    } else {
      if (arrows)
        this.modifyArrowsFromToPoint(arrows, i);
    }
  }
};


/**
 * Only start/end points are calculated here.
 * Horizontal line is calculated separately.
 *
 * @return {Array.<anychart.waterfallModule.Arrow.DrawSettings>}
 */
anychart.waterfallModule.ArrowsController.prototype.createDrawSettings = function() {
  this.updateStacksBounds();

  this.xScaleValueToArrows_.length = 0;
  var positionedArrows = [];
  for (var i = 0; i < this.arrows_.length; i++) {
    var arrow = this.arrows_[i];

    if (arrow.enabled()) {
      this.createArrowDrawSettings(arrow);
  
      this.positionArrow(arrow, positionedArrows);
  
      this.addArrowToScaleValuesArray(arrow);
  
      positionedArrows.push(arrow);
    }
  }

  this.positionFromToPoints();

  return positionedArrows;
};


/**
 * Applies labels style.
 */
anychart.waterfallModule.ArrowsController.prototype.applyLabelsStyle = function() {
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


/**
 * Initializes layers for arrows.
 *
 * @private
 */
anychart.waterfallModule.ArrowsController.prototype.initLayers_ = function() {
  var labelsLayer = /** @type {!acgraph.vector.UnmanagedLayer} */(this.getLabelsLayer());
  var arrowsLayer = /** @type {!acgraph.vector.Layer} */(this.getArrowsLayer());
  var rootLayer = /** @type {!acgraph.vector.Layer} */(this.getRootLayer());

  this.container().addChild(rootLayer);

  rootLayer
    .addChild(arrowsLayer)
    .addChild(labelsLayer);

  rootLayer.clip(this.chart_.getPlotBounds());
};


/**
 * Prepare and draw arrows.
 */
anychart.waterfallModule.ArrowsController.prototype.draw = function() {
  this.initLayers_();

  this.checkArrowsCorrectness();

  this.applyLabelsStyle();

  // We need arrows labels bounds, when calculating arrows positions.
  this.dispatchSignal(anychart.Signal.MEASURE_BOUNDS | anychart.Signal.MEASURE_COLLECT);
  anychart.measuriator.measure();

  this.createDrawSettings();

  var arrowsLayer = this.getArrowsLayer();

  for (var i = 0; i < this.arrows_.length; i++) {
    var arrow = this.arrows_[i];
    arrow.container(arrowsLayer);
    arrow.draw();
  }
};


//region --- Arrow manipulation API for chart.
/**
 *
 * @param {anychart.waterfallModule.Arrow} arrow - Arrow instance.
 * @return {boolean}
 */
anychart.waterfallModule.ArrowsController.prototype.removeArrow = function(arrow) {
  var indexToDelete = goog.array.indexOf(this.arrows_, arrow);

  if (indexToDelete >= 0) {
    return this.removeArrowAt(indexToDelete);
  }
  return false;
};


/**
 * Remove arrow at index.
 *
 * @param {number} index
 * @return {boolean}
 */
anychart.waterfallModule.ArrowsController.prototype.removeArrowAt = function(index) {
  var arrow = this.arrows_[index];

  if (goog.isDef(arrow)) {
    goog.array.splice(this.arrows_, index, 1);
    goog.dispose(arrow);
    return true;
  }

  return false;
};


/**
 * Get arrow at index.
 *
 * @param {number} index - Arrow index.
 * @return {anychart.waterfallModule.Arrow}
 */
anychart.waterfallModule.ArrowsController.prototype.getArrow = function(index) {
  return this.arrows_[index] || null;
};


/**
 * Create arrow with given settings.
 *
 * @param {Object=} opt_settings
 * @return {anychart.waterfallModule.Arrow}
 */
anychart.waterfallModule.ArrowsController.prototype.addArrow = function(opt_settings) {
  var arrow = new anychart.waterfallModule.Arrow(this);
  if (goog.isDef(opt_settings)) {
    arrow.setup(opt_settings);
    arrow.listenSignals(this.arrowInvalidationHandler_, this);
  }

  this.arrows_.push(arrow);

  this.dispatchSignal(anychart.Signal.NEEDS_REDRAW);
  return arrow;
};


/**
 * Arrow invalidation handler.
 */
anychart.waterfallModule.ArrowsController.prototype.arrowInvalidationHandler_ = function() {
  this.dispatchSignal(
    anychart.Signal.NEEDS_REDRAW
  );
};


/**
 * @return {Array.<anychart.waterfallModule.Arrow>}
 */
anychart.waterfallModule.ArrowsController.prototype.getAllArrows = function() {
  return goog.array.clone(this.arrows_);
};
//endregion


/**
 * @return {acgraph.vector.Layer}
 */
anychart.waterfallModule.ArrowsController.prototype.getRootLayer = function() {
  if (!this.rootLayer_) {
    this.rootLayer_ = acgraph.layer();
    this.rootLayer_.zIndex(anychart.waterfallModule.ArrowsController.ARROWS_ZINDEX);
  }

  return this.rootLayer_;
};


/**
 * Getter for labels layer.
 * @return {acgraph.vector.UnmanagedLayer}
 */
anychart.waterfallModule.ArrowsController.prototype.getLabelsLayer = function() {
  if (!this.labelsLayer_) {
    this.labelsLayerEl_ = /** @type {Element} */(acgraph.getRenderer().createLayerElement());
    this.labelsLayer_ = acgraph.unmanagedLayer(this.labelsLayerEl_);
    this.labelsLayer_.zIndex(anychart.waterfallModule.ArrowsController.ARROWS_LABELS_ZINDEX);
  }

  return this.labelsLayer_;
};


/**
 * @return {acgraph.vector.Layer}
 */
anychart.waterfallModule.ArrowsController.prototype.getArrowsLayer = function() {
  if (!this.arrowsLayer_) {
    this.arrowsLayer_ = acgraph.layer();
    this.arrowsLayer_.zIndex(anychart.waterfallModule.ArrowsController.ARROWS_ZINDEX);
  }

  return this.arrowsLayer_;
};


/** @inheritDoc */
anychart.waterfallModule.ArrowsController.prototype.disposeInternal = function() {
  goog.disposeAll(
    this.arrows_,
    this.arrowsLayer_,
    this.labelsLayer_
  );
  anychart.waterfallModule.ArrowsController.base(this, 'disposeInternal');
};


//region --- IMeasurementsTargetProvider
/**
 * @return {Array.<anychart.core.ui.OptimizedText>}
 */
anychart.waterfallModule.ArrowsController.prototype.provideMeasurements = function() {
  var labels = [];
  for (var i = 0; i < this.arrows_.length; i++) {
    var arrow = this.arrows_[i];
    var label = arrow.getText();
    labels.push(label);
  }
  return labels;
};
//endregion
