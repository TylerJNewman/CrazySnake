(function() {
  var snakeGame = window.snakeGame = (window.snakeGame || {});

  var Snake = snakeGame.Snake = function (board) {
    this.turning = false;
    this.direction = "E";
    this.board = board;
    this.growTurns = 0;
    this.gameOver = false;
    this.segments = [new Coord([10,10]), new Coord([10,11]), new Coord([10,12])];

  };

  Snake.prototype.moveDirection = function (direction) {
    if (direction === "N") {
      return new Coord([-1,0]);
    }
    if (direction === "E") {
      return new Coord([0,1]);
    }
    if (direction === "S") {
      return new Coord([1,0]);
    }
    if (direction === "W") {
      return new Coord([0,-1]);
    }
  };

  var Coord = snakeGame.Coord = function (coord) {
    this.coord = coord;
  };

  var Board = snakeGame.Board = function () {
    this.snake = new Snake(this);
    this.apple = new Apple(this);
  };

  var Apple = snakeGame.Apple = function(board) {
    this.board = board;
    this.reset();
  };

  Apple.prototype.reset = function () {
     var x = Math.floor(Math.random() * 20);
     var y = Math.floor(Math.random() * 20);

     while (this.board.snake.isOccupying([x, y])) {
       x = Math.floor(Math.random() * 20);
       y = Math.floor(Math.random() * 20);
     }

     this.position = new Coord([x, y]);

   };

   Snake.prototype.eatApple = function () {
     if (this.head().equals(this.board.apple.position)) {
       this.growTurns += 1;
       return true;
     } else {
       return false;
     }
   };

   Snake.prototype.head = function () {
     return this.segments[this.segments.length - 1];
   };

  Snake.prototype.isValid = function () {

    var head = this.head();

    if (!this.board.validPosition(this.head())) {
      return false;
    }

    for (var i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(head)) {
        return false;
      }
    }

    return true;
  };


   Snake.prototype.isOccupying = function (array) {
      var result = false;
      this.segments.forEach(function (segment) {
        if (segment.coord[0] === array[0] && segment.coord[1] === array[1]) {
          result = true;
          return result;
        }
      });
      return result;
    };

  Snake.prototype.getSegments = function () {
    var segs = [];
    for (var i = 0; i < this.segments.length; i++) {
      segs.push(this.segments[i].coord);
    }
    return segs;
  };


  Coord.prototype.plus = function (position) {
    return [this.coord[0] + position.coord[0], this.coord[1] + position.coord[1]];
  };

  Coord.prototype.equals = function (position) {

    return (this.coord[0] === position.coord[0]) && (this.coord[1] === position.coord[1]);
  };

  Coord.prototype.isOpposite = function (position) {

    return (this.coord.coord[0] === ((position.coord.coord[0])*-1)) || (this.coord.coord[1] === ((position.coord.coord[1])*-1));
  };

  Snake.prototype.move = function () {



    var dir = this.moveDirection(this.direction);
    var last = this.segments.length - 1;
    this.turning = false;
    var newcoord = this.segments[last].plus(dir);
    this.segments.push(new Coord(newcoord));
    if (this.eatApple()) {
        this.board.apple.reset();

      }

    if (this.growTurns > 0) {
      this.growTurns -= 1;
    } else {
      this.segments.shift();
    }
    if (!this.isValid()) {
         this.segments = [];
    }




  };

  Snake.prototype.turn = function (dir) {
    var x = new Coord(this.moveDirection(this.direction));
    var y = new Coord(this.moveDirection(dir));
    if(x.isOpposite(y) || this.turning){
      return;
    } else {
      this.turning = true;
      this.direction = dir;
    }

    if (!this.isValid()) {
        this.gameOver = true;
    }

  };

  Board.prototype.validPosition = function (coord) {

      return (coord.coord[0] >= 0) && (coord.coord[0] < 20) &&
        (coord.coord[1] >= 0) && (coord.coord[1] < 20);
  };

  // var test = new Board();
  // test.render();

})();
