//1、change contract address on mainnet
var strategy_address = '0x75B024ECD6097Ee1c20847B6E3B2dAB4b590Fd5E'
var access_address = '0xF7A51488BF4B119E67A339633ef8125CEF15624A'
var Web3 = require('web3')
//2、change path to abi
const strategy = require('./build/contracts/strategy.json')
const access = require('./build/contracts/access.json')
module.exports = function () {
  //3、change provider to local ganache
  var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/'))

  let strategyIns = web3.eth.contract(strategy.abi).at(strategy_address)
  let accessIns = web3.eth.contract(access).at(access_address)

  //test1
  strategyIns.getName((err, res) => {
    if (err != null) {
      console.log(err)
    } else {
      console.log('result: ', res.toString())
    }
  })

  //test2
  strategyIns.getAaveAPY('0xdAC17F958D2ee523a2206206994597C13D831ec7', (err, res) => {
    if (err != null) {
      console.log(err)
    } else {
      console.log('result: ', res.toString())
    }
  })

  //test3
  strategyIns.getAavePool((err, res) => {
    if (err != null) {
      console.log(err)
    } else {
      console.log('result: ', res.toString())
    }
  })

  //test4
  strategyIns.getCompound((err, res) => {
    if (err != null) {
      console.log(err)
    } else {
      console.log('result: ', res.toString())
    }
  })

  //test5
  strategyIns.provider((err, res) => {
    if (err != null) {
      console.log(err)
    } else {
      console.log('result: ', res.toString())
    }
  })

  //test6
  accessIns.OPERATOR_ROLE.call((err, res) => {
    if (err != null) {
      console.log(err)
    } else {
      console.log('OPERATOR_ROLE: ', res)
    }
  })
  console.log('end')
}
