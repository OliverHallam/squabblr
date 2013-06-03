function connect()
{
	var url = window.location.protocol + "//" + window.location.host;
	var socket = io.connect(url);
	socket.on('new-letter', newLetter);
}

function intersectsTile(x, y, w, h, p) {
	var tiles = $('#available .tile')
	var length = tiles.length;
	for (var i = 0; i < length; i++) {
	  var tile = $(tiles[i]);
	  var position = tile.position();
	  if (position.left + tile.innerWidth() >= x - p &&
	  	  position.left <= x + w + p &&
	  	  position.top + tile.innerHeight() >= y - p &&
	  	  position.top <= y + h + p)
	  	return true;
	}
	return false;
}

function rotate(elem, degree) {
    elem.css({ '-webkit-transform': 'rotate(' + degree + 'deg)'});
    elem.css({ '-moz-transform': 'rotate(' + degree + 'deg)'});
    elem.css({ '-o-transform': 'rotate(' + degree + 'deg)'});
    elem.css({ 'transform': 'rotate(' + degree + 'deg)'});
}

function letterValue(letter) {
	switch (letter) {
		case 'A':
		case 'E':
		case 'I':
		case 'L':
		case 'N':
		case 'O':
		case 'R':
		case 'S':
		case 'T':
		case 'U':
			return 1;
		case 'D':
		case 'G':
			return 2;
		case 'B':
		case 'C':
		case 'M':
		case 'P':
			return 3;
		case 'F':
		case 'H':
		case 'V':
		case 'W':
		case 'Y':
			return 4;
		case 'K':
			return 5;
		case 'J':
		case 'X':
			return 8;
		case 'Q':
		case 'Z':
			return 10;
		default:
			return '';
	}
}

function newLetter(letter) {
	var available = $('#available')
	
	// try to find a gap this tile will fit in
	for (var i=0; i<100; i++) {
		var x=Math.floor(Math.random() * (available.width() - 60));
		var y=Math.floor(Math.random() * (available.height() - 60));
		if (intersectsTile(x, y, 60, 60, 8) === false)
			break;
	}

	var rotation = Math.random() * 8 - 4;

	var elem =$('<div data-letter="' + letter + '" data-value="' + letterValue(letter) + '" class="tile" />')
	    .hide()
	    .appendTo('#available')
	    .offset({top: y, left: x});
	rotate(elem, rotation);
	elem.fadeIn('slow');
}