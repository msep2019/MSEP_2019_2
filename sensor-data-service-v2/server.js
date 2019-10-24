var express = require("express"), app = express(), port = process.env.port || 7000, websocket_port = 7005;
const WebSocket = require('ws');
const Influx = require('influx');
const http = require('http');
const cors = require('cors');

const influx = new Influx.InfluxDB({
    host: '35.224.2.110',
    port: 8086,
    database: 'mainflux',
    username: 'admin',
    password: ''
  });
  
var mongoose = require('mongoose');
  // mongoose instance connection url connection
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://35.239.129.255/iot'); 
mongoose.connect('mongodb+srv://iot-testbed:iot-testbed@cluster0-txati.gcp.mongodb.net/iot?retryWrites=true&w=majority'); 
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var Datastream = require('./api/models/Datastream'), //created model loading here
 bodyParser = require('body-parser');
var Location =require('./api/models/Location');

var Sensor = require('./api/models/sensor');
var Thing = require('./api/models/Thing');
var Thing = require('./api/models/DatastreamTagMapping');
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');    
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  

var routes = require('./api/routes/data-route'); //importing route
routes(app); //register the route   
app.use(cors());
app.options('*', cors());
// TODO: Remove this line in future. Currently used for testing
app.use(cors({credentials: true, origin: '*'}));
app.listen(port);
console.log("IoT data server started on port: " + port);
const server = http.createServer(app);
// Start websocket 
const wss = new WebSocket.Server({server});
console.log("IoT data server websocket started on port: " + websocket_port);

var data_stream_controller = require('./api/controllers/data-stream-controller');

// Register events for websocket server
wss.on("connection", async function connection(ws) {
  console.log("------------------Web socket--------------------- ");
  // console.log(ws);
  ws.on('message', async function incoming(message) {
    console.log('received: %s', message);
    if (message == 'datastreams') {
      // console.log(JSON.stringify(data_stream_controller.getAllDatastreams()));
      datastream_result = await data_stream_controller.getAllDatastreams();
      console.log("Test async");
      setTimeout(function() {
        console.log("Result " + datastream_result);
        if (datastream_result != null) {
          console.log(datastream_result[0]['@iot.id']);
          ws.send(JSON.stringify(datastream_result));
        }
      }, 3000);
      
    } else {
      ws.send(JSON.stringify({"message":"successfully received message"}));
    }
  });
});
server.listen(websocket_port);


