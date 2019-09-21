# Ethereum install on MacOS

## Install Ethereum with Homebrew
  ```
brew update
brew tap ethereum/ethereum
brew install ethereum
  ```
  The default path of Ethereum is `/usr/local/Cellar/ethereum/[Ethereum version]` 
## Setup `genesis.json` 

  ```
{
	"config": {
        "chainId": 10, 
        "homesteadBlock": 0,
        "eip155Block": 0,
        "eip158Block": 0
    },
    "alloc"      : {},
    "coinbase"   : "0x0000000000000000000000000000000000000000",
    "difficulty" : "0x20000",
    "extraData"  : "",
    "gasLimit"   : "0x2fefd8",
    "nonce"      : "0x0000000000000042",
    "mixhash"    : "0x0000000000000000000000000000000000000000000000000000000000000000",
    "parentHash" : "0x0000000000000000000000000000000000000000000000000000000000000000",
    "timestamp"  : "0x00"
}
  ```
  The `genesis.json` should be under `/usr/local/Cellar/ethereum/[Ethereum version]/bin` 
## Innitialization 

  ```
  cd /usr/local/Cellar/ethereum/[Ethereum version]/bin/
  mkdir /usr/local/Cellar/ethereum/[Ethereum version]/bin/chain
  geth --datadir "/usr/local/Cellar/ethereum/[Ethereum version]/bin/chain" init genesis.json
  ```
  
## Launch the client

  ```
  geth --identity "PICCetherum" --rpc --rpccorsdomain "*" --datadir "/usr/local/Cellar/ethereum/[Ethereum version]/bin/chain" --port 8545 --networkid 95518
  ```
  
   
## Connection with client

  ```
  geth attach /usr/local/Cellar/ethereum/[Ethereum version]/bin/chain/geth.ipc
  ```
  
   
## Essential Commmands

  ```
  personal.newAccount('test-account-1') //create new account
  miner.start() //start
  miner.stop() //stop
  eth.getBalance(eth.accounts[2]) //Inspect particular account balance
  eth.blockNumber  //Can be used to inspect if the Ethereum is working
  ``
  ```
