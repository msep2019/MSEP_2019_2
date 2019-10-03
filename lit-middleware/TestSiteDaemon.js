/* The DaemonClass represents a daemon that control the underlying testsite infrastructure based on instructions from the smart contract. 
    Its prime responsiblity is to call the underlying Docker Engine. 
*/
const DockerCompose = require('docker-compose');
const YamlValidator = require('yaml-validator');
var fs = require('fs');
const Docker = require('dockerode');
const docker = new Docker();
var configMW = JSON.parse(fs.readFileSync("./mw-config.json").toString());
class DaemonClass {
    constructor(_web3, _contractInstance, _addrOwner){
        this.web3 = _web3;
        this.contractInstance = _contractInstance;
        this.addrOwner = _addrOwner;
    }

    startDaemon() {
        // console.log("startDaemon() called.")
        // console.log(this.web3);
        // console.log(this.contractInstance);

        const testSiteContract = this.contractInstance;
        testSiteContract.events.experimentStaged({}, (error, event) => {
            if(!error){
                // CONVERT THE HEX TO BYTES TO CONVERT IT BACK LATER
                let code = event.returnValues.code;
                let expID = this.web3.utils.hexToBytes(event.returnValues.expID);
                // VERSION 0.1 SUPPORT ONLY ONE TYPE OF EXPERIEMNT: RUNNING CODE ON THE REMOTE INFRASTRUCTURE.
                // RESULT IS THE URL TO ACCESS THE CODE ON THE REMOTE INFRASTRUCTURE AFTER DEPLOYMENT
                console.log("Received an experimentStaged event for the following code:");
                console.log("ExpID:" + this.web3.utils.bytesToHex(expID));
                console.log("Exp code: " + code);

                this.conductExperiment(expID, code);
            } else {
                console.log(error);
            }
            
        });
    }

    // This method is called whenever a new experiment is assigned to the test site
    conductExperiment(_expID, _code) {
        console.log("\nInside conductExperiment method:");
        console.log("ExpID:" + this.web3.utils.bytesToHex(_expID));
        console.log("Exp code: " + _code);

        this.fetchExperiment(_expID, _code);
    }

    // This method is called to retrieve the code that the experiment demands.
    fetchExperiment(_expID, _code) {
        console.log("\nInside fetchExperiment method:");
        console.log("ExpID:" + this.web3.utils.bytesToHex(_expID));
        console.log("Exp code: " + _code);

        // VERSION 0.1 DOES NOT CONTROL THE FETCHING OF EXPERIMENT CODE. IT CALLS THE EXECUTE EXPERIEMNT IMMEDIATE.

        this.executeExperiment(_expID, _code);
    }

    executeExperiment(_expID, _code) {
        console.log("\nInside executeExperiment method:");
        console.log("ExpID:" + this.web3.utils.bytesToHex(_expID));
        console.log("Exp code: " + _code);

        // const hostAddr = "127.0.0.1"
        // const knownImages = {
        //     "grafana/grafana" : hostAddr + ":3000",
        //     // "lite-server" : hostAddr + ":8080",
        // };

        // const Docker = require('dockerode');
        // const docker = new Docker();
        // let result = "";

        // if (_code in knownImages) {
            /*FIXME: Docker by itself does not allow the flexibility and complexity necessary to run an experiment.
                Future version will interface with Docker-compose instead.
            */

            // docker.createContainer({Image: _code, Cmd: [], "HostConfig": {
            //     "PortBindings": {
            //     "3000/tcp": [
            //         {
            //         "HostPort": knownImages[_code].split(":")[1] // Get port by splitting the hostaddr:port string.
            //         }
            //     ]
            //     }, "Binds": ["/Users/trannguyen/Documents/CodeProjects/LIT/LIT_MW/sample/web-template:/src"]}}, function (err, container) {
            //     if(!err){
            //         container.start(function (err, data) {
            //             console.log('container started')
            //             //...
            //         });
            //     } else {
            //         console.log(err)
            //     }
            // });
            // docker.pull(_code,{}, function(err, image){
            //     console.log("Pull the image");        
            // });

            // docker.createContainer({Image: _code, Cmd: [], "HostConfig": {
            //     "PortBindings": {
            //     "3000/tcp": [
            //         {
            //         "HostPort": knownImages[_code].split(":")[1] // Get port by splitting the hostaddr:port string.
            //         }
            //     ]
            //     }}}, function (err, container) {
            //     if(!err){
            //         container.start(function (err, data) {
            //             console.log('container started')
            //             //...
            //         });
            //     } else {
            //         console.log(err)
            //     }
            // });
            
            // Write the code into a new folder


            
            // FIXME: Results must come from the Docker engine itself, or other means, not hardcoded.
        //     result = knownImages[_code];
        // } else {
        //     result = "Couldn't find the required experiment code at the specified location";
        // }
        var experimentFolder = "./experiments/" + this.web3.utils.bytesToHex(_expID);
        fs.mkdirSync(experimentFolder,  function(err){
            if(err) {
                return console.log(err);
            }
            console.log("The directory was created!");
        });
        fs.writeFileSync(experimentFolder + "/docker-compose.yml", _code, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        })

