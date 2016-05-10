// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var crypto = require('crypto');
var port = process.env.PORT || 8080;
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var currentUsers = 0;
var sessionKeys = [];
var sessionCookieName = 'sessionid';
var password = process.env.ADMINPASSWORD;
var publicPath = __dirname + '/public';
var adminPath = __dirname + '/admin';
var userIds = [];
var userIdIndex = 0;
app.set('views', 'public');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));
app.use('/admin', express.static(__dirname + '/admin'));
app.use(favicon('public/favicon.ico'));
app.get('/users', function (req, res) {
	res.send(currentUsers.toString());
});

app.get('/admin', function (req, res) {
	if (verifySessionId(req)) {
		res.sendFile(adminPath + '/admin.html');
	} else {
		res.redirect('/login')
	}
});

app.get('/login', function (req, res) {
	res.sendFile(publicPath + '/login.html');
});

app.post('/attemptLogin', function (req, res) {
	if (req.body.password === password) {
		var sessionId = generateKey();
		while (sessionKeys.indexOf(sessionId) > -1) {
			sessionId = generateKey();
		}
		res.cookie(sessionCookieName, sessionId, {});
		res.send(true);
		addId(sessionId);
	} else {
		res.send(false);
	}
})
var thevoid = io.of('/void');
var admin = io.of('/admin');
thevoid.on('connection', function (socket) {
	currentUsers++;
	var user = {
		id: userIdIndex,
		socketId: socket.id
	};
	userIds.push(user);
	admin.emit('userConnected', user);
	// when the client emits 'new message', this listens and executes
	socket.on('new message', function (data) {
		// we tell the client to execute 'new message'
		data = data.substring(0, 300);
		thevoid.emit('new message', {
			message: data,
		});
		admin.emit('new message', {
			message: 'User ' + user.id + ' says: ' + data
		})
	});

	socket.on('disconnect', function () {
		currentUsers--;
		removeUser(socket.id);
		admin.emit('userLeft', {
			id: socket.id
		})
		if (currentUsers == 1) {
			thevoid.emit('alone');
		}
	})

	//Don't send it to the user who just logged on
	//only send it to the other lone user
	if (currentUsers == 2) {
		socket.broadcast.emit('newUser');
	}
	userIdIndex++;
});

admin.on('connection', function (socket) {
	var authToken = getCookie(sessionCookieName, socket.handshake.headers.cookie);
	if (!authToken || !verifySessionId(authToken)) {
		socket.disconnect();
	}
	admin.emit('connected', userIds)
	socket.on('ban', function (socketId) {
		if (socketId) {
			thevoid.connected[socketId].emit('ban', 'http://bfy.tw/5h1b');
		}
	})
})

function removeUser(socket) {
	var index = -1;
	for (var i = 0; i < userIds.length; i++) {
		if (userIds[i].socketId === socket) {
			index = i;
			break;
		}
	}
	if (index > -1) userIds.splice(index, 1);
}

var generateKey = function () {
	var sha = crypto.createHash('sha256');
	sha.update(Math.random().toString());
	return sha.digest('hex');
};

function verifySessionId(req) {
	if (req.cookies) {
		var cookie = req.cookies[sessionCookieName];
		return sessionKeys.indexOf(cookie) > -1;
	} else if (req) {
		return sessionKeys.indexOf(req) > -1;
	} else {
		return false;
	}
}


//Should already have verified that sessionId is not in sessionKeys
function addId(sessionId) {
	sessionKeys.push(sessionId);
	setTimeout(function () {
		var index = sessionKeys.indexOf(sessionId);
		sessionKeys.splice(index, 1);
	}, 3600000);
}


function getCookie(name, cookie) {
	var value = "; " + cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}

app.all('*', function (req, res) {
	res.redirect("/");
});
