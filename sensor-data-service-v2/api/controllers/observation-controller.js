
'use strict';
var influx_connection = require("../models/influxdb-connection");
var influxdb = influx_connection.influx;
var configuration = require("../../configuration.js");
var domainUrl = configuration.domain;
var datastream_controller = require("./data-stream-controller");
function getObservations(req, res) {
    // id format: urn:dev:mac:(MAC_Address)-(sensor_type)-(datastream-id)-(time).
    // for example: urn:dev:mac:f0:f8:f2:86:7a:82-ambienttemp-12121313-213131;
    var observation_id = req.params.id;
    if (observation_id != null) {
        // Get the time
        var chunks = observation_id.split('-');
        if (chunks.length != 4) {
            res.status(500).send("Invalid id");
        }
        console.log("Observation id: " + observation_id);
        var query_script = "SELECT * FROM messages WHERE \"name\" =~ /.*" 
                                + chunks[0] +  '.*' + chunks[1] +  '.*' + chunks[2] + "/" + "AND time = " + chunks[3] + " LIMIT 1";
        console.log("Script " + query_script);
        
        influxdb.query(query_script)
            .then(result => {
                var ogc_observation = new Map;
                result.forEach(element => {
                    var time = element['time'].getNanoTime();
                    ogc_observation['@iot.id'] = element['name'].substring(12, 29) + '-' + element['name'].substring(30) + '-' + chunks[2];
                    ogc_observation['@iot.selfLink'] = domainUrl +  '/req/observations(' + ogc_observation['@iot.id'] + ')';
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
                    ogc_observation['@iot.id'] = element['name'] + "-" + time;
                    ogc_observation['@iot.selfLink'] = domainUrl + '/req/observations(' + ogc_observation['@iot.id'] + ')';
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

function getObservationDataStream(req, res) {
    // id format: urn:dev:mac:(MAC_Address)-(sensor_type)-(datastream-id)-(time).
    // for example: urn:dev:mac:f0:f8:f2:86:7a:82-ambienttemp-12121313-213131;
    var observation_id = req.params.id;
    if (observation_id != null) {
        // Get the time
        var chunks = observation_id.split('-');
        if (chunks.length != 4) {
            res.status(500).send("Invalid id");
        } else {
            req.params.id = chunks[2];
            datastream_controller.get_data_stream(req, res);
        }

    } else {
        res.status(500).send("Invalid id");
    }
}
exports.get_observations = getObservations;
exports.get_observation_datastream = getObservationDataStream;


