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

const Fuji = artifacts.require('Fuji');
const Haku = artifacts.require('Haku');
const Tate = artifacts.require('Tate');
const Swap = artifacts.require('Swap');
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
    user = { fuji: {}, haku: {}, tate: {} };

  let wrapper;

  before(async () => {
    const accounts = await getAccounts();
    owner.address = accounts[0];
    sender.address = accounts[1];
    receiver.address = accounts[2];
    user.address = accounts[3];

    wrapper = await Wrapper.at('0x7167866f98742577BB5B98d54a451035a8880012');
  });

  describe('ACCESS', async () => {
    it('Check Owners', async () => {
      // expect(await wrapper.admin()).to.equal(owner.address);
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
      const fuji = await Fuji.at(await wrapper._fuji());
      const haku = await Haku.at(await wrapper._haku());
      const tate = await Tate.at(await wrapper._tate());

      // const fujiTateSwapperAddress = await wrapper._fujiTateSwapper();
      // const fujiTateSwapper = await Swap.at(fujiTateSwapperAddress);

      // const hakuTateSwapperAddress = await wrapper._hakuTateSwapper();
      // const hakuTateSwapper = await Swap.at(hakuTateSwapperAddress);

      if (DEBUG) {
        debugger;
      }

      const swapTransaction1 = await wrapper.swap(5, 25);
      const unSwapTransaction1 = await wrapper.unswap(10, 5);
      if (DEBUG) {
        debugger;
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

  // describe('TEST', async () => {
  //   if (DEBUG) {
  //     it('DEBUG', async () => {
  //       debugger;
  //     });
  //   }
  // });
});
