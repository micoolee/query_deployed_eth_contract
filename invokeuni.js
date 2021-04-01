var Web3 = require('web3')
//1、change contract address on mainnet
var contract_address = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
var usdt_address = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
var comp_address = '0xc00e94Cb662C3520282E6f5717214004A7f26888'

//2、change path to abi
const uni = require('./build/contracts/uniswap.json')
const accounts = ['0xDC090F503f4efda0Ff22c25797c5697c6c6E866C']
const usdtAbi = require('./build/contracts/usdt.json')
module.exports = function () {
  //3、change provider to local ganache
  var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/'))
  var usdt = web3.eth.contract(usdtAbi).at(usdt_address)
  let contract = web3.eth.contract(uni).at(contract_address)

  //test1
  var err,
    res = contract.factory.call({ from: accounts[0] })
  if (err != null) {
    console.log(err)
  } else {
    console.log('factory result: ', res.toString())
  }

  //weth
  var err,
    res = contract.WETH.call({ from: accounts[0] })
  if (err != null) {
    console.log(err)
  } else {
    console.log('WETH result: ', res.toString())
  }

  //approve
  usdt.approve(contract_address, 0, { from: accounts[0] })
  usdt.approve(contract_address, 10000000000000000000000, { from: accounts[0] })

  //allowance
  var err,
    res = usdt.allowance.call(accounts[0], contract_address, { from: accounts[0] })
  if (err != null) {
    console.log(err)
  } else {
    console.log('allowance res:', res.toString())
  }

  usdt.safeTransfer()
  //swapTokensForExactTokens
  // var err,
  //   res = contract.swapExactTokensForTokens(30, 1, [usdt_address, comp_address], accounts[0], 10000000000000, { from: accounts[0] })
  // if (err != null) {
  //   console.log(err)
  // } else {
  //   console.log('swapExactTokensForTokens res:', res)
  // }
}
