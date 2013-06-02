function connect()
{
	var url = window.location.protocol + "//" + window.location.host;
	var socket = io.connect(url);
	socket.on('new-letter', newLetter);
}

function newLetter(letter, value) {
	$('<div data-letter="' + letter + '" data-value="' + value + '" class="tile" />')
	  .hide()
	  .appendTo('#available')
	  .fadeIn('slow');
}