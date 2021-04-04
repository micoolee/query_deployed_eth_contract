var Web3 = require('web3')
//1、change contract address on mainnet
var contract_address = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
var usdt_address = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
var weth_address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

//2、change path to abi
const uniAbi = require('./build/contracts/uniswap.json')
const accounts = ['0xDC090F503f4efda0Ff22c25797c5697c6c6E866C']
const usdtAbi = require('./build/contracts/usdt.json')
const web3 = new Web3('http://127.0.0.1:7545/')
module.exports = async function () {
  var usdt = new web3.eth.Contract(usdtAbi, usdt_address)
  let contract_uni = new web3.eth.Contract(uniAbi, contract_address)

  //test1
  await contract_uni.methods
    .factory()
    .call()
    .then(function (receipt) {
      console.log('receipt: ', receipt)
    })

  //approve
  await usdt.methods
    .approve(contract_address, 0)
    .send({ from: accounts[0] })
    .then(function (receipt) {
      console.log('receipt: ', receipt)
    })

  await usdt.methods
    .approve(contract_address, '1000000000000000000000')
    .send({ from: accounts[0] })
    .then(function (receipt) {
      console.log('receipt: ', receipt)
    })

  //allowance
  allowance = await usdt.methods.allowance(accounts[0], contract_address).call()
  console.log('allowance:', allowance.toString())

  //swapTokensForExactTokens
  await contract_uni.methods
    .swapExactETHForTokens(200000000, [weth_address, usdt_address], accounts[0], 10000000000000)
    .send({ from: accounts[0], value: '1000000000000000000', gas: 2100000, gasPrice: '20000000000' })
    .then(function (receipt) {
      console.log('receipt: ', receipt)
    })
}
