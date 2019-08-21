
'use strict';
var influx_connection = require("../models/influxdb-connection");
var mongoose = require('mongoose'),
  Location = mongoose.model('Location');
const location_fields = "@iot.id @iot.selfLink locations@iot.navigationLink " + 
  "historicalLocations@iot.navigationLink datastreams@iot.navigationLink name description properties";


exports.get_locations = function(req, res) {
  var location_id = req.params.id;
  if (location_id != null) {
    console.log('Get Location ' + location_id); 
    Location.findOne({"@iot.id":location_id}, location_fields, function(err, Loc)
    {
      if (err) {
        console.log("Error " + err);
        return res.json(err);
      }
      return res.json(convertMongoToOGC(Loc));
    });
}
//   } else {
//     Location.find().exec(function(err, Locations) {        //for multiple location
//       if (err) {
//         console.log("Error " + err);
//         return res.json(err);
//       }    
//       var result_array = [];
//       if (Locations != null) {
//         Locations.forEach(function(Location) {
//           result_array.push(convertMongoToOGC(Location));
//         });
//       }
//       return res.json(result_array);
//     });
//   }
  
};

exports.add_location = function(req, res) {
  console.log('Add Location');
  var new_location = new Location(req.body);
  console.log("Added location", new_location)
  new_location.save(function(err, Loc) {
    if (err){
      res.send(err);
    } else{
      res.json(convertMongoToOGC(Loc));
    }
  });  
};

function convertMongoToOGC(Loc) {
var ogc_Location = new Map;  
   ogc_Location['@iot.id'] = Loc.get('@iot')['id'];
   ogc_Location['@iot.selfLink'] = Loc.get('@iot')['selfLink'];
   //ogc_Location["locations@iot.navigationLink"] = Loc.get("locations@iot")['navigationLink'];
 //  ogc_Location["historicalLocations@iot.navigationLink"] = Loc.get("historicalLocations@iot")['navigationLink'];
  // ogc_Location["datastreams@iot.navigationLink"] = Loc.get("datastreams@iot")['navigationLink'];
   ogc_Location["name"] = Loc.get("name");
   ogc_Location["description"] = Loc.get("description");
  //ogc_Location["properties"] = Location.get("unitOfMeasurement");  
  return ogc_Location;
 };