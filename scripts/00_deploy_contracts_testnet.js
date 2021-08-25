const DEBUG = false;

const { ethers, network, web3, Web3 } = hre;
const { getContractFactory, getDefaultProvider, getSigners } = ethers;
const ethersUtils = ethers.utils;
const { eth } = web3;
const web3Utils = web3.utils;
const { abi, Contract, currentProvider, accounts, personal, providers } = eth;
const DefaultProvider = getDefaultProvider();
const CurrentProvider = currentProvider;
const HardhatProvider = network.provider;
const HDWalletProvider = network.config.provider();

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
  /*
    Deploy to Avalanche C-Chain with Truffle - https://docs.avax.network/build/tutorials/smart-contracts/using-truffle-with-the-avalanche-c-chain
  */
  signer = await hre.ethers.getSigner(owner);
  Wrapper = await getContractFactory('Wrapper');
  // Wrapper = await getContractFactory('Wrapper', signer);
  // wrapper = await Wrapper.connect(HDWalletProvider);
  const unsignedWrapperTransaction = Wrapper.getDeployTransaction(owner);
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
  // Deploy Wrapper Contract
  // Call createTokenFactory() function on Wrapper
  // Call createToken() function on TokenFactory 3 times providing the following arguments:
  // 1.
  // 2.
  // 3.
  // Call createSwapper() function on Wrapper providing the following arguments: 'FujiTateSwapper', 0xbdCf46A20E8d323BBc45D74685B5B84919B007fD, 0xa07e242E8D40A5AdA75419958A4085eD53D7a29F
  // Call createSwapper() function on Wrapper providing the following arguments: 'TateHakuSwapper', 0xa07e242E8D40A5AdA75419958A4085eD53D7a29F, 0x4212389C5d88bd27514F0141C4fA2538c7216114
  // Call swap() function on the 'FujiTateSwapper' Swap providing the following argument 100
  // Call swap() function on the 'TateHakuSwapper' Swap providing the following argument 50
  // Call approveFrom() function on the 'Fuji' Token providing the following arguments: 0xbdCf46A20E8d323BBc45D74685B5B84919B007fD, 0xeB5c8FB7d97bF7084ABdD77CCaF7dB5BeAAB08fA, 1000
  // Call transferFrom() function on the 'Fuji' Token providing the following arguments: 0xbdCf46A20E8d323BBc45D74685B5B84919B007fD, 0x808ce8dec9e10bed8d0892aceef9f1b8ec2f52bd, 1000
  // Call approveFrom() function on the 'Haku' Token providing the following arguments: 0x4212389C5d88bd27514F0141C4fA2538c7216114, 0xeB5c8FB7d97bF7084ABdD77CCaF7dB5BeAAB08fA, 1000
  // Call transferFrom() function on the 'Haku' Token providing the following arguments: 0x4212389C5d88bd27514F0141C4fA2538c7216114, 0x808ce8dec9e10bed8d0892aceef9f1b8ec2f52bd, 1000

  const signers = await getSigners();
  setUsers(signers);
  await deployWrapper();
  await createTokenFactory();
  await createTokens();
  await createSwappers();
  const addresses = [owner, fuji.address, haku.address, tate.address];
  console.dir(await getBalances(addresses));
}

// SUBMISSION_ADDRESS = 0x808ce8dec9e10bed8d0892aceef9f1b8ec2f52bd
// owner = 0xeB5c8FB7d97bF7084ABdD77CCaF7dB5BeAAB08fA
// user =
// wrapper = 0x55aB662996D3b0AD0adFDEE9F4145fF4765AF879
// tokenFactory = 0x228acB69E7EeD6aBa0De4123674a3310be3f800D
// fuji = 0xbdCf46A20E8d323BBc45D74685B5B84919B007fD
// haku = 0x4212389C5d88bd27514F0141C4fA2538c7216114
// tate = 0xa07e242E8D40A5AdA75419958A4085eD53D7a29F
// fujiTateSwapper = 0x0E3D5C6Adcb3F353840F59AB6D3CD1804221E350
// tateHakuSwapper = 0x2B0B1ec8443F5BCc4f8a107e3C7376CAA84C2B99

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
