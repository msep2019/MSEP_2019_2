'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: Add iot thing links
var Datastream = new Schema({
  "@iot.id": {
    type: String,
    required: 'Datastream id',
    index: true,
    unique: true    
  },
  "@iot.selfLink": {
    type: String,
    required: 'Self link'
  },
  "sensor@iot.navigationLink": {
      type: String,
      required: 'Sensors'
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