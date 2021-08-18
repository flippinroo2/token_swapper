const TokenInterface = require('../classes/TokenInterface.js');

const DEBUG = true;

function logAccounts() {
  console.log('\n\nBALANCES:');
  console.log(
    `fujiAdmin: ${fujiMetadata.admin.balance}\tfujiMetadata: ${fujiMetadata.balance}\thakuAdmin: ${hakuMetadata.admin.balance}\thakuMetadata: ${hakuMetadata.balance}\towner: ${owner.balance}\treceiver: ${receiver.balance}\tsender: ${sender.balance}\ttateAdmin: ${tateMetadata.admin.balance}\ttateMetadata: ${tateMetadata.balance}\tuser: ${user.balance}`,
  );
  console.log('\nALLOWANCES:');
  console.log(
    `fujiAdmin: ${fujiMetadata.admin.ownerAllowance}\tfujiMetadata: ${fujiMetadata.ownerAllowance}\thakuAdmin: ${hakuMetadata.admin.ownerAllowance}\thakuMetadata: ${hakuMetadata.ownerAllowance}\towner: ${owner.ownerAllowance}\treceiver: ${receiver.ownerAllowance}\tsender: ${sender.ownerAllowance}\ttateAdmin: ${tateMetadata.admin.ownerAllowance}\ttateMetadata: ${tateMetadata.ownerAllowance}\tuser: ${user.ownerAllowance}`,
  );
}

function logTransaction(transactionHash, blockNumber, from, gasUsed, to) {
  console.log(
    `Transaction: ${transactionHash}\nFrom: ${from}\nTo: ${to}\nBlock #: ${blockNumber}\nGas: ${gasUsed}`,
  );
}

async function refreshBalances(token, metadata) {
  const tokenBalanceTransaction = await token.balanceOf(token.address);
  metadata.balance = tokenBalanceTransaction.toNumber();

  const adminBalanceTransaction = await token.balanceOf(metadata.admin.address);
  metadata.admin.balance = adminBalanceTransaction.toNumber();

  const ownerBalanceTransaction = await token.balanceOf(owner.address);
  owner.balance = ownerBalanceTransaction.toNumber();

  const senderBalanceTransaction = await token.balanceOf(sender.address);
  sender.balance = senderBalanceTransaction.toNumber();

  const receiverBalanceTransaction = await token.balanceOf(receiver.address);
  receiver.balance = receiverBalanceTransaction.toNumber();

  const userBalanceTransaction = await token.balanceOf(user.address);
  user.balance = userBalanceTransaction.toNumber();

  if (DEBUG) {
    logAccounts();
  }
}

