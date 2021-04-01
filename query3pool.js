var Web3 = require('web3')

//1、change contract address on mainnet
var address_3pool = '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7'
var usdt_address = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
var token_3crv = '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490'
var gauge_3pool = '0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A'
var weth_address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

//2、change path to abi
const swap3pool = require('./build/contracts/stableSwap3pool.json')
const usdtAbi = require('./build/contracts/usdt.json')
const wethAbi = require('./build/contracts/weth.json')
const accounts = ['0xDC090F503f4efda0Ff22c25797c5697c6c6E866C', '0xaeB2Be031655344bb8e30a92725e3C345f1cAdad']

var Tx = require('ethereumjs-tx').Transaction
const web3 = new Web3('http://127.0.0.1:7545/')
module.exports = async function () {
  //3、change provider to local ganache
  let result
  const contract_3pool = new web3.eth.Contract(swap3pool.abi, address_3pool)
  contract_3pool.methods.get_virtual_price().call((err, val) => {
    console.log({ err, val })
  })

  contract_3pool.methods.future_owner().call((err, val) => {
    console.log({ err, val })
  })
  // //test2
  // var err,
  //   res = contract_3pool.future_owner.call({ from: accounts[0] })
  // if (err != null) {
  //   console.log(err)
  // } else {
  //   console.log('future_owner res:', res)
  // }

  //test3
  const usdt = new web3.eth.Contract(usdtAbi, usdt_address)

  balance = await usdt.methods.balanceOf(accounts[0]).call()
  console.log(balance.toString())

  await usdt.methods
    .approve(address_3pool, 0)
    .send({ from: accounts[0] })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })

  await usdt.methods
    .approve(address_3pool, 50000000)
    .send({ from: accounts[0] })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })

  allowance = await usdt.methods.allowance(accounts[0], address_3pool).call()
  console.log('allowance:', allowance.toString())

  await contract_3pool.methods
    .add_liquidity([0, 0, 1000000], 900000)
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })

  await contract_3pool.methods
    .remove_liquidity(900000, [0, 0, 1000000])
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })
}

function balanceOf(token, account, from) {
  var err,
    res = token.balanceOf.call(account, { from: from })
  if (err != null) {
    console.log(err)
  } else {
    console.log('balance res:', res.toString())
  }
}

function allowance(token, account1, account2, from) {
  var err,
    res = token.allowance.call(account1, account2, { from: from })
  if (err != null) {
    console.log(err)
  } else {
    console.log('allowance res:', res.toString())
  }
}
