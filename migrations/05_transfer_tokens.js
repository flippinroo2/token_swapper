var owner, user;

const Wrapper = artifacts.require('Wrapper');
const TokenFactory = artifacts.require('TokenFactory');
const Token = artifacts.require('Token');

var wrapper,
  tokenFactory,
  tokens = {},
  fuji,
  haku,
  tate;

function setUsers(signers) {
  [signer] = signers;
  if (signer) {
    owner = signer.address;
    user = signers[1].address;
    return;
  }
  [owner] = hre.network.config.provider().addresses;
}

async function getWrapper() {
  wrapper = await Wrapper.deployed();
}

async function getTokenFactory() {
  const tokenFactoryAddress = await wrapper.getTokenFactory();
  tokenFactory = await TokenFactory.at(tokenFactoryAddress);
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

async function transferTokens(address) {
  await fuji.approveFrom(fuji.address, address, 1000);
  await fuji.transferFrom(fuji.address, address, 1000);

  await haku.approveFrom(haku.address, address, 1000);
  await haku.transferFrom(haku.address, address, 1000);
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

  await getWrapper();
  await getTokenFactory();
  await getTokens();
  const addresses = [owner, fuji.address, haku.address, tate.address];
  console.log(await getBalances(addresses));
  await transferTokens(owner);
  console.log(await getBalances(addresses));
};
