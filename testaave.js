var Web3 = require('web3')
const web3 = new Web3('http://127.0.0.1:7545/')
var assert = require('assert')

//1、address on mainnet
var swap_aave = '0xDeBF20617708857ebe4F679508E7b7863a8A8EeE'
var usdt_address = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
var token_aave_address = '0xFd2a8fA60Abd58Efe3EeE34dd494cD491dC14900'
var gauge_aave = '0xd662908ADA2Ea1916B3318327A97eB18aD588b5d'
var crv = '0xD533a949740bb3306d119CC777fa900bA034cd52'
const accounts = ['0xDC090F503f4efda0Ff22c25797c5697c6c6E866C', '0xaeB2Be031655344bb8e30a92725e3C345f1cAdad']

//2、path to abi
const swap_aave_abi = require('./build/contracts/stableSwapAave.json')
const gaugeaave = require('./build/contracts/gauge_aave.json')
const usdtAbi = require('./build/contracts/usdt.json')
const aave_token_abi = require('./build/contracts/lptoken_aave.json')

module.exports = async function () {
  //usdt实例
  const usdt = new web3.eth.Contract(usdtAbi, usdt_address)
  balance = await usdt.methods.balanceOf(accounts[0]).call()
  console.log('my usdt balance: ', balance.toString())

  const aave_token = new web3.eth.Contract(aave_token_abi, token_aave_address)
  balance = await aave_token.methods.balanceOf(accounts[0]).call()
  console.log('my aave_token balance: ', balance.toString())

  //aave swap实例
  const contract_aave = new web3.eth.Contract(swap_aave_abi, swap_aave)
  virtual_price = await contract_aave.methods.get_virtual_price().call()
  console.log('virtual price: ', virtual_price)

  //aave gauge实例
  const contract_gaugeaave = new web3.eth.Contract(gaugeaave, gauge_aave)
  minter = await contract_gaugeaave.methods.minter().call()
  console.log('minter: ', minter)
  assert.strictEqual(minter, '0xd061D61a4d941c39E5453435B6345Dc261C2fcE0', 'minter is wrong')

  //approve usdt额度给aave swap
  allow = '10000000000000000000000'
  await approve(usdt, swap_aave, accounts[0], 0)
  await approve(usdt, swap_aave, accounts[0], allow)

  //检查usdt的额度
  allowance = await usdt.methods.allowance(accounts[0], swap_aave).call()
  console.log('usdt allowance:', allowance.toString())
  assert.strictEqual(allowance.toString(), allow, 'allowance not equal')

  //aave swap增加流动性
  await contract_aave.methods
    .add_liquidity([0, 0, 5000000], 0, true)
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
      assert.strictEqual(receipt.status, true, 'fail to add_liquidity')
    })

  await contract_aave.methods
    .remove_liquidity(1000000000000000n, [0, 0, 0], true)
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
      assert.strictEqual(receipt.status, true, 'fail to remove_liquidity')
    })

  await contract_gaugeaave.methods
    .set_approve_deposit(accounts[0], true)
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .then(function (receipt) {
      console.log('set_approve_deposit receipt: ', receipt.status)
      assert.strictEqual(receipt.status, true, 'fail to set_approve_deposit')
    })

  //approve aave lptoken额度给gauge_aave
  await approve(aave_token, gauge_aave, accounts[0], 0)
  await approve(aave_token, gauge_aave, accounts[0], '10000000000000000000000')

  await contract_gaugeaave.methods
    .deposit('880000000000000000', accounts[0])
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
      assert.strictEqual(receipt.status, true, 'fail to deposit')
    })

  await contract_gaugeaave.methods
    .withdraw('10000000000000')
    .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
    .then(function (receipt) {
      console.log('receipt: ', receipt.status)
      assert.strictEqual(receipt.status, true, 'fail to withdraw')
    })
  result = await contract_gaugeaave.methods.balanceOf(accounts[0]).call()
  console.log('(a3CRV-gauge) balance: ', result)
  result = await contract_gaugeaave.methods.claimable_tokens(accounts[0]).call()
  console.log('claimable tokens result: ', result)
  result = await contract_gaugeaave.methods.claimable_reward(accounts[0], token_aave_address).call()
  console.log('claimable reward result: ', result)
  result = await contract_gaugeaave.methods.claimable_reward(accounts[0], crv).call()
  console.log('claimable crv: ', result)

  // await contract_gaugeaave.methods
  //   .claim_rewards(accounts[0])
  //   .send({ from: accounts[0], gas: 2100000, gasPrice: '20000000000' })
  //   .then(function (receipt) {
  //     console.log('receipt: ', receipt.status)
  //     assert.strictEqual(receipt.status, true, 'fail to withdraw')
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
