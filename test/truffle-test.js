const TestToken = artifacts.require('TestToken');

require('chai').use(require('chai-as-promised')).should();

contract('TEST', (accounts) => {
  let testToken;
  let owner, sender, receiver, user;
  let contractAddress;

  before(async () => {
    testToken = await TestToken.new('TEST');
    // TestToken.setAsDeployed(testToken);
    const testTokenInstance = await TestToken.deployed('TEST');
    contractAddress = await testTokenInstance.address;
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
      erc20Example.mint(owner, 100000000000);
    });
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {
      console.log('DEBUG');
    });
  });
});
