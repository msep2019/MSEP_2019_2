'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// TODO: Add iot thing links
var Location = new Schema({
  "@iot.id": {
    type: String,
    required: 'Location id',
    index: true,
    unique: true    
  },
  "@iot.selfLink": {
    type: String,
    required: 'Self link'
  },
  "name": {
      type: String,
      required: 'Name of location'
  },
  "description": {
    type: String,
    required: 'Description of location'
  },
  "encodingType": {
      type: String,
      required: 'Type of encoding'
  },
  "location": {
      type: Map,
      required: 'Location of sensor'
  }
});
module.exports = mongoose.model('Location', Location);
