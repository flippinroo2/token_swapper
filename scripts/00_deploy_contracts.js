const TokenInterface = require('../classes/TokenInterface.js');

const DEBUG = false;

const { ethers } = hre;

const { getContractFactory, getSigners } = ethers;

const Moralis = require('Moralis');
// const { ACL, Analytics, AnonymousUtils, Cloud, CLP, Config, FacebookUtils, File, Plugins, Polygon, Query, Role, Schema, Session, Storag, UI, User, Web3, Web3API } = require('Moralis');

const { eth, utils } = web3;

let Factory, Swap, Token, Wrapper;

let fuji,
  fujiInterface,
  fujiMetadata,
  fujiTateSwap,
  fujiTateSwapMetadata = { user1: {}, user2: {} },
  haku,
  hakuInterface,
  hakuMetadata,
  hakuTateSwap,
  hakuTateSwapMetadata = { user1: {}, user2: {} },
  owner = {
    name: 'owner',
    fujiAllowance: 0,
    hakuAllowance: 0,
    tateAllowance: 0,
  },
  tate,
  tateInterface,
  tateMetadata,
  tokenFactory,
  tokenFactoryMetadata = {
    name: 'tokenMetadata',
    fujiAllowance: 0,
    fujiBalance: 0,
    hakuAllowance: 0,
    hakuBalance: 0,
    tateAllowance: 0,
    tateBalance: 0,
  },
  user = {
    name: 'user',
    fujiAllowance: 0,
    fujiBalance: 0,
    hakuAllowance: 0,
    hakuBalance: 0,
    tateAllowance: 0,
    tateBalance: 0,
  },
  wrapper,
  wrapperMetadata = {
    admin: {},
    name: 'wrapper',
    fujiAllowance: 0,
    fujiBalance: 0,
    hakuAllowance: 0,
    hakuBalance: 0,
    tateAllowance: 0,
    tateBalance: 0,
  };

