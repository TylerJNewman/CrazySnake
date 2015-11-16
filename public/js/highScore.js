(function () {

var Game = window.Game = window.Game || {};

var Stats = Game.Stats = function () {};

Stats.prototype.retrieveHighScore = function () {
  if (document.cookie) {
    this.highScore = parseInt(document.cookie.match(/\d+/)[0]);
  } else {
    this.highScore = 0;
  }
  return this;
};

Stats.prototype.adjustCounter = function (score) {
  this.highScore = Math.max(score, this.highScore);
};


})();


