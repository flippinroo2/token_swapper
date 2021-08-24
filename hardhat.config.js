const fs = require('fs');

const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const protocol = 'https';
const ip = 'api.avax-test.network';
const port = 9650;
const provider = new Web3.providers.HttpProvider(
  `${protocol}://${ip}:${port}/ext/bc/C/rpc`,
);
const testProvider = new Web3.providers.HttpProvider(
  `${protocol}://${ip}/ext/bc/C/rpc`,
);
const privateKeys = [
  '0x53f4305f5dfbe5228f7264fa7b15ff28dfbdee34b2dc0887b6e585774bec66d6',
];

require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-web3');
// require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: '0.8.0',
  networks: {
    // test: {
    //   url: 'https://api.avax-test.network/ext/bc/C/rpc',
    //   chainId: 43113,
    //   from: 0xeb5c8fb7d97bf7084abdd77ccaf7db5beaab08fa,
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
