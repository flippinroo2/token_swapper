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
const hardhatEthers = hre.ethers;
const hardhatNetwork = hre.network;
const hardhatWaffle = hre.waffle;
const hardhatWeb3 = hre.web3;

const ethersUtils = hardhatEthers.utils;

const { eth, utils } = web3;
const { getAccounts, net, personal, requestAccounts } = eth;

const timeout = 300000;

const Token = artifacts.require('Token');
// const Swap = artifacts.require('Swap');
const Wrapper = artifacts.require('Wrapper');

let wrapperMetadata;

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

describe('Wrapper', function () {
  this.timeout(timeout);

  let owner = { fuji: {}, haku: {}, tate: {} },
    sender = { fuji: {}, haku: {}, tate: {} },
    receiver = { fuji: {}, haku: {}, tate: {} },
    user = { fuji: {}, haku: {}, tate: {} },
    admin = { fuji: {}, haku: {}, tate: {} };

  let wrapper, fuji, haku, tate;

  before(async () => {
    const accounts = await getAccounts();
    owner.address = accounts[0];
    sender.address = accounts[1];
    receiver.address = accounts[2];
    user.address = accounts[3];

    wrapper = await Wrapper.at('0x49186E6674A162bbd4441b6f0f27F9822053Ba6D');
    admin.address = wrapper.address;

    fuji = await Token.at(await wrapper._fuji());
    haku = await Token.at(await wrapper._haku());
    tate = await Token.at(await wrapper._tate());
  });

  describe('ACCESS', async () => {
    it('Check Owners', async () => {
      // expect(await wrapper.admin()).to.equal(owner.address);
    });
  });

  describe('BALANCES', async () => {
    it('Check Balances', async () => {
      owner.fuji.balance = await getBalance(fuji, owner);
      owner.haku.balance = await getBalance(haku, owner);
      owner.tate.balance = await getBalance(tate, owner);
      sender.fuji.balance = await getBalance(fuji, sender);
      sender.haku.balance = await getBalance(haku, sender);
      sender.tate.balance = await getBalance(tate, sender);
      receiver.fuji.balance = await getBalance(fuji, receiver);
      receiver.haku.balance = await getBalance(haku, receiver);
      receiver.tate.balance = await getBalance(tate, receiver);
      user.fuji.balance = await getBalance(fuji, user);
      user.haku.balance = await getBalance(haku, user);
      user.tate.balance = await getBalance(tate, user);
      admin.fuji.balance = await getBalance(fuji, admin);
      admin.haku.balance = await getBalance(haku, admin);
      admin.tate.balance = await getBalance(tate, admin);
    });
  });

  describe('MINT', async () => {});

  describe('APPROVALS', async () => {
    sender.allowance = {
      fuji: {},
      haku: {},
      tate: {},
    };

    it('Approve', async () => {});
  });

  describe('SWAP', async () => {
    it('Swap 100 Fuji for Tate', async () => {
      // const fujiTateSwapperAddress = await wrapper._fujiTateSwapper();
      // const fujiTateSwapper = await Swap.at(fujiTateSwapperAddress);

      // const hakuTateSwapperAddress = await wrapper._hakuTateSwapper();
      // const hakuTateSwapper = await Swap.at(hakuTateSwapperAddress);

      const fujiAdminAddress = await fuji.getAdmin();

      const fujiTotalSupplyTransaction1 = await fuji.totalSupply();
      const [fujiTotalSupply] = fujiTotalSupplyTransaction1.words;

      const fujiTotalMintedTransaction1 = await fuji.getTotalMinted();
      const [fujiTotalMinted] = fujiTotalMintedTransaction1.words;

      if (DEBUG) {
        debugger;
      }

      const fujiApprovalTransaction1 = await fuji.approve(
        sender.address,
        fujiTotalSupply,
      );

      const fujiAllowanceTransaction1 = await fuji.allowance(
        admin.address,
        sender.address,
      );

      const fujiMintTransaction1 = await fuji.transfer(owner.address, 3);
      const [fujiMint1] = fujiMintTransaction1.words;

      if (DEBUG) {
        debugger;
      }

      const swapTransaction1 = await wrapper.swap(25);
      const unSwapTransaction1 = await wrapper.unswap(10);
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

  // describe('TEST', async () => {
  //   if (DEBUG) {
  //     it('DEBUG', async () => {
  //       debugger;
  //     });
  //   }
  // });
});
