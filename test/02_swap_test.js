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

  let fuji, haku, tate;

  before(async () => {
    const accounts = await getAccounts();
    owner.address = accounts[0];
    sender.address = accounts[1];
    receiver.address = accounts[2];
    user.address = accounts[3];

    wrapper = await Wrapper.at('0x0418715c212f1f4d8b3760656D3D1d140D05A08c');
  });

  describe('ACCESS', async () => {
    it('Check Owners', async () => {
      expect(await wrapper.getAdmin()).to.equal(owner.address);
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

  // describe('TEST', async () => {
  //   if (DEBUG) {
  //     it('DEBUG', async () => {
  //       debugger;
  //     });
  //   }
  // });
});
