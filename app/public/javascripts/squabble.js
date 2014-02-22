function connect()
{
  var url = window.location.protocol + "//" + window.location.host;
  var socket = io.connect(url);
  socket.on('set-state', setState);
  socket.on('joined', joined);
  socket.on('player-joined', playerJoined);
  socket.on('player-disconnected', playerDisconnected);
  socket.on('start-game', startGame);
  socket.on('new-letter', newLetter);
  socket.on('word-accepted', wordAccepted);
  socket.on('word-rejected', wordRejected);

  $('#join').submit(function(event) {
    event.preventDefault();
    $('#join input').prop('disabled', true);
    socket.emit('join', $('#input-name').val());
  });

  $('#button-watch').click(function() {
    $('#login').hide();
    $('#fade').fadeOut(1000);
  });

  $('#ready').submit(function(event) {
    event.preventDefault();
    $('#ready input').prop('disabled', true);
    socket.emit('ready');
  });

  $('#submit-word').submit(function(event) {
    event.preventDefault();
    socket.emit('submit-word', $('#input-word').val());
  });
}

function setState(state) {
  var lettersLength = state.letters.length;
  for (var i = 0; i<lettersLength; i++) {
    newLetter(state.letters[i]);
  }

  var playersLength = state.players.length;
  for (i = 0; i<playersLength; i++) {
    playerJoined(state.players[i].name);
  }
}

function joined() {
  $('#login').hide();
  $('#waiting').show();
}

function startGame() {
  $('#waiting').hide();
  $('#fade').fadeOut(1000);
  $('#input-word').slideDown(1000).focus();
}

function playerJoined(name) {
  $('#players').append("<div data-player='" + name + "'>" + name + "</div>");
}

function playerDisconnected(name) {
  var player = $('#players div[data-player="' + name + '"]');
  player.slideUp(1000, function() { player.remove(); });
}

function wordAccepted(word) {
  $('#input-word').val('');
}

function wordRejected(word) {
  $('#input-word').stop().css('color', '#f00')
    .animate({ 'color': '#000' }, 500);
}

function newLetter(letter) {
  var available = $('#available');
  addTile(available, letter);
}