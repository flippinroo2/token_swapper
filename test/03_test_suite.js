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

const ethersUtils = hardhatEthers.utils;

const { eth, utils } = web3;
const { getAccounts, net, personal, requestAccounts } = eth;

const timeout = 300000;

const Fuji = artifacts.require('Fuji');
const Haku = artifacts.require('Haku');
const Tate = artifacts.require('Tate');

let fujiMetadata, hakuMetadata, tateMetadata;

async function getBalance(token, { address }) {
  const balanceOfTransaction = await token.balanceOf(address);
  const [balance] = balanceOfTransaction.words;
  return balance;
}
function logTransaction({ tx, receipt }) {
  const { blockNumber, from, gasUsed, to } = receipt;
  if (DEBUG) {
    console.log(
      `Transaction: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
    );
  }
}

async function fillMetadata(token) {
  const metadata = {
    address: token.address,
    owner: await token.owner(),
    name: await token.name(),
    symbol: await token.symbol(),
    decimals: utils.hexToNumber(await token.decimals()),
    totalSupply: utils.hexToNumber(await token.totalSupply()),
  };
  return metadata;
}

describe('Test Suite', function () {
  this.timeout(timeout);

  let owner = { fuji: {}, haku: {}, tate: {} },
    sender = { fuji: {}, haku: {}, tate: {} },
    receiver = { fuji: {}, haku: {}, tate: {} },
    user = { fuji: {}, haku: {}, tate: {} };

  let fuji, haku, tate;

  before(async () => {
    const accounts = await getAccounts();
    owner.address = accounts[0];
    sender.address = accounts[1];
    receiver.address = accounts[2];
    user.address = accounts[3];

    fuji = await Fuji.at('0xe84D8DeC422D937e8128f0f99E825673c7390F24');
    haku = await Haku.at('0x19D6bb2858Df4e4875139a87524D09F5A20f56D9');
    tate = await Tate.at('0x87d4F59864D91332014303317C3D2dCD40720f87');

    fujiMetadata = await fillMetadata(fuji);
    hakuMetadata = await fillMetadata(haku);
    tateMetadata = await fillMetadata(tate);
  });

  describe('ACCESS', async () => {
    it('Check Owners', async () => {
      expect(await fuji.owner()).to.equal(owner.address);
      expect(await haku.owner()).to.equal(owner.address);
      expect(await tate.owner()).to.equal(owner.address);
    });
  });

  describe('MINT', async () => {
    // it('Set total supply on all 3 tokens', async () => {
    //   const fujiTotalSupplyTransaction1 = await fuji.totalSupply();
    //   const hakuTotalSupplyTransaction1 = await haku.totalSupply();
    //   const tateTotalSupplyTransaction1 = await tate.totalSupply();
    // });

    it('Mint FUJI', async () => {
      const mintFujiTransaction1 = await fuji.mint(owner.address, 100);
      logTransaction(mintFujiTransaction1);

      const mintFujiTransaction2 = await fuji.mint(sender.address, 10);
      logTransaction(mintFujiTransaction2);

      const mintFujiTransaction3 = await fuji.mint(user.address, 1);
      logTransaction(mintFujiTransaction3);
    });

    it('Mint HAKU', async () => {
      const mintHakuTransaction1 = await haku.mint(owner.address, 200);
      logTransaction(mintHakuTransaction1);

      const mintHakuTransaction2 = await haku.mint(sender.address, 20);
      logTransaction(mintHakuTransaction2);

      const mintHakuTransaction3 = await haku.mint(user.address, 2);
      logTransaction(mintHakuTransaction3);
    });

    it('Mint TATE', async () => {
      const mintTateTransaction1 = await tate.mint(owner.address, 500);
      logTransaction(mintTateTransaction1);

      const mintTateTransaction2 = await tate.mint(sender.address, 50);
      logTransaction(mintTateTransaction2);

      const mintTateTransaction3 = await tate.mint(user.address, 5);
      logTransaction(mintTateTransaction3);
    });

    it('Set total supply on all 3 tokens', async () => {
      const fujiTotalSupplyTransaction1 = await fuji.totalSupply();
      const [fujiTotalSupply] = fujiTotalSupplyTransaction1.words;
      fujiMetadata.totalSupply = fujiTotalSupply;

      hakuMetadata.totalSupply = utils.hexToNumber(await haku.totalSupply());
      tateMetadata.totalSupply = utils.hexToNumber(await tate.totalSupply());
    });
  });

  describe('BALANCES', async () => {
    it('Owner Balances', async () => {
      owner.fuji.balance = await getBalance(fuji, owner);
      owner.haku.balance = await getBalance(haku, owner);
      owner.tate.balance = await getBalance(tate, owner);
      // const fujiBalanceOfTransaction = await fuji.balanceOf(owner.address);
      // const hakuBalanceOfTransaction = await haku.balanceOf(owner.address);
      // const tateBalanceOfTransaction = await tate.balanceOf(owner.address);

      // const [fujiBalance] = fujiBalanceOfTransaction.words;
      // owner.fuji.balance = utils.hexToNumber(fujiBalanceOfTransaction);

      // const [hakuBalance] = hakuBalanceOfTransaction.words;
      // owner.haku.balance = utils.hexToNumber(hakuBalanceOfTransaction);

      // const [tateBalance] = tateBalanceOfTransaction.words;
      // owner.tate.balance = utils.hexToNumber(tateBalanceOfTransaction);
    });

    it('Sender Balances', async () => {
      sender.fuji.balance = await getBalance(fuji, sender);
      sender.haku.balance = await getBalance(haku, sender);
      sender.tate.balance = await getBalance(tate, sender);
    });

    it('Receiver Balances', async () => {
      receiver.fuji.balance = await getBalance(fuji, receiver);
      receiver.haku.balance = await getBalance(haku, receiver);
      receiver.tate.balance = await getBalance(tate, receiver);
    });

    it('User Balances', async () => {
      user.fuji.balance = await getBalance(fuji, user);
      user.haku.balance = await getBalance(haku, user);
      user.tate.balance = await getBalance(tate, user);
    });
  });

  describe('APPROVALS', async () => {
    sender.allowance = {
      fuji: {},
      haku: {},
      tate: {},
    };

    it('Approve', async () => {
      // const fujiTotalSupply = await fuji.totalSupply();
      // const hakuTotalSupply = await haku.totalSupply().words;
      // const [tateTotalSupply] = await tate.totalSupply().words;

      // These are only giving approval for "owner" tokens. Going to have to do a manual transaction from each individual account.
      const approveFujiTransaction1 = await fuji.approve(
        sender.address,
        fujiMetadata.totalSupply,
      );
      logTransaction(approveFujiTransaction1);

      const approveHakuTransaction1 = await haku.approve(
        sender.address,
        hakuMetadata.totalSupply,
      );
      logTransaction(approveHakuTransaction1);

      const approveTateTransaction1 = await tate.approve(
        sender.address,
        tateMetadata.totalSupply,
      );
      logTransaction(approveTateTransaction1);
    });

    it('Fuji Allowance', async () => {
      const allowanceFujiTransaction1 = await fuji.allowance(
        fujiMetadata.address,
        sender.address,
      );
      const [fujiAllowance1] = allowanceFujiTransaction1.words;
      sender.allowance.fuji.contract = fujiAllowance1;

      const allowanceFujiTransaction2 = await fuji.allowance(
        owner.address,
        sender.address,
      );
      const [fujiAllowance2] = allowanceFujiTransaction2.words;
      sender.allowance.fuji.owner = fujiAllowance2;

      const allowanceFujiTransaction3 = await fuji.allowance(
        receiver.address,
        sender.address,
      );
      const [fujiAllowance3] = allowanceFujiTransaction3.words;
      sender.allowance.fuji.receiver = fujiAllowance3;

      const allowanceFujiTransaction4 = await fuji.allowance(
        user.address,
        sender.address,
      );
      const [fujiAllowance4] = allowanceFujiTransaction4.words;
      sender.allowance.fuji.user = fujiAllowance4;

      if (DEBUG) {
        // debugger;
      }
    });

    it('Haku Allowance', async () => {
      const allowanceHakuTransaction1 = await haku.allowance(
        hakuMetadata.address,
        sender.address,
      );
      const [hakuAllowance1] = allowanceHakuTransaction1.words;
      sender.allowance.haku.contract = hakuAllowance1;

      const allowanceHakuTransaction2 = await haku.allowance(
        owner.address,
        sender.address,
      );
      const [hakuAllowance2] = allowanceHakuTransaction2.words;
      sender.allowance.haku.owner = hakuAllowance2;

      const allowanceHakuTransaction3 = await haku.allowance(
        receiver.address,
        sender.address,
      );
      const [hakuAllowance3] = allowanceHakuTransaction3.words;
      sender.allowance.haku.receiver = hakuAllowance3;

      const allowanceHakuTransaction4 = await haku.allowance(
        user.address,
        sender.address,
      );
      const [hakuAllowance4] = allowanceHakuTransaction4.words;
      sender.allowance.haku.user = hakuAllowance4;

      if (DEBUG) {
        // debugger;
      }
    });

    it('Tate Allowance', async () => {
      const allowanceTateTransaction1 = await tate.allowance(
        tateMetadata.address,
        sender.address,
      );
      const [tateAllowance1] = allowanceTateTransaction1.words;
      sender.allowance.tate.contract = tateAllowance1;

      const allowanceTateTransaction2 = await tate.allowance(
        owner.address,
        sender.address,
      );
      const [tateAllowance2] = allowanceTateTransaction2.words;
      sender.allowance.tate.owner = tateAllowance2;

      const allowanceTateTransaction3 = await tate.allowance(
        receiver.address,
        user.address,
      );
      const [tateAllowance3] = allowanceTateTransaction3.words;
      sender.allowance.tate.receiver = tateAllowance3;

      const allowanceTateTransaction4 = await tate.allowance(
        user.address,
        sender.address,
      );
      const [tateAllowance4] = allowanceTateTransaction4.words;
      sender.allowance.tate.user = tateAllowance4;
    });
  });

  describe('TRANSFERS', async () => {
    it('Transfer', async () => {
      const previousBalances = {
        owner: {
          fuji: owner.fuji.balance,
          haku: owner.haku.balance,
          tate: owner.tate.balance,
        },
        receiver: {
          fuji: receiver.fuji.balance,
          haku: receiver.haku.balance,
          tate: receiver.tate.balance,
        },
      };

      const transferFujiTransaction1 = await fuji.transfer(receiver.address, 7);
      logTransaction(transferFujiTransaction1);
      const transferHakuTransaction1 = await haku.transfer(receiver.address, 7);
      logTransaction(transferHakuTransaction1);
      const transferTateTransaction1 = await tate.transfer(receiver.address, 7);
      logTransaction(transferTateTransaction1);

      owner.fuji.balance = await getBalance(fuji, owner);
      owner.haku.balance = await getBalance(haku, owner);
      owner.tate.balance = await getBalance(tate, owner);

      receiver.fuji.balance = await getBalance(fuji, receiver);
      receiver.haku.balance = await getBalance(haku, receiver);
      receiver.tate.balance = await getBalance(tate, receiver);

      expect(owner.fuji.balance).to.equal(previousBalances.owner.fuji - 7);
      expect(receiver.fuji.balance).to.equal(
        previousBalances.receiver.fuji + 7,
      );

      expect(owner.haku.balance).to.equal(previousBalances.owner.haku - 7);
      expect(receiver.haku.balance).to.equal(
        previousBalances.receiver.haku + 7,
      );

      expect(owner.tate.balance).to.equal(previousBalances.owner.tate - 7);
      expect(receiver.tate.balance).to.equal(
        previousBalances.receiver.tate + 7,
      );
    });

    it('Transfer From', async () => {
      const previousBalances = {
        owner: {
          fuji: owner.fuji.balance,
          haku: owner.haku.balance,
          tate: owner.tate.balance,
        },
        receiver: {
          fuji: receiver.fuji.balance,
          haku: receiver.haku.balance,
          tate: receiver.tate.balance,
        },
      };

      if (DEBUG) {
        // debugger;
      }

      // Probably have to do a manual transaction here to call this function from sender instead of from the contract itself.
      // const transferFujiTransaction1 = await fuji.transferFrom(
      //   owner.address,
      //   receiver.address,
      //   4,
      // );
      // logTransaction(transferFujiTransaction1);

      // const transferHakuTransaction1 = await haku.transferFrom(
      //   owner.address,
      //   receiver.address,
      //   4,
      // );
      // logTransaction(transferHakuTransaction1);

      // const transferTateTransaction1 = await tate.transferFrom(
      //   owner.address,
      //   receiver.address,
      //   4,
      // );
      // logTransaction(transferTateTransaction1);

      owner.fuji.balance = await getBalance(fuji, owner);
      owner.haku.balance = await getBalance(haku, owner);
      owner.tate.balance = await getBalance(tate, owner);

      receiver.fuji.balance = await getBalance(fuji, receiver);
      receiver.haku.balance = await getBalance(haku, receiver);
      receiver.tate.balance = await getBalance(tate, receiver);

      if (DEBUG) {
        // debugger;
      }
    });
  });

  describe('SWAP', async () => {
    const focus = fuji;
    it('Swap 100 Fuji for Tate', async () => {
      if (DEBUG) {
        // debugger;
      }
    });

    it('Swap 50 Tate for Haku', async () => {
      if (DEBUG) {
        // debugger;
      }
    });

    it('Not swap Fuji for Haku', async () => {
      if (DEBUG) {
        // debugger;
      }
    });

    it('Not swap Haku for Fuji', async () => {
      if (DEBUG) {
        // debugger;
      }
    });
  });

  describe('TEST', async () => {
    if (DEBUG) {
      it('DEBUG', async () => {
        debugger;
        const fujiTestTransaction = await fuji.testFunction();
        const hakuTestTransaction = await haku.testFunction();
        const tateTestTransaction = await tate.testFunction();
      });
    }
  });
});
