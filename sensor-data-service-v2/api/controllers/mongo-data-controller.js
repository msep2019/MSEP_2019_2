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

var num = 0;
var nameofSensor = newSensor.name;
console.log(nameofSensor);

// add new sensor, if it already exist, will not add to the database
function add(){
    newOne.count({'name':nameofSensor},  function(err,res){
        if (err) {
            throw err;
        } else {
            num = res;
            console.log(num);
            if (num > 0) {
                console.log("cannot");
            } else {
                console.log("add");
                newSensor.save(function (err) {
                    if (err) throw err;
                })
            }
        }
    });
}


////delete
function delSensor(){
    newOne.count({'name':nameofSensor},  function (err,res) {
        if (err) {
            throw err;
        } else {
            num = res;
            console.log(num);
            if (num < 1) {
                console.log("cannot");
            }
            else
            {
                console.log("can remove from database");
                newOne.remove({'name':nameofSensor}, function (error) {
                    if (error) throw error;
                });
            }
        }
    });
}

//update
var updateDescription = {'description': 'battery111111'};

function updateSensor() {
    newOne.count({'name':nameofSensor},  function (err,res) {
        if (err) {
            throw err;
        } else {
            num = res;
            console.log(num);
            if (num < 1) {
                console.log("cannot");
            }
            else
            {
                console.log("can update");
                newOne.update({'name':nameofSensor}, updateDescription, function (err) {
                    if (err) throw err;
                })
            }
        }
    });
}

//find
function findSensor(){
    newOne.find({'name':nameofSensor}, function(err,res){
        if (err) throw err;
        console.log(res);
    });
}

//add();
//delSensor();
//updateSensor();
findSensor();

//newOne.find({}, function(err,res){
//    console.log(res);
//});

