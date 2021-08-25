const DEBUG = false;

const { ethers } = hre;
const { getContractFactory, getSigners } = ethers;

var signer, owner, user;
var wrapper;
var Token, fuji, haku, tate;
var Factory, tokenFactory;
var Swap, fujiTateSwap, tateHakuSwap;

function setUsers(signers) {
  if (signers) {
    [signer] = signers;
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
  setUsers(await getSigners());
  await deployWrapper();
  await createTokenFactory();
  await createTokens();
  await createSwappers();
  const addresses = [owner, fuji.address, haku.address, tate.address];
  console.dir(await getBalances(addresses));
  await swap();
  console.dir(await getBalances(addresses));
  await transferTokens(owner);
  // await transferTokens(0x808ce8dec9e10bed8d0892aceef9f1b8ec2f52bd);
  console.dir(await getBalances(addresses));
}

// SUBMISSION_ADDRESS = 0x808ce8dec9e10bed8d0892aceef9f1b8ec2f52bd
// owner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// user = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
// wrapper = 0x5FbDB2315678afecb367f032d93F642f64180aa3
// tokenFactory = 0xa16E02E87b7454126E5E10d957A927A7F5B5d2be
// fuji = 0x8Ff3801288a85ea261E4277d44E1131Ea736F77B
// haku = 0x4CEc804494d829bEA93AB8eA7045A7efBED3c229
// tate = 0xb385A0bAA2F8f30C660ABd207e8624863fcf30AE
// fujiTateSwapper = 0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968
// tateHakuSwapper = 0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
