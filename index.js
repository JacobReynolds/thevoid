const WebSocket = require('ws');
let connected=0;
const io = require('socket.io')(8080, {
    path: '/',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false,
    origins: '*:*'
  });

io.on('connection', function connection(ws) {
    connected++;
  ws.on('message', function incoming(data) {
    if (data.length>300) {
        return;
    }
    console.log(`${ws.id}: ${data}`)
    io.emit('message',data);
  });

  ws.broadcast.emit('new user');
  ws.broadcast.emit('count',connected);

  ws.on('count',function incoming(data) {
    ws.emit('count',connected);
  })

  ws.on('disconnect',()=>{
      connected--;
      ws.broadcast.emit('count',connected);
  })
});
