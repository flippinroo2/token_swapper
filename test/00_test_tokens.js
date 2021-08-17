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
async function getMetadata(token) {
  const decimals = await token._tokenDecimals();
  const totalSupply = await token.totalSupply();
  const metadata = {
    admin: await token.getAdmin(),
    name: await token._name(),
    symbol: await token._symbol(),
    decimals: decimals.words,
    totalSupply: totalSupply.words,
  };
  if (DEBUG) {
    debugger;
  }
  return metadata;
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

    // const createFujiTransaction = await tokenFactory.createToken(
    //   'Fuji',
    //   'FUJI',
    //   18,
    //   100,
    // );
    // const fujiTransaction = readTransaction(createFujiTransaction);
    // fuji = await Token.at(fujiMetadata.address);
    fuji = await Token.at(fujiAddress);
    accountData.fuji.admin.address = await fuji.getAdmin();
    fujiMetadata = await getMetadata(fuji);

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
    hakuMetadata = await getMetadata(haku);

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
    tateMetadata = await getMetadata(tate);

    const fujiTotalSupplyTransaction = await fuji.totalSupply();
    accountData.fuji.totalSupply = fujiTotalSupplyTransaction.words[0];
    const fujiTotalMintedTransaction = await fuji.getTotalMinted();
    accountData.fuji.totalMinted = fujiTotalMintedTransaction.words[0];
    const fujiBalanceOfAdminTransaction = await fuji.balanceOf(
      accountData.fuji.admin.address,
    );
    accountData.fuji.admin.balance = fujiBalanceOfAdminTransaction.words[0];
    const fujiAdminSenderApprovalTransaction = await fuji.approve(
      accountData.tokenFactory.address,
      // accountData.sender.address,
      accountData.fuji.totalSupply,
    );
    const adminSenderApprovalTransactionData = readTransaction(
      fujiAdminSenderApprovalTransaction,
    );
    const [fujiAdminSenderApproval] =
      adminSenderApprovalTransactionData.value.words;
    const fujiAdminSenderAllowanceTransaction = await fuji.allowance(
      accountData.fuji.admin.address,
      accountData.fuji.address,
    );
    const [fujiAdminSenderAllowance] =
      fujiAdminSenderAllowanceTransaction.words;
    debugger;
    // Need fuji to be allowed to do the transfer for the 1st address.
    const fujiTransaferFromTransaction1 = await fuji.transferFrom(
      accountData.tokenFactory.address,
      accountData.receiver.address,
      50,
    );
    // const transaction6 = await fuji.mint();
    const fujiTransaferTransaction2 = await fuji.transfer(
      accountData.receiver.address,
      5,
    );
    const transaction8 = await fuji.balanceOf(accountData.receiver.address);
    debugger;

    // hakuMetadata = await getMetadata(hakuContract);
    // tateMetadata = await getMetadata(tateContract);
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
