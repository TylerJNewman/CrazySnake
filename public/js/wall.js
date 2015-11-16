(function () {

var Game = window.Game = window.Game || {};

var Wall = Game.Wall = function () {};

Wall.prototype.checkOnEdge = function (gamePlay) {

  var game = gamePlay;

  var direction = this.onEdge(game.board.snake.headPos);
  // do not queue direction change if it is the same direction
  if (direction && currentDir != direction) {

    var newDir = this.hitWall(direction);
    // prevent queuing if user takes over
    if (game.dirQueue.length <= 0) game.queueDirShift(newDir);
  }
  var currentDir = direction;

};

Wall.prototype.hitWall = function (direction) {

  if (direction === "left") {
    return new Game.Coord(0,-1);
  }
  if (direction === "top") {
    return new Game.Coord(1,0);
  }
  if (direction === "right") {
    return new Game.Coord(0,1);
  }
  if (direction === "bottom") {
    return new Game.Coord(-1,0);
  }
};

Wall.prototype.onEdge = function (coord) {
  if (coord.pos[1] === Game.Config.boardHeight - 1) {
    return (coord.pos[0] === 0) ? "left" : "bottom";
  }
  if (coord.pos[0] === Game.Config.boardWidth - 1) {
    return (coord.pos[1] === Game.Config.boardHeight - 1) ? "bottom" : "right";
  }
  if (coord.pos[1] === 0) {
    return (coord.pos[0] === Game.Config.boardWidth - 1) ? "right" : "top";
  }
  if (coord.pos[0] === 0) {
    return (coord.pos[1] === 0) ? "top" : "left";
  }
};


})();
