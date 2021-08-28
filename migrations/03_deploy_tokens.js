const DEBUG = true;

var owner, user;

var wrapper, tokenFactory;

var fuji, haku, tate;

const Wrapper = artifacts.require('Wrapper');
const TokenFactory = artifacts.require('TokenFactory');
const Token = artifacts.require('Token');

function debug(value) {
  if (DEBUG) {
    console.log(value);
  }
}

async function getWrapper(deployer) {
  wrapper = await Wrapper.deployed();
}

async function getTokenFactory(deployer) {
  const tokenFactoryAddress = await wrapper.getTokenFactory();
  tokenFactory = await TokenFactory.at(tokenFactoryAddress);
}

async function createTokens(deployer) {
  const fujiCreatedTransaction = await tokenFactory.createToken(
    'Fuji',
    'FUJI',
    18,
    1100,
  );
  const [fujiCreatedEvent] = fujiCreatedTransaction.logs;
  const fujiAddress = fujiCreatedEvent.args.tokenAddress;
  fuji = await Token.at(fujiAddress);

  const hakuCreatedTransaction = await tokenFactory.createToken(
    'Haku',
    'HAKU',
    18,
    1050,
  );
  const [hakuCreatedEvent] = hakuCreatedTransaction.logs;
  const hakuAddress = hakuCreatedEvent.args.tokenAddress;
  haku = await Token.at(hakuAddress);

  const tateCreatedTransaction = await tokenFactory.createToken(
    'Tate',
    'TATE',
    18,
    150,
  );
  const [tateCreatedEvent] = tateCreatedTransaction.logs;
  const tateAddress = tateCreatedEvent.args.tokenAddress;
  tate = await Token.at(tateAddress);
}

module.exports = async function (deployer, network, [primary, secondary]) {
  owner = primary;
  user = secondary;
  await getWrapper();
  await getTokenFactory();
  await createTokens();
};
