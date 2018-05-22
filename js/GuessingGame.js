// Game class
function Game() {

    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();

}

// Prototype methods
// Game.prototype.difference - difference in guess and number
Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

// Game.prototype.isLower - returns boolean representing guess lower/higher than winningNumber
Game.prototype.isLower = function() {
    return this.winningNumber > this.playersGuess;
}

// Game.prototype.checkGuess - returns 'You Win!' if guess is right
Game.prototype.checkGuess = function(guess) {
    this.playersGuess = guess;

    if(guess === this.winningNumber) { 
        return 'You Win!';
    }
    else if(this.pastGuesses.includes(guess)) {
        return 'You have already guessed that number.';
    }
    else {
        this.pastGuesses.push(guess);

        if(this.pastGuesses.length === 5) {
            return 'You Lose.';
        }
        else if(this.difference() < 10) {
            return 'You\'re burning up!';
        }
        else if(this.difference() < 25) {
            return 'You\'re lukewarm.';
        }
        else if(this.difference() < 50) {
            return 'You\'re a bit chilly.';
        }
        else {
            return 'You\'re ice cold!';
        }
    }
}

// Game.prototype.playersGuessSubmission - takes in player guess, makes sure it's valid
Game.prototype.playersGuessSubmission = function(guess) {
    if(guess < 1 || guess > 100 || typeof(guess) !== 'number') {
        throw "That is an invalid guess.";
    }
    else {
        return this.checkGuess(guess);
    }
}

// Game.prototype.provideHint - generates array of hints using shuffle and generateWinningNumber
Game.prototype.provideHint = function() {
    var arr = [generateWinningNumber(), generateWinningNumber(), this.winningNumber];

    return shuffle(arr);

}


// newGame - returns empty, new game instance
function newGame() {
    return new Game();
}

// generateWinningNumber - returns decimal from 0 up to 100 (not including)
function generateWinningNumber() {
    var result = Math.floor(Math.random() * 100);
    
    if(result) {
        return result + 1;
    }
    else {
        return 1;
    }
}

// shuffle - fisher-yates shuffle algorithm
// Takes array as arg, returns array that is shuffled in place
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

// Add a guess to the shown list
var addGuessToList = function(guess) {
    $('.guess:last').remove()

    // insert new text to top of li list
    $('#guess-list').prepend('<li class="guess">' + guess + '</li>');
}

var showMessages = function(game, response, guess) {
    // Update h1 based on the response
    if(response === 'You have already guessed that number.') {
        $('#title').text(response);
    }
    else if(response === "You Win!" || response === "You Lose.") {
        addGuessToList(guess);
        $('#hint').prop("disabled",true);
        $('#submit').prop("disabled",true);
        $('#title').text(response);
        $('#subtitle').text('Press the Reset button to play again!');
    }
    else {
        addGuessToList(guess);
        $('#title').text(response);

        if(game.isLower()) {
            $('#subtitle').text('Guess Higher!')
        }
        else {
            $('#subtitle').text('Guess Lower!')
        }
    }
}

// makeGuess - function for jQuery interactivity
var makeGuess = function(game) {
    var guess = +$('#player-input').val();
    $('#player-input').val('');
    var response = game.playersGuessSubmission(guess);
    
    // Update h1 based on the response
    showMessages(game, response, guess);
}

// resetGame - function for jQuery game reset
var resetGame = function() {
    // reset all text
    $('#title').text('Play the Guessing Game!');
    $('#subtitle').text('Guess a number between 1-100!');
    $('.guess').text('-');

    //reset buttons
    $('#hint, #submit').prop("disabled",false);
}

// All jQuery code
$(document).ready(function() { 
    // create a new game instance
    var game = newGame();

    // When a user submits a guess, receive input
    $("#submit").click(function(e) {
        makeGuess(game);
    });

    $('#player-input').keypress(function(e){
        if(e.which == 13) {
            makeGuess(game);
        }
    });

    // Reset the game
    $('#reset').click(function(e) {
        resetGame();
        game = newGame();
    })

    // Give the user hints
    $('#hint').click(function(e) {
        var hints = game.provideHint()
        $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    })

});

