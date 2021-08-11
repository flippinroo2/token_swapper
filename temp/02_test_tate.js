const DEBUG = false;

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

const Tate = artifacts.require('Tate');

contract('Tate', (accounts) => {
  let deployer = { balance: 0, address: accounts[0] },
    sender = { balance: 0, address: accounts[1] },
    receiver = { balance: 0, address: accounts[2] },
    user = { balance: 0, address: accounts[3] };
  let tate, contractAddress;

  before(async () => {
    tate = await Tate.deployed();
    contractAddress = tate.address;
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
        // debugger;
      }
      const mintTransaction = await tate.mint(deployer.address, 10);

      const balanceOfTransaction = await tate.balanceOf(deployer.address);
      deployer.balance = utils.hexToNumber(balanceOfTransaction);
      if (DEBUG) {
        debugger;
      }
      expect(deployer.balance).to.equal(10);
    });
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {
      console.log('DEBUG');
    });
  });
});
