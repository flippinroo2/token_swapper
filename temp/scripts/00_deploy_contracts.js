const TokenInterface = require('../../classes/TokenInterface.js');

const DEBUG = false;

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

function logTransaction(transactionHash, blockNumber, from, gasUsed, to) {
  if (DEBUG) {
    debugger;
  }
  console.log(
    `Transaction: ${transactionHash}\nFrom: ${from}\nTo: ${to}\nBlock #: ${blockNumber}\nGas: ${gasUsed}`,
  );
}

async function refreshBalances(token, metadata) {
  if (DEBUG) {
    debugger;
  }

  const tokenAddress = token.address;
  const tokenName = metadata.name;

  const adminAddress = metadata.admin.address;

  const propertyString = `${tokenName.toLowerCase()}Balance`;

  metadata[propertyString] = await token.getBalance(tokenAddress);
  metadata.admin[propertyString] = await token.getBalance(adminAddress);
  owner[propertyString] = await token.getBalance(owner.address);
  sender[propertyString] = await token.getBalance(sender.address);
  receiver[propertyString] = await token.getBalance(receiver.address);
  user[propertyString] = await token.getBalance(user.address);

  if (DEBUG) {
    logAccounts();
  }
}

async function refreshAllowance(token, metadata, account) {
  if (DEBUG) {
    debugger;
  }

  const tokenAddress = token.address;
  const adminAddress = metadata.admin.address;
  const accountAddress = account.address;
  const propertyString = `${account.name}Allowance`;

  const tokenAllowance = await token.getAllowance(tokenAddress, accountAddress);
  metadata[propertyString] = tokenAllowance;
  const adminAllowance = await token.getAllowance(adminAddress, accountAddress);
  metadata.admin[propertyString] = adminAllowance;
}

async function refreshAllowances(token, metadata) {
  await refreshAllowance(token, metadata, owner);
  await refreshAllowance(token, metadata, sender);
  await refreshAllowance(token, metadata, receiver);
  await refreshAllowance(token, metadata, user);
  await refreshAllowance(token, metadata, tokenFactory);
  await refreshAllowance(token, metadata, wrapper);
  await refreshAllowance(token, metadata, fujiTateSwap);
  await refreshAllowance(token, metadata, hakuTateSwap);
}

function parseTransactionData({
  blockHash,
  blockNumber,
  confirmations,
  events,
  from,
  gasUsed,
  logs,
  status,
  to,
  transactionHash,
  transactionIndex,
  type,
}) {
  if (DEBUG) {
    // logTransaction(transactionHash, blockNumber, from, gasUsed, to);
    debugger;
  }
  let eventObject = {};
  events.forEach((element, index, array) => {
    // console.log('element:');
    // console.dir(element);
    // console.log(`index ${index}`);
    if (index === 0) {
    }
    const eventProperty = element.hasOwnProperty('event');
    const argsProperty = element.hasOwnProperty('args');
    // const eventString = `event${index}`;
    if (eventProperty) {
      let eventArguments = {};
      if (argsProperty) {
        eventArguments.address = element.args[0];
        eventArguments.name = element.args[1].hash;
        eventArguments.symbol = element.args[2].hash;
        eventArguments.decimals = element.args[3];
        eventArguments.totalSupply = element.args[4].toNumber();
      }
      eventObject[element.event] = {
        signature: element.eventSignature,
        arguments: eventArguments,
      };
    }
    if (index === array.length - 1) {
      eventObject.data = element.data;
    }
  });
  return {
    from,
    to,
    transactionIndex,
    transactionHash,
    gasUsed: gasUsed.toNumber(),
    type,
    status,
    blockNumber,
    blockHash,
    confirmations,
    events: eventObject,
  };
}

