exports.run = function(socket) {
  setInterval(newLetter, 2000)

  socket.on('submit-word', function (data) {
    socket.emit('word-rejected', data);
  })

  function newLetter() {
  	var letterIndex = Math.floor(Math.random() * 26)
  	var letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(letterIndex);
    socket.emit('new-letter', letter)
  }
}