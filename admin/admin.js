var admin = io('/admin');

admin.on('newUser', function (user) {})

admin.on('userLeft', function (user) {
	var id = '#' + getSocketId(user.id);
	$(id).remove();
})

admin.on('connected', function (users) {
	users.forEach(function (user) {
		addUser(user.id, user.socketId);
	})
})

admin.on('userConnected', function (user) {
	addUser(user.id, user.socketId);
})

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}

function addUser(id, socketId) {
	$('.users').append('<div class="user col-sm-12 col-md-4 col-lg-2" id="' + getSocketId(socketId) + '">User: ' + id + '<button class="ban btn btn-danger" onclick="ban(\'' + socketId + '\')">Ban</button></div>')
}

function ban(socketid) {
	admin.emit('ban', socketid);
}

//Can't look up the socket id with a '#' in it using jquery
function getSocketId(socketId) {
	return socketId.split('#')[1];
}
//When enter is pressed, shout!
$(".adminShout").keypress(function (e) {
	if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
		socket.emit('new message', $('#adminShout').val());
		$('#adminShout').val('');
	}
});
admin.on('new message', function (data) {
	console.log(data.message);
})
