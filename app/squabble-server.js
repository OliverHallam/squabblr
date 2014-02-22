var _ = require('underscore');
var fs = require('fs');

var dictText = fs.readFileSync('./dictionaries/sowpods.txt', 'UTF-8');
var dict = dictText.split('\r\n');

var isRunning = false;
var sockets = [];
var newLetterInterval;

var gameState =
{
  letters: [],
  players: []
};

exports.connect = function(socket) {
  sockets.push(socket);

  socket.on('disconnect', function() {
    var index = sockets.indexOf(socket);
    sockets.splice(index, 1);
  });

  if (isRunning) {
    socket.emit('set-state', gameState);
  } else {;
    exports.run();
    isRunning = true;
  }

  socket.on('join', function(name) {
    socket.on('submit-word', function(word) { onSubmitWord(socket, word); });

    gameState.players.push(name);
    socket.emit('joined');

    _.each(sockets, function(s) { s.emit('player-joined', name); });
    socket.on('disconnect', function() {
      gameState.players.splice(gameState.players.indexOf(name), 1);
      _.each(sockets, function(s) { s.emit('player-disconnected', name); });
    });
  });
};

exports.run = function() {
  console.log('Started game');

  newLetterInterval = setInterval(newLetter, 2000);
};

function newLetter() {
  var letterIndex = Math.floor(Math.random() * 26);
  var letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(letterIndex);
  
  gameState.letters.push(letter);
  _.each(sockets, function(socket) { socket.emit('new-letter', letter); });

  if (gameState.letters.length === 10) {
    clearInterval(newLetterInterval);
  }
}

function isValidWord(data) {
  if (data == null || data.length === 0)
    return false;

  // first, check whether we have enough letters
  var letterIndexes = [];
  for (var i = 0; i < data.length; i++) {
    var letter = data[i];
    var index = -1;
    do {
      index = gameState.letters.indexOf(letter, index + 1);
      if (index < 0)
        return false;
    } while (_.contains(letterIndexes, index))

    letterIndexes.push(index);
  }

  // second, check that the word is actually a word
  return _.contains(dict, data);
}

function onSubmitWord(socket, data) {
  data = data.toUpperCase();

  if (isValidWord(data))
    socket.emit('word-accepted', data);
  else
    socket.emit('word-rejected', data);
};
