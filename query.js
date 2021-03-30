//1、change contract address on mainnet
var contract_address = '0x75B024ECD6097Ee1c20847B6E3B2dAB4b590Fd5E'
var Web3 = require('web3')
//2、change path to abi
const strategy = require('./build/contracts/strategy.json')
module.exports = function () {
  //3、change provider to local ganache
  var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/'))

  let contract = web3.eth.contract(strategy.abi).at(contract_address)

  //test1
  contract.getName((err, res) => {
    if (err != null) {
      console.log(err)
    } else {
      console.log('result: ', res.toString())
    }
  })

  //test2
  contract.getAaveAPY('0xdAC17F958D2ee523a2206206994597C13D831ec7', (err, res) => {
    if (err != null) {
      console.log(err)
    } else {
      console.log('result: ', res.toString())
    }
  })
}
