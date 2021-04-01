//1、change contract address on mainnet
var contract_address = '0x75B024ECD6097Ee1c20847B6E3B2dAB4b590Fd5E'
var Web3 = require('web3')
//2、change path to abi
const strategy = require('./build/contracts/strategy.json')
module.exports = function () {
  //3、change provider to local ganache
  var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/'))

  let contract = web3.eth.contract(strategy.abi)

  // 部署新合约，https://learnblockchain.cn/docs/web3js-0.2x/web3.eth.html
  var contractInstance = contract.new([constructorParam1], [constructorParam2], { data: '0x12345...', from: myAccount, gas: 1000000 })
}
