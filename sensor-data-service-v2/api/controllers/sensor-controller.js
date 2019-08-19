var influx_connection = require("../models/influxdb-connection");
var mongoose = require('mongoose'),
    sensor = mongoose.model('sensor');
const sensor_fields = "@iot.id @iot.selfLink name description encodingType metadata";

exports.getSensor = function(req,res) {
    var sensor_id = req.params.id;
    if (sensor_id != null) {
        console.log('sensor_id' + sensor_id);
        sensor.findOne({"@iot.id": sensor_id}, sensor_fields, function (err, sensor) {
            if (err)
                return res.json(err);
            return res.json(convertMongoToOGC(sensor));
        });
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
    var delete_sensor = new sensor(req.body);
    sensor.findOneAndDelete({"@iot.id":delete_sensor.get("@iot")['id']}, function (err, sensor) {
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
    ogc['@iot.id'] = sensor.get('@iot')['id'];
    ogc['@iot.selfLink'] = sensor.get('@iot')['selfLink'];
    ogc["name"] = sensor.get("name");
    ogc["description"] = sensor.get("description");
    ogc["encodingType"] = sensor.get("encodingType");
    ogc["metadata"] = sensor.get("metadata");
    return ogc;
}
