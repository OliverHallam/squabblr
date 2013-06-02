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
    // For webkit browsers: e.g. Chrome
    elem.css({ WebkitTransform: 'rotate(' + degree + 'deg)'});
    // For Mozilla browser: e.g. Firefox
    elem.css({ '-moz-transform': 'rotate(' + degree + 'deg)'});
}

function newLetter(letter, value) {
	var available = $('#available')
	
	// try to find a gap this tile will fit in
	for (var i=0; i<100; i++) {
		var x=Math.floor(Math.random() * (available.width() - 40) + 10);
		var y=Math.floor(Math.random() * (available.height() - 40) + 10);
		if (intersectsTile(x, y, 60, 60, 8) === false)
			break;
	}

	var rotation = Math.random() * 8 - 4;

	var elem =$('<div data-letter="' + letter + '" data-value="' + value + '" class="tile" />')
	    .hide()
	    .appendTo('#available')
	    .offset({top: y, left: x});
	rotate(elem, rotation);
	elem.fadeIn('slow');
}