const DEBUG = true;

const { use, expect } = require('chai');
use(require('chai-as-promised')).should();

/*
_
artifacts
Atomics
btoa
config
console
crypto
debug
WebAssembly
*/

const { eth, utils } = web3;

const Fuji = artifacts.require('Fuji');

contract('Fuji', (accounts) => {
  let fuji, contractAddress;
  let deployer = { balance: 0 },
    sender = { balance: 0 },
    receiver = { balance: 0 },
    user = { balance: 0 };
  deployer.address = accounts[0];
  sender.address = accounts[1];
  receiver.address = accounts[2];
  user.address = accounts[3];

  before(async () => {
    fuji = await Fuji.deployed();
    contractAddress = fuji.address;
  });

  describe('Deployment', async () => {
    it('DEPLOY', async () => {
      assert.notEqual(contractAddress, 0x0);
      assert.notEqual(contractAddress, '');
      assert.notEqual(contractAddress, null);
      assert.notEqual(contractAddress, undefined);
    });

    it('MINT', async () => {
      if (DEBUG) {
        debugger;
      }
      const mintTransaction = await fuji.mint(deployer.address, 10);

      const balanceOfTransaction = await fuji.balanceOf(deployer.address);
      const balance1 = utils.hexToNumber(balanceOfTransaction);
      deployer.balance = balance1;
    });
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {});
  });
});