        // Default options
        const options = {
            log: true,
            structure: true,
            onWarning: null,
            writeJson: true
        };
        var validator = new YamlValidator(options);
        validator.validate([experimentFolder + "/docker-compose.yml"]);

        // TODO: Validating docker compose file
        if (validator.report() == 0) {
            var generatedJSON = JSON.parse(fs.readFileSync(experimentFolder + "/docker-compose.json").toString());            
            // console.log(generatedJSON['services']['grafana']['ports']);
        }
        // TODO: Stop instances before proceeding
        // Compare the input service, image name, and port to stop correct image
        // const Docker = require('dockerode');
        // const docker = new Docker();

        // DockerCompose.stop({ cwd: "./experiments/0xf19e3218ffae99ffad2ca623e6307144c6c3c2e0/docker-compose.json", log: true })
        //     .then(function(result){
        //         console.log("---- Stopping ----");
        //         console.log(result);
        //     }).catch (function(err){
        //         console.log(err);
        //     }); 

        var deployingResult = {};
        DockerCompose.upAll({ cwd: experimentFolder, log: true })
            .then(function(result) {
                // TODO: Extract data from output to get service names
                console.log("---- Starting ----");
                console.log(result);
                if (result.statusCode == 0) {
                    console.log('done');
                    console.log(result.out);
                    deployingResult['status'] = 0;
                    deployingResult['message'] = result.out;
                } else {
                    console.log('error');
                    console.log(result.err);
                    deployingResult['status'] = 1;
                    deployingResult['message'] = result.err;
                }
            }).catch(function(result) {
                console.log('error');
                console.log(result.err);
                deployingResult['status'] = 1;
                deployingResult['message'] = result.err;                
            });

        // VERSION 0.1 USE THIS MECHANISM TO KICKSTART THE ASYNC RESPONSE.
        // IN FUTURE VERSION, THE COLLECT RESULT WILL BE CALLED WHEN THE EXPERIMENT IS DONE.
        setTimeout((this.collectResult).bind(this), 20000, _expID, deployingResult);
    }

    // Collect containers performance statistics and urls
    collectResult(_expID, _result) {
        console.log("\nInside collectResult method:");
        console.log("ExpID:" + this.web3.utils.bytesToHex(_expID));        
        // List containers base on name
        var tmpString = this.web3.utils.bytesToHex(_expID);
        
        _result['containers'] = {};
        docker.listContainers({filters:{name:[tmpString]}}).then(containers => {
            console.log("List deployed containers");
            console.log(containers);
            containers.forEach(container => {
                var tmpInfo = {};
                tmpInfo['name'] = container.Names[0];
                // TODO: Parsing ports 
                var port = 3000;
                tmpInfo['service_url'] = configMW['server_ip'] + ":" + port;

                // TODO: Implement service for tracking performance
                tmpInfo['statistic_url'] = configMW['statistic_service'] + "/" + container.Id;                    

                // Retrieving performance stats
                var tmpContainer = docker.getContainer(container.Id);                    
                tmpContainer.stats({stream:false}).then(function(stats) {
                    tmpInfo['performance_stats'] = DaemonClass.calculatePerformanceStats(stats);
                    _result['containers'][container.Image] = tmpInfo;
                }).catch(function (err_stats){
                    console.log("Error while retrieving container stats");
                    console.log(err_stats);
                });
            });
            // TODO: Use synchronous call instead of using timeout
            setTimeout((this.reportExperimentResult).bind(this), 3000, _expID, _result);            
        }).catch(err => {
            console.log("Error in geting containers");
            console.log(err);
            this.reportExperimentResult(_expID, _result);
        });
        
    }

    reportExperimentResult(_expID, _result) {
        console.log("\nInside reportExperimentResult method:");
        console.log("ExpID:" + this.web3.utils.bytesToHex(_expID));
        console.log("Exp result: " + JSON.stringify(_result));

        // Submit the result back to the smart contract
        this.contractInstance.methods.updateExperimentResult(this.web3.utils.bytesToHex(_expID), JSON.stringify(_result)).send({
            from : this.addrOwner,
            gas : 3000000,
        }).then((receipt) => {
            console.log("\nReported the experiment result to the contract.")
            // console.log(receipt);
        });
    }

    static calculatePerformanceStats(stats) {        
        console.log("--------Stats---------");        
        console.log(stats);
        var result = {};
        try {
            result['mem_usage'] = stats['memory_stats']['usage'];
            result['mem_max_usage'] = stats['memory_stats']['max_usage'];
            result['mem_limit'] = stats['memory_stats']['limit'];
            
            let delta_total_usage = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
            let delta_system_usage = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
            let percentage = delta_total_usage / delta_system_usage * stats.cpu_stats.cpu_usage.percpu_usage.length * 100.0;
            result['cpu_percentage'] = percentage;
            
            // TODO: Calculate Network IO and Block IO
        } catch (e) {
            console.log("Error in calculate performance stats");
            console.log(e);
        }
        
        return result;
    }

    
}

// module.exports.TestSiteDaemon = DaemonClass
module.exports = DaemonClass