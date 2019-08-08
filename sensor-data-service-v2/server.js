var express = require("express"), app = express(), port = process.env.port || 5000;


const Influx = require('influx');
const influx = new Influx.InfluxDB({
    host: '34.67.130.25',
    port: 8086,
    database: 'mainflux',
    username: 'admin',
    password: ''
  });
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
  

influx.getDatabaseNames().then(names => 
    {
        console.log(names);
    });
var routes = require('./api/routes/data-route'); //importing route
routes(app); //register the route    
app.listen(port);
console.log("IoT data server started on port: " + port);