if (DEBUG) {
  debugger;
}
function logAccounts() {
  if (DEBUG) {
    debugger;
  }

  console.log('\n\nBALANCES:');
  console.log(
    `fujiAdmin: ${fujiMetadata.admin.balance}\tfujiMetadata: ${fujiMetadata.balance}\thakuAdmin: ${hakuMetadata.admin.balance}\thakuMetadata: ${hakuMetadata.balance}\towner: ${owner.balance}\treceiver: ${receiver.balance}\tsender: ${sender.balance}\ttateAdmin: ${tateMetadata.admin.balance}\ttateMetadata: ${tateMetadata.balance}\tuser: ${user.balance}`,
  );
  console.log('\nALLOWANCES:');
  console.log(
    `fujiAdmin: ${fujiMetadata.admin.fujiAllowance}\tfujiMetadata: ${fujiMetadata.fujiAllowance}\thakuAdmin: ${hakuMetadata.admin.fujiAllowance}\thakuMetadata: ${hakuMetadata.fujiAllowance}\towner: ${owner.fujiAllowance}\treceiver: ${receiver.fujiAllowance}\tsender: ${sender.fujiAllowance}\ttateAdmin: ${tateMetadata.admin.fujiAllowance}\ttateMetadata: ${tateMetadata.fujiAllowance}\tuser: ${user.fujiAllowance}`,
  );
}
async function main() {
  const signers = await getSigners();
  const [signer] = signers;

  owner.address = signer.address;
  user.address = signers[1].address;

  if (DEBUG) {
    debugger;
  }

  await refreshData(fujiInterface, fujiMetadata);
  await refreshData(hakuInterface, hakuMetadata);
  await refreshData(tateInterface, tateMetadata);

  await (async () => {
    let adminObject = { address: wrapperMetadata.address, name: 'admin' },
      ownerObject = fujiTateSwapMetadata.user1,
      userObject = fujiTateSwapMetadata.user2,
      factoryObject = { address: tokenFactoryMetadata.address },
      fujiObject = { addres: fujiMetadata.address },
      tateObject = { address: tateMetadata.address },
      swapObject = {
        fujiTateSwap: {
          address: fujiTateSwap.address,
        },
        hakuTateSwap: {
          address: hakuTateSwap.address,
        },
      };

    let dataVariable;

    async function refreshObjects() {
      dataVariable = await fuji.balanceOf(adminObject.address);
      adminObject.fujiBalance = dataVariable.toNumber();

      dataVariable = await fuji.balanceOf(ownerObject.address);
      ownerObject.fujiBalance = dataVariable.toNumber();

      dataVariable = await fuji.balanceOf(userObject.address);
      userObject.fujiBalance = dataVariable.toNumber();

      dataVariable = await fuji.balanceOf(factoryObject.address);
      factoryObject.fujiBalance = dataVariable.toNumber();

      dataVariable = await fuji.balanceOf(fujiMetadata.address);
      fujiObject.fujiBalance = dataVariable.toNumber();

      dataVariable = await fuji.balanceOf(tateMetadata.address);
      tateObject.fujiBalance = dataVariable.toNumber();

      dataVariable = await fuji.balanceOf(fujiTateSwap.address);
      swapObject.fujiTateSwap.fujiBalance = dataVariable.toNumber();

      // BREAK

      dataVariable = await haku.balanceOf(adminObject.address);
      adminObject.hakuBalance = dataVariable.toNumber();

      dataVariable = await haku.balanceOf(ownerObject.address);
      ownerObject.hakuBalance = dataVariable.toNumber();

      dataVariable = await haku.balanceOf(userObject.address);
      userObject.hakuBalance = dataVariable.toNumber();

      dataVariable = await haku.balanceOf(factoryObject.address);
      factoryObject.hakuBalance = dataVariable.toNumber();

      dataVariable = await haku.balanceOf(fujiMetadata.address);
      fujiObject.hakuBalance = dataVariable.toNumber();

      dataVariable = await haku.balanceOf(tateMetadata.address);
      tateObject.hakuBalance = dataVariable.toNumber();

      dataVariable = await haku.balanceOf(fujiTateSwap.address);
      swapObject.fujiTateSwap.hakuBalance = dataVariable.toNumber();

      // BREAK

      dataVariable = await tate.balanceOf(adminObject.address);
      adminObject.tateBalance = dataVariable.toNumber();

      dataVariable = await tate.balanceOf(ownerObject.address);
      ownerObject.tateBalance = dataVariable.toNumber();

      dataVariable = await tate.balanceOf(userObject.address);
      userObject.tateBalance = dataVariable.toNumber();

      dataVariable = await tate.balanceOf(factoryObject.address);
      factoryObject.tateBalance = dataVariable.toNumber();

      dataVariable = await tate.balanceOf(fujiMetadata.address);
      fujiObject.tateBalance = dataVariable.toNumber();

      dataVariable = await tate.balanceOf(tateMetadata.address);
      tateObject.tateBalance = dataVariable.toNumber();

      dataVariable = await tate.balanceOf(fujiTateSwap.address);
      swapObject.fujiTateSwap.tateBalance = dataVariable.toNumber();

      // BREAK
    }

    async function transfer() {
      dataVariable = await fuji.transferFrom(
        tokenFactoryMetadata.address,
        owner.address,
        7,
      );
      dataVariable = await haku.transferFrom(
        tokenFactoryMetadata.address,
        owner.address,
        4,
      );
      dataVariable = await tate.transferFrom(
        tokenFactoryMetadata.address,
        user.address,
        11,
      );
    }

    async function swap() {
      const fujiTateSwapTransaction = await fujiTateSwap._swap(7);
      const hakuTateSwapTransaction = await hakuTateSwap._swap(4);
    }

    await refreshObjects();
    debugger;
    await transfer();
    await refreshObjects();
    debugger;
    await swap();
    await refreshObjects();
    debugger;
  })();

  if (DEBUG) {
    // console.log(
    //   `Wrapper\n_address1 = ${wrapperAddress1}\n_address2 = ${wrapperAddress2}\nfuji address = ${fuji.address}\nhaku address = ${haku.address}\ntate address = ${tate.address}`,
    // );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
