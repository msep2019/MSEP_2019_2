geth --networkid 4224 --mine --minerthreads 1 --datadir "~/ChainSkills/private/chainskills.json" --nodiscover --rpc --rpcport "8545" --port "30303" --rpccorsdomain "*" --nat "any" --rpcapi eth,web3,personal,net --unlock 0 --password ~/ChainSkills/private/chainskills.json/password.sec --ipcpath "/usr/local/Cellar/ethereum/1.9.2/bin/geth.ipc" --allow-insecure-unlock