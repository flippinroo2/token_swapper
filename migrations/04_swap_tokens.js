var owner, user;

const Wrapper = artifacts.require('Wrapper');
const TokenFactory = artifacts.require('TokenFactory');
const Token = artifacts.require('Token');
const Swap = artifacts.require('Swap');

var wrapper,
  tokenFactory,
  tokens = {},
  fuji,
  haku,
  tate,
  fujiTateSwapper,
  tateHakuSwapper;

async function getWrapper() {
  wrapper = await Wrapper.deployed();
}

async function getTokenFactory() {
  const tokenFactoryAddress = await wrapper.getTokenFactory();
  tokenFactory = await TokenFactory.at(tokenFactoryAddress);
}

async function createSwappers() {
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
  fujiTateSwapper = await Swap.at(fujiTateSwapAddress);

  const tateHakuSwapCreatedTransaction = await wrapper.createSwapper(
    'TateHakuSwapper',
    tate.address,
    haku.address,
  );
  const [tateHakuSwapCreatedEvent] = getSwapCreatedEvent(
    tateHakuSwapCreatedTransaction,
  );
  const tateHakuSwapAddress = tateHakuSwapCreatedEvent.args.swap_;
  tateHakuSwapper = await Swap.at(tateHakuSwapAddress);
}

async function getTokens() {
  const getNumberOfTokensTransaction = await tokenFactory.getNumberOfTokens();
  const [numberOfTokens] = getNumberOfTokensTransaction.words;
  const tokenSymbols = await tokenFactory.getTokenSymbols();

  for (symbol of tokenSymbols) {
    const address = await tokenFactory.getTokenAddressFromSymbol(symbol);
    tokens[symbol] = await Token.at(address);
  }

  fuji = tokens['FUJI'];
  haku = tokens['HAKU'];
  tate = tokens['TATE'];
}

async function swapTokens() {
  await fujiTateSwapper.swap(100);
  await tateHakuSwapper.swap(50);
}

async function getBalances(addresses) {
  return await Promise.all(
    addresses.map(async (item, index) => {
      let fujiBalance, hakuBalance, tateBalance;
      fujiBalance = await fuji.balanceOf(item);
      hakuBalance = await haku.balanceOf(item);
      tateBalance = await tate.balanceOf(item);
      return {
        fuji: fujiBalance.toNumber(),
        haku: hakuBalance.toNumber(),
        tate: tateBalance.toNumber(),
      };
    }),
  );
}

module.exports = async function (deployer, network, [primary, secondary]) {
  owner = primary;
  user = secondary;

  const { chain, emitter, logger, networks, provider } = deployer;

  await getWrapper(deployer);
  await getTokenFactory(deployer);
  await getTokens(deployer);
  const addresses = [owner, fuji.address, haku.address, tate.address];
  await createSwappers(deployer);
  console.log(await getBalances(addresses));
  await swapTokens();
  console.log(await getBalances(addresses));
};
