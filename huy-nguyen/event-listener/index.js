'use strict'
const Web3 = require('web3')
const web3 = new Web3('ws://localhost:7545')
const tokenInterface = require('./contracts/SimpleContract.json')
const deployedAddress = tokenInterface.networks[5777].address
const simpleContract = new web3.eth.Contract(tokenInterface.abi,deployedAddress)
simpleContract.events.SimpleRequest()
    .on('data', (event) => {
        console.log(event);
    })
    .on('error', console.error);