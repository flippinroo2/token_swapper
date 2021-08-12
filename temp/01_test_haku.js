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

const Haku = artifacts.require('Haku');

contract('Haku', (accounts) => {
  let owner = { balance: 0 },
    sender = { balance: 0, address: accounts[1] },
    receiver = { balance: 0, address: accounts[2] },
    user = { balance: 0, address: accounts[3] };
  let haku,
    hakuMetadata = {};

  before(async () => {
    // These functions below only work if hardhat has compiled the abis
    // const temp = await hardhatEthers.getContractFactory('Haku');
    // const test = await temp.deploy('Haku', 'FUJI');

    // These functions all link to a different version of the Haku contract that's not on Ganache.
    // const HakuDefaults = await Haku.defaults();
    // const HakuAddress = await Haku.address;
    // const hakuNew = await Haku.new('Haku', 'FUJI');
    // const hakuDeployed = await Haku.deployed();

    haku = await Haku.at('0x5124566b479cDBA5b85Db6F605A8e48D814EAC47');

    owner.address = await haku.owner();

    hakuMetadata.address = haku.address;
    hakuMetadata.owner = owner.address;
    hakuMetadata.name = await haku.name();
    hakuMetadata.symbol = await haku.symbol();
    hakuMetadata.decimals = utils.hexToNumber(await haku.decimals());
    hakuMetadata.totalSupply = utils.hexToNumber(await haku.totalSupply());
  });

  describe('Deployment', async () => {
    it('DEPLOY', () => {
      const { address } = haku;
      assert.equal(owner.address, accounts[0]);
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it('MINT', async () => {
      const mintTransaction = await haku.mint(owner.address, 10);
      const { tx, receipt } = mintTransaction;
      if (DEBUG) {
        console.log(
          `Mint Transaction: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }
      const balanceOfTransaction = await haku.balanceOf(owner.address);
      const [balance] = balanceOfTransaction.words;
      owner.balance = utils.hexToNumber(balanceOfTransaction);
      expect(owner.balance).to.equal(balance);
    });
  });

  describe('Testing', async () => {
    it('DEBUG', async () => {
      const testTransaction = await haku.testFunction();
      if (DEBUG) {
        debugger;
      }
    });
  });
});
