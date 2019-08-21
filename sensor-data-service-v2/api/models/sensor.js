var mongoose = require('mongoose');
var Schema =mongoose.Schema;

var sensor = new Schema({
    "name":{
        type: String,
        required:"MAC address"
    },

    "description":{
        type: String,
        required:"Description"
    },

    "encodingType":{
        type: String,
        required: "encodingType require"
    },

    "metadata":{
        type: String,
        required: "metadata require"
    }
});

module.exports = mongoose.model('sensor', sensor);


