
'use strict';
var influx_connection = require("../models/influxdb-connection");
exports.get_stream = function(req, res) {
    influx_connection.influx.query(`
    select * from messages    
    limit 10
  `).then(result => {
    res.json(result)
  }).catch(err => {
    res.status(500).send(err.stack)
  })
};