const DEBUG = true;

var owner, user;

const Wrapper = artifacts.require('Wrapper');
const TokenFactory = artifacts.require('TokenFactory');
const Token = artifacts.require('Token');
const Swap = artifacts.require('Swap');

var wrapper, tokenFactory, fuji, haku, tate, fujiTateSwapper, tateHakuSwapper;
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

// async function getSwapper(deployer) {
//   const fujiTateSwapperAddress = await Swap.deployed();
//   const tateHakuSwapperAddress = await Swap.deployed();
// }

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

async function swapTokens() {
  await fujiTateSwapper.swap(100); // Needs to be contract admin to work.
  await tateHakuSwapper.swap(50); // Needs to be contract admin to work.
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
  await createSwappers();
  console.log(await getBalances(addresses));
  await swapTokens();
  console.log(await getBalances(addresses));
};
