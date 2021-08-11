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

const Haku = artifacts.require('Haku');

contract('Haku', (accounts) => {
  let deployer = { balance: 0, address: accounts[0] },
    sender = { balance: 0, address: accounts[1] },
    receiver = { balance: 0, address: accounts[2] },
    user = { balance: 0, address: accounts[3] };
  let haku, contractAddress;

  before(async () => {
    haku = await Haku.deployed();
    contractAddress = haku.address;
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
      const mintTransaction = await haku.mint(deployer.address, 10);

      const balanceOfTransaction = await haku.balanceOf(deployer.address);
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
