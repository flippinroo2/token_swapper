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
  let fuji, contractAddress;
  let test;

  before(async () => {
    // These functions below only work if hardhat has compiled the abis
    // const temp = await hardhatEthers.getContractFactory('Fuji');
    // test = await temp.deploy('Fuji', 'FUJI');

    fuji = await Fuji.deployed();

    contractAddress = fuji.address;
    console.log('fuji address: %s', contractAddress);

    owner.address = await fuji.owner();
    console.log('owner address: %s', owner.address);
  });

  describe('Deployment', async () => {
    it('DEPLOY', () => {
      assert.equal(owner.address, accounts[0]);
      assert.notEqual(contractAddress, 0x0);
      assert.notEqual(contractAddress, '');
      assert.notEqual(contractAddress, null);
      assert.notEqual(contractAddress, undefined);
    });

    it('MINT', async () => {
      const mintTransaction = await fuji.mint(owner.address, 10);
      const balanceOfTransaction = await fuji.balanceOf(owner.address);
      owner.balance = utils.hexToNumber(balanceOfTransaction);
      if (DEBUG) {
        debugger;
      }
      expect(owner.balance).to.equal(10);
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