async function refreshAllowances(token, metadata, account) {
  const propertyString = `${account.name}Allowance`;

  const tokenAllowanceTransaction = await token.allowance(
    owner.address,
    token.address,
  );
  metadata[propertyString] = tokenAllowanceTransaction.toNumber();

  const adminAllowanceTransaction = await token.allowance(
    owner.address,
    metadata.admin.address,
  );
  metadata.admin[propertyString] = adminAllowanceTransaction.toNumber();

  const ownerAllowanceTransaction = await token.allowance(
    metadata.admin.address,
    owner.address,
  );
  owner[propertyString] = ownerAllowanceTransaction.toNumber();

  const senderAllowanceTransaction = await token.allowance(
    owner.address,
    sender.address,
  );
  sender[propertyString] = senderAllowanceTransaction.toNumber();

  const receiverAllowanceTransaction = await token.allowance(
    owner.address,
    receiver.address,
  );
  receiver[propertyString] = receiverAllowanceTransaction.toNumber();

  const userAllowanceTransaction = await token.allowance(
    owner.address,
    user.address,
  );
  user[propertyString] = userAllowanceTransaction.toNumber();
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
    logTransaction(transactionHash, blockNumber, from, gasUsed, to);
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

async function tokenTransactions(token, metadata) {
  metadata.admin.address = await token.getAdmin();

  const testMetadata = await transactionTest.getMetadata();
  debugger;

  const totalSupplyTransaction = await token.totalSupply();
  const totalSupply = totalSupplyTransaction.toNumber();

  const approvalTransaction = await token.approve(
    metadata.admin.address,
    totalSupply,
  );
  const adminApproval = approvalTransaction.value.toNumber();

  const approvalFromTransaction = await token.approveFrom(
    metadata.admin.address,
    owner.address,
    totalSupply,
  );
  await refreshAllowances(token, metadata, owner);

  await refreshBalances(token, metadata);

  // const transferTransaction = await token.transfer();
  await token.transferFrom(metadata.admin.address, owner.address, 100);
  await token.transferFrom(metadata.admin.address, sender.address, 200);
  await token.transferFrom(metadata.admin.address, receiver.address, 500);
  await token.transferFrom(metadata.admin.address, user.address, 50);

  await refreshBalances(token, metadata);
}

let fujiMetadata = {
    admin: { balance: 0, ownerAllowance: 0 },
    balance: 0,
    name: 'fuji',
    ownerAllowance: 0,
  },
  hakuMetadata = {
    admin: { balance: 0, ownerAllowance: 0 },
    balance: 0,
    name: 'haku',
    ownerAllowance: 0,
  },
  owner = { balance: 0, name: 'owner', ownerAllowance: 0 },
  sender = { balance: 0, name: 'sender', ownerAllowance: 0 },
  receiver = { balance: 0, name: 'receiver', ownerAllowance: 0 },
  tateMetadata = {
    admin: { balance: 0, ownerAllowance: 0 },
    balance: 0,
    name: 'tate',
    ownerAllowance: 0,
  },
  user = { balance: 0, name: 'user', ownerAllowance: 0 };

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

  const Token = await getContractFactory('Token'); // Might not need this.

  const Factory = await getContractFactory('TokenFactory');
  const tokenFactory = await Factory.deploy();

  const createFujiTransaction = await tokenFactory.createToken(
    'Fuji',
    'FUJI',
    18,
    1100,
  );
  const fujiTransactionData = parseTransactionData(
    await createFujiTransaction.wait(),
  );
  const fuji = await Token.attach(
    fujiTransactionData.events.TokenCreated.arguments.address,
  );
  const fujiInterface = new TokenInterface(fuji);
  const testMetadata = await fujiInterface.getMetadata();

  debugger;

  await fujiInterface.approve(
    testMetadata.admin.address,
    owner.address,
    testMetadata.totalSupply,
  );
  await fujiInterface.getAllowance(owner.address, testMetadata.admin.address);
  await fujiInterface.transfer(metadata.admin.address, owner.address);

  debugger;

  // const fuji2 = await Token.connect(
  //   fujiTransactionData.events.TokenCreated.arguments.address,
  // );

  const createHakuTransaction = await tokenFactory.createToken(
    'Haku',
    'HAKU',
    18,
    1050,
  );
  const hakuTransactionData = parseTransactionData(
    await createHakuTransaction.wait(),
  );
  const haku = await Token.attach(
    hakuTransactionData.events.TokenCreated.arguments.address,
  );

  const createTateTransaction = await tokenFactory.createToken(
    'Tate',
    'TATE',
    18,
    1000,
  );
  const tateTransactionData = parseTransactionData(
    await createTateTransaction.wait(),
  );
  const tate = await Token.attach(
    tateTransactionData.events.TokenCreated.arguments.address,
  );

  // const Swap = await getContractFactory('../artifacts/contracts/Swap.sol:Swap');
  // const Swap = await getContractFactory('contracts/Wrapper.sol:Swap');

  const Wrapper = await getContractFactory('Wrapper');
  const wrapper = await Wrapper.deploy(owner.address, user.address);

  console.log(
    `Owner Address: ${owner.address}\nSender Address:${sender.address}\nReceiver Address: ${receiver.address}\nUser Address: ${user.address}\nToken Factory Address: ${tokenFactory.address}\nFuji Address: ${fuji.address}\nHaku Address: ${haku.address}\nTate Address: ${tate.address}\nWrapper Address: ${wrapper.address}`,
  );

  await tokenTransactions(fuji, fujiMetadata);
  await tokenTransactions(haku, hakuMetadata);
  await tokenTransactions(tate, tateMetadata);

  debugger;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
