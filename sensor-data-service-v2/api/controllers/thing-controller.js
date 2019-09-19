
'use strict';
var configuration = require("../../configuration.js");
var domainUrl = configuration.domain;
var mongoose = require('mongoose'),
  Thing = mongoose.model('Thing');
const thing_fields = "_id name description properties";


exports.get_things = function(req, res) {
  var thing_id = req.params.id;
  if (thing_id != null) {
    console.log('Get thing ' + thing_id); 
    Thing.findOne({"_id":thing_id}, thing_fields, function(err, thing)
    {
      if (err) {
        console.log("Error " + err);
        return res.json(err);
      }
      return res.json(convertMongoToOGC(thing));
    });
  } else {
    Thing.find().exec(function(err, things) {
      if (err) {
        console.log("Error " + err);
        return res.json(err);
      }    
      var result_array = [];
      if (things != null) {
        things.forEach(function(thing) {
          result_array.push(convertMongoToOGC(thing));
        });
      }
      return res.json(result_array);
    });
  }
  
};

exports.add_thing = function(req, res) {
  console.log('Add thing');
  var new_thing = new Thing(req.body);
  new_thing.save(function(err, thing) {
    if (err) {
      res.send(err);
    } else {
      res.json(convertMongoToOGC(thing));
    }
  });  
};

exports.delete_thing = function(req, res) {
  console.log('Delete thing ' + req.body['@iot.id']);
  Thing.findOneAndDelete({"_id":req.body['@iot.id']}, function(err, thing) {
    if (err) {
      res.send(err);
    } else {
      if (thing != null) {
        return res.json(convertMongoToOGC(thing));
      } else {
        return res.json(new Map);
      }
    }
  });
};


function convertMongoToOGC(thing) {  
  var ogc_thing = new Map;  
  if (thing != null) {
    ogc_thing['@iot.id'] = thing.get('_id');
    ogc_thing['@iot.selfLink'] = domainUrl + '/req/things(' + ogc_thing['@iot.id'] + ')';
    ogc_thing["locations@iot.navigationLink"] = 'things(' + ogc_thing['@iot.id'] + ')' + "/locations";
    ogc_thing["historicalLocations@iot.navigationLink"] = 'things(' + ogc_thing['@iot.id'] + ')' + "/historicalLocations";
    ogc_thing["datastreams@iot.navigationLink"] = 'things(' + ogc_thing['@iot.id'] + ')' + "/datastreams";
    ogc_thing["name"] = thing.get("name");
    ogc_thing["description"] = thing.get("description");
    ogc_thing["properties"] = thing.get("properties");
  }
    
  return ogc_thing;
}