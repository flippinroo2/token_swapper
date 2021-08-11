const DEBUG = false;

const Haku = artifacts.require('Haku');

require('chai').use(require('chai-as-promised')).should();

contract('Haku', (accounts) => {
  let haku;
  let owner, sender, receiver, user;
  let contractAddress;

  before(async () => {
    // hakuInstance = await Haku.new('Haku', 'HAKU');
    // Haku.setAsDeployed(hakuInstance);
    const haku = await Haku.deployed('Haku', 'HAKU');
    contractAddress = await haku.address;
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
      haku.mint(owner, 10000);
    });
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {
      console.log('DEBUG');
    });
  });
});
