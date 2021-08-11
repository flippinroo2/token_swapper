const DEBUG = false;

const Storage = artifacts.require('Storage');
const Fuji = artifacts.require('Fuji');
const Haku = artifacts.require('Haku');
const Tate = artifacts.require('Tate');

describe('Test Suite', (temp) => {
  let fuji, haku, tate;
  let owner, sender, receiver, user;
  let contractAddress;

  describe('Deployment', async (suite) => {
    it('DEPLOY', async (suite) => {
      if (DEBUG) {
        debugger;
      }

      fuji = await Fuji.deployed();
      // contractAddress = await fuji.address;
      haku = await Haku.deployed();
      tate = await Tate.deployed();

      [owner, sender, receiver, user] = accounts;
      assert.notEqual(contractAddress, 0x0);
      assert.notEqual(contractAddress, '');
      assert.notEqual(contractAddress, null);
      assert.notEqual(contractAddress, undefined);
    });

    it('MINT', async () => {
      fuji.mint(owner, 10000);
    });
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {
      console.log('DEBUG');
    });
  });
});
