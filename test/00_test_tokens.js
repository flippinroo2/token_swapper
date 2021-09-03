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

// const hre = require('hardhat');

// const hardhatArtifacts = hre.artifacts;
// const hardhatConfig = hre.config;
// const hardhatWeb3 = hre.web3;
// const { ethers, network, waffle } = hre;

const { eth, utils } = web3;

const Wrapper = artifacts.require('Wrapper');
const Swap = artifacts.require('Swap');
const Token = artifacts.require('Token');
const Factory = artifacts.require('TokenFactory');

// const fujiAddress = '0xa4Ed0801954569a0583f59b9761C6B0508184B98';
// const hakuAddress = '0x99d6BEEd728dfC469f4f2F6fb2AF0F9206100ca9';
// const tateAddress = '0x2e6Db5C4FFdeF431E87cf15990a016db85657B50';
const wrapperAddress = '0x5bA0b58c328f075deC10f6bf60E073ef298Bb628';

/*
Potentially useful objects:
_
crypto
eth
debug
*/

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

  if (DEBUG) {
    // logAccounts();
  }
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

async function refreshAllowances(token, metadata) {
  await refreshAllowance(token, metadata, accountData.owner);
  await refreshAllowance(token, metadata, accountData.user);
}

function parseTransactionData({
  blockHash,
  blockNumber,
  confirmations,
  events,
  from,
  gasUsed,
  logs,
  status,
  to,
  transactionHash,
  transactionIndex,
  type,
}) {
  if (DEBUG) {
    // logTransaction(transactionHash, blockNumber, from, gasUsed, to);
  }
  let eventObject = {};

  if (events) {
    events.forEach((element, index, array) => {
      // console.log('element:');
      // console.dir(element);
      // console.log(`index ${index}`);
      if (index === 0) {
      }
      const eventProperty = element.hasOwnProperty('event');
      const argsProperty = element.hasOwnProperty('args');
      // const eventString = `event${index}`;
      if (eventProperty) {
        let eventArguments = {};
        if (argsProperty) {
          eventArguments.address = element.args[0];
          eventArguments.name = element.args[1].hash;
          eventArguments.symbol = element.args[2].hash;
          eventArguments.decimals = element.args[3];
          eventArguments.totalSupply = element.args[4].toNumber();
        }
        eventObject[element.event] = {
          signature: element.eventSignature,
          arguments: eventArguments,
        };
      }
      if (index === array.length - 1) {
        eventObject.data = element.data;
      }
    });
  }
  return {
    from,
    to,
    transactionIndex,
    transactionHash,
    gasUsed,
    type,
    status,
    blockNumber,
    blockHash,
    confirmations,
    events: eventObject,
  };
}

