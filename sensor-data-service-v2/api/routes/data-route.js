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
    
    app.route('/req/Datastreams\\(:id\\)/properties')
        .get(data_stream_controller.get_data_stream);    


    app.route('/req/Datastreams\\(:id\\)/relations')
        .get(data_stream_controller.get_data_stream);    
    // TODO: Add function for Thing entity
    app.route('/req/Things')
        .get(thing_controller.get_things);      

    app.route('/req/Things')
        .post(thing_controller.add_thing);
    
    app.route('/req/Things\\(:id\\)')
        .get(thing_controller.get_things); 

    app.route('/req/Things\\(:id\\)/properties')
        .get(thing_controller.get_things); 

    app.route('/req/Things\\(:id\\)/relations')
        .get(thing_controller.get_things);     

    app.route('/req/Observations')
        .get(observation_controller.get_observations);   

    app.route('/req/Observations\\(:id\\)')
        .get(observation_controller.get_observations);   
  };
