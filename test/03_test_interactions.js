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

const { eth, utils } = web3;

const Storage = artifacts.require('Storage');
const Fuji = artifacts.require('Fuji');
const Haku = artifacts.require('Haku');
const Tate = artifacts.require('Tate');

describe('Test Suite', (temp) => {
  let fuji, haku, tate;
  let owner, sender, receiver, user;

  beforeEach(async (testSuite) => {
    console.log('beforeEach()');
  });
  describe('Deployment', async () => {
    if (DEBUG) {
      debugger;
    }
    fuji = await Fuji.deployed('Fuji', 'FUJI');
    // [owner, sender, receiver, user] = accounts;

    it('DEPLOY', async (test) => {
      if (DEBUG) {
        debugger;
      }
      haku = await Haku.deployed('Haku', 'HAKU');
      tate = await Tate.deployed('Tate', 'TATE');
    });

    it('MINT', async () => {});
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {
      console.log('DEBUG');
    });
  });
});
