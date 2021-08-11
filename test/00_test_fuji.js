const DEBUG = true;

const Fuji = artifacts.require('Fuji');

require('chai').use(require('chai-as-promised')).should();

contract('Fuji', (accounts) => {
  debugger;
  let fuji;
  let owner, sender, receiver, user;
  let contractAddress;

  before(async () => {
    if (DEBUG) {
      debugger;
    }
    // fujiInstance = await Fuji.new('TEST');
    // Fuji.setAsDeployed(fujiInstance);
    const fuji = await Fuji.deployed('TEST');
    contractAddress = await fuji.address;
    [owner, sender, receiver, user] = accounts;
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
    it('DEBUG', async () => {
      console.log('DEBUG');
    });
  });
});
