const DEBUG = false;

var owner, user;

const Wrapper = artifacts.require('Wrapper');
const TokenFactory = artifacts.require('TokenFactory');

var wrapper, tokenFactory;
function debug(value) {
  if (DEBUG) {
    console.log(value);
  }
}

async function getWrapper(deployer) {
  wrapper = await Wrapper.deployed();
}

async function createTokenFactory(deployer) {
  const tokenFactoryCreatedTransaction = await wrapper.createTokenFactory();
  const [tokenFactoryCreatedEvent] = tokenFactoryCreatedTransaction.logs;
  const tokenFactoryAddress = tokenFactoryCreatedEvent.args.factory_;
  tokenFactory = await TokenFactory.at(tokenFactoryAddress);
  debugger;
}

module.exports = async function (deployer, network, [primary, secondary]) {
  owner = primary;
  user = secondary;
  await getWrapper(deployer);
  await createTokenFactory(deployer);
};
