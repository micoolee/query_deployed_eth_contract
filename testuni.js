var Web3 = require('web3')
var assert = require('assert')

//1、change contract address on mainnet
var contract_uni_address = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
var usdt_address = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
var weth_address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
var dai_address = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
var crv = '0xD533a949740bb3306d119CC777fa900bA034cd52' //(1e18)
var compound = '0xc00e94Cb662C3520282E6f5717214004A7f26888' //(1e18)

//2、change path to abi
const uniAbi = require('./build/contracts/uniswap.json')
const accounts = ['0xDC090F503f4efda0Ff22c25797c5697c6c6E866C']
const usdtAbi = require('./build/contracts/usdt.json')
const crvAbi = require('./build/contracts/crv.json')
const compoundAbi = require('./build/contracts/compound.json')
const web3 = new Web3('http://127.0.0.1:7545/')
module.exports = async function () {
  //构造usdt和uni的实例
  var usdt = new web3.eth.Contract(usdtAbi, usdt_address)
  let contract_uni = new web3.eth.Contract(uniAbi, contract_uni_address)
  var contract_crv = new web3.eth.Contract(crvAbi, crv)
  var contract_compound = new web3.eth.Contract(compoundAbi, compound)

  //uni调用测试
  factory = await contract_uni.methods.factory().call()
  console.log('factory: ', factory)
  balance = await contract_crv.methods.balanceOf(accounts[0]).call()
  console.log('crv balance:', balance)
  balance = await contract_compound.methods.balanceOf(accounts[0]).call()
  console.log('compound balance:', balance)

  //approve usdt额度给uni
  await approve(usdt, contract_uni_address, accounts[0], 0)
  await approve(usdt, contract_uni_address, accounts[0], `${1 * 1e20}`.toString())

  //check allowance
  allowance = await usdt.methods.allowance(accounts[0], contract_uni_address).call()
  console.log('allowance:', allowance.toString())

  //swap eth to usdt
  // await contract_uni.methods
  //   .swapExactETHForTokens(200000000, [weth_address, usdt_address], accounts[0], 10000000000000)
  //   .send({ from: accounts[0], value: '1000000000000000000', gas: 2100000, gasPrice: '20000000000' })
  //   .then(function (receipt) {
  //     console.log('receipt: ', receipt.status)
  //   })

  //swap eth to comp
  // await contract_uni.methods
  //   .swapExactETHForTokens(200000000, [weth_address, compound], accounts[0], 10000000000000)
  //   .send({ from: accounts[0], value: '1000000000000000000', gas: 2100000, gasPrice: '20000000000' })
  //   .then(function (receipt) {
  //     console.log('receipt: ', receipt.status)
  //   })

  //swap crv to usdt(crv 1e18)
  // await approve(contract_crv, contract_uni_address, accounts[0], 0)
  // await approve(contract_crv, contract_uni_address, accounts[0], '10000000000000000000000')
  // allowance = await contract_crv.methods.allowance(accounts[0], contract_uni_address).call()
  // console.log('crv allowance:', allowance.toString())
  // await contract_uni.methods
  //   .swapExactTokensForTokens(`${1 * 1e18}`, 0, [crv, usdt_address], accounts[0], 10000000000000)
  //   .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
  //   .then(function (receipt) {
  //     console.log('receipt: ', receipt.status)
  //   })

  //swap comp to usdt
  // await approve(contract_compound, contract_uni_address, accounts[0], 0)
  // await approve(contract_compound, contract_uni_address, accounts[0], `${1 * 1e20}`.toString())
  // allowance = await contract_compound.methods.allowance(accounts[0], contract_uni_address).call()
  // console.log('compound allowance:', allowance.toString())
  // await contract_uni.methods
  //   .swapExactTokensForTokens(`${1 * 1e18}`, 0, [compound, usdt_address], accounts[0], 10000000000000)
  //   .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
  //   .then(function (receipt) {
  //     console.log('receipt: ', receipt.status)
  //   })

  console.log('end')
}

async function approve(token, account2, from, amount) {
  await token.methods
    .approve(account2, amount)
    .send({ from: from })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
      assert.strictEqual(receipt.status, true, 'fail to approve')
    })
}
