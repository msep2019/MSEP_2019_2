//var express = require('express');
//var app = express();

//link to influxdb
//const influx = require('influx');
//setup client
//const count = new influx.InfluxDB({
//    host : '127.0.0.1',
//    port: 8086,
//    username: 'admin',
//    password: '',
//    database: 'test', 
//    table: 'test'
//});

//use configuration in influxdb-connection.js
var influx_connection = require("../models/influxdb-connection");
var influxdb = influx_connection.influx;
//deal with unhandleedRejectionWarning
process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
});

new Promise((_, reject) => reject(new Error('oops')))
    .catch(error => { console.log('caught', error.message); });

//get the data from database
//app.get('/', function(req,res){
//    count.query('SELECT * FROM "test"').then(result => {
//        res.json(result)}).catch(err => {
//            res.status(500).send(err,stack)
//    })
//})

//// find out the data within 5 mins
//function data_acuqire(req,res){
//    count.query('SELECT * FROM "temperature" WHERE time > now() - 5m').then(result => {
//        res.json(result)}).catch(err => {
//        res.status(500).send(err,stack)
//    })
//};


//using exports, in order to reuse directly in other js file. Use app.js under 'controllers' folder to test.
//function data_acuqire(req,res){
//   count.query('SELECT * FROM "test"').then(result => {
//       res.json(result)}).catch(err => {
//           res.status(500).send(err,stack)
//   })
//};
//
//exports.data_acquire = data_acquire;

// it can be invoked in the routes/data-route.js 
exports.get_stream = function(req,res){
    influxdb.query('SELECT * FROM "messages"').then(result => {
       res.json(result)}).catch(err => {
           res.status(500).send(err,stack)
   })
};

//app.listen(3000);
//console.log("IoT data server started on port: " + "3000");
