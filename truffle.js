require('dotenv').config()
var HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 7545,
      network_id: '*', // Match any network id
      gas: 4700000,
    },
    ropsten: {
      provider: function () {
        return new HDWalletProvider(process.env.INFURA_ROPSTEN_MNEMONIC, 'https://ropsten.infura.io/v3/' + process.env.INFURA_KEY)
      },
      network_id: '3',
      networkCheckTimeout: 50000000,
    },
    main: {
      provider: function () {
        return new HDWalletProvider(process.env.INFURA_MAINNET_MNEMONIC, 'https://eth-mainnet.alchemyapi.io/v2/' + process.env.INFURA_KEY)
      },
      network_id: '1',
      networkCheckTimeout: 50000000,
    },
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
}
