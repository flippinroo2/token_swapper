const DEBUG = false;

var owner, user;

const Wrapper = artifacts.require('Wrapper');
const TokenFactory = artifacts.require('TokenFactory');

var wrapper, tokenFactory;

async function getWrapper(deployer) {
  wrapper = await Wrapper.deployed();
  debugger;
}

async function createTokenFactory(deployer) {
  // const tokenFactoryDeployTransaction = await deployer.deploy(TokenFactory);
  // tokenFactory = await TokenFactory.deployed();
  const tokenFactoryCreatedTransaction = await wrapper.createTokenFactory();
  const [tokenFactoryCreatedEvent] = tokenFactoryCreatedTransaction.logs;
  const tokenFactoryAddress = tokenFactoryCreatedEvent.args.factory_;
  tokenFactory = await TokenFactory.at(tokenFactoryAddress);
}

module.exports = async function (deployer, network, [primary, secondary]) {
  owner = primary;
  user = secondary;
  await getWrapper(deployer);
  await createTokenFactory(deployer);
};
