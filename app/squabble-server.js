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
}

exports.connect = function(socket) {
  sockets.push(socket)

  socket.on('disconnect', function() {
    var index = sockets.indexOf(socket);
    sockets.splice(index, 1);
  });

  if (isRunning) {
    socket.emit('set-state', gameState)
  } else {
    exports.run();
    isRunning = true;
  }

  socket.on('join', function(name) {
    socket.on('submit-word', function(word) { onSubmitWord(socket, word) });

    gameState.players.push(name);
    socket.emit('joined');

    _.each(sockets, function (socket) { socket.emit('player-joined', name)});
    socket.on('disconnect', function() {
      gameState.players.splice(gameState.players.indexOf(name), 1);
      _.each(sockets, function(socket) { socket.emit('player-disconnected', name) })
    })
  });
}

exports.run = function() {
  console.log('Started game')

  newLetterInterval = setInterval(newLetter, 2000);
}

function newLetter() {
  var letterIndex = Math.floor(Math.random() * 26)
  var letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(letterIndex);
  
  gameState.letters.push(letter);
  _.each(sockets, function (socket) { socket.emit('new-letter', letter) })

  if (gameState.letters.length === 10) {
    clearInterval(newLetterInterval);
  }
}

function onSubmitWord(socket, data) {
    var data = data.toUpperCase();
    if (_.contains(dict, data))
      socket.emit('word-accepted', data);
    else
      socket.emit('word-rejected', data);
  };
