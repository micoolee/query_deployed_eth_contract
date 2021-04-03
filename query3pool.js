var Web3 = require('web3')

//1、change contract address on mainnet
var swap_3pool = '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7'
var usdt_address = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
var token_3crv = '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490'
var gauge_3pool = '0xbFcF63294aD7105dEa65aA58F8AE5BE2D9d0952A'
var weth_address = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
var crv = '0xD533a949740bb3306d119CC777fa900bA034cd52'
//2、change path to abi
const swap3pool = require('./build/contracts/stableSwap3pool.json')
const gauge3pool = require('./build/contracts/gauge.json')
const usdtAbi = require('./build/contracts/usdt.json')
const wethAbi = require('./build/contracts/weth.json')
const accounts = ['0xDC090F503f4efda0Ff22c25797c5697c6c6E866C', '0xaeB2Be031655344bb8e30a92725e3C345f1cAdad']

const web3 = new Web3('http://127.0.0.1:7545/')
module.exports = async function () {
  //usdt实例
  const usdt = new web3.eth.Contract(usdtAbi, usdt_address)
  balance = await usdt.methods.balanceOf(accounts[0]).call()
  console.log(balance.toString())

  //3pool实例
  const contract_3pool = new web3.eth.Contract(swap3pool.abi, swap_3pool)
  //只读的函数
  contract_3pool.methods.get_virtual_price().call((err, val) => {
    console.log({ err, val })
  })

  //gauge实例
  const contract_gauge3pool = new web3.eth.Contract(gauge3pool, gauge_3pool)
  contract_gauge3pool.methods.minter().call((err, val) => {
    console.log({ err, val })
  })

  //approve额度
  //写入的函数
  await usdt.methods
    .approve(swap_3pool, 0)
    .send({ from: accounts[0] })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })
  await usdt.methods
    .approve(swap_3pool, '100000000000000000')
    .send({ from: accounts[0] })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })

  //mike 检查usdt的额度
  allowance = await usdt.methods.allowance(accounts[0], swap_3pool).call()
  console.log('allowance:', allowance.toString())

  await contract_3pool.methods
    .add_liquidity([0, 0, 5000000], 0)
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })

  await contract_3pool.methods
    .remove_liquidity(1000000000000000n, [0, 0, 0])
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })

  await contract_gauge3pool.methods.approved_to_deposit('0xdc090f503f4efda0ff22c25797c5697c6c6e866c', '0xdc090f503f4efda0ff22c25797c5697c6c6e866c').call((err, val) => {
    console.log({ err, val })
  })

  await contract_gauge3pool.methods
    .deposit('880000000000000000', accounts[0])
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })

  await contract_gauge3pool.methods
    .withdraw('10000000000000')
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })
}

function approve(token, account2, from, amount) {
  token.methods
    .approve(account2, amount)
    .send({ from: from })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })
}
