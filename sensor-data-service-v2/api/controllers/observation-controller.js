
'use strict';
var influx_connection = require("../models/influxdb-connection");
var influxdb = influx_connection.influx;
function getObservations(req, res) {
    // id format: (MAC_Address)-(sensor_type)-(time in nanosecond).
    // for example: f0:f8:f2:86:7a:82-ambienttemp-12121313;
    var observation_id = req.params.id;
    if (observation_id != null) {
        // Get the time
        var chunks = observation_id.split('-');
        if (chunks.length != 3) {
            res.status(500).send("Invalid id");
        }
        console.log("Observation id: " + observation_id);
        var query_script = "SELECT * FROM messages WHERE \"name\" =~ /.*" 
                                + chunks[0] +  '.*' + chunks[1] + "/ AND time = " + chunks[2] + " LIMIT 1";
        console.log("Script " + query_script)                            ;
        
        influxdb.query(query_script)
            .then(result => {
                var ogc_observation = new Map;
                result.forEach(element => {
                    var time = element['time'].getNanoTime();
                    ogc_observation['@iot.id'] = element['name'].substring(12, 29) + '-' + element['name'].substring(30) + '-' + time;
                    ogc_observation['@iot.selfLink'] = 'req/observations(' + ogc_observation['@iot.id'] + ')';
                    ogc_observation['datastream@iot.navigationLink'] = 'req/observations(' + ogc_observation['@iot.id'] + ')/datastream';                
                    ogc_observation['phenomenonTime'] = time ;
                    ogc_observation['resultTime'] = time;
                    ogc_observation['result'] = element['value'];
                    res.json(ogc_observation);
                });
                // res.json(result)
            }).catch(err => {
                res.status(500).send(err.stack)
            })
    } else {
        var query_script = "SELECT * FROM messages LIMIT 10";
        console.log("Script " + query_script)                            ;
        var ogc_array = [];
        influxdb.query(query_script)
            .then(result => {                
                result.forEach(element => {
                    var ogc_observation = new Map;
                    var time = element['time'].getNanoTime();
                    ogc_observation['@iot.id'] = element['name'].substring(12, 29) + '-' + element['name'].substring(30) + '-' + time;
                    ogc_observation['@iot.selfLink'] = 'req/observations(' + ogc_observation['@iot.id'] + ')';
                    ogc_observation['datastream@iot.navigationLink'] = 'req/observations(' + ogc_observation['@iot.id'] + ')/datastream';                
                    ogc_observation['phenomenonTime'] = time ;
                    ogc_observation['resultTime'] = time;
                    ogc_observation['result'] = element['value'];
                    ogc_array.push(ogc_observation);           
                    console.log(ogc_array);         
                });
                res.json(ogc_array);                  
            }).catch(err => {
                res.status(500).send(err.stack)
            })
          
    }
    
}
exports.get_observations = getObservations;

