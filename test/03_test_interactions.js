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

const { eth, utils } = web3;

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

  let fuji,
    fujiMetadata = {},
    haku,
    hakuMetadata = {},
    tate,
    tateMetadata = {};

  async function fillMetadata(token) {
    if (DEBUG) {
      debugger;
    }
    return {
      address: token.address,
      owner: await token.owner(),
      name: await token.name(),
      symbol: await token.symbol(),
      decimals: utils.hexToNumber(await token.decimals()),
      totalSupply: utils.hexToNumber(await token.totalSupply()),
    };
  }

  before(async (error) => {
    const ethAccounts = await eth.getAccounts();
    owner.address = ethAccounts[0];
    sender.address = ethAccounts[1];
    receiver.address = ethAccounts[2];
    user.address = ethAccounts[3];

    fuji = await Fuji.at('0x5c1A66D05D33E4b08Ed63eE46a99011fBbF2eCE1');
    haku = await Haku.at('0x5124566b479cDBA5b85Db6F605A8e48D814EAC47');
    tate = await Tate.at('0x00Bc46dC89E2425FEc12f1842c31DbaFfd09fa59');

    fujiMetadata = await fillMetadata(fuji);
    hakuMetadata = await fillMetadata(haku);
    tateMetadata = await fillMetadata(tate);
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
