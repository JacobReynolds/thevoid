var socket = io();

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

socket.on('new message', function (data) {
	alert(data.message);
});

// Prevents input from having injected markup
function cleanInput(input) {
	return $('<div/>').text(input).text();
}
