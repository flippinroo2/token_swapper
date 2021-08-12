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
const Haku = artifacts.require('Haku');
// const Tate = artifacts.require('Tate');

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
      // debugger;
    }
    const metadata = {
      address: token.address,
      owner: await token.owner(),
      name: await token.name(),
      symbol: await token.symbol(),
      decimals: utils.hexToNumber(await token.decimals()),
      totalSupply: utils.hexToNumber(await token.totalSupply()),
    };
    if (DEBUG) {
      // debugger;
    }
    return metadata;
  }

  before(async (error) => {
    const ethAccounts = await eth.getAccounts();
    owner.address = ethAccounts[0];
    sender.address = ethAccounts[1];
    receiver.address = ethAccounts[2];
    user.address = ethAccounts[3];

    fuji = await Fuji.at('0x5c1A66D05D33E4b08Ed63eE46a99011fBbF2eCE1');
    haku = await Haku.at('0x5124566b479cDBA5b85Db6F605A8e48D814EAC47');
    // tate = await Tate.at('0x00Bc46dC89E2425FEc12f1842c31DbaFfd09fa59');

    // Need to increase timeout for these.
    // fujiMetadata = await fillMetadata(fuji);
    // hakuMetadata = await fillMetadata(haku);
    // tateMetadata = await fillMetadata(tate);
  });

  describe('Deployment', async () => {
    it('MINT', async () => {
      if (DEBUG) {
        debugger;
      }
      const mintFujiTransaction = await fuji.mint(owner.address, 10);
      const { tx, receipt } = mintFujiTransaction;
      if (DEBUG) {
        console.log(
          `Mint Transaction: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
        );
      }
      if (DEBUG) {
        debugger;
      }
      // const balanceOfTransaction = await fuji.balanceOf(owner.address);
      // const [balance] = balanceOfTransaction.words;
      // owner.balance = utils.hexToNumber(balanceOfTransaction);
      // expect(owner.balance).to.equal(balance);
    });
  });

  describe('Testing', async () => {
    it('SWAP', async () => {
      if (DEBUG) {
        debugger;
      }
    });

    it('DEBUG', async () => {
      if (DEBUG) {
        debugger;
      }
    });
  });
});
