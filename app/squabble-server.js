var _ = require('underscore');
var fs = require('fs');

var dictText = fs.readFileSync('./dictionaries/sowpods.txt', 'UTF-8');
var dict = dictText.split('\r\n');

var isRunning = false;
var sockets = [];

var gameState = 
{
  letters: []
}

exports.connect = function(socket) {
  sockets.push(socket)

  if (isRunning) {
    socket.emit('set-state', gameState)
  } else {
    exports.run();
    isRunning = true;
  }

  socket.on('submit-word', onSubmitWord);
}

exports.run = function() {
  console.log('Started game')

  setInterval(newLetter, 2000)
}

function newLetter() {
  var letterIndex = Math.floor(Math.random() * 26)
  var letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(letterIndex);
  
  gameState.letters.push(letter);
  _.each(sockets, function (socket) { socket.emit('new-letter', letter) })
}

function onSubmitWord(data) {
    var data = data.toUpperCase();
    if (_.contains(dict, data))
      socket.emit('word-accepted', data);
    else
      socket.emit('word-rejected', data);
  };
