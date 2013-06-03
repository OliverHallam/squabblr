var _ = require('underscore');
var fs = require('fs');

var dictText = fs.readFileSync('./dictionaries/sowpods.txt', 'UTF-8');
var dict = dictText.split('\r\n');

exports.run = function(socket) {
    
  setInterval(newLetter, 2000)

  socket.on('submit-word', function (data) {
  	var data = data.toUpperCase();
  	if (_.contains(dict, data))
  		socket.emit('word-accepted', data);
  	else
    	socket.emit('word-rejected', data);
  })

  function newLetter() {
  	var letterIndex = Math.floor(Math.random() * 26)
  	var letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(letterIndex);
    socket.emit('new-letter', letter)
  }
}