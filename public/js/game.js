(function () {

var Game = window.Game = window.Game || {};

var Play = Game.Play = function($el, firstGame) {
  console.log("Game.Play");

  // instantiate canvas and queue of directions
  this.$el = $el;
  this.board = new Game.Board(this.$el);
  this.dirQueue = [];

  this.firstGame = firstGame;

  this.gameOver = false;

  // set boolean flag for togglePlay()
  this.newGame = true;

  // setup keypress shortcuts
  this.configureKeys();
  Game.Config.fps = 10;

  // retrieve high score from cookie
  this.stats = new Game.Stats().retrieveHighScore();
  if (!this.firstGame) {
    $(".high-score").html(
      "Top Score: " + this.stats.highScore
    );

  }

  // set timed delay on border illumination
  this.delayIntroAnimation();

  this.flashPlayButton = setInterval( function () {


  $("#press-play").addClass('animated flash');
          var wait = window.setTimeout( function(){
              $("#press-play").removeClass('animated flash')}, 1300
          );
  }, 8000);




  // show start button and keyboard shortcuts
  $("#start-button").fadeIn(1600);
  $("#config").fadeIn(1500);

  // start button begins new game
  $("#start-button").click(function () {
    $("#config").fadeOut(1500);
    this.unPause();
    this.beginGameSequence();
    this.newGame = false;
  }.bind(this));

};

Play.prototype.delayIntroAnimation = function () {
  setTimeout(function () {
   this.board.introAnimation();
  }.bind(this), 2400);
};


Play.prototype.loopPlay = function () {

  var game = this;
  game.inPlay = true;

  // initialize loop
  game.loop = setInterval( function () {

    // adjust board
    game.adjustDir();

    // render board unless game is lost
    if (!game.lost) {
      game.renderBoard();
    } else {
      clearInterval(game.loop);
      game.inPlay = false;
    }

  }, 1000 / Game.Config.fps );

};

Play.prototype.adjustDir = function () {

  // change direction, move snake, update apples
  this.changeDirs();
  this.board.adjust();

  // reset boolean after adjusting for change in direction
  this.alreadyChangedDirs = false;

  // check if snake is along the side of the wall
  new Game.Wall().checkOnEdge(this);

  // check if snake is eating itself
  this.checkForLoss();

  // update current score
  var currentScore = this.board.snake.length();
  this.stats.adjustCounter(currentScore);

  if(this.board.snake.eating) {
    Game.Config.fps += 1;
    clearInterval(this.loop);
    this.loopPlay();
  }


};

Play.prototype.beginGameSequence = function () {
  $("#start-button").fadeOut(600, function() {
      clearInterval(this.flashPlayButton);
      this.loopPlay();
      this.newGame = false;
      this.firstGame = false;
    }.bind(this));
};


Play.prototype.blinkOut = function ($block) {
  $block.css("background-color", "white");
  $block.css("transition", "opacity 1s");
  $block.one("transitionend", function() {
    $block.css("background-color", "#47ff7e");
    $block.css("transition", "opacity 1.5s");
  });
  $block.css("opacity", "0");
};

Play.prototype.checkForLoss = function () {
  // || this.offBoard(this.board.snake.headPos)
  if (this.board.snake.eatingSelf()) { this.lossSequence(); }
};

Play.prototype.changeDirs = function () {

  // prevent function from overlapping with itself
  if (this.alreadyChangedDirs || this.dirQueue.length === 0) return;
  this.alreadyChangedDirs = true;

  // change direction based of next item in queue
  this.board.snake.changeDir(this.dirQueue.shift());
};

Play.prototype.configureKeys = function () {

  var game = this;

  key('up', function () { game.queueDirShift(new Game.Coord(0, -1)); } );
  key('left', function () { game.queueDirShift(new Game.Coord(-1, 0)); });
  key('down', function () { game.queueDirShift(new Game.Coord(0, 1)); });
  key('right', function () { game.queueDirShift(new Game.Coord(1, 0)); });
  key('space', function () {
    if (game.readyToBegin) {
      $("#config").fadeOut(1500);
      game.unPause();
      game.beginGameSequence();
      game.newGame = false;
    } else {
      game.togglePlay();
    }

  });
  key('q', function () {
    if (game.inPlay) game.lossSequence();
  });
};




Play.prototype.lossSequence = function () {
  // update high score
  this.logHighScore();

  var game = this;

  // prevent board from rendering
  this.lost = true;
  game.readyToBegin = false;




  // this.togglePlay();
  this.pause();

  this.gameOverAnimation();


};

Play.prototype.gameOverAnimation = function () {

  var game = this;

  this.gameOver = true;

  $(".game-over").css("opacity", "1").css("top", "-300px");

  setTimeout(function () {
    $(".countdown-block").css("opacity", "1");
  }, 0);

  $(".countdown-blocks").one("transitionend", function() {

    setTimeout(function () {
      game.blinkOut($(".countdown-blocks .block-1"));
    }, 200 );

    setTimeout(function () {
      game.blinkOut($(".countdown-blocks .block-2"));
    }, 600);

    setTimeout(function () {
      game.blinkOut($(".countdown-blocks .block-3"));
    }, 1200);

    setTimeout(function () {
      $(".game-over").css("transition", "opacity 1.5s");
      $(".game-over").css("opacity", "0");
    }, 1500);

    setTimeout(function () {
      game.reset();
      game.newGame = true;
    }, 1600);

    });
};



Play.prototype.logHighScore = function () {
  // set cookie to max of current score and previous high score
  var currentScore = this.board.snake.length();
  debugger;
  document.cookie = "high_score=" +
    Math.max(currentScore, this.stats.highScore);

};




Play.prototype.queueDirShift = function (dir) {
  //implementing queue so that users can make moves in quick succession
  this.dirQueue.push(dir);
  this.changeDirs();


};

Play.prototype.reset = function () {
  var game = this;

  //remove everything but the game info
  this.$el.find(".stopper").remove();
  this.$el.find(".square").remove();

  $("#start-button").fadeIn(1600, function() {
    game.readyToBegin = true;
    clearInterval(game.loop);
    newGame = new Game.Play($el, false);

  }.bind(this));
};

Play.prototype.renderBoard = function () {
  this.board.render(this.$el);
};

Play.prototype.pause = function () {
  var game = this;
  game.$el.addClass("paused");
  clearInterval(game.loop);
  game.inPlay = false;
  game.paused = true;
};

Play.prototype.unPause = function () {
  this.$el.removeClass("paused");
  // this.loopPlay();
  // this.inPlay = true;
  this.paused = false;
};

Play.prototype.togglePlay = function () {
  if (this.gameOver) return;

  console.log("togglePlay");
  var game = this;

  if(this.newGame) {

    this.beginGameSequence();
    this.newGame = false;
    console.log("this.beginGameSequence();");

  } else if (this.paused) {

    this.$el.removeClass("paused");
    this.loopPlay();
    this.paused = false;

      $(".me-info").css("transition", ".5s").css("opacity", "0");
      $(".me-info").one("transitionend", function() {
        $(".me-info").css("transition", "1.5s").css("top", "-300px");
      });


  } else {

    this.$el.addClass("paused");
    clearInterval(game.loop);
    game.inPlay = false;
    this.paused = true;
    if (!this.lost) {
      $(".me-info").css("opacity", "1").css("top", "-420px");
    }

  }
};

})();
