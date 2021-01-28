goog.provide('anychart.waterfallModule.ArrowsManager');

goog.require('anychart.waterfallModule.Arrow');


/**
 * 
 * @constructor
 * @extends {anychart.core.Base}
 * @param {anychart.waterfallModule.Chart} chart 
 */
anychart.waterfallModule.ArrowsManager = function(chart) {
  anychart.waterfallModule.ArrowsManager.base(this, 'constructor');

  this.chart_ = chart;

  this.arrows_ = [];

  this.arrowsLayer_ = null;
};
goog.inherits(anychart.waterfallModule.ArrowsManager, anychart.core.Base);

anychart.waterfallModule.ArrowsManager.prototype.SUPPORTED_SIGNALS = anychart.Signal.NEEDS_REDRAW;


anychart.waterfallModule.ArrowsManager.prototype.getArrowStackBounds_ = function(arrow) {
  var chart = this.chart_;
  var xScale = chart.xScale();

  var from = arrow.getOption('from');
  var to = arrow.getOption('to');

  var fromStackIndex = xScale.getIndexByValue(from);
  var toStackIndex = xScale.getIndexByValue(to);

  var fromStackBounds = chart.getStackBounds(fromStackIndex);
  var toStackBounds = chart.getStackBounds(toStackIndex);

  return {
    from: fromStackBounds,
    to: toStackBounds
  }
};


anychart.waterfallModule.ArrowsManager.prototype.getArrowDrawInfo_ = function(arrow) {
  var stacksBounds = this.getArrowStackBounds_(arrow);

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

  if (!goog.isDef(heightCache[settings.from])) {
    heightCache[settings.from] = settings.horizontalLineY;
  }

  if (settings.horizontalLineY == heightCache[settings.from]) {
    settings.horizontalLineY += isArrowUp ? -arrowGap : arrowGap;
    heightCache[settings.from] = settings.horizontalLineY;
  }
}


anychart.waterfallModule.ArrowsManager.prototype.isArrowUp_ = function(arrow) {
  var chart = this.chart_;
  var xScale = chart.xScale();
  var from = arrow.getOption('from');
  var fromStackIndex = xScale.getIndexByValue(from);
  var fromStackDirection = chart.getStackSum(fromStackIndex, 'diff');
  return fromStackDirection >= 0;
}


anychart.waterfallModule.ArrowsManager.prototype.calculateArrows_ = function() {
  var chart = this.chart_;
  var xScale = chart.xScale();
  /**
   * Stores arrows precalculated values.
   * I.e. arrow start point, arrow end point, arrow horizontal line y value.
   *
   * @type {Array.<{{from: string, to: string, startPoint: {x: number, y: number}, endPoint: {x: number, y: number}}>}
   */
  this.settings_ = [];

  var heightCache = {};

  for (var i = 0; i < this.arrows_.length; i++) {
    var arrow = this.arrows_[i];

    var stacksBounds = this.getArrowStackBounds_(arrow);

    var fromStackBounds = stacksBounds.from;
    var toStackBounds = stacksBounds.to;

    var isArrowUp = this.isArrowUp_(arrow);

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

    if (!goog.isDef(heightCache[settings.from])) {
      heightCache[settings.from] = settings.horizontalLineY;
    }

    if (settings.horizontalLineY == heightCache[settings.from]) {
      settings.horizontalLineY += isArrowUp ? -arrowGap : arrowGap;
      heightCache[settings.from] = settings.horizontalLineY;
    }

    this.settings_.push(settings);
  }
}

anychart.waterfallModule.ArrowsManager.prototype.draw = function() {
  if (!this.arrowsLayer_) {
    this.arrowsLayer_ = chart.rootElement.layer();
    this.arrowsLayer_.zIndex(9000)
  }

  this.calculateArrows_();

  for (var i = 0; i < this.arrows_.length; i++) {
    var arrow = this.arrows_[i];
    arrow.draw(this.settings_[i], this.arrowsLayer_);
  }
};

anychart.waterfallModule.ArrowsManager.prototype.removeArrow = function(arrow) {
  this.arrows_.splice(this.arrows_.indexOf(arrow), 1);
  goog.dispose(arrow);
};

anychart.waterfallModule.ArrowsManager.prototype.removeArrowAt = function(index) {
  var arrow = this.arrows_[index];
  if (goog.isDef(arrow)) {
    goog.array.splice(this.arrows_, index, 1);
    goog.dispose(arrow);
  }
}

anychart.waterfallModule.ArrowsManager.prototype.getArrow = function(index) {
  return this.arrows_[index] || null;
};

anychart.waterfallModule.ArrowsManager.prototype.addArrow = function(options) {
  var arrow = new anychart.waterfallModule.Arrow();
  if (goog.isDef(options)) {
    arrow.setup(options);
  }
  this.arrows_.push(arrow);
  return arrow;
};

anychart.waterfallModule.ArrowsManager.prototype.getAllArrows = function() {
  return goog.array.clone(this.arrows_);
};

anychart.waterfallModule.ArrowsManager.prototype.arrowInvalidationHandler_ = function() {
  this.dispatchSignal(anychart.Signal.NEEDS_REDRAW);
}