async function approveAll(token, metadata) {
  // Could add an "accounts" parameter so we don't have to touch state variables.
  const { admin, totalSupply } = metadata;

  if (DEBUG) {
    debugger;
  }

  await token.approve(token.address, admin.address, totalSupply);
  await token.approve(token.address, user.address, totalSupply);
  await token.approve(token.address, owner.address, totalSupply);
  await token.approve(token.address, sender.address, totalSupply);
  await token.approve(token.address, receiver.address, totalSupply);
  await token.approve(token.address, tokenFactory.address, totalSupply);
  await token.approve(token.address, wrapper.address, totalSupply);
  await token.approve(token.address, fujiTateSwap.address, totalSupply);
  await token.approve(token.address, hakuTateSwap.address, totalSupply);

  // approve(address owner, address spender, uint256 amount)
  const approvalExample = await token.approve(
    admin.address,
    token.address,
    totalSupply,
  ); // This returns a transaction response. (Not a receipt yet until it has confirmations.)
  const approvalReceiptExample = await approvalExample.wait(); // The wait() function returns a transaction receipt.

  await token.approve(admin.address, owner.address, totalSupply);
  await token.approve(admin.address, sender.address, totalSupply);
  await token.approve(admin.address, receiver.address, totalSupply);
  await token.approve(admin.address, user.address, totalSupply);
  await token.approve(admin.address, tokenFactory.address, totalSupply);
  await token.approve(admin.address, wrapper.address, totalSupply);
  await token.approve(admin.address, fujiTateSwap.address, totalSupply);
  await token.approve(admin.address, hakuTateSwap.address, totalSupply);

  await token.approve(owner.address, token.address, totalSupply);
  await token.approve(owner.address, admin.address, totalSupply);
  await token.approve(owner.address, sender.address, totalSupply);
  await token.approve(owner.address, receiver.address, totalSupply);
  await token.approve(owner.address, user.address, totalSupply);
  await token.approve(owner.address, tokenFactory.address, totalSupply);
  await token.approve(owner.address, wrapper.address, totalSupply);
  await token.approve(owner.address, fujiTateSwap.address, totalSupply);
  await token.approve(owner.address, hakuTateSwap.address, totalSupply);

  await token.approve(sender.address, token.address, totalSupply);
  await token.approve(sender.address, admin.address, totalSupply);
  await token.approve(sender.address, owner.address, totalSupply);
  await token.approve(sender.address, receiver.address, totalSupply);
  await token.approve(sender.address, user.address, totalSupply);
  await token.approve(sender.address, tokenFactory.address, totalSupply);
  await token.approve(sender.address, wrapper.address, totalSupply);
  await token.approve(sender.address, fujiTateSwap.address, totalSupply);
  await token.approve(sender.address, hakuTateSwap.address, totalSupply);

  await token.approve(receiver.address, token.address, totalSupply);
  await token.approve(receiver.address, admin.address, totalSupply);
  await token.approve(receiver.address, owner.address, totalSupply);
  await token.approve(receiver.address, sender.address, totalSupply);
  await token.approve(receiver.address, user.address, totalSupply);
  await token.approve(receiver.address, tokenFactory.address, totalSupply);
  await token.approve(receiver.address, wrapper.address, totalSupply);
  await token.approve(receiver.address, fujiTateSwap.address, totalSupply);
  await token.approve(receiver.address, hakuTateSwap.address, totalSupply);

  await token.approve(user.address, token.address, totalSupply);
  await token.approve(user.address, admin.address, totalSupply);
  await token.approve(user.address, owner.address, totalSupply);
  await token.approve(user.address, sender.address, totalSupply);
  await token.approve(user.address, receiver.address, totalSupply);
  await token.approve(user.address, tokenFactory.address, totalSupply);
  await token.approve(user.address, wrapper.address, totalSupply);
  await token.approve(user.address, fujiTateSwap.address, totalSupply);
  await token.approve(user.address, hakuTateSwap.address, totalSupply);

  await token.approve(tokenFactory.address, token.address, totalSupply);
  await token.approve(tokenFactory.address, admin.address, totalSupply);
  await token.approve(tokenFactory.address, sender.address, totalSupply);
  await token.approve(tokenFactory.address, receiver.address, totalSupply);
  await token.approve(tokenFactory.address, user.address, totalSupply);
  await token.approve(tokenFactory.address, wrapper.address, totalSupply);
  await token.approve(tokenFactory.address, fujiTateSwap.address, totalSupply);
  await token.approve(tokenFactory.address, hakuTateSwap.address, totalSupply);

  await token.approve(wrapper.address, token.address, totalSupply);
  await token.approve(wrapper.address, admin.address, totalSupply);
  await token.approve(wrapper.address, sender.address, totalSupply);
  await token.approve(wrapper.address, receiver.address, totalSupply);
  await token.approve(wrapper.address, user.address, totalSupply);
  await token.approve(wrapper.address, tokenFactory.address, totalSupply);
  await token.approve(wrapper.address, fujiTateSwap.address, totalSupply);
  await token.approve(wrapper.address, hakuTateSwap.address, totalSupply);

  await token.approve(fujiTateSwap.address, token.address, totalSupply);
  await token.approve(fujiTateSwap.address, admin.address, totalSupply);
  await token.approve(fujiTateSwap.address, sender.address, totalSupply);
  await token.approve(fujiTateSwap.address, receiver.address, totalSupply);
  await token.approve(fujiTateSwap.address, user.address, totalSupply);
  await token.approve(fujiTateSwap.address, tokenFactory.address, totalSupply);
  await token.approve(fujiTateSwap.address, wrapper.address, totalSupply);
  await token.approve(fujiTateSwap.address, hakuTateSwap.address, totalSupply);

  await token.approve(hakuTateSwap.address, token.address, totalSupply);
  await token.approve(hakuTateSwap.address, admin.address, totalSupply);
  await token.approve(hakuTateSwap.address, sender.address, totalSupply);
  await token.approve(hakuTateSwap.address, receiver.address, totalSupply);
  await token.approve(hakuTateSwap.address, user.address, totalSupply);
  await token.approve(hakuTateSwap.address, tokenFactory.address, totalSupply);
  await token.approve(hakuTateSwap.address, fujiTateSwap.address, totalSupply);
  await token.approve(hakuTateSwap.address, wrapper.address, totalSupply);
}

