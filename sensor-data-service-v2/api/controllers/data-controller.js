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
var influx_connection = require("../models/influxdb-connection");
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

function data_acuqire(req,res){
   count.query('SELECT * FROM "test"').then(result => {
       res.json(result)}).catch(err => {
           res.status(500).send(err,stack)
   })
};

exports.data_acquire = data_acquire;
    


//// find out the data within 5 mins
//exports.get_stream = function(req,res){
//    count.query('SELECT * FROM "temperature" WHERE time > now() - 5m').then(result => {
//        res.json(result)}).catch(err => {
//        res.status(500).send(err,stack)
//    })
//};


//app.listen(3000);
//console.log("IoT data server started on port: " + "3000");
