(function () {

var Game = window.Game = window.Game || {};

Game.Snake = function() {
  this.headPos = new Coord(
    Math.floor(Game.Config.boardWidth / 2),
    Math.floor(Game.Config.boardHeight / 2)
  );
  this.currentDir = new Coord(1,0);
  this.segments = [this.headPos, this.headPos.minus(this.currentDir), this.headPos.minus(this.currentDir).plus(this.currentDir)];
};

var Snake = Game.Snake;

Game.Coord = function(row, col) {
  this.pos = [row, col];
};

var Coord = Game.Coord;

Coord.prototype.eq = function (otherCoord) {
  return this.pos[0] === otherCoord.pos[0] && this.pos[1] === otherCoord.pos[1];
};

Coord.prototype.inverse = function (otherCoord) {
  return this.pos[0] === -1 * otherCoord.pos[0] && this.pos[1] === - 1 * otherCoord.pos[1];
};

Coord.prototype.minus = function (otherCoord) {
  return new Coord(this.pos[0] - otherCoord.pos[0], this.pos[1] - otherCoord.pos[1]);
};

Coord.prototype.plus = function (otherCoord) {
  return new Coord(this.pos[0] + otherCoord.pos[0], this.pos[1] + otherCoord.pos[1]);
};

//
Snake.prototype.changeDir = function (dir) {
  if (!dir.inverse(this.currentDir) && this.validMove(dir)) {
    this.currentDir = new Coord(dir.pos[0], dir.pos[1]);
  }
};

Snake.prototype.eat = function () {
  this.eating = true;
};

Snake.prototype.eatingSelf = function () {
  for (var i = 1; i < this.length(); i++) {
    if (this.segments[i].eq(this.headPos)) return true;
  }

  return false;
};

Snake.prototype.length = function () {
  return this.segments.length;
};

Snake.prototype.move = function () {
  // only move if queue does not send us off the wall
  if (this.validMove(this.currentDir)) {
    this.headPos = this.headPos.plus(this.currentDir);
  } else {
    return;
  }

  this.segments.unshift(this.headPos);
  if (!this.eating) {
    this.segments.pop();
  } else {
  }
  this.eating = false;
};

Snake.prototype.on = function (coord) {
  for (var i = 0; i < this.length(); i++) {
    if (this.segments[i].eq(coord)) return true;
  }

  return false;
};

Snake.prototype.validMove = function (dir) {
  var nextPos = this.headPos.plus(dir);
  return (!this.offBoard(nextPos));
};

Snake.prototype.offBoard = function (coord) {
  return coord.pos[0] < 0 || coord.pos[1] < 0 ||
  coord.pos[0] >= Game.Config.boardWidth ||
  coord.pos[1] >= Game.Config.boardHeight;
};

// Snake.prototype.nextHeadPos = function () {
//   return this.headPos.plus(this.currentDir);
// };

})();
