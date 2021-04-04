var Web3 = require('web3')
const web3 = new Web3('http://127.0.0.1:7545/')

//1、address on mainnet
var usdt_address = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
var gusd_address = '0x056Fd409E1d7A124BD7017459dFEa2F387b6d5Cd' //mike decimal=2
var token_3crv = '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490'
var crv = '0xD533a949740bb3306d119CC777fa900bA034cd52'
var lp_token = '0xd2967f45c4f384deea880f807be904762a3dea07'

var swap_gusd = '0x4f062658EaAF2C1ccf8C8e36D6824CDf41167956'
var deposit_gusd = '0x64448B78561690B70E17CBE8029a3e5c1bB7136e'
var gauge_gusd = '0xC5cfaDA84E902aD92DD40194f0883ad49639b023'
const accounts = ['0xDC090F503f4efda0Ff22c25797c5697c6c6E866C', '0xaeB2Be031655344bb8e30a92725e3C345f1cAdad']

//2、path to abi
const swapgusd = require('./build/contracts/swap_metapool.json')
const deposit_metapool = require('./build/contracts/deposit_metapool.json')
const gauge_metapool = require('./build/contracts/gauge_metapool.json')
const lptoken_metapool = require('./build/contracts/lptoken_metapool.json')
const usdtAbi = require('./build/contracts/usdt.json')
const wethAbi = require('./build/contracts/weth.json')

module.exports = async function () {
  //usdt实例
  const usdt = new web3.eth.Contract(usdtAbi, usdt_address)
  balance = await usdt.methods.balanceOf(accounts[0]).call()
  console.log('my usdt balance: ', balance.toString())

  //gusd实例
  const gusd = new web3.eth.Contract(usdtAbi, gusd_address)
  balance = await gusd.methods.balanceOf(accounts[0]).call()
  console.log('my gusd balance: ', balance.toString())

  //3crv实例
  const crv3 = new web3.eth.Contract(usdtAbi, token_3crv)
  balance = await crv3.methods.balanceOf(accounts[0]).call()
  console.log('my 3crv balance: ', balance.toString())

  //gusd swap实例
  const contract_gusd = new web3.eth.Contract(swapgusd, swap_gusd)
  virtual_price = await contract_gusd.methods.get_virtual_price().call()
  console.log('virtual_price: ', virtual_price)

  //gusd+3pool lp token
  const lpToken = new web3.eth.Contract(lptoken_metapool, lp_token)
  balance = await lpToken.methods.balanceOf(accounts[0]).call()
  console.log('lpToken balance: ', balance.toString())

  //gusd deposit实例
  const contract_depositgusd = new web3.eth.Contract(deposit_metapool, deposit_gusd)
  pool = await contract_depositgusd.methods.pool().call()
  console.log('pool: ', pool)

  //gusd gauge实例
  const contract_gaugegusd = new web3.eth.Contract(gauge_metapool, gauge_gusd)
  minter = await contract_gaugegusd.methods.minter().call()
  console.log('minter: ', minter)

  //approve 3crv额度
  await crv3.methods
    .approve(swap_gusd, 0)
    .send({ from: accounts[0] })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })
  await crv3.methods
    .approve(swap_gusd, '10000000000000000000000')
    .send({ from: accounts[0] })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })

  //检查3crv的额度
  allowance = await crv3.methods.allowance(accounts[0], swap_gusd).call()
  console.log('allowance:', allowance.toString())

  //deposit 3crv
  await contract_gusd.methods
    .add_liquidity([0, '2000000000000000000'], 0)
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })

  await contract_gusd.methods
    .remove_liquidity('2000000000000000000', [0, 0])
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })

  //approve gusd+3pool的lp token给gauge_gusd
  await lpToken.methods
    .approve(gauge_gusd, 0)
    .send({ from: accounts[0] })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })
  await lpToken.methods
    .approve(gauge_gusd, '10000000000000000000000')
    .send({ from: accounts[0] })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })

  allowance = await lpToken.methods.allowance(accounts[0], gauge_gusd).call()
  console.log('lptoken allowance:', allowance.toString())

  //deposit gusd+3pool的lp token
  await contract_gaugegusd.methods
    .deposit(10, accounts[0])
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })

  await contract_gaugegusd.methods
    .withdraw(5)
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })

  await contract_gaugegusd.methods
    .claimable_tokens(accounts[0])
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })

  balance = await contract_gaugegusd.methods.balanceOf(accounts[0]).call()
  console.log('balance: ', balance)

  claimableTokens = await contract_gaugegusd.methods.claimable_tokens(accounts[0]).call()
  console.log('claimableTokens: ', claimableTokens)

  //approve gusd+3pool的lp token给deposit_gusd
  await lpToken.methods
    .approve(deposit_gusd, 0)
    .send({ from: accounts[0] })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })
  await lpToken.methods
    .approve(deposit_gusd, '10000000000000000000000')
    .send({ from: accounts[0] })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })
  allowance = await lpToken.methods.allowance(accounts[0], deposit_gusd).call()
  console.log('lptoken allowance of deposit_gusd:', allowance.toString())

  //approve gusd给deposit_gusd
  await gusd.methods
    .approve(deposit_gusd, 0)
    .send({ from: accounts[0] })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })
  await gusd.methods
    .approve(deposit_gusd, '10000000000000000000000')
    .send({ from: accounts[0] })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })
  allowance = await gusd.methods.allowance(accounts[0], deposit_gusd).call()
  console.log('gusd allowance of deposit_gusd:', allowance.toString())

  await contract_depositgusd.methods
    .add_liquidity([1, 0, 0, 0], 0)
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })

  await contract_depositgusd.methods
    .remove_liquidity(10, [0, 0, 0, 0])
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })

  await contract_depositgusd.methods
    .remove_liquidity_one_coin(10, 3, 0)
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
    })
  console.log('end')
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
