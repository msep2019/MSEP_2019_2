var influx_connection = require("../models/influxdb-connection");
var configuration = require("../../configuration.js");
var domainUrl = configuration.domain;
var mongoose = require('mongoose'),
    sensor = mongoose.model('sensor');
const sensor_fields = "_id name description encodingType metadata";

exports.getSensor = function(req,res) {
    var sensorId = req.params.id;
    if (sensorId != null) {
        if (sensorId != null) {
            console.log('sensor_id ' + sensorId);
            sensor.findOne({"_id": sensorId}, sensor_fields, function (err, sensor) {
                if (err)
                    return res.send(err);
                return res.json(convertMongoToOGC(sensor));
            });
        } 
    } else {
        sensor.find().exec(function(err,sensors){
            if (err)
                return res.json(err);
            var all_sensor = [];
            if(sensors != null){
                sensors.forEach(function (sensor) {
                    all_sensor.push(convertMongoToOGC(sensor));
                })
            }
            return res.json(all_sensor);
        });
    }
};

exports.addSensor = function (req,res) {
    var new_sensor = new sensor(req.body);
    new_sensor.save(function (err, sensor) {
        if (err)
            return res.json(err);
        res.json(convertMongoToOGC(sensor));
    });
};

exports.deleteSensor = function(req,res) {
    console.log("Iot id " + req.body["@iot.id"]);
    var delete_sensor = new sensor(req.body);
    sensor.findOneAndDelete({"_id":req.body["@iot.id"]}, function (err, sensor) {
        if (err) {
            return res.json(err);
        } else {
            if (sensor != null) {
                return res.json(convertMongoToOGC(sensor));
            } else {
                return res.json(new Map);
            }
        }
    });
};

function convertMongoToOGC(sensor) {
    var ogc = new Map;
    if (sensor != null) {
        ogc['@iot.id'] = sensor.get('_id');
        ogc['@iot.selfLink'] = domainUrl + "/req/sensors(" + ogc['@iot.id'] + ")"; 
        ogc["datastreams@iot.navigationLink"] = "sensors(" + ogc['@iot.id'] + ")" + "/datastreams";
        ogc["name"] = sensor.get("name");
        ogc["description"] = sensor.get("description");
        ogc["encodingType"] = sensor.get("encodingType");
        ogc["metadata"] = sensor.get("metadata");
    }
    return ogc;
}

exports.convertMongoToOGC = convertMongoToOGC;
