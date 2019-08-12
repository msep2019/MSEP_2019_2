
'use strict';
var influx_connection = require("../models/influxdb-connection");
var mongoose = require('mongoose'),
  Datastream = mongoose.model('Datastream');
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

exports.get_data_stream = function(req, res) {
  var stream_id = req.params.id;
  var full_id = `\"urn:dev:mac:` + stream_id + '\"';
  console.log("Stream id " + full_id);
  var limit = req.param.limit || 10;
  // TODO: format query
  influx_connection.influx.query(`
  SELECT * FROM messages WHERE \"name\" = ` + `\'urn:dev:mac:` + stream_id + '\'' +
  `limit ` + limit
).then(result => {
  res.json(result)
}).catch(err => {
  res.status(500).send(err.stack)
})
};

exports.add_data_stream = function(req, res) {
  console.log('Add data stream');
  
  var new_datastream = new Datastream(req.body);
  new_datastream.save(function(err, datastream) {
    if (err)
      res.send(err);
    res.json(datastream);
  });
  
  
};