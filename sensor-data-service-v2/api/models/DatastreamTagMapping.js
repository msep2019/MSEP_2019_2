'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DatastreamTagMapping = new Schema({
  "datastream_id": {
      type: String,
      required: 'datastream id'
  },
  "mac": {
    type: String,
    required: 'SensorTag MAC address'
  },
  "sensor": {
      type: String,
      required: 'Type of sensor. For example: light, ambient_temperature'
  }
});
module.exports = mongoose.model('DatastreamTagMapping', DatastreamTagMapping);
