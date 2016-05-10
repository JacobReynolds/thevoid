// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8080;
var favicon = require('serve-favicon');
var currentUsers = 0;

server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));
app.use(favicon('public/favicon.ico'));
app.get('/users', function (req, res) {
	res.send(currentUsers.toString());
});
io.on('connection', function (socket) {
	currentUsers++;
	// when the client emits 'new message', this listens and executes
	socket.on('new message', function (data) {
		// we tell the client to execute 'new message'
		io.sockets.emit('new message', {
			message: data.substring(0, 300)
		});
	});

	socket.on('disconnect', function () {
		currentUsers--;
		if (currentUsers == 1) {
			io.sockets.emit('alone');
		}
	})

	//Don't send it to the user who just logged on
	//only send it to the other lone user
	if (currentUsers == 2) {
		socket.broadcast.emit('newUser');
	}
});
