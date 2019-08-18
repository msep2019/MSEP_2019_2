'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: Add iot thing links
var Thing = new Schema({
  "@iot.id": {
    type: String,
    required: 'Thing id',
    index: true,
    unique:true    
  },
  "@iot.selfLink": {
    type: String,
    required: 'Self link'
  },
  "locations@iot.navigationLink": {
      type: String,
      required: 'Locations'
  },
  "historicalLocations@iot.navigationLink": {
    type: String   
  },
  "datastreams@iot.navigationLink": {
    type: String,
    required: 'Datastreams'
  },
  name: {
      type: String,
      required: 'Name of thing'
  },
  description: {
    type: String,
    required: 'Description of thing'
  },
  properties: {
      type: Map
  }
});
module.exports = mongoose.model('Thing', Thing);