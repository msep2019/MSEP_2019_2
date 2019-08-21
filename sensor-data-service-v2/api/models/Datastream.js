'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Datastream = new Schema({
  "id": {
    type: String,
    required: 'Datastream id',
    index: true,
    unique: true    
  },  
  "sensor": {
      type: String,
      required: 'Sensor'
  },
  "thing": {
    type: String,
    required: 'Sensor'
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
