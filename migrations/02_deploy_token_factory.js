var owner, user;

const Wrapper = artifacts.require('Wrapper');
const TokenFactory = artifacts.require('TokenFactory');

var wrapper, tokenFactory;

async function getWrapper() {
  wrapper = await Wrapper.deployed();
}

async function createTokenFactory() {
  const tokenFactoryCreatedTransaction = await wrapper.createTokenFactory();
  const [tokenFactoryCreatedEvent] = tokenFactoryCreatedTransaction.logs;
  const tokenFactoryAddress = tokenFactoryCreatedEvent.args.factory_;
  tokenFactory = await TokenFactory.at(tokenFactoryAddress);
}

module.exports = async function (deployer, network, [primary, secondary]) {
  owner = primary;
  user = secondary;
  await getWrapper();
  await createTokenFactory();
};
