const DEBUG = true;

const { use, expect } = require('chai');
use(require('chai-as-promised')).should();

/*
_
artifacts
Atomics
btoa
config
crypto
debug
WebAssembly
*/

const Storage = artifacts.require('Storage');
const Fuji = artifacts.require('Fuji');
const Haku = artifacts.require('Haku');
const Tate = artifacts.require('Tate');

describe('Test Suite', () => {
  const { eth, utils } = web3;
  // const {
  //   abi,
  //   accounts,
  //   Contract,
  //   getAccounts,
  //   getBalance,
  //   getChainId,
  //   getTransaction,
  //   getTransactionCount,
  // } = eth;

  let owner = { balance: 0 },
    sender = { balance: 0 },
    receiver = { balance: 0 },
    user = { balance: 0 };

  let fuji, haku, tate;

  before(async (error) => {
    const ethAccounts = await eth.getAccounts();
    owner.address = ethAccounts[0];
    sender.address = ethAccounts[1];
    receiver.address = ethAccounts[2];
    user.address = ethAccounts[3];
    fuji = await Fuji.deployed();
    haku = await Haku.deployed();
    tate = await Tate.deployed();
    if (DEBUG) {
      debugger;
    }
  });

  describe('Deployment', async () => {
    it('DEPLOY', async (test) => {
      if (DEBUG) {
        debugger;
      }
    });

    it('MINT', async () => {});

    it('SWAP', async () => {});
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {
      console.log('DEBUG');
    });
  });
});
