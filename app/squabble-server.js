exports.run = function(socket) {
  setInterval(newLetter, 5000)


  function newLetter() {
    socket.emit('new-letter', 'A', 1)
  }
}