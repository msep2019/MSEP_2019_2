'use strict';
module.exports = function(app) {
    var data_stream_controller = require('../controllers/data-stream-controller');
 var data_controllers = require('../controllers/data-controller');
    // Depecrated routes
    app.route('/test-stream')
        .get(data_controllers.get_stream);
    // stream routes
<<<<<<< HEAD
	var thing_controller = require('../controllers/thing-controller');
    var observation_controller = require('../controllers/observation-controller');
    var location_controller = require('../controllers/Location-controller');

=======
	var sensor_controller = require('../controllers/sensor-controller');
	var thing_controller = require('../controllers/thing-controller');
	var observation_controller = require('../controllers/observation-controller');
>>>>>>> 320547c8126c8305d3df426cdd421be7b3c7f071
	//var data_controllers = require('../controllers/data-controller');
        // stream routes
    app.route('/stream')
        .get(data_stream_controller.get_stream);
    console.log("Registering stream route")    ;
    app.route('/datastreams/:id')
        .get(data_stream_controller.get_data_stream);

    app.route('/req/datastreams\\(:id\\)')
        .get(data_stream_controller.get_data_stream);
    
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
    // TODO: Add function for Thing entity
    app.route('/req/things')
        .get(thing_controller.get_things);      

    app.route('/req/things')
        .post(thing_controller.add_thing);

    app.route('/req/things')
        .delete(thing_controller.delete_thing);        
    
    app.route('/req/things\\(:id\\)')
        .get(thing_controller.get_things); 

    app.route('/req/things\\(:id\\)/properties')
        .get(thing_controller.get_things); 

    app.route('/req/things\\(:id\\)/relations')
        .get(thing_controller.get_things);     

    app.route('/req/observations')
        .get(observation_controller.get_observations);   

<<<<<<< HEAD
    app.route('/req/observations')
        .get(observation_controller.get_observations);  

    app.route('/req/locations')
        .get(location_controller.get_locations);

    app.route('/req/locations')
        .post(location_controller.add_location); 

    app.route('/req/location\\(:id\\)/properties')
        .get(location_controller.get_locations);

    app.route('/req/locations\\(:id\\)')
        .get(location_controller.get_locations);
=======
    app.route('/req/observations\\(:id\\)')
        .get(observation_controller.get_observations); 
	
    app.route('/req/sensors')
        .get(sensor_controller.getSensor);

    app.route('/req/sensors')
        .post(sensor_controller.addSensor);

    app.route('/req/sensors')
        .delete(sensor_controller.deleteSensor);
>>>>>>> 320547c8126c8305d3df426cdd421be7b3c7f071
  };
