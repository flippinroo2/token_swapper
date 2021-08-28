const DEBUG = false;

var owner, user;

const Wrapper = artifacts.require('Wrapper');
const TokenFactory = artifacts.require('TokenFactory');
const Token = artifacts.require('Token');
const Swap = artifacts.require('Swap');

var wrapper, tokenFactory, fuji, haku, tate, fujiTateSwapper, tateHakuSwapper;

async function getWrapper(deployer) {
  wrapper = await Wrapper.deployed();
}

async function getTokenFactory(deployer) {
  const tokenFactoryAddress = await wrapper.getTokenFactory();
  tokenFactory = await TokenFactory.at(tokenFactoryAddress);
}

async function getTokens(deployer) {
  const getNumberOfTokensTransaction = await tokenFactory.getNumberOfTokens();
  const [numberOfTokens] = getNumberOfTokensTransaction.words;
  for (let i; i <= numberOfTokens; i++) {}
  // const symbols = await tokenFactory.tokenSymbols_();
  const fujiAddress = await tokenFactory.getTokenAddress('FUJI');
  fuji = await Token.at(fujiAddress);

  const hakuAddress = await tokenFactory.getTokenAddress('HAKU');
  haku = await Token.at(hakuAddress);

  const tateAddress = await tokenFactory.getTokenAddress('TATE');
  tate = await Token.at(tateAddress);
}

async function createSwappers(deployer) {
  function getSwapCreatedEvent(events) {
    return events.logs.filter((item) => {
      const { event } = item;
      if (event == 'SwapCreated') {
        return item;
      }
    });
  }

  const fujiTateSwapCreatedTransaction = await wrapper.createSwapper(
    'FujiTateSwapper',
    fuji.address,
    tate.address,
  );
  const [fujiTateSwapCreatedEvent] = getSwapCreatedEvent(
    fujiTateSwapCreatedTransaction,
  );
  const fujiTateSwapAddress = fujiTateSwapCreatedEvent.args.swap_;
  fujiTateSwapper = Swap.at(fujiTateSwapAddress);

  const tateHakuSwapCreatedTransaction = await wrapper.createSwapper(
    'TateHakuSwapper',
    tate.address,
    haku.address,
  );
  const [tateHakuSwapCreatedEvent] = getSwapCreatedEvent(
    tateHakuSwapCreatedTransaction,
  );
  const tateHakuSwapAddress = tateHakuSwapCreatedEvent.args.swap_;
  tateHakuSwapper = Swap.at(tateHakuSwapAddress);
}

module.exports = async function (deployer, network, [primary, secondary]) {
  owner = primary;
  user = secondary;
  await getWrapper(deployer);
  await getTokenFactory(deployer);
  await getTokens(deployer);
  await createSwappers(deployer);
};
