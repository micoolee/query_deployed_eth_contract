var Web3 = require('web3')

//1、change contract address on mainnet
var usdt_address = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
var token_3crv = '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490'
var crv = '0xD533a949740bb3306d119CC777fa900bA034cd52'
var lp_token = '0xd2967f45c4f384deea880f807be904762a3dea07'

var swap_gusd = '0x4f062658EaAF2C1ccf8C8e36D6824CDf41167956'
var deposit_gusd = '0x64448B78561690B70E17CBE8029a3e5c1bB7136e'
var gauge_gusd = '0xC5cfaDA84E902aD92DD40194f0883ad49639b023'

//2、change path to abi
const swapgusd = require('./build/contracts/swap_metapool.json')
const deposit_metapool = require('./build/contracts/deposit_metapool.json')
const gauge_metapool = require('./build/contracts/gauge_metapool.json')
const lptoken_metapool = require('./build/contracts/lptoken_metapool.json')
const usdtAbi = require('./build/contracts/usdt.json')
const wethAbi = require('./build/contracts/weth.json')
const accounts = ['0xDC090F503f4efda0Ff22c25797c5697c6c6E866C', '0xaeB2Be031655344bb8e30a92725e3C345f1cAdad']

const web3 = new Web3('http://127.0.0.1:7545/')
module.exports = async function () {
  //usdt实例
  const usdt = new web3.eth.Contract(usdtAbi, usdt_address)
  balance = await usdt.methods.balanceOf(accounts[0]).call()
  console.log(balance.toString())

  //3crv实例
  const crv3 = new web3.eth.Contract(usdtAbi, token_3crv)
  balance = await crv3.methods.balanceOf(accounts[0]).call()
  console.log(balance.toString())

  //gusd swap实例
  const contract_gusd = new web3.eth.Contract(swapgusd, swap_gusd)
  contract_gusd.methods.get_virtual_price().call((err, val) => {
    console.log({ err, val })
  })

  //lp token
  const lpToken = new web3.eth.Contract(lptoken_metapool, lp_token)
  balance = await lpToken.methods.balanceOf(accounts[0]).call()
  console.log(balance.toString())

  //gusd deposit实例
  const contract_depositgusd = new web3.eth.Contract(deposit_metapool, deposit_gusd)
  contract_depositgusd.methods.pool().call((err, val) => {
    console.log({ err, val })
  })

  //gusd gauge实例
  const contract_gaugegusd = new web3.eth.Contract(gauge_metapool, gauge_gusd)
  contract_gaugegusd.methods.minter().call((err, val) => {
    console.log({ err, val })
  })

  //approve额度
  //写入的函数
  await crv3.methods
    .approve(swap_gusd, 0)
    .send({ from: accounts[0] })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })
  await crv3.methods
    .approve(swap_gusd, '10000000000000000000000')
    .send({ from: accounts[0] })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })

  //mike 检查3crv的额度
  allowance = await crv3.methods.allowance(accounts[0], swap_gusd).call()
  console.log('allowance:', allowance.toString())

  await contract_gusd.methods
    .add_liquidity([0, '2000000000000000000'], 0)
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })

  await contract_gusd.methods
    .remove_liquidity('1000000000000000000', [0, 0])
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })

  await lpToken.methods
    .approve(gauge_gusd, 0)
    .send({ from: accounts[0] })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })
  await lpToken.methods
    .approve(gauge_gusd, '10000000000000000000000')
    .send({ from: accounts[0] })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })

  allowance = await lpToken.methods.allowance(accounts[0], gauge_gusd).call()
  console.log('lptoken allowance:', allowance.toString())

  await contract_gaugegusd.methods
    .deposit(10, accounts[0])
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .once('transactionHash', (hash) => {
      console.log(hash)
    })
    .once('receipt', (receipt) => {
      console.log(receipt)
    })

  await contract_gaugegusd.methods
    .withdraw(10)
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
