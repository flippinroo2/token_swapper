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

const Fuji = artifacts.require('Fuji');
const Fuji = artifacts.require('Haku');
const Fuji = artifacts.require('Tate');

describe('Test Suite', function () {
  let owner = { balance: 0 },
    sender = { balance: 0 },
    receiver = { balance: 0 },
    user = { balance: 0 };
  let fuji,
    fujiMetadata = {};

  before(async () => {
    fuji = await Fuji.at('0x5c1A66D05D33E4b08Ed63eE46a99011fBbF2eCE1');

    owner.address = await fuji.owner();

    // fujiMetadata.address = fuji.address;
    // fujiMetadata.owner = owner.address;
    // fujiMetadata.name = await fuji.name();
    // fujiMetadata.symbol = await fuji.symbol();
    // fujiMetadata.decimals = utils.hexToNumber(await fuji.decimals());
    // fujiMetadata.totalSupply = utils.hexToNumber(await fuji.totalSupply());
  });

  describe('Deployment', async () => {
    it('DEPLOY', () => {
      const { address } = fuji;
      assert.equal(owner.address, accounts[0]);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('MINT', async () => {
      const mintTransaction = await fuji.mint(owner.address, 10);
      const { tx, receipt } = mintTransaction;
      if (DEBUG) {
        console.log(
          `Mint Transaction: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }
      const balanceOfTransaction = await fuji.balanceOf(owner.address);
      const [balance] = balanceOfTransaction.words;
      owner.balance = utils.hexToNumber(balanceOfTransaction);
      expect(owner.balance).to.equal(balance);
    });
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {
      const testTransaction = await fuji.testFunction();
      if (DEBUG) {
        debugger;
      }
    });
  });
});
