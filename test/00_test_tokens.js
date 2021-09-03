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
    `fujiAdmin: ${fujiMetadata.admin.balance}\tfujiMetadata: ${fujiMetadata.balance}\thakuAdmin: ${hakuMetadata.admin.balance}\thakuMetadata: ${hakuMetadata.balance}\towner: ${owner.balance}\treceiver: ${receiver.balance}\tsender: ${sender.balance}\ttateAdmin: ${tateMetadata.admin.balance}\ttateMetadata: ${tateMetadata.balance}\tuser: ${user.balance}`,
  );
  console.log('\nALLOWANCES:');
  console.log(
    `fujiAdmin: ${fujiMetadata.admin.ownerAllowance}\tfujiMetadata: ${fujiMetadata.ownerAllowance}\thakuAdmin: ${hakuMetadata.admin.ownerAllowance}\thakuMetadata: ${hakuMetadata.ownerAllowance}\towner: ${owner.ownerAllowance}\treceiver: ${receiver.ownerAllowance}\tsender: ${sender.ownerAllowance}\ttateAdmin: ${tateMetadata.admin.ownerAllowance}\ttateMetadata: ${tateMetadata.ownerAllowance}\tuser: ${user.ownerAllowance}`,
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
  const { owner, sender, receiver, user } = accountData;

  const propertyString = `${tokenName.toLowerCase()}Balance`;

  metadata[propertyString] = await token.getBalance(tokenAddress);
  metadata.admin[propertyString] = await token.getBalance(adminAddress);
  accountData.owner[propertyString] = await token.getBalance(owner.address);
  accountData.sender[propertyString] = await token.getBalance(sender.address);
  accountData.receiver[propertyString] = await token.getBalance(
    receiver.address,
  );
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
  await refreshAllowance(token, metadata, accountData.sender);
  await refreshAllowance(token, metadata, accountData.receiver);
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
  const { owner, sender, receiver, user } = accountData;

  const propertyString = `${tokenName.toLowerCase()}Balance`;

  await token.approve(tokenAddress, adminAddress, totalSupply);
  await token.approve(tokenAddress, owner.address, totalSupply);
  await token.approve(tokenAddress, sender.address, totalSupply);
  await token.approve(tokenAddress, receiver.address, totalSupply);
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
  await token.approve(adminAddress, sender.address, totalSupply);
  await token.approve(adminAddress, receiver.address, totalSupply);
  await token.approve(adminAddress, user.address, totalSupply);

  await token.approve(owner.address, tokenAddress, totalSupply);
  await token.approve(owner.address, adminAddress, totalSupply);
  await token.approve(owner.address, sender.address, totalSupply);
  await token.approve(owner.address, receiver.address, totalSupply);
  await token.approve(owner.address, user.address, totalSupply);

  await token.approve(sender.address, tokenAddress, totalSupply);
  await token.approve(sender.address, adminAddress, totalSupply);
  await token.approve(sender.address, owner.address, totalSupply);
  await token.approve(sender.address, receiver.address, totalSupply);
  await token.approve(sender.address, user.address, totalSupply);

  await token.approve(receiver.address, tokenAddress, totalSupply);
  await token.approve(receiver.address, adminAddress, totalSupply);
  await token.approve(receiver.address, owner.address, totalSupply);
  await token.approve(receiver.address, sender.address, totalSupply);
  await token.approve(receiver.address, user.address, totalSupply);

  await token.approve(user.address, tokenAddress, totalSupply);
  await token.approve(user.address, adminAddress, totalSupply);
  await token.approve(user.address, owner.address, totalSupply);
  await token.approve(user.address, sender.address, totalSupply);
  await token.approve(user.address, receiver.address, totalSupply);
}

async function tokenTransactions(token, metadata) {
  const { admin, totalSupply } = metadata;

  await refreshBalances(token, metadata);

  await approveAll(token, metadata);

  await refreshAllowances(token, metadata);

  const transfer = await token.transfer(
    admin.address,
    accountData.sender.address,
    50,
  );
  const transferReceipt = parseTransactionData(transfer.receipt);

  await refreshBalances(token, metadata);
  if (DEBUG) {
    // debugger;
  }
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
  receiver: { balance: 0 },
  sender: { balance: 0 },
  tate: { balance: 0, admin: {} },
  tokenFactory: { balance: 0, admin: {} },
  user: { balance: 0 },
  wrapper: { balance: 0 },
};

let wrapper, tokenFactory, fuji, haku, tate;

// describe('TokenFactory', (accounts) => {
contract('Wrapper', (accounts) => {
  // this.timeout(timeout); // This doesn't work without mocha enabled.
  console.log('Accounts:');
  console.dir(accounts);
  accountData.owner.address = accounts[0];
  accountData.receiver.address = accounts[1];
  accountData.sender.address = accounts[2];
  accountData.user.address = accounts[3];

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
    accountData.fuji.admin.address = await fuji.getAdmin();

    const fujiInterface = new TokenInterface(fuji);
    fujiMetadata = await fujiInterface.getMetadata();

    await tokenTransactions(fujiInterface, fujiMetadata);
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
    accountData.tate.admin.address = await tate.getAdmin();

    const tateInterface = new TokenInterface(tate);
    tateMetadata = await tateInterface.getMetadata();
  });

  describe('Deployment', async () => {
    it('DEPLOY', () => {
      const { address } = accountData.owner;
      assert.equal(address, accounts[0]);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('MINT', async () => {
      // if (DEBUG) {
      //   // console.log(
      //   //   `Mint Transaction: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
      //   // );
      //   debugger;
      // }
    });
  });

  describe('Swap', async () => {
    it('SWAP', async () => {
      if (DEBUG) {
        debugger;
      }
      const wrapperAdmin = await wrapper._admin();
      if (DEBUG) {
        debugger;
      }
      const createFujiSwap = await wrapper.createFujiSwap(fuji, tate);
      const createHakuSwap = await wrapper.createHakuSwap(haku, tate);
      if (DEBUG) {
        debugger;
      }
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
