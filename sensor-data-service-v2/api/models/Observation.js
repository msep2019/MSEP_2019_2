'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: Add iot thing links
var Observation = new Schema({
  "@iot.id": {
    type: String,
    required: 'Observation id',
    index: true    
  },
  "@iot.selfLink": {
    type: String,
    required: 'Self link'
  },
  "Datastreams@iot.navigationLink": {
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