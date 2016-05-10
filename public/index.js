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
	$('.void').append('<div class="echo" id="' + id + '">' + message + '</div>');
	//Animation calculations
	var fromX = getRandom(0, $('.void').width());
	var fromY = getRandom(0, $('.void').height());
	var toX = getRandom(0, $('.void').width());
	var toY = getRandom(0, $('.void').height());
	var echo = $('#' + id);
	var fontSize = getFontSize(message);
	var echoWidth = getWidth($(echo).width());
	//We need to set these before calculating overflow, because they can change the height/width
	$(echo).css({
		width: echoWidth,
		'font-size': fontSize
	});
	//Don't let text go off screen
	var xOverflow = (toX + echoWidth) - $('.void').width();
	if (xOverflow > 0) {
		toX -= xOverflow;
	}
	//Don't let text go off screen
	var yOverflow = (toY + $(echo).height()) - $('.void').height();
	if (yOverflow > 0) {
		toY -= yOverflow;
	}
	//Animation sequence
	$(echo).css({
		top: fromY,
		left: fromX,
		'font-size': fontSize
	})
	$(echo).animate({
		top: toY,
		left: toX,
		opacity: 1
	}, 2000)

	//Get rid of it
	destroyEcho(echo);
	id++;
}

function destroyEcho(echo) {
	//Destroy the echo
	setTimeout(function () {
		$(echo).animate({
			opacity: 0
		}, 1500)
		setTimeout(function () {
			$(echo).remove();
		}, 1500)
	}, 2000)
}

function getWidth(width) {
	return getRandom(200, Math.min(width, 400));
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

$(document).ready(function () {
	$.get('/users', function (data) {
		if (data == 1) {
			$('.alone').css('display', 'block');
			$('.alone').animate({
				opacity: 1
			}, 2500)
		}
	})
})


socket.on('newUser', function () {
	$('.alone').animate({
		opacity: 0
	}, 2500)
	setTimeout(function () {
		$('.alone').css('display', 'none');
	}, 2500);
	thevoid('A user has connected, can you hear them?');
});

socket.on('alone', function () {
	$('.alone').css('display', 'block');
	$('.alone').animate({
		opacity: 1
	}, 2500)
});
