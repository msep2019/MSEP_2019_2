
'use strict';
var influx_connection = require("../models/influxdb-connection");
var mongoose = require('mongoose'),
  Datastream = mongoose.model('Datastream');
const datastream_fields = "@iot.id @iot.selfLink sensor@iot.navigationLink name description unitOfMeasurement phenomenonTime resultTime"  ;
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
   
    Datastream.findOne({"@iot.id":stream_id}, datastream_fields, function(err, stream)
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
  var new_datastream = new Datastream(req.body);
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
  var new_datastream = new Datastream(req.body);
  Datastream.findOneAndUpdate({"@iot.id":new_datastream.get("@iot")['id']}, req.body, function(err, datastream) {
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
  var new_datastream = new Datastream(req.body);  
  Datastream.findOneAndDelete({"@iot.id":new_datastream.get("@iot")['id']}, function(err, datastream) {
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
  


function convertMongoToOGC(stream) {
  var ogc_datastream = new Map;  
  ogc_datastream['@iot.id'] = stream.get('@iot')['id'];
  ogc_datastream['@iot.selfLink'] = stream.get('@iot')['selfLink'];
  ogc_datastream["Sensor@iot.navigationLink"] = stream.get("sensor@iot")['navigationLink'];
  ogc_datastream["name"] = stream.get("name");
  ogc_datastream["description"] = stream.get("description");
  ogc_datastream["unitOfMeasurement"] = stream.get("unitOfMeasurement");
  ogc_datastream["phenomenonTime"] = stream.get("phenomenonTime");
  ogc_datastream["resultTime"] = stream.get("resultTime");  
  return ogc_datastream;
}