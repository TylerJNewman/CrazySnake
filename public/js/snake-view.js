(function () {
  var snakeGame = window.snakeGame = (window.snakeGame || {});

  var View = snakeGame.View = function ($el) {

    this.$el = $el;

    this.board = new snakeGame.Board();

    this.setupGrid();

    this.intervalId = window.setInterval(
      this.step.bind(this),
      100
    );

    $(window).on("keydown", this.handleKeyEvent.bind(this));
  };


  View.KEYS = {
      38: "N",
      39: "E",
      40: "S",
      37: "W"
    };

  View.prototype.handleKeyEvent = function (event) {
    if (View.KEYS[event.keyCode]) {
      this.board.snake.turn(View.KEYS[event.keyCode]);
    }
  };

  View.prototype.render = function () {

    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.apple.position], "apple");

  };

  View.prototype.updateClasses = function(coords, className) {

    this.$li.filter("." + className).removeClass();

    coords.forEach(function(coord){
      var flattenedGridCoord = (coord.coord[0]*20) + coord.coord[1];
      this.$li.eq(flattenedGridCoord).addClass(className);

    }.bind(this));
  };

  View.prototype.setupGrid = function () {
    var htmlStr = "";

    for (var i = 0; i < 20; i++) {
      htmlStr += "<ul>";
      for (var j=0; j < 20; j++) {
        htmlStr += "<li></li>";
      }
      htmlStr += "</ul>";
    }

    this.$el.html(htmlStr);
    this.$li = this.$el.find("li");
  };

  View.prototype.step = function () {
      if (this.board.snake.segments.length > 0) {
        this.board.snake.move();
        this.render();
      } else {
        alert("You lose!");
        window.clearInterval(this.intervalId);
      }
    };

})();
