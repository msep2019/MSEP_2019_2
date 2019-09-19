const Web3 = require('web3');
const fs = require('fs');
//if (typeof Web3 !== 'undefined') { 
//    const web3T = new Web3(Web3.currentProvider); 
//} else { 
//    const webhttp = new Web3(Web3.givenProviders || new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
//}
//const webhttp = new Web3(Web3.givenProviders || new Web3.providers.HttpProvider('http://127.0.0.1:7545'));
const websocket = new Web3(Web3.givenProviders || new Web3,providers.WebsocketProvider('http://127.0.0.1:7545'));

const mycontractJson = require('/Users/conglin/blockchain/truffle_sample/build/contracts/Mycontract.json');
const contractDetail = {
    abi : mycontractJson.abi,
    contractAddress : '0xDC0AfDc52683df220937739D1Fdfd11E4345eFeA'
};

//let MyContract;
//let Migrations;

// function mycontractListen(){
const myContract = new websocket.eth.Contract(contractDetail.abi, contractDetail.contractAddress);
    
// }
console.log("-------");
    myContract.events.Instructor().on('data', (event) =>{
        const data = event.returnvalues;
        data.hash_id, { 
            'a': data.a,
            'b': data.b,
        };
    })
    .on('error', function(err){
        console.log(err);
    });

//mycontractListen();

