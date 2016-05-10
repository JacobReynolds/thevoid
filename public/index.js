var socket = io();
var id = 0;
// Sends a chat message
function shout() {
	var message = $('#shout').val();
	// Prevent markup from being injected into the message
	message = cleanInput(message);
	// if there is a non-empty message and a socket connection
	if (message) {
		$('#shout').val('');
		// tell server to execute 'new message' and send along one parameter
		socket.emit('new message', message);
	}
}

//When enter is pressed, shout!
$(".shout").keypress(function (e) {
	if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
		shout();
	}
});

socket.on('new message', function (data) {
	thevoid(data.message);
});

function thevoid(message) {
	$('.void').append('<span class="echo" id="' + id + '">' + message + '</span>');
	//Animation calculations
	var fromX = getRandom(0, $('.void').width());
	var fromY = getRandom(0, $('.void').height());
	var toX = getRandom(0, $('.void').width());
	var toY = getRandom(0, $('.void').height());
	var echo = $('#' + id);
	var fontSize = getFontSize(message);
	var echoWidth = getWidth($('.void').width());
	//Don't let text go off screen
	if (toX + echoWidth > $('.void').width()) {
		toX -= echoWidth;
	}
	if (toY + $(echo).height() > $('.void').height()) {
		toY -= $(echo).height();
	}
	//Animation sequence
	$(echo).css({
		top: fromY,
		left: fromX,
		width: echoWidth,
		'font-size': fontSize
	})
	$(echo).animate({
		top: toY,
		left: toX,
		opacity: 1
	}, 2000)

	//Destroy the echo
	setTimeout(function () {
		$(echo).animate({
			opacity: 0
		}, 1500)
	}, 2000)
	id++;
}

function getWidth(max) {
	return getRandom(200, Math.min(max, 400));
}

function getFontSize(message) {
	if (message.length <= 24) {
		return 32;
	} else if (message.length <= 48) {
		return 26
	} else if (message.length <= 72) {
		return 24
	} else if (message.length <= 96) {
		return 20
	} else {
		return 16;
	}
}

// Prevents input from having injected markup
function cleanInput(input) {
	return $('<div/>').text(input).html();
}

function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}
