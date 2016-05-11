var admin = io('/admin');

admin.on('newUser', function (user) {})

admin.on('userLeft', function (user) {
	var id = '#' + getSocketId(user.id);
	$(id).remove();
})

admin.on('connected', function (users) {
	users.users.forEach(function (user) {
		addUser(user.id, user.socketId);
	})
	users.banned.forEach(function (banned) {
		addBanned(banned);
	})
	admin.removeListener('connected');
})

admin.on('userConnected', function (user) {
	addUser(user.id, user.socketId);
})

admin.on('newBlock', function (ipAddress) {
	addBanned(ipAddress);
})

function addUser(id, socketId) {
	$('.users').append('<div class="user col-sm-6 col-md-4 col-lg-2" id="' + getSocketId(socketId) + '">User: ' + id + '<button class="ban btn btn-danger" onclick="ban(\'' + socketId + '\')">Ban</button></div>')
}

function addBanned(ipAddress) {
	$('.banned').append('<div class="user col-sm-12 col-md-4 col-lg-2">IP: ' + ipAddress + '<button class="ban btn btn-success" onclick="unban(this, \'' + ipAddress + '\')">Unban</button></div>')
}

function ban(socketid) {
	admin.emit('ban', socketid);
}

function unban(div, ipAddress) {
	admin.emit('unban', ipAddress);
	$(div).parent().remove();
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
	thevoid(data.message);
	console.log(data.message);
})
