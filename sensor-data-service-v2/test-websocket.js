const WebSocket = require('ws');

const ws = new WebSocket('ws://127.0.0.1:7005/');

ws.on('open', function open() {
  ws.send('datastreams');  
});


ws.on('message', function incoming(data) {
    console.log("Received message %s", data);  
});

