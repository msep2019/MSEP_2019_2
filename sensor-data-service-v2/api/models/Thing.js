'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// TODO: Add iot thing links
var Thing = new Schema({ 
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