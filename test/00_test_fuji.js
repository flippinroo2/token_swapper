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
  const [owner, sender, receiver, user] = accounts;

  before(async () => {
    fuji = await Fuji.deployed();
    contractAddress = await fuji.address;
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
      fuji.mint(owner, 10000);
    });
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {});
  });
});
