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

const hre = require('hardhat');

const hardhatArtifacts = hre.artifacts;
const hardhatConfig = hre.config;
const hardhatEthers = hre.ethers;
const hardhatNetwork = hre.network;
const hardhatWaffle = hre.waffle;
const hardhatWeb3 = hre.web3;

const { eth, utils } = web3;

const Token = artifacts.require('Token');
const Factory = artifacts.require('TokenFactory');

const fujiAddress = '0xAFb39e9fd5d45de70b235f91f10d65E1D6aC871B';
const hakuAddress = '0xAFb39e9fd5d45de70b235f91f10d65E1D6aC871B';
const tateAddress = '0xAFb39e9fd5d45de70b235f91f10d65E1D6aC871B';

function getNewTokenData({
  tokenAddress,
  name,
  symbol,
  decimals,
  totalSupply,
}) {
  // const arraylength = event.length;
  // for (let i; i <= arraylength; i++) {
  //   console.log(`counter = ${i}`);
  //   console.log(event[i]);
  // }
  return tokenAddress;
}

function getEvent({ tx, receipt }) {
  const { blockNumber, from, gasUsed, logs, to } = receipt;
  const [log] = logs;
  const { address, args } = log;
  return args;
}

function logTransaction({ tx, receipt }) {
  const { blockNumber, from, gasUsed, to } = receipt;
  console.log(
    `Transaction: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
  );
}

function readTransaction(transaction) {
  if (DEBUG) {
    logTransaction(transaction);
  }
  const event = getEvent(transaction);
  return event;
}
async function fillMetadata(token) {
  debugger;
  const owner = await token.getAdmin();
  const name = await token._name();
  const symbol = await token._symbol();
  const decimals = await token._tokenDecimals();
  const totalSupply = await token.totalSupply();
  debugger;
  const metadata = {
    owner: await token.getAdmin(),
    name: await token._name(),
    symbol: await token._symbol(),
    // decimals: utils.hexToNumber(await token._tokenDecimals()),
    // totalSupply: utils.hexToNumber(await token.totalSupply()),
  };
  return metadata;
}

contract('TokenFactory', (accounts) => {
  // this.timeout(timeout); // This doesn't work without mocha enabled.
  console.log('Accounts:');
  console.dir(accounts);
  let accountData = {
    admin: { balance: 0 },
    owner: { balance: 0, address: accounts[0] },
    sender: { balance: 0, address: accounts[1] },
    receiver: { balance: 0, address: accounts[2] },
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

    tokenFactory = await Factory.deployed();
    accountData.admin.address = tokenFactory.address;

    const createFujiTransaction = await tokenFactory.createToken(
      'Fuji',
      'FUJI',
      18,
      100,
    );

    fujiMetadata.address = getNewTokenData(
      readTransaction(createFujiTransaction),
    );
    fuji = await Token.at(fujiMetadata.address);
    await fillMetadata(fuji);
    debugger;

    const createHakuTransaction = await tokenFactory.createToken(
      'Haku',
      'HAKU',
      18,
      100,
    );
    hakuMetadata.address = getNewTokenData(
      readTransaction(createHakuTransaction),
    );
    haku = await Token.at(hakuMetadata.address);
    // await fillMetadata(haku);

    const createTateTransaction = await tokenFactory.createToken(
      'Tate',
      'TATE',
      18,
      100,
    );
    tateMetadata.address = getNewTokenData(
      readTransaction(createTateTransaction),
    );
    tate = await Token.at(tateMetadata.address);
    // await fillMetadata(tate);

    // debugger;
    const transaction2 = await fuji.totalSupply();
    const transaction3 = await fuji.getTotalMinted();
    const transaction4 = await fuji.balanceOf(accountData.admin.address);
    const transaction5 = await fuji.allowance(
      accountData.admin.address,
      accountData.sender.address,
    );
    // const transaction6 = await fuji.mint();
    const transaction7 = await fuji.transfer(accountData.receiver.address, 5);
    const transaction8 = await fuji.balanceOf(accountData.receiver.address);
    debugger;

    // hakuMetadata = await fillMetadata(hakuContract);
    // tateMetadata = await fillMetadata(tateContract);
    // debugger;
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
