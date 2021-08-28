const DEBUG = true;

var owner, user;

const Wrapper = artifacts.require('Wrapper');
const TokenFactory = artifacts.require('TokenFactory');
const Token = artifacts.require('Token');

var wrapper, tokenFactory, fuji, haku, tate;

function debug(value) {
  if (DEBUG) {
    console.log(value);
  }
}

function setUsers(signers) {
  [signer] = signers;
  if (signer) {
    owner = signer.address;
    user = signers[1].address;
    return;
  }
  [owner] = hre.network.config.provider().addresses;
}

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

async function transferTokens(address) {
  fuji.approveFrom(fuji.address, address, 1000);
  fuji.transferFrom(fuji.address, address, 1000);

  haku.approveFrom(haku.address, address, 1000);
  haku.transferFrom(haku.address, address, 1000);
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
  console.log(await getBalances(addresses));
  await transferTokens(owner);
  console.log(await getBalances(addresses));
};
