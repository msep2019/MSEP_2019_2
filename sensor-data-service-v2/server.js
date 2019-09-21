var express = require("express"), app = express(), port = process.env.port || 5000;



const Influx = require('influx');
const influx = new Influx.InfluxDB({
    host: '34.69.148.86',
    port: 8086,
    database: 'mainflux',
    username: 'admin',
    password: ''
  });
  
var mongoose = require('mongoose');
  // mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://34.69.148.86/iot'); 
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
var Datastream = require('./api/models/Datastream'), //created model loading here
 bodyParser = require('body-parser');
var Location =require('./api/models/Location');

var Sensor = require('./api/models/sensor');
var Thing = require('./api/models/Thing');
var Thing = require('./api/models/DatastreamTagMapping');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  

var routes = require('./api/routes/data-route'); //importing route
routes(app); //register the route    
app.listen(port);
console.log("IoT data server started on port: " + port);


