const fs = require('fs');
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-web3');

module.exports = {
  solidity: '0.8.0',
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
