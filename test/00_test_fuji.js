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

const Fuji = artifacts.require('Fuji');

contract('Fuji', (accounts) => {
  let owner = { balance: 0 },
    sender = { balance: 0, address: accounts[1] },
    receiver = { balance: 0, address: accounts[2] },
    user = { balance: 0, address: accounts[3] };
  let fuji,
    fujiMetadata = {},
    contractAddress;

  before(async () => {
    // These functions below only work if hardhat has compiled the abis
    // const temp = await hardhatEthers.getContractFactory('Fuji');
    // const test = await temp.deploy('Fuji', 'FUJI');

    // These functions all link to a different version of the Fuji contract that's not on Ganache.
    // const FujiDefaults = await Fuji.defaults();
    // const FujiAddress = await Fuji.address;
    // const fujiNew = await Fuji.new('Fuji', 'FUJI');
    // const fujiDeployed = await Fuji.deployed();

    fuji = await Fuji.at('0x0eA5fa02b89e2c10c5e1b5CF5A254965007e9DC0');

    owner.address = await fuji.owner();

    fujiMetadata.address = fuji.address;
    fujiMetadata.owner = owner.address;
    fujiMetadata.name = await fuji.name();
    fujiMetadata.symbol = await fuji.symbol();
    fujiMetadata.decimals = utils.hexToNumber(await fuji.decimals());
    fujiMetadata.totalSupply = utils.hexToNumber(await fuji.totalSupply());
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
          `Transaction: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }
      const balanceOfTransaction = await fuji.balanceOf(owner.address);
      const [balance] = balanceOfTransaction.words;
      owner.balance = utils.hexToNumber(balanceOfTransaction);
      if (DEBUG) {
        debugger;
      }
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
