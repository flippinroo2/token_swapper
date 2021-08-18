const TokenInterface = require('../classes/TokenInterface.js');

const DEBUG = false;

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

  const propertyString = `${tokenName.toLowerCase()}Balance`;

  metadata[propertyString] = await token.getBalance(tokenAddress);
  metadata.admin[propertyString] = await token.getBalance(adminAddress);
  owner[propertyString] = await token.getBalance(owner.address);
  sender[propertyString] = await token.getBalance(sender.address);
  receiver[propertyString] = await token.getBalance(receiver.address);
  user[propertyString] = await token.getBalance(user.address);

  if (DEBUG) {
    logAccounts();
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
  await refreshAllowance(token, metadata, owner);
  await refreshAllowance(token, metadata, sender);
  await refreshAllowance(token, metadata, receiver);
  await refreshAllowance(token, metadata, user);
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
  return {
    from,
    to,
    transactionIndex,
    transactionHash,
    gasUsed: gasUsed.toNumber(),
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
  const { admin, totalSupply } = metadata;

  await token.approve(token.address, admin.address, totalSupply);
  await token.approve(token.address, owner.address, totalSupply);
  await token.approve(token.address, sender.address, totalSupply);
  await token.approve(token.address, receiver.address, totalSupply);
  await token.approve(token.address, user.address, totalSupply);

  // approve(address owner, address spender, uint256 amount)
  const approvalExample = await token.approve(
    admin.address,
    token.address,
    totalSupply,
  ); // This returns a transaction response. (Not a receipt yet until it has confirmations.)
  const approvalReceiptExample = await approvalExample.wait(); // The wait() function returns a transaction receipt.

  await token.approve(admin.address, owner.address, totalSupply);
  await token.approve(admin.address, sender.address, totalSupply);
  await token.approve(admin.address, receiver.address, totalSupply);
  await token.approve(admin.address, user.address, totalSupply);

  await token.approve(owner.address, token.address, totalSupply);
  await token.approve(owner.address, admin.address, totalSupply);
  await token.approve(owner.address, sender.address, totalSupply);
  await token.approve(owner.address, receiver.address, totalSupply);
  await token.approve(owner.address, user.address, totalSupply);

  await token.approve(sender.address, token.address, totalSupply);
  await token.approve(sender.address, admin.address, totalSupply);
  await token.approve(sender.address, owner.address, totalSupply);
  await token.approve(sender.address, receiver.address, totalSupply);
  await token.approve(sender.address, user.address, totalSupply);

  await token.approve(receiver.address, token.address, totalSupply);
  await token.approve(receiver.address, admin.address, totalSupply);
  await token.approve(receiver.address, owner.address, totalSupply);
  await token.approve(receiver.address, sender.address, totalSupply);
  await token.approve(receiver.address, user.address, totalSupply);

  await token.approve(user.address, token.address, totalSupply);
  await token.approve(user.address, admin.address, totalSupply);
  await token.approve(user.address, owner.address, totalSupply);
  await token.approve(user.address, sender.address, totalSupply);
  await token.approve(user.address, receiver.address, totalSupply);
}
async function tokenTransactions(token, metadata) {
  const { admin, totalSupply } = metadata;

  await refreshBalances(token, metadata);

  await approveAll(token, metadata);

  await refreshAllowances(token, metadata);

  const transfer = await token.transfer(admin.address, receiver.address, 50);
  const transferReceipt = await transfer.wait();

  /* ETHERS.js DECODE TESTING
  // IMPORTANT !!!
  // const base58DecodeTest = ethers.utils.base58.decode(approval.hash);
  const base64DecodeTest = ethers.utils.base64.decode(approval.hash);
  // const RLPDecodeTest = ethers.utils.RLP.decode(base64DecodeTest);
  // const bytes32Test = ethers.utils.parseBytes32String(approval.hash); // Not 32 bytes long
  // const utf8Test = ethers.utils.toUtf8String(approval.hash);
  // IMPORTANT !!!

  // IMPORTANT !!!
  // const test = ethers.utils.serializeTransaction(approval);
  // const test = ethers.utils.serializeTransaction(approvalReceipt); // This just made a new hex of the entire transaction.
  // const test = ethers.utils.parseTransaction(approval);
  // const abiInterface = ethers.utils.Interface(ABI);
  // IMPORTANT !!!

  // IMPORTANT !!!
  // These functions below turn strings into hashes, not vise versa!!!
  // const idTest = ethers.utils.id(approval.data);
  // const keccak256Test = ethers.utils.keccak256(approval.data);
  // const sha256Test = ethers.utils.sha256(approval.data);
  // IMPORTANT !!!
  */

  /* Web3.js TESTING
    // const web3CheckAddressChecksum = web3.utils.checkAddressChecksum(approval.hash);
    // const web3BytesToHex = web3.utils.bytesToHex(approval.hash);
    // const web3HexToAscii = web3.utils.hexToAscii(approval.hash);
    // const web3ToAscii = web3.utils.toAscii(approval.hash);
    // const web3HexToUtf8 = web3.utils.hexToUtf8(approval.hash);
    */

  await refreshBalances(token, metadata);
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

// describe('TokenFactory', (accounts) => {
contract('TokenFactory', (accounts) => {
  // this.timeout(timeout); // This doesn't work without mocha enabled.
  console.log('Accounts:');
  console.dir(accounts);
  let accountData = {
    fuji: { balance: 0, admin: {} },
    haku: { balance: 0, admin: {} },
    owner: { balance: 0, address: accounts[0] },
    receiver: { balance: 0, address: accounts[2] },
    sender: { balance: 0, address: accounts[1] },
    tate: { balance: 0, admin: {} },
    tokenFactory: { balance: 0, admin: {} },
    user: { balance: 0, address: accounts[3] },
  };
  let tokenFactory;
  let fujiContract,
    fujiMetadata = {};
  let hakuContract,
    hakuMetadata = {};
  let tateContract,
    tateMetadata = {};

  before(async () => {
    // These functions below only work if hardhat has compiled the abis
    // const temp = await hardhatEthers.getContractFactory('Fuji');
    // const test = await temp.deploy('Fuji', 'FUJI');

    // These functions all link to a different version of the Fuji contract that's not on Ganache.
    // const FujiDefaults = await Fuji.defaults();
    // const FujiAddress = await Fuji.address;
    // const fujiNew = await Fuji.new('Fuji', 'FUJI');
    // const fujiDeployed = await Fuji.deployed();

    // Factory.setProvider(web3.currentProvider);
    tokenFactory = await Factory.deployed();
    accountData.tokenFactory.address = tokenFactory.address;

    const tokenAddressesTransaction = await tokenFactory.getAddresses();
    const [fujiAddress, hakuAddress, tateAddress] = tokenAddressesTransaction;

    accountData.fuji.address = fujiAddress;
    accountData.haku.address = hakuAddress;
    accountData.tate.address = tateAddress;

    // Token.setProvider(web3.currentProvider);
    // const tokenTest = await Token.deployed();

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

    debugger;
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
      if (DEBUG) {
        console.log(
          `Mint Transaction: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }
      // const balanceOfTransaction = await fuji.balanceOf(owner.address);
      // const [balance] = balanceOfTransaction.words;
      // owner.balance = utils.hexToNumber(balanceOfTransaction);
      // expect(owner.balance).to.equal(balance);
    });
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {
      // const testTransaction = await fuji.testFunction();
      if (DEBUG) {
        debugger;
      }
    });
  });
});
