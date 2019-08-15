//use local mongodb test functions
//var mongoose = require('mongoose');
//mongoose.connect('mongodb://127.0.0.1:27017/sensor',{ useNewUrlParser: true });
//var Schema = mongoose.Schema;
//
//var newOne = mongoose.model('sensor', new Schema({
//    name: String,
//    description: String
//    },{collection: 'sensor'})
//);
//
//var newSensor = new newOne({
//    name: 'sensor4',
//    description: 'Battery22'
//});
//
//var theName = {'name': 'sensor4'};
//console.log(newSensor.name);


// add new sensor, if it already exist, will not add to the database
function add(newSensor){
    newOne.find(newSensor.name, function(err,res){
        if (err) throw err;
        if (res.length > 0) {
            console.log("cannot");
        }
        else
        {
            console.log("add");
            newSensor.save(function (err) {
                if (err) throw err;
            })
        }
    });
}


//delete
function delSensor (newSensor){
    newOne.find(newSensor.name, function(err,res){
        if (err) throw err;
        if (res.length == 0) {
            console.log("cannot");
        }
        else
        {
            console.log("can remove from database");
            newOne.deleteOne(theName, function (err) {
                if (err) throw err;
            })
        }
    });
}


//update
//var updateDescription = {'description': 'battery111111'};

function updateSensor(newSensor, updateDescription) {
    newOne.find(newSensor.name, function(err,res){
        if (err) throw err;
        if (res.length == 0) {
            console.log("cannot");
        }
        else
        {
            console.log("can update");
            newOne.update(newSensor.name, updateDescription, function (err) {
                if (err) throw err;
            })
        }
    });
}

//find
function findSensor(theName){
    newOne.find(theName, function(err,res){
        if (err) throw err;
        console.log(res);
    });
}