async function refreshData(token, metadata) {
  if (DEBUG) {
    debugger;
  }

  const { admin, totalSupply } = metadata;

  await approveAll(token, metadata);

  await refreshAllowances(token, metadata);

  await refreshBalances(token, metadata);

  if (DEBUG) {
    debugger;
  }
}

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
  sender = {
    name: 'sender',
    fujiAllowance: 0,
    fujiBalance: 0,
    hakuAllowance: 0,
    hakuBalance: 0,
    tateAllowance: 0,
    tateBalance: 0,
  },
  receiver = {
    name: 'receiver',
    fujiAllowance: 0,
    fujiBalance: 0,
    hakuAllowance: 0,
    hakuBalance: 0,
    tateAllowance: 0,
    tateBalance: 0,
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

async function main() {
  const { artifacts, config, ethers, network, waffle, web3 } = hre;
  const { getContractFactory, getSigners } = ethers;
  const { eth, utils } = web3;

  const signers = await getSigners();
  const [signer] = signers;

  owner.address = signer.address;
  sender.address = signers[1].address;
  receiver.address = signers[2].address;
  user.address = signers[3].address;

  // console.log('Account balance:', (await owner.getBalance()).toString());

  const Factory = await getContractFactory('TokenFactory');
  tokenFactory = await Factory.deploy();
  tokenFactoryMetadata.address = tokenFactory.address;
  tokenFactoryMetadata.admin = await tokenFactory._admin();

  const Token = await getContractFactory('Token'); // Might not need this.

  const Wrapper = await getContractFactory('Wrapper');
  wrapper = await Wrapper.deploy(owner.address, user.address);
  // const wrapper = await Wrapper.at();
  // const otherWrapper = await wrapper.deployed();

  wrapperMetadata.address = wrapper.address;
  wrapperMetadata.admin = await wrapper._admin();
  wrapperMetadata.owner = await wrapper._address1();
  wrapperMetadata.user = await wrapper._address2();

  // const Swap = await getContractFactory('../artifacts/contracts/Swap.sol:Swap');
  // const Swap = await getContractFactory('contracts/Wrapper.sol:Swap');
  const Swap = await getContractFactory('Swap');

  // IMPORTANT!!!
  // This is the proper way to listen for events!!!
  // tokenFactory.on('TokenCreated', (address, [indexes], ...paremeters) => {
  //   debugger;
  //   console.log(`TokenCreated:\nAddress - ${test}`);
  // });
  // IMPORTANT!!!

  const createFujiTransaction = await tokenFactory.createToken(
    'Fuji',
    'FUJI',
    18,
    11000,
  );
  const fujiTransactionData = parseTransactionData(
    await createFujiTransaction.wait(),
  );

  // REWORK THE WAY TOKENS ARE CREATED BY USING THE EVENT LISTENER INSTEAD OF THIS.
  fuji = await Token.attach(
    fujiTransactionData.events.TokenCreated.arguments.address,
  ); // Using this attach method is basically the same as calling the "Contract" constructor with this address and the interface & signerOrProvider passed in.

  // const fuji2 = await Token.connect(
  //   fujiTransactionData.events.TokenCreated.arguments.address,
  // );

  fujiInterface = new TokenInterface(fuji);
  fujiMetadata = await fujiInterface.getMetadata();

  const createHakuTransaction = await tokenFactory.createToken(
    'Haku',
    'HAKU',
    18,
    10500,
  );
  const hakuTransactionData = parseTransactionData(
    await createHakuTransaction.wait(),
  );
  haku = await Token.attach(
    hakuTransactionData.events.TokenCreated.arguments.address,
  );
  hakuInterface = new TokenInterface(haku);
  hakuMetadata = await hakuInterface.getMetadata();

  const createTateTransaction = await tokenFactory.createToken(
    'Tate',
    'TATE',
    18,
    10000,
  );

  const tateTransactionData = parseTransactionData(
    await createTateTransaction.wait(),
  );
  tate = await Token.attach(
    tateTransactionData.events.TokenCreated.arguments.address,
  );
  tateInterface = new TokenInterface(tate);
  tateMetadata = await tateInterface.getMetadata();

  const createFujiSwap = await wrapper.createFujiSwap(
    fuji.address,
    tate.address,
  );
  await createFujiSwap.wait();

  const createHakuSwap = await wrapper.createHakuSwap(
    haku.address,
    tate.address,
  );
  await createHakuSwap.wait();

  fujiTateSwap = Swap.attach(await wrapper._fujiTateSwapper());

  fujiTateSwapMetadata.address = await fujiTateSwap.address;
  fujiTateSwapMetadata.token1 = await fujiTateSwap._token1();
  fujiTateSwapMetadata.user1 = {
    name: 'owner',
    address: await fujiTateSwap._user1(),
  };
  let tokenAllowance = await fujiTateSwap._token1Allowance();
  fujiTateSwapMetadata.user1.fujiAllowance = tokenAllowance.toNumber();

  fujiTateSwapMetadata.token2 = await fujiTateSwap._token2();
  fujiTateSwapMetadata.user2 = {
    name: 'user',
    address: await fujiTateSwap._user2(),
  };
  tokenAllowance = await fujiTateSwap._token2Allowance();
  fujiTateSwapMetadata.user2.tateAllowance = tokenAllowance.toNumber();

  hakuTateSwap = Swap.attach(await wrapper._hakuTateSwapper());

  hakuTateSwapMetadata.token1 = await hakuTateSwap._token1();
  hakuTateSwapMetadata.user1 = {
    name: 'owner',
    address: await hakuTateSwap._user1(),
  };
  tokenAllowance = await hakuTateSwap._token1Allowance();
  hakuTateSwapMetadata.user1.hakuAllowance = tokenAllowance.toNumber();

  hakuTateSwapMetadata.token2 = await hakuTateSwap._token2();
  hakuTateSwapMetadata.user2 = {
    name: 'user',
    address: await hakuTateSwap._user2(),
  };
  tokenAllowance = await hakuTateSwap._token2Allowance();
  hakuTateSwapMetadata.user2.tateAllowance = tokenAllowance.toNumber();

  if (DEBUG) {
    console.log(
      `\n\nOwner Address: ${owner.address}\nSender Address:${sender.address}\nReceiver Address: ${receiver.address}\nUser Address: ${user.address}\nWrapper Address: ${wrapper.address}\nToken Factory Address: ${tokenFactory.address}\nFuji Address: ${fuji.address}\nHaku Address: ${haku.address}\nTate Address: ${tate.address}\nfujiTateSwap Address: ${fujiTateSwap.address}\nhakuTateSwap Address: ${hakuTateSwap.address}\n\n`,
    );
  }

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
      fujiObject = {},
      tateObject = {},
      swapObject = {
        fujiTateSwap: {
          address: fujiTateSwap.address,
        },
        hakuTateSwap: {
          address: hakuTateSwap.address,
        },
      };

    let dataVariable;

    async function fillFujiBalances() {
      dataVariable = await fuji.balanceOf(adminObject.address);
      adminObject.fujiBalance = dataVariable.toNumber();

      dataVariable = await fuji.balanceOf(ownerObject.address);
      ownerObject.fujiBalance = dataVariable.toNumber();

      dataVariable = await fuji.balanceOf(userObject.address);
      userObject.fujiBalance = dataVariable.toNumber();

      dataVariable = await fuji.balanceOf(fujiMetadata.address);
      fujiObject.fujiBalance = dataVariable.toNumber();

      dataVariable = await fuji.balanceOf(tateMetadata.address);
      tateObject.fujiBalance = dataVariable.toNumber();

      dataVariable = await fuji.balanceOf(fujiTateSwap.address);
      swapObject.fujiTateSwap.fujiBalance = dataVariable.toNumber();
    }

    async function fillTateBalances() {
      dataVariable = await tate.balanceOf(adminObject.address);
      adminObject.tateBalance = dataVariable.toNumber();

      dataVariable = await tate.balanceOf(ownerObject.address);
      ownerObject.tateBalance = dataVariable.toNumber();

      dataVariable = await tate.balanceOf(userObject.address);
      userObject.tateBalance = dataVariable.toNumber();

      dataVariable = await tate.balanceOf(fujiMetadata.address);
      fujiObject.tateBalance = dataVariable.toNumber();

      dataVariable = await tate.balanceOf(tateMetadata.address);
      tateObject.tateBalance = dataVariable.toNumber();

      dataVariable = await tate.balanceOf(fujiTateSwap.address);
      swapObject.fujiTateSwap.tateBalance = dataVariable.toNumber();
    }

    await fillFujiBalances();
    await fillTateBalances();

    dataVariable = await fuji.transferFrom(
      tokenFactoryMetadata.address,
      owner.address,
      17,
    );
    dataVariable = await haku.transferFrom(
      tokenFactoryMetadata.address,
      owner.address,
      24,
    );
    dataVariable = await tate.transferFrom(
      tokenFactoryMetadata.address,
      user.address,
      33,
    );

    // debugger;
    const fujiTateSwapTransaction = await fujiTateSwap._swap(7);
    // debugger;
    const hakuTateSwapTransaction = await hakuTateSwap._swap(3);
  })();

  await refreshData(fujiInterface, fujiMetadata);
  await refreshData(hakuInterface, hakuMetadata);
  await refreshData(tateInterface, tateMetadata);

  debugger;

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