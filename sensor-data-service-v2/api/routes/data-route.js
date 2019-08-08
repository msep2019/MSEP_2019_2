'use strict';
module.exports = function(app) {
    var data_stream_controller = require('../controllers/data-stream-controller');
    //var data_controllers = require('../controllers/data-controller');
  
    // stream routes
    app.route('/stream')
        .get(data_stream_controller.get_stream);
    console.log("Registering stream route")    ;
  };
