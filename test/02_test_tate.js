const DEBUG = false;

const Tate = artifacts.require('Tate');

require('chai').use(require('chai-as-promised')).should();

contract('Tate', (accounts) => {
  let tate;
  let owner, sender, receiver, user;
  let contractAddress;

  before(async () => {
    // tateInstance = await Tate.new('TEST');
    // Tate.setAsDeployed(tateInstance);
    const tate = await Tate.deployed('TEST');
    contractAddress = await tate.address;
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
      tate.mint(owner, 10000);
    });
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {
      console.log('DEBUG');
    });
  });
});
