const TokenInterface = require('../classes/TokenInterface.js');

const DEBUG = false;

const { ethers } = hre;

const { getContractFactory, getSigners } = ethers;

const Moralis = require('Moralis');
// const { ACL, Analytics, AnonymousUtils, Cloud, CLP, Config, FacebookUtils, File, Plugins, Polygon, Query, Role, Schema, Session, Storag, UI, User, Web3, Web3API } = require('Moralis');

const { eth, utils } = web3;

let Factory, Swap, Token, Wrapper;

let fuji,
  fujiInterface,
  fujiMetadata,
  fujiTateSwap,
  fujiTateSwapMetadata = { user1: {}, user2: {} },
  haku,
  hakuInterface,
  hakuMetadata,
  hakuTateSwap,
  hakuTateSwapMetadata = { user1: {}, user2: {} },
  owner = {
    name: 'owner',
    fujiAllowance: 0,
    hakuAllowance: 0,
    tateAllowance: 0,
  },
  tate,
  tateInterface,
  tateMetadata,
  tokenFactory,
  tokenFactoryMetadata = {
    name: 'tokenMetadata',
    fujiAllowance: 0,
    fujiBalance: 0,
    hakuAllowance: 0,
    hakuBalance: 0,
    tateAllowance: 0,
    tateBalance: 0,
  },
  user = {
    name: 'user',
    fujiAllowance: 0,
    fujiBalance: 0,
    hakuAllowance: 0,
    hakuBalance: 0,
    tateAllowance: 0,
    tateBalance: 0,
  },
  wrapper,
  wrapperMetadata = {
    admin: {},
    name: 'wrapper',
    fujiAllowance: 0,
    fujiBalance: 0,
    hakuAllowance: 0,
    hakuBalance: 0,
    tateAllowance: 0,
    tateBalance: 0,
  };

async function main() {
  const signers = await getSigners();
  const [signer] = signers;

  owner.address = signer.address;
  user.address = signers[1].address;

  if (DEBUG) {
    debugger;
  }
  const Wrapper = await getContractFactory('Wrapper');
  const wrapper = await Wrapper.deploy(owner.address, user.address);

  const Token = await getContractFactory('Token');

  const Factory = await getContractFactory('TokenFactory');
  const tokenFactory = await Factory.deploy();

  tokenFactory.on('TokenCreated', () => {
    console.log('TEST');
    debugger;
  });

  let dataVariable;

  const fujiTransaction = await tokenFactory.createToken(
    'Fuji',
    'FUJI',
    18,
    1100,
  );

  // await (async () => {
  // dataVariable = await fujiTransaction.wait();
  // const fujiAddress = dataVariable.events.TokenCreated.address;
  // const fuji = await Token.at(fujiAddress);

  // const hakuTransaction = await tokenFactory.createToken(
  //   'Haku',
  //   'HAKU',
  //   18,
  //   1050,
  // );
  // dataVariable = parseTransactionData(hakuTransaction.receipt);
  // const hakuAddress = dataVariable.events.TokenCreated.address;
  // const haku = await Token.at(hakuAddress);

  // const tateTransaction = await tokenFactory.createToken(
  //   'Tate',
  //   'TATE',
  //   18,
  //   1000,
  // );
  // dataVariable = parseTransactionData(tateTransaction.receipt);
  // const tateAddress = dataVariable.events.TokenCreated.address;
  // const tate = await Token.at(tateAddress);

  // // const fujiNew = await Token.new('Fuji', 'FUJI', 1100);
  // // const hakuNew = await Token.new('Haku', 'HAKU', 1050);
  // // const tateNew = await Token.new('Tate', 'TATE', 1000);

  // await deployer.deploy(Wrapper, ReceiverAddress, sender);
  // wrapper = await Wrapper.deployed();

  // await deployer.deploy(Swap, owner, fuji, user, tate);
  // const fujiTateSwap = await Swap.deployed();

  // await deployer.deploy(Swap, owner, haku, user, tate);
  // const hakuTateSwap = await Swap.deployed();

  // debugger;
  // await fujiTateSwap._swap(100);
  // })();

  if (DEBUG) {
    // console.log(
    //   `Wrapper\n_address1 = ${wrapperAddress1}\n_address2 = ${wrapperAddress2}\nfuji address = ${fuji.address}\nhaku address = ${haku.address}\ntate address = ${tate.address}`,
    // );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
