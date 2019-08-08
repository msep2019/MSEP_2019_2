var data_controllers = require("../controllers/data-controllers");
app.get('/', data_controllers.data_acquire);
app.listen(3000);
console.log("IoT data server started on port: " + "3000");
