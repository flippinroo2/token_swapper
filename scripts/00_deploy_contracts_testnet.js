const DEBUG = false;

const { ethers } = hre;
const { getContractFactory, getSigners } = ethers;
const defaultProvider = ethers.getDefaultProvider();

var signer, owner, user;
var wrapper;
var Token, fuji, haku, tate;
var Factory, tokenFactory;
var Swap, fujiTateSwap, tateHakuSwap;

function setUsers(signers) {
  [signer] = signers;
  if (signer) {
    owner = signer.address;
    user = signers[1].address;
    return;
  }
  [owner] = hre.network.config.provider().addresses;
}
async function deployWrapper() {
  signer = await hre.ethers.getSigner(owner);
  Wrapper = await getContractFactory('Wrapper', signer);
  wrapper = await Wrapper.deploy(owner);
}

async function createTokenFactory() {
  Factory = await getContractFactory('TokenFactory');

  await wrapper.createTokenFactory();
  // const test = await wrapper.createTokenFactory.call(); // Using call() will allow you to get the return value for testing.

  const [factoryCreatedEvent] = await wrapper.queryFilter('FactoryCreated');
  const [tokenFactoryAddress] = factoryCreatedEvent.args;

  // tokenFactory = await Factory.deploy();
  tokenFactory = await Factory.attach(tokenFactoryAddress);
}

async function createTokens() {
  Token = await getContractFactory('Token');

  await tokenFactory.createToken('Fuji', 'FUJI', 18, 1100);
  await tokenFactory.createToken('Haku', 'HAKU', 18, 1050);
  await tokenFactory.createToken('Tate', 'TATE', 18, 150);

  const tokens = await tokenFactory.queryFilter('TokenCreated');

  for (const token of tokens) {
    const [address] = token.args;
    const tempToken = await Token.attach(address);
    const symbol = await tempToken._symbol();
    if (symbol === 'FUJI') {
      fuji = tempToken;
    }
    if (symbol === 'HAKU') {
      haku = tempToken;
    }
    if (symbol === 'TATE') {
      tate = tempToken;
    }
  }
}

async function createSwappers() {
  Swap = await getContractFactory('Swap');

  await wrapper.createSwapper('FujiTateSwapper', fuji.address, tate.address);
  await wrapper.createSwapper('TateHakuSwapper', tate.address, haku.address);

  const swappers = await wrapper.queryFilter('SwapCreated');

  for (const swap of swappers) {
    const { args } = swap;
    const [name, address] = args;
    if (name == 'FujiTateSwapper') {
      fujiTateSwap = Swap.attach(address);
    }
    if (name == 'TateHakuSwapper') {
      tateHakuSwap = Swap.attach(address);
    }
  }
}

async function swap() {
  await fujiTateSwap.swap(100);
  // await fujiTateSwap.unswap(100);
  await tateHakuSwap.swap(50);
  // await tateHakuSwap.unswap(50);
}

async function transferTokens(address) {
  if (DEBUG) {
    console.log('address');
    console.log(address);
  }
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

async function main() {
  const signers = await getSigners();
  setUsers(signers);
  await deployWrapper();
  await createTokenFactory();
  await createTokens();
  await createSwappers();
  const addresses = [owner, fuji.address, haku.address, tate.address];
  console.dir(await getBalances(addresses));
}

// SUBMISSION_ADDRESS =
// owner =
// user =
// wrapper =
// tokenFactory =
// fuji =
// haku =
// tate =
// fujiTateSwapper =
// tateHakuSwapper =

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
