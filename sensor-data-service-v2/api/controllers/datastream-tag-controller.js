var influx_connection = require("../models/influxdb-connection");
var configuration = require("../../configuration.js");
var domainUrl = configuration.domain;
var mongoose = require('mongoose'),
    DatastreamTagMapping = mongoose.model('DatastreamTagMapping');
const mapping_fields = "_id datastream_id mac sensor";

exports.getDatastreamTagMapping = function(req,res) {
    var datastream_id = req.params.id;
    if (datastream_id != null) {        
        console.log('datastream_id ' + datastream_id);
        DatastreamTagMapping.findOne({"datastream_id": datastream_id}, mapping_fields, function (err, mapping) {
            if (err)
                return res.send(err);
            return res.json(mapping);
        });
         
    } else {
        DatastreamTagMapping.find().exec(function(err, mappings){
            if (err)
                return res.json(err);            
            return res.json(mappings);
        });
    }
};

exports.addDatastreamTagMapping = function (req,res) {
    var new_mapping = new DatastreamTagMapping(req.body);
    new_mapping.save(function (err, mapping) {
        if (err)
            return res.json(err);
        res.json(mapping);
    });
};

exports.deleteDatastreamTagMapping = function(req,res) {        
    DatastreamTagMapping.findOneAndDelete({"datastream_id":req.body["datastream_id"]}, function (err, mapping) {
        if (err) {
            return res.json(err);
        } else {
            if (mapping != null) {
                return res.json(mapping);
            } else {
                return res.json(new Map);
            }
        }
    });
};
