'use strict'
const Web3 = require('web3')
const request = require('request')
const web3 = new Web3('ws://localhost:7545')
const tokenInterface = require('./contracts/SimpleContract.json')
const deployedAddress = tokenInterface.networks[5777].address
const simpleContract = new web3.eth.Contract(tokenInterface.abi, deployedAddress)
simpleContract.events.SimpleEvent()
    .on('data', (event) => {
        console.log(event);
        request('http://34.67.130.25:5000/req/datastreams', { json: true }, (err, res, body) => {
            if (err) { return console.log(err); }
            console.log(body[0]);
            // Call contract method to store datastream name
            simpleContract.methods.storeDatastream(body[0].name).send({from: '0x475cC82cFb4e27d7f0aeCE782e707Acb489d8BF7' });
        });
    })
    .on('error', console.error);
    