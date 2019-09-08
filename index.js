/*AWS Application Load Balancer health check*/
const http = require('http');

const requestHandler = (request, response) => {
    response.statusCode=200;
    response.end();
}
const server = http.createServer(requestHandler)
  
server.listen(8080, (err) => {
    if (err) {
      return console.log('something bad happened', err)
    }
    console.log(`health check is listening`)
  })
/*End health check code*/


const WebSocket = require('ws');
let connected=0;
const io = require('socket.io')(http, {
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

  ws.on('count',function incoming(data) {
    ws.emit('count',connected);
  })

  ws.on('disconnect',()=>{
      connected--
  })
});




