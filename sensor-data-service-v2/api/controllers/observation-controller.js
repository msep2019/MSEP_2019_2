
'use strict';
var influx_connection = require("../models/influxdb-connection");
var influxdb = influx_connection.influx;
var configuration = require("../../configuration.js");
var domainUrl = configuration.domain;
var datastream_controller = require("./data-stream-controller");
var ogc_filter_influx_query_mapping = {"result":"value", "gt": ">", "ge" : ">=", "lt" : "<", "le": "<="};
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
                    var time = element['time'].toISOString();
                    // var time = element['time'].getNanoTime();
                    ogc_observation['@iot.id'] = element['name'] + "-" + element['time'].getNanoTime();
                    ogc_observation['@iot.selfLink'] = domainUrl +  '/req/observations(' + ogc_observation['@iot.id'] + ')';
                    ogc_observation['datastream@iot.navigationLink'] = 'observations(' + ogc_observation['@iot.id'] + ')/datastream';                
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
        var limit = 10;
        if (req.query['$top'] != null) {
            limit = req.query['$top'];
        } 
        var query_script = "SELECT * FROM messages ";
        var condition = "";
        if (req.query['$filter'] != null) {
            // TODO: Use patterns to extract all functions and create query
            var filters = req.query['$filter'];
            condition = condition + parsingFilterForObservation(filters);
            query_script = query_script + " WHERE " + condition;
        }
        
        query_script = query_script + " LIMIT " + limit;
        console.log("Script " + query_script);
        var ogc_array = [];
        influxdb.query(query_script)
            .then(result => {                
                result.forEach(element => {
                    var ogc_observation = new Map;
                    // var time = element['time'].getNanoTime();
                    var time = element['time'].toISOString();
                    ogc_observation['@iot.id'] = element['name'] + "-" + time;
                    ogc_observation['@iot.selfLink'] = domainUrl + '/req/observations(' + ogc_observation['@iot.id'] + ')';
                    ogc_observation['datastream@iot.navigationLink'] = 'observations(' + ogc_observation['@iot.id'] + ')/datastream';                
                    ogc_observation['phenomenonTime'] = new Date(time) ;
                    ogc_observation['resultTime'] = time;
                    ogc_observation['result'] = element['value'];
                    ogc_array.push(ogc_observation);           
                    // console.log(ogc_array);         
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

function parsingFilterForObservation(filters) {
    // TODO: Use patterns to extract all functions and create query    
    // Currently support only gt, ge, lt and le functions on result
    var parts = filters.split(" ");     
    var condition = "";       
    parts.forEach(part =>{
        if (ogc_filter_influx_query_mapping[part] != null) {
          condition = condition + " " + ogc_filter_influx_query_mapping[part] + " ";
        } else {
          condition = condition + " " + part + " ";
        }
    });   
    return condition;
}
  
function parsingOrderByForObservation(orderby) {
    // TODO: Use patterns to extract all functions and create query    
    // Currently support only gt, ge, lt and le functions on result
    var parts = orderby.split(" ");     
    var condition = " ORDER BY ";       
    parts.forEach(part =>{
        if (ogc_filter_influx_query_mapping[part] != null) {
            condition = condition + " " + ogc_filter_influx_query_mapping[part] + " ";
        } else {
            condition = condition + " " + part + " ";
        }
    });   
    return condition;
}
exports.get_observations = getObservations;
exports.get_observation_datastream = getObservationDataStream;