async function approveAll(token, metadata) {
  // Could add an "accounts" parameter so we don't have to touch state variables.
  const tokenAddress = token.address;
  const tokenName = metadata.name;
  const { admin, totalSupply } = metadata;
  const adminAddress = admin.address;
  const { owner, user } = accountData;

  const propertyString = `${tokenName.toLowerCase()}Balance`;

  await token.approve(tokenAddress, adminAddress, totalSupply);
  await token.approve(tokenAddress, owner.address, totalSupply);
  await token.approve(tokenAddress, user.address, totalSupply);

  // approve(address owner, address spender, uint256 amount)
  const approvalExample = await token.approve(
    adminAddress,
    tokenAddress,
    totalSupply,
  ); // This returns a transaction response. (Not a receipt yet until it has confirmations.)
  // const approvalReceiptExample = await approvalExample.wait(); // The wait() function returns a transaction receipt.
  const approvalReceiptExample = parseTransactionData(approvalExample.receipt);

  await token.approve(adminAddress, owner.address, totalSupply);
  await token.approve(adminAddress, user.address, totalSupply);

  await token.approve(owner.address, tokenAddress, totalSupply);
  await token.approve(owner.address, adminAddress, totalSupply);
  await token.approve(owner.address, user.address, totalSupply);

  await token.approve(user.address, tokenAddress, totalSupply);
  await token.approve(user.address, adminAddress, totalSupply);
  await token.approve(user.address, owner.address, totalSupply);
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

let accountData = {
  fuji: { balance: 0, admin: {} },
  haku: { balance: 0, admin: {} },
  owner: { balance: 0 },
  tate: { balance: 0, admin: {} },
  tokenFactory: { balance: 0, admin: {} },
  user: { balance: 0 },
  wrapper: { balance: 0 },
};

let wrapper, tokenFactory, fuji, haku, tate;

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

// describe('TokenFactory', (accounts) => {
contract('Wrapper', (accounts) => {
  // this.timeout(timeout); // This doesn't work without mocha enabled.
  console.log('Accounts:');
  console.dir(accounts);
  accountData.owner.address = accounts[0];
  accountData.user.address = accounts[1];

  let fujiMetadata = {},
    hakuMetadata = {},
    tateMetadata = {};

  before(async () => {
    wrapper = await Wrapper.deployed();
    accountData.wrapper.address = wrapper.address;
    const wrapperAdmin = await wrapper.getAdmin();
    // const wrapperFujiTateSwapper = await wrapper._fujiTateSwapper();
    // const wrapperHakuTateSwapper = await wrapper._hakuTateSwapper();

    // Factory.setProvider(web3.currentProvider);
    const tokenFactoryAddress = await wrapper.getTokenFactory();
    tokenFactory = await Factory.at(tokenFactoryAddress);
    accountData.tokenFactory.address = tokenFactory.address;

    // Token.setProvider(web3.currentProvider);
    // const tokenTest = await Token.deployed();

    const tokenSymbols = await tokenFactory.getTokenSymbols();

    const tokenAddresses = [];
    for (symbol of tokenSymbols) {
      const address = await tokenFactory.getTokenAddressFromSymbol(symbol);
      tokenAddresses.push(address);
    }
    const [fujiAddress, hakuAddress, tateAddress] = tokenAddresses;

    accountData.fuji.address = fujiAddress;
    accountData.haku.address = hakuAddress;
    accountData.tate.address = tateAddress;

    // These functions below only work if hardhat has compiled the abis
    // const temp = await hardhatEthers.getContractFactory('Fuji');
    // const test = await temp.deploy('Fuji', 'FUJI');

    // These functions all link to a different version of the Fuji contract that's not on Ganache.
    // const FujiDefaults = await Fuji.defaults();
    // const FujiAddress = await Fuji.address;
    // const fujiNew = await Fuji.new('Fuji', 'FUJI');
    // const fujiDeployed = await Fuji.deployed();

    const createFujiTransaction = await tokenFactory.createToken(
      'Fuji',
      'FUJI',
      18,
      100,
    );
    const fujiTransaction = readTransaction(createFujiTransaction);
    // fuji = await Token.at(fujiMetadata.address);
    fuji = await Token.at(fujiAddress);
    accountData.fuji.address = fujiAddress;
    accountData.fuji.admin.address = await fuji.getAdmin();

    const fujiInterface = new TokenInterface(fuji);
    fujiMetadata = await fujiInterface.getMetadata();

    // const createHakuTransaction = await tokenFactory.createToken(
    //   'Haku',
    //   'HAKU',
    //   18,
    //   100,
    // );
    // hakuMetadata.address = getNewTokenData(
    //   readTransaction(createHakuTransaction),
    // );
    // haku = await Token.at(hakuMetadata.address);
    haku = await Token.at(hakuAddress);
    accountData.haku.address = hakuAddress;
    accountData.haku.admin.address = await haku.getAdmin();

    const hakuInterface = new TokenInterface(haku);
    hakuMetadata = await hakuInterface.getMetadata();

    // const createTateTransaction = await tokenFactory.createToken(
    //   'Tate',
    //   'TATE',
    //   18,
    //   100,
    // );
    // tateMetadata.address = getNewTokenData(
    //   readTransaction(createTateTransaction),
    // );
    // tate = await Token.at(tateMetadata.address);
    tate = await Token.at(tateAddress);
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
    });
  });

  describe('TRANSFER', async () => {
    it('Initial Transfer', async () => {
      const initialBalances = await getBalances([
        wrapper.address,
        fuji.address,
        haku.address,
        tate.address,
        accountData.owner.address,
        accountData.user.address,
      ]);

      // debugger;

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
      const wrapperAdmin = await wrapper.getAdmin();

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

      // debugger;
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
