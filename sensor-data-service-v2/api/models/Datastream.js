'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Datastream = new Schema({
  "sensor_id": {
      type: String,
      required: 'Sensor'
  },
  "thing_id": {
    type: String,
    required: 'Thing'
  },
  name: {
      type: String,
      required: 'Name of datastream'
  },
  description: {
    type: String,
    required: 'Description of datastream'
  },
  unitOfMeasurement: {
      type: Map
  },
  phenomenonTime: {
      type: String
  },
  resultTime: {
      type: String
  }
});
module.exports = mongoose.model('Datastream', Datastream);
