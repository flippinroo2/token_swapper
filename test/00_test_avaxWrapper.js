const Storage = artifacts.require('Storage');
const AvaxWrapper = artifacts.require('AvaxWrapper');

require('chai').use(require('chai-as-promised')).should();

contract('AvaxWrapper', (accounts) => {
  let avaxWrapper;
  let owner, sender, receiver, user;
  let contractAddress;

  before(async () => {
    // avaxWrapperInstance = await AvaxWrapper.new('TEST');
    // AvaxWrapper.setAsDeployed(avaxWrapperInstance);
    const avaxWrapper = await AvaxWrapper.deployed('TEST');
    contractAddress = await avaxWrapper.address;
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
      avaxWrapper.mint(owner, 10000);
    });
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {
      console.log('DEBUG');
    });
  });
});
