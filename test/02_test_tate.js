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

const Tate = artifacts.require('Tate');

contract('Tate', (accounts) => {
  let owner = { balance: 0 },
    sender = { balance: 0, address: accounts[1] },
    receiver = { balance: 0, address: accounts[2] },
    user = { balance: 0, address: accounts[3] };
  let tate,
    tateMetadata = {};

  before(async () => {
    // These functions below only work if hardhat has compiled the abis
    // const temp = await hardhatEthers.getContractFactory('Tate');
    // const test = await temp.deploy('Tate', 'FUJI');

    // These functions all link to a different version of the Tate contract that's not on Ganache.
    // const TateDefaults = await Tate.defaults();
    // const TateAddress = await Tate.address;
    // const tateNew = await Tate.new('Tate', 'FUJI');
    // const tateDeployed = await Tate.deployed();

    tate = await Tate.at('0x188AC596a66fd69bB74D5b223FBe02471479D62F');

    owner.address = await tate.owner();

    tateMetadata.address = tate.address;
    tateMetadata.owner = owner.address;
    tateMetadata.name = await tate.name();
    tateMetadata.symbol = await tate.symbol();
    tateMetadata.decimals = utils.hexToNumber(await tate.decimals());
    tateMetadata.totalSupply = utils.hexToNumber(await tate.totalSupply());
  });

  describe('Deployment', async () => {
    it('DEPLOY', () => {
      const { address } = tate;
      assert.equal(owner.address, accounts[0]);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('MINT', async () => {
      const mintTransaction = await tate.mint(owner.address, 10);
      const { tx, receipt } = mintTransaction;
      if (DEBUG) {
        console.log(
          `Transaction: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }
      const balanceOfTransaction = await tate.balanceOf(owner.address);
      const [balance] = balanceOfTransaction.words;
      owner.balance = utils.hexToNumber(balanceOfTransaction);
      expect(owner.balance).to.equal(balance);
    });
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {
      const testTransaction = await tate.testFunction();
      if (DEBUG) {
        debugger;
      }
    });
  });
});
