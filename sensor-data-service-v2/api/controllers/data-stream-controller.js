
'use strict';
var influx_connection = require("../models/influxdb-connection");
var configuration = require("../../configuration.js");
var domainUrl = configuration.domain;
var mongoose = require('mongoose'),
  Datastream = mongoose.model('Datastream');
const datastream_fields = "_id sensor_id thing_id name description unitOfMeasurement phenomenonTime resultTime"  ;
var sensor_controller = require("./sensor-controller");
var thing_controller = require("./thing-controller");
exports.get_stream = function(req, res) {
    influx_connection.influx.query(`
    select * from messages    
    limit 10
  `).then(result => {
    res.json(result)
  }).catch(err => {
    res.status(500).send(err.stack)
  })
};

exports.get_data_stream = function(req, res) {
  var stream_id = req.params.id;
  console.log('Get data stream ' + stream_id);  
  if (stream_id != null) {
   
    Datastream.findOne({"_id":stream_id}, datastream_fields, function(err, stream)
    {
      if (err) {
        console.log("Error " + err);
        return res.json(err);
      }    
      if (stream != null) {
        return res.json(convertMongoToOGC(stream));
      } else {
        return res.json([]);
      }
    });
  } else {
    Datastream.find().exec(function(err, docs) {
      if (err) {
        console.log("Error " + err);
        return res.json(err);
      }    
      var result_array = [];
      if (docs != null) {
        docs.forEach(function(doc) {
          result_array.push(convertMongoToOGC(doc));
        });
      }
      return res.json(result_array);
    });
  }
};


exports.add_data_stream = function(req, res) {
  var new_datastream = new Datastream();
  new_datastream.set("name", req.body['name']);
  new_datastream.set("description", req.body['description']);
  new_datastream.set("sensor_id", req.body["sensor"]["@iot.id"]);
  new_datastream.set("thing_id", req.body["thing"]["@iot.id"]);
  new_datastream.set("unitOfMeasurement", req.body["unitOfMeasurement"]);
  new_datastream.set("phenomenonTime", req.body["phenomenonTime"]);
  new_datastream.set("resultTime", req.body["resultTime"]);
  
  new_datastream.save(function(err, datastream) {
    if (err) {
      res.send(err);
    } else {
      if (datastream != null) {
        return res.json(convertMongoToOGC(datastream));
      } else {
        return res.json(new Map);
      }
    }
  });
}

exports.update_data_stream = function(req, res) {  
  var new_datastream = new Datastream();
  new_datastream.set("_id", req.body['@iot.id']);
  new_datastream.set("name", req.body['name']);
  new_datastream.set("description", req.body['description']);
  new_datastream.set("sensor_id", req.body["sensor"]["@iot.id"]);
  new_datastream.set("thing_id", req.body["thing"]["@iot.id"]);
  new_datastream.set("unitOfMeasurement", req.body["unitOfMeasurement"]);
  new_datastream.set("phenomenonTime", req.body["phenomenonTime"]);
  new_datastream.set("resultTime", req.body["resultTime"]);
  Datastream.findOneAndUpdate({"_id":req.body['@iot.id']}, new_datastream, function(err, datastream) {
    if (err) {
      res.send(err);
    } else {
      if (datastream != null) {
        return res.json(convertMongoToOGC(datastream));
      } else {
        return res.json(new Map);
      }
    }
  });
}

exports.delete_data_stream = function(req, res) {  
  Datastream.findOneAndDelete({"_id":req.body['@iot.id']}, function(err, datastream) {
    if (err) {
      res.send(err);
    } else {
      if (datastream != null) {
        return res.json(convertMongoToOGC(datastream));
      } else {
        return res.json(new Map);
      }
    }
  });
}
  
exports.get_data_stream_sensor = function(req, res) {
  var stream_id = req.params.id;
  console.log('Get data stream ' + stream_id);  
  if (stream_id != null) {   
    Datastream.findOne({"_id":stream_id}, datastream_fields, function(err, stream)
    {
      if (err) {
        console.log("Error " + err);
        return res.json(err);
      }    
      if (stream != null) {        
        req.params.id = stream.get('sensor_id');
        sensor_controller.getSensor(req,res);        
      } else {
        return res.json({});
      }
    });
  } 
};

exports.get_data_stream_thing = function(req, res) {
  var stream_id = req.params.id;
  console.log('Get data stream ' + stream_id);  
  if (stream_id != null) {   
    Datastream.findOne({"_id":stream_id}, datastream_fields, function(err, stream)
    {
      if (err) {
        console.log("Error " + err);
        return res.json(err);
      }    
      if (stream != null) {        
        req.params.id = stream.get('thing_id');
        thing_controller.get_things(req,res);        
      } else {
        return res.json({});
      }
    });
  } 
};

function convertMongoToOGC(stream) {
  var ogc_datastream = new Map;  
  if (stream != null) {
    ogc_datastream['@iot.id'] = stream.get('_id');
    ogc_datastream['@iot.selfLink'] = domainUrl + '/req/datastreams(' + ogc_datastream['@iot.id'] + ')';
    ogc_datastream["sensor@iot.navigationLink"] = ogc_datastream['@iot.selfLink'] + "/sensor";
    ogc_datastream["thing@iot.navigationLink"] = ogc_datastream['@iot.selfLink'] + "/thing";
    ogc_datastream["name"] = stream.get("name");
    ogc_datastream["description"] = stream.get("description");
    ogc_datastream["unitOfMeasurement"] = stream.get("unitOfMeasurement");
    ogc_datastream["phenomenonTime"] = stream.get("phenomenonTime");
    ogc_datastream["resultTime"] = stream.get("resultTime");  
  }  
  return ogc_datastream;
}