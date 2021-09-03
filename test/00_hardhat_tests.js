const TokenInterface = require('../classes/TokenInterface.js');

const DEBUG = true;

const { use, expect } = require('chai');
use(require('chai-as-promised')).should();

/*
_
artifacts
Atomics
btoa
config
console
crypto
debug
WebAssembly
*/

const hre = require('hardhat');

const hardhatArtifacts = hre.artifacts;
const hardhatConfig = hre.config;
const hardhatWeb3 = hre.web3;
const { ethers, network, waffle } = hre;

const { eth, utils } = web3;

var accountData = {
  fuji: { balance: 0, admin: {} },
  haku: { balance: 0, admin: {} },
  owner: { balance: 0 },
  tate: { balance: 0, admin: {} },
  tokenFactory: { balance: 0, admin: {} },
  user: { balance: 0 },
  wrapper: { balance: 0 },
};

var Wrapper, wrapper, TokenFactory, tokenFactory, Token, fuji, haku, tate;

var transaction;

function logAccounts() {
  console.log('\n\nBALANCES:');
  console.log(
    `fujiAdmin: ${fujiMetadata.admin.balance}\tfujiMetadata: ${fujiMetadata.balance}\thakuAdmin: ${hakuMetadata.admin.balance}\thakuMetadata: ${hakuMetadata.balance}\towner: ${owner.balance}\ttateAdmin: ${tateMetadata.admin.balance}\ttateMetadata: ${tateMetadata.balance}\tuser: ${user.balance}`,
  );
  console.log('\nALLOWANCES:');
  console.log(
    `fujiAdmin: ${fujiMetadata.admin.ownerAllowance}\tfujiMetadata: ${fujiMetadata.ownerAllowance}\thakuAdmin: ${hakuMetadata.admin.ownerAllowance}\thakuMetadata: ${hakuMetadata.ownerAllowance}\towner: ${owner.ownerAllowance}\ttateAdmin: ${tateMetadata.admin.ownerAllowance}\ttateMetadata: ${tateMetadata.ownerAllowance}\tuser: ${user.ownerAllowance}`,
  );
}

function logTransaction({ tx, receipt }) {
  const { blockNumber, from, gasUsed, to } = receipt;
  console.log(
    `Transaction: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
  );
}

async function refreshBalances(token, metadata) {
  const tokenAddress = token.address;
  const tokenName = metadata.name;
  const adminAddress = metadata.admin.address;
  const { owner, user } = accountData;

  const propertyString = `${tokenName.toLowerCase()}Balance`;

  metadata[propertyString] = await token.getBalance(tokenAddress);
  metadata.admin[propertyString] = await token.getBalance(adminAddress);
  accountData.owner[propertyString] = await token.getBalance(owner.address);
  accountData.user[propertyString] = await token.getBalance(user.address);
}

async function refreshAllowance(token, metadata, account) {
  const tokenAddress = token.address;
  const adminAddress = metadata.admin.address;
  const accountAddress = account.address;
  const propertyString = `${account.name}Allowance`;

  const tokenAllowance = await token.getAllowance(tokenAddress, accountAddress);
  metadata[propertyString] = tokenAllowance;
  const adminAllowance = await token.getAllowance(adminAddress, accountAddress);
  metadata.admin[propertyString] = adminAllowance;
}

function getEvent({ tx, receipt }) {
  const { blockNumber, from, gasUsed, logs, to } = receipt;
  const [log] = logs;
  const { address, args } = log;
  return args;
}

function readTransaction(transaction) {
  if (DEBUG) {
    logTransaction(transaction);
  }
  const event = getEvent(transaction);
  return event;
}

async function approveTokens(addresses) {
  for (address of addresses) {
    await fuji.approveFrom(fuji.address, address, 1100);
    await haku.approveFrom(haku.address, address, 1050);
    await tate.approveFrom(tate.address, address, 150);
  }
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

describe('Test Suite', function () {
  this.timeout(1000000);
  let fujiMetadata = {},
    hakuMetadata = {},
    tateMetadata = {};

  before(async (error) => {
    const signers = await hre.ethers.getSigners();
    accountData.owner.address = signers[0].address;
    accountData.user.address = signers[1].address;

    Wrapper = await hre.ethers.getContractFactory('Wrapper');
    wrapper = await Wrapper.deploy(accountData.owner.address);
    accountData.wrapper.address = wrapper.address;
    const wrapperAdmin = await wrapper.getAdmin();

    TokenFactory = await hre.ethers.getContractFactory('TokenFactory');
    transaction = await wrapper.createTokenFactory();
    const createTokenFactoryTransaction = await transaction.wait();
    const [createTokenFactoryEvent] = createTokenFactoryTransaction.events;
    const tokenFactoryAddress = createTokenFactoryEvent.args.factory;
    tokenFactory = await TokenFactory.attach(tokenFactoryAddress);
    accountData.tokenFactory.address = tokenFactoryAddress;

    Token = await hre.ethers.getContractFactory('Token');

    transaction = await tokenFactory.createToken('Fuji', 'FUJI', 18, 1100);
    transaction = await tokenFactory.createToken('Haku', 'HAKU', 18, 1050);
    transaction = await tokenFactory.createToken('Tate', 'TATE', 18, 150);

    const tokenSymbols = await tokenFactory.getTokenSymbols();

    const tokenAddresses = [];
    for (symbol of tokenSymbols) {
      const address = await tokenFactory.getTokenAddressFromSymbol(symbol);
      tokenAddresses.push(address);
    }
    const [fujiAddress, hakuAddress, tateAddress] = tokenAddresses;

    // accountData.fuji.address = fujiAddress;
    // accountData.haku.address = hakuAddress;
    // accountData.tate.address = tateAddress;

    fuji = await Token.attach(fujiAddress);
    accountData.fuji.address = fujiAddress;
    accountData.fuji.admin.address = await fuji.getAdmin();
    const fujiInterface = new TokenInterface(fuji);
    fujiMetadata = await fujiInterface.getMetadata();

    haku = await Token.attach(hakuAddress);
    accountData.haku.address = hakuAddress;
    accountData.haku.admin.address = await haku.getAdmin();
    const hakuInterface = new TokenInterface(haku);
    hakuMetadata = await hakuInterface.getMetadata();

    tate = await Token.attach(tateAddress);
    accountData.tate.address = tateAddress;
    accountData.tate.admin.address = await tate.getAdmin();
    const tateInterface = new TokenInterface(tate);
    tateMetadata = await tateInterface.getMetadata();
  });

  describe('DEPLOY', async () => {
    it('Check valid account address ', () => {
      const { address } = accountData.owner;
      assert.equal(address, accounts[0]);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('MINT', async () => {
      if (DEBUG) {
        // console.log(
        //   `Mint Transaction: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        // );
        // debugger;
      }
      const fujiMintFail = await fuji.mint(fuji.address, 5000);
      const hakuMintFail = await haku.mint(haku.address, 5000);
      const tateMintFail = await tate.mint(tate.address, 5000);
      debugger;
    });
  });

  describe('TRANSFER', async () => {
    it('Transfers', async () => {
      const initialBalances = await getBalances([
        wrapper.address,
        fuji.address,
        haku.address,
        tate.address,
        accountData.owner.address,
        accountData.user.address,
      ]);

      // await fuji.transfer(accountData.fuji.address, 100);
      // await haku.transfer(accountData.haku.address, 100);
      // await tate.transfer(accountData.tate.address, 100);

      const finalBalances = await getBalances([
        wrapper.address,
        fuji.address,
        haku.address,
        tate.address,
        accountData.owner.address,
        accountData.user.address,
      ]);
    });
  });

  describe('SWAP', async () => {
    it('Fuji Tate Swap', async () => {
      const createFujiTateSwapTransaction = await wrapper.createSwapper(
        'Fuji Tate Swap',
        fuji.address,
        tate.address,
      );
      const [fujiTateSwapEvent] = createFujiTateSwapTransaction.logs.filter(
        (item) => {
          if (item.event == 'SwapCreated') {
            return item;
          }
        },
      );
      const fujiTateSwap = await Swap.at(fujiTateSwapEvent.args.swap);

      const createTateHakuSwapTransaction = await wrapper.createSwapper(
        'Tate Haku Swap',
        tate.address,
        haku.address,
      );
      const [tateHakuSwapEvent] = createTateHakuSwapTransaction.logs.filter(
        (item) => {
          if (item.event == 'SwapCreated') {
            return item;
          }
        },
      );
      const tateHakuSwap = await Swap.at(tateHakuSwapEvent.args.swap);

      const preSwapBalances = await getBalances([
        wrapper.address,
        fuji.address,
        haku.address,
        tate.address,
        accountData.owner.address,
        accountData.user.address,
      ]);

      const fujiTateSwapResult = await fujiTateSwap.swap(100);
      const tateHakuSwapResult = await tateHakuSwap.swap(50);

      const postSwapBalances = await getBalances([
        wrapper.address,
        fuji.address,
        haku.address,
        tate.address,
        accountData.owner.address,
        accountData.user.address,
      ]);
    });
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {
      // const testTransaction = await fuji.testFunction();
      if (DEBUG) {
      }
    });
  });
});
