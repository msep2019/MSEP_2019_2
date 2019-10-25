const MyContract = artifacts.require('MyContract')
const Web3 = require('web3');
const client = require('node-rest-client-promise').Client();
const INFURA_KEY = "SECRET_INFURA_KEY"; // Insert your own key here :)
const ETHERSCAN_API_KEY = "SECRET_ETHERSCAN_KEY";
const web3 = new Web3('wss://mainnet.infura.io/ws/v3/'  +  INFURA_KEY);
const CONTRACT_ADDRESS = "0x6A2C9BEde31a1c397CAa22DAE52aefa6FaBeeA19";
const abi = [{
      anonymous: false,
      inputs: [Array],
      name: 'Log',
      type: 'event',
      constant: undefined,
      payable: undefined,
      signature: '0xb8a00d6d8ca1be30bfec34d8f97e55f0f0fd9eeb7fb46e030516363d4cfe1ad6'
    },
    {
      anonymous: false,
      inputs: [Array],
      name: 'SimpleEvent',
      type: 'event',
      constant: undefined,
      payable: undefined,
      signature: '0x16c23f162b48b065522955c91a071144f6b6079f7585ecd5f239601dd3ab4a4a'
    },
    {
      constant: true,
      inputs: [Array],
      name: 'add',
      outputs: [Array],
      payable: false,
      stateMutability: 'pure',
      type: 'function',
      signature: '0x771602f7'
    },
    {
      constant: false,
      inputs: [],
      name: 'fireEvent',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
      signature: '0x4185df15'
    }]

const contract = Web3.eth.Contract(abi, address);
contract('MyContract', ([_, creator]) => {
  it('can be deployed manually', async function () {
    const byteCode = MyContract.bytecode

    const transactionHash = await web3.eth.sendTransaction({ from: creator, to: 0x0, data: byteCode, gas: 4600000 })
    const receipt = await web3.eth.getTransactionReceipt(transactionHash)

    const myContract = await MyContract.at(receipt.contractAddress)
    const addition = await myContract.add(2, 10)
    assert(addition.eq(12))
  })

  contract.getPastEvent("allEvents",
    {
        fromBlock: START_BLOCK,
        toBlock: END_BLOCK //or latest

    })
    .then(events => console.log(events))
    .catch((err) => console.error(err));
})