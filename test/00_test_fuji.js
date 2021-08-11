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

const Fuji = artifacts.require('Fuji');

contract('Fuji', (accounts) => {
  let owner = { balance: 0, address: accounts[0] },
    sender = { balance: 0, address: accounts[1] },
    receiver = { balance: 0, address: accounts[2] },
    user = { balance: 0, address: accounts[3] };
  let fuji, contractAddress;

  before(async () => {
    fuji = await Fuji.deployed();
    contractAddress = fuji.address;
    console.log('fuji address: %s', contractAddress);
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
      const mintTransaction = await fuji.mint(owner.address, 10);

      const balanceOfTransaction = await fuji.balanceOf(owner.address);
      owner.balance = utils.hexToNumber(balanceOfTransaction);
      if (DEBUG) {
        debugger;
      }
      expect(owner.balance).to.equal(10);
    });
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {
      console.log('DEBUG');
    });
  });
});
