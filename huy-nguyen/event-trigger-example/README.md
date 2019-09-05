A simple smart contract with event. Emit the event after executing calculations.

Build command:
- truffle migrate  (Note: change network configuration in truffle-config.js)

Call function commands:
- connect to remote blockchain network: truffle console 
- In the console, run following commands
+ var dApp
+ SimpleContract.deployed().then(function(instance) { dApp = instance; })
+ dApp.calculate(4, 5)

