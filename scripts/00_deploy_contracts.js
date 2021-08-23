const TokenInterface = require('../classes/TokenInterface.js');

const DEBUG = false;

const { artifacts, config, ethers, network, waffle, web3 } = hre;

const { getContractFactory, getSigners } = ethers;

const Moralis = require('Moralis');
// const { ACL, Analytics, AnonymousUtils, Cloud, CLP, Config, FacebookUtils, File, Plugins, Polygon, Query, Role, Schema, Session, Storag, UI, User, Web3, Web3API } = require('Moralis');

const { eth, utils } = web3;

let Factory, Swap, Token, Wrapper;

let fuji,
  fujiTateSwap,
  haku,
  hakuTateSwap,
  owner = {
    name: 'owner',
    fujiAllowance: 0,
    hakuAllowance: 0,
    tateAllowance: 0,
  },
  tate,
  tokenFactory,
  user = {
    name: 'user',
    fujiAllowance: 0,
    fujiBalance: 0,
    hakuAllowance: 0,
    hakuBalance: 0,
    tateAllowance: 0,
    tateBalance: 0,
  },
  wrapper;

async function main() {
  const signers = await getSigners();
  const [signer] = signers;

  owner.address = signer.address;
  user.address = signers[1].address;

  const Factory = await getContractFactory('TokenFactory');
  tokenFactory = await Factory.deploy();
  tokenFactoryMetadata.address = tokenFactory.address;
  tokenFactoryMetadata.admin = await tokenFactory._admin();

  const Token = await getContractFactory('Token');

  const createFujiTransaction = await tokenFactory.createToken(
    'Fuji',
    'FUJI',
    18,
    1100,
  );
  const fujiTransactionData = await createFujiTransaction.wait();
  fuji = Token.attach(fujiTransactionData.to);

  const createHakuTransaction = await tokenFactory.createToken(
    'Haku',
    'HAKU',
    18,
    1050,
  );
  const hakuTransactionData = await createHakuTransaction.wait();
  haku = Token.attach(hakuTransactionData.to);

  const createTateTransaction = await tokenFactory.createToken(
    'Tate',
    'TATE',
    18,
    1000,
  );
  const tateTransactionData = await createTateTransaction.wait();
  tate = Token.attach(tateTransactionData.to);

  const Wrapper = await getContractFactory('Wrapper');
  wrapper = await Wrapper.deploy(owner.address, user.address);

  const Swap = await getContractFactory('Swap');

  const createFujiSwap = await wrapper.createFujiSwap(
    fuji.address,
    tate.address,
  );
  await createFujiSwap.wait();

  const createHakuSwap = await wrapper.createHakuSwap(
    haku.address,
    tate.address,
  );
  await createHakuSwap.wait();

  debugger;

  fujiTateSwap = Swap.attach(await wrapper._fujiTateSwapper());
  hakuTateSwap = Swap.attach(await wrapper._hakuTateSwapper());

  debugger;

  const fujiTateSwapTransaction = await fujiTateSwap._swap(7);
  const hakuTateSwapTransaction = await hakuTateSwap._swap(4);
}

if (DEBUG) {
  // console.log(
  //   `Wrapper\n_address1 = ${wrapperAddress1}\n_address2 = ${wrapperAddress2}\nfuji address = ${fuji.address}\nhaku address = ${haku.address}\ntate address = ${tate.address}`,
  // );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
