'use strict';
module.exports = function(app) {
    var data_stream_controller = require('../controllers/data-stream-controller');
    //var data_controllers = require('../controllers/data-controller');
  
    // stream routes
    app.route('/stream')
        .get(data_stream_controller.get_stream);
    console.log("Registering stream route")    ;
    app.route('/datastream/:id')
        .get(data_stream_controller.get_data_stream);

    app.route('/req/datastream\\(:id\\)')
        .get(data_stream_controller.get_data_stream);
        
    app.route('/req/datastream')
        .post(data_stream_controller.add_data_stream);        
  };
