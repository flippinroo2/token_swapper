const DEBUG = true;

var owner, user;

var tokenFactory;

var fuji, haku, tate;

const TokenFactory = artifacts.require('TokenFactory');

function setUsers(signers) {
  [signer] = signers;
  if (signer) {
    owner = signer.address;
    user = signers[1].address;
    return;
  }
  [owner] = hre.network.config.provider().addresses;
}

async function createTokens(deployer) {
  debugger;
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

async function getTokenFactory(deployer) {
  tokenFactory = await TokenFactory.deployed();
}

module.exports = async function (deployer, network, [primary, secondary]) {
  owner = primary;
  user = secondary;

  const { chain, emitter, logger, networks, provider } = deployer;

  await getTokenFactory();
  await createTokens();

  debugger;

  if (DEBUG) {
    debugger;
  }
};
