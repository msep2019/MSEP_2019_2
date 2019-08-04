var express = require("express"), app = express(), port = process.env.port || 5000;


const Influx = require('influx');
const influx = new Influx.InfluxDB({
    host: '34.67.130.25',
    port: 8086,
    database: 'mainflux',
    username: 'admin',
    password: ''
  });

influx.getDatabaseNames().then(names => 
    {
        console.log(names);
    });
app.listen(port);
console.log("IoT data server started on port: " + port);

