const DEBUG = true;

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
  await tokenFactory.createToken('Tate', 'TATE', 18, 100);

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

  // fuji = await Token.attach(fujiAddress);
  // haku = await Token.attach(hakuAddress);
  // tate = await Token.attach(tateAddress);
}

async function createSwappers() {
  Swap = await getContractFactory('Swap');

  await wrapper.createSwapper('FujiTateSwapper', fuji.address, tate.address);
  await wrapper.createSwapper('TateHakuSwapper', tate.address, haku.address);

  const swappers = await wrapper.queryFilter('SwapCreated');

  for (const swap of swappers) {
    const { args } = swap;
    const [address] = args;
    const tempSwap = Swap.attach(address);
    const swapName = await tempSwap.name();
    if (swapName == 'FujiTateSwapper') {
      fujiTateSwap = Swap.attach(address);
    }
    if (swapName == 'TateHakuSwapper') {
      tateHakuSwap = Swap.attach(address);
    }
  }
}

async function swap() {
  // fuji.approveFrom(address(fuji), address(this), 1100);
  // haku.approveFrom(address(haku), address(this), 1050);
  // tate.approveFrom(address(tate), address(this), 100);

  // fuji.transferFrom(address(fuji), address(this), 100);

  await fujiTateSwap._swap(100);
  await tateHakuSwap._swap(50);
}

async function transferTokens(address) {
  if (DEBUG) {
    console.log('address');
    console.log(address);
  }
  fuji.transferFrom(address(fuji), _submissionAddress, 1000);
  haku.transferFrom(address(haku), _submissionAddress, 1000);
}

async function main() {
  setUsers(await getSigners());
  await deployWrapper();
  await createTokenFactory();
  await createTokens();
  await createSwappers();
  await swap();
  // await transferTokens(0x808ce8dec9e10bed8d0892aceef9f1b8ec2f52bd);
}

// SUBMISSION_ADDRESS = 0x808ce8dec9e10bed8d0892aceef9f1b8ec2f52bd
// owner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// user = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
// wrapper = 0x5FbDB2315678afecb367f032d93F642f64180aa3
// tokenFactory = 0xa16E02E87b7454126E5E10d957A927A7F5B5d2be
// fuji = 0x8Ff3801288a85ea261E4277d44E1131Ea736F77B
// haku = 0x4CEc804494d829bEA93AB8eA7045A7efBED3c229
// tate = 0xb385A0bAA2F8f30C660ABd207e8624863fcf30AE

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
