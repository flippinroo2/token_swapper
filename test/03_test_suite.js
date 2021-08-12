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
const { getAccounts, personal } = eth;

const timeout = 300000;

const Fuji = artifacts.require('Fuji');
const Haku = artifacts.require('Haku');
const Tate = artifacts.require('Tate');

describe('Test Suite', function () {
  this.timeout(timeout);

  let owner = { fuji: {}, haku: {}, tate: {} },
    sender = { fuji: {}, haku: {}, tate: {} },
    receiver = { fuji: {}, haku: {}, tate: {} },
    user = { fuji: {}, haku: {}, tate: {} };
  let fuji,
    fujiMetadata = {};

  before(async () => {
    const accounts = await getAccounts();
    owner.address = accounts[0];
    sender.address = accounts[1];
    receiver.address = accounts[2];
    user.address = accounts[3];

    fuji = await Fuji.at('0x450660E1FCFF8370B803321369f761b419b1770d');
    haku = await Haku.at('0x6178153500879507063304a8d88Dde1d746ce203');
    tate = await Tate.at('0x9da4Eb9e4513b37639f5A94BD2759B7745F2D87c');
  });

  describe('ACCESS', async () => {
    it('Check Owners', async () => {
      expect(await fuji.owner()).to.equal(owner.address);
      expect(await haku.owner()).to.equal(owner.address);
      expect(await tate.owner()).to.equal(owner.address);
    });
  });

  describe('MINT', async () => {
    it('Mint FUJI', async () => {
      let tx, receipt;

      const mintFujiTransaction1 = await fuji.mint(owner.address, 100);
      tx = mintFujiTransaction1.tx;
      receipt = mintFujiTransaction1.receipt;
      if (DEBUG) {
        console.log(
          `Mint Fuji Transaction 1: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }

      const mintFujiTransaction2 = await fuji.mint(sender.address, 10);
      tx = mintFujiTransaction2.tx;
      receipt = mintFujiTransaction2.receipt;
      if (DEBUG) {
        console.log(
          `Mint Fuji Transaction 2: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }

      const mintFujiTransaction3 = await fuji.mint(receiver.address, 1);
      tx = mintFujiTransaction3.tx;
      receipt = mintFujiTransaction3.receipt;
      if (DEBUG) {
        console.log(
          `Mint Fuji Transaction 3: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }
    });

    it('Mint HAKU', async () => {
      let tx, receipt;

      const mintHakuTransaction1 = await haku.mint(owner.address, 200);
      tx = mintHakuTransaction1.tx;
      receipt = mintHakuTransaction1.receipt;
      if (DEBUG) {
        console.log(
          `Mint Haku Transaction1: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }

      const mintHakuTransaction2 = await haku.mint(sender.address, 20);
      tx = mintHakuTransaction2.tx;
      receipt = mintHakuTransaction2.receipt;
      if (DEBUG) {
        console.log(
          `Mint Haku Transaction2: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }

      const mintHakuTransaction3 = await haku.mint(receiver.address, 2);
      tx = mintHakuTransaction3.tx;
      receipt = mintHakuTransaction3.receipt;
      if (DEBUG) {
        console.log(
          `Mint Haku Transaction3: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }
    });

    it('Mint TATE', async () => {
      let tx, receipt;

      const mintTateTransaction1 = await tate.mint(owner.address, 500);
      tx = mintTateTransaction1.tx;
      receipt = mintTateTransaction1.receipt;
      if (DEBUG) {
        console.log(
          `Mint Tate Transaction1: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }

      const mintTateTransaction2 = await tate.mint(sender.address, 50);
      tx = mintTateTransaction2.tx;
      receipt = mintTateTransaction2.receipt;
      if (DEBUG) {
        console.log(
          `Mint Tate Transaction2: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }

      const mintTateTransaction3 = await tate.mint(receiver.address, 5);
      tx = mintTateTransaction3.tx;
      receipt = mintTateTransaction3.receipt;
      if (DEBUG) {
        console.log(
          `Mint Tate Transaction3: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }
    });
  });

  describe('BALANCES', async () => {
    it('Owner Balances', async () => {
      const fujiBalanceOfTransaction = await fuji.balanceOf(owner.address);
      const hakuBalanceOfTransaction = await haku.balanceOf(owner.address);
      const tateBalanceOfTransaction = await tate.balanceOf(owner.address);

      const [fujiBalance] = fujiBalanceOfTransaction.words;
      owner.fuji.balance = utils.hexToNumber(fujiBalanceOfTransaction);

      const [hakuBalance] = hakuBalanceOfTransaction.words;
      owner.haku.balance = utils.hexToNumber(hakuBalanceOfTransaction);

      const [tateBalance] = tateBalanceOfTransaction.words;
      owner.tate.balance = utils.hexToNumber(tateBalanceOfTransaction);
    });

    it('Sender Balances', async () => {
      const fujiBalanceOfTransaction = await fuji.balanceOf(sender.address);
      const hakuBalanceOfTransaction = await haku.balanceOf(sender.address);
      const tateBalanceOfTransaction = await tate.balanceOf(sender.address);

      const [fujiBalance] = fujiBalanceOfTransaction.words;
      sender.fuji.balance = utils.hexToNumber(fujiBalanceOfTransaction);

      const [hakuBalance] = hakuBalanceOfTransaction.words;
      sender.haku.balance = utils.hexToNumber(hakuBalanceOfTransaction);

      const [tateBalance] = tateBalanceOfTransaction.words;
      sender.tate.balance = utils.hexToNumber(tateBalanceOfTransaction);
    });

    it('Receiver Balances', async () => {
      const fujiBalanceOfTransaction = await fuji.balanceOf(receiver.address);
      const hakuBalanceOfTransaction = await haku.balanceOf(receiver.address);
      const tateBalanceOfTransaction = await tate.balanceOf(receiver.address);

      const [fujiBalance] = fujiBalanceOfTransaction.words;
      receiver.fuji.balance = utils.hexToNumber(fujiBalanceOfTransaction);

      const [hakuBalance] = hakuBalanceOfTransaction.words;
      receiver.haku.balance = utils.hexToNumber(hakuBalanceOfTransaction);

      const [tateBalance] = tateBalanceOfTransaction.words;
      receiver.tate.balance = utils.hexToNumber(tateBalanceOfTransaction);
    });
  });

  describe('TRANSFERS', async () => {
    it('DEBUG', async () => {
      if (DEBUG) {
        debugger;
      }
      const testTransaction = await fuji.testFunction();
    });
  });

  describe('SWAP', async () => {
    it('DEBUG', async () => {
      if (DEBUG) {
        // debugger;
      }
    });
  });

  describe('TEST', async () => {
    it('Balances', async () => {
      if (DEBUG) {
        // debugger;
      }
    });

    if (DEBUG) {
      it('DEBUG', async () => {
        debugger;
        const testTransaction = await fuji.testFunction();
      });
    }
  });
});
