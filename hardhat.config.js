const fs = require('fs');

const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const protocol = 'https';
const ip = 'api.avax-test.network';
const port = 9650;
const provider = new Web3.providers.HttpProvider(
  `${protocol}://${ip}:${port}/ext/bc/C/rpc`,
);
const providerNoPort = new Web3.providers.HttpProvider(
  `${protocol}://${ip}/ext/bc/C/rpc`,
);
const privateKeys = ['<INSERT_PRIVATE_KEY>'];

require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-web3');
// require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: '0.8.0',
  networks: {
    // test: {
    //   url: 'https://api.avax-test.network/ext/bc/C/rpc',
    //   chainId: 43113,
    //   from: <INSERT_ADDRESS>,
    // },
    fuji: {
      provider: () => {
        return new HDWalletProvider({
          privateKeys: privateKeys,
          providerOrUrl: testProvider,
        });
      },
      url: `${protocol}://${ip}/ext/bc/C/rpc`,
      network_id: '*',
      gas: 300000000,
      gasPrice: 225000000000,
    },
  },
};

task(
  'delete',
  'Delete old compiled artifacts & deployments',
  async (_, { ethers }) => {
    if (fs.existsSync('./artifacts')) {
      fs.rmdirSync('./artifacts', { recursive: true, force: true });
    }
    if (fs.existsSync('./cache')) {
      fs.rmdirSync('./cache', { recursive: true, force: true });
    }
  },
);
