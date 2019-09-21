'use strict';
module.exports = function(app) {
    var data_stream_controller = require('../controllers/data-stream-controller');
    var data_controllers = require('../controllers/data-controller');
    // Depecrated routes
    app.route('/test-stream')
        .get(data_controllers.get_stream);
    // stream routes
	var thing_controller = require('../controllers/thing-controller');
    var observation_controller = require('../controllers/observation-controller');
    var location_controller = require('../controllers/Location-controller');

    var sensor_controller = require('../controllers/sensor-controller');
    var datastream_tag_controller = require('../controllers/datastream-tag-controller');
	
	//var data_controllers = require('../controllers/data-controller');
        // stream routes
    app.route('/stream')
        .get(data_stream_controller.get_stream);
    console.log("Registering stream route")    ;
    app.route('/datastreams/:id')
        .get(data_stream_controller.get_data_stream);

    app.route('/req/datastreams\\(:id\\)')
        .get(data_stream_controller.get_data_stream);

    app.route('/req/datastreams\\(:id\\)/sensor')
        .get(data_stream_controller.get_data_stream_sensor);    

    app.route('/req/datastreams\\(:id\\)/thing')
        .get(data_stream_controller.get_data_stream_thing);   
    
    app.route('/req/datastreams\\(:id\\)/observations')
        .get(data_stream_controller.get_data_stream_observations);    
    
    app.route('/req/datastreams')
        .get(data_stream_controller.get_data_stream); 
    app.route('/req/datastreams')
        .post(data_stream_controller.add_data_stream);    
    
    app.route('/req/datastreams')
        .put(data_stream_controller.update_data_stream);    

    app.route('/req/datastreams')
        .delete(data_stream_controller.delete_data_stream);                 
    
    app.route('/req/datastreams\\(:id\\)/properties')
        .get(data_stream_controller.get_data_stream);    


    app.route('/req/datastreams\\(:id\\)/relations')
        .get(data_stream_controller.get_data_stream);    
    
    // Routes for Thing entity
    app.route('/req/things')
        .get(thing_controller.get_things);      

    app.route('/req/things')
        .post(thing_controller.add_thing);

    app.route('/req/things')
        .delete(thing_controller.delete_thing);        
    
    app.route('/req/things\\(:id\\)/datastreams')
        .get(data_stream_controller.get_data_streams_by_thing_id); 

    app.route('/req/things\\(:id\\)')
        .get(thing_controller.get_things);     

    app.route('/req/things\\(:id\\)/properties')
        .get(thing_controller.get_things); 

    app.route('/req/things\\(:id\\)/relations')
        .get(thing_controller.get_things);     
    

    // Routes for observations
    app.route('/req/observations')
        .get(observation_controller.get_observations);   

    app.route('/req/observations\\(:id\\)')
        .get(observation_controller.get_observations); 

    app.route('/req/observations\\(:id\\)/datastream')
        .get(observation_controller.get_observation_datastream);           

    // Location routes
    app.route('/req/locations')
        .get(location_controller.get_locations);

    app.route('/req/locations')
        .post(location_controller.add_location); 

    app.route('/req/location\\(:id\\)/properties')
        .get(location_controller.get_locations);

    app.route('/req/locations\\(:id\\)')
        .get(location_controller.get_locations);
    
    
    // Sensor routes    
    // Get all sensors
    app.route('/req/sensors')
        .get(sensor_controller.getSensor);
    
    // Get one sensor
    app.route('/req/sensors\\(:id\\)')
        .get(sensor_controller.getSensor);    

    // Add new sensor
    app.route('/req/sensors')
        .post(sensor_controller.addSensor);

    // Delete a sensor
    app.route('/req/sensors')
        .delete(sensor_controller.deleteSensor);

    // Get sensor datastreams
    app.route('/req/sensors\\(:id\\)/datastreams')
        .get(data_stream_controller.get_data_streams_by_sensor_id);    

    // Datastream sensor tag mapping routes
    // Get all mappings
    app.route("/conf/datastreamtagmappings")
        .get(datastream_tag_controller.getDatastreamTagMapping);  
    // Get mapping by id    
    app.route("/conf/datastreamtagmappings\\(:id\\)")
        .get(datastream_tag_controller.getDatastreamTagMapping);        
    
    app.route("/conf/datastreamtagmappings")
        .post(datastream_tag_controller.addDatastreamTagMapping);
        
    app.route("/conf/datastreamtagmappings")
        .delete(datastream_tag_controller.deleteDatastreamTagMapping);        
  };
