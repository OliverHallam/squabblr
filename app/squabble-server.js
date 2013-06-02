exports.run = function(socket) {
  setInterval(newLetter, 2000)


  function newLetter() {
    socket.emit('new-letter', 'A', 1)
  }
}