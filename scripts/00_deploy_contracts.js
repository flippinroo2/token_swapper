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
  const tokenAddress = token.address;
  const tokenName = metadata.name;

  const adminAddress = metadata.admin.address;

  const propertyString = `${tokenName}Balance`;

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

  await token.approve(token.address, admin.address, totalSupply);
  await token.approve(token.address, owner.address, totalSupply);
  await token.approve(token.address, sender.address, totalSupply);
  await token.approve(token.address, receiver.address, totalSupply);
  await token.approve(token.address, user.address, totalSupply);

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

  await token.approve(owner.address, token.address, totalSupply);
  await token.approve(owner.address, admin.address, totalSupply);
  await token.approve(owner.address, sender.address, totalSupply);
  await token.approve(owner.address, receiver.address, totalSupply);
  await token.approve(owner.address, user.address, totalSupply);

  await token.approve(sender.address, token.address, totalSupply);
  await token.approve(sender.address, admin.address, totalSupply);
  await token.approve(sender.address, owner.address, totalSupply);
  await token.approve(sender.address, receiver.address, totalSupply);
  await token.approve(sender.address, user.address, totalSupply);

  await token.approve(receiver.address, token.address, totalSupply);
  await token.approve(receiver.address, admin.address, totalSupply);
  await token.approve(receiver.address, owner.address, totalSupply);
  await token.approve(receiver.address, sender.address, totalSupply);
  await token.approve(receiver.address, user.address, totalSupply);

  await token.approve(user.address, token.address, totalSupply);
  await token.approve(user.address, admin.address, totalSupply);
  await token.approve(user.address, owner.address, totalSupply);
  await token.approve(user.address, sender.address, totalSupply);
  await token.approve(user.address, receiver.address, totalSupply);
}
async function tokenTransactions(token, metadata) {
  const { admin, totalSupply } = metadata;

  await refreshBalances(token, metadata);

  await approveAll(token, metadata);

  await refreshAllowances(token, metadata);

  const transfer = await token.transfer(admin.address, receiver.address, 50);
  const transferReceipt = await transfer.wait();

  /* ETHERS.js DECODE TESTING
  // IMPORTANT !!!
  // const base58DecodeTest = ethers.utils.base58.decode(approval.hash);
  const base64DecodeTest = ethers.utils.base64.decode(approval.hash);
  // const RLPDecodeTest = ethers.utils.RLP.decode(base64DecodeTest);
  // const bytes32Test = ethers.utils.parseBytes32String(approval.hash); // Not 32 bytes long
  // const utf8Test = ethers.utils.toUtf8String(approval.hash);
  // IMPORTANT !!!

  // IMPORTANT !!!
  // const test = ethers.utils.serializeTransaction(approval);
  // const test = ethers.utils.serializeTransaction(approvalReceipt); // This just made a new hex of the entire transaction.
  // const test = ethers.utils.parseTransaction(approval);
  // const abiInterface = ethers.utils.Interface(ABI);
  // IMPORTANT !!!

  // IMPORTANT !!!
  // These functions below turn strings into hashes, not vise versa!!!
  // const idTest = ethers.utils.id(approval.data);
  // const keccak256Test = ethers.utils.keccak256(approval.data);
  // const sha256Test = ethers.utils.sha256(approval.data);
  // IMPORTANT !!!
  */

  /* Web3.js TESTING
    // const web3CheckAddressChecksum = web3.utils.checkAddressChecksum(approval.hash);
    // const web3BytesToHex = web3.utils.bytesToHex(approval.hash);
    // const web3HexToAscii = web3.utils.hexToAscii(approval.hash);
    // const web3ToAscii = web3.utils.toAscii(approval.hash);
    // const web3HexToUtf8 = web3.utils.hexToUtf8(approval.hash);
    */

  await refreshBalances(token, metadata);
}

let fuji,
  fujiMetadata,
  haku,
  hakuMetadata,
  owner = { balance: 0, name: 'owner', ownerAllowance: 0 },
  sender = { balance: 0, name: 'sender', ownerAllowance: 0 },
  receiver = { balance: 0, name: 'receiver', ownerAllowance: 0 },
  tate,
  tateMetadata,
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

  /* NOTES:
  // Contract.connect(providerOrSigner); // Returns a new instance of the contract, but connected to the provider or signer. (Could be useful for connecting to Ganache as the provider).

  const tokenInterface = Token.interface; // This is the ABI for the contract
  const tokenSigner = Token.signer; // If there is a signer provided with the constructor, then this will return the signer.
  const tokenProvider = Token.provider // If there is a provider with the constructor, then this will return the provider.
  const tokenDeployTransaction = Token.deployTransaction // This will return a TransactionResponse of the deployment transaction.
  const tokenDeployTransaction = Token.getDeployTransaction(); // ...args [, overrides]
  const tokenQueryFilter = Token.queryFilter(event) // This return events that match the event passed in.
  */

  const Factory = await getContractFactory('TokenFactory');
  const tokenFactory = await Factory.deploy();

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
    1100,
  );
  const fujiTransactionData = parseTransactionData(
    await createFujiTransaction.wait(),
  );

  // REWORK THE WAY TOKENS ARE CREATED BY USING THE EVENT LISTENER INSTEAD OF THIS.
  fuji = await Token.attach(
    fujiTransactionData.events.TokenCreated.arguments.address,
  ); // Using this attach method is basically the same as calling the "Contract" constructor with this address and the interface & signerOrProvider passed in.

  const fujiInterface = new TokenInterface(fuji);
  fujiMetadata = await fujiInterface.getMetadata();

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
  haku = await Token.attach(
    hakuTransactionData.events.TokenCreated.arguments.address,
  );
  const hakuInterface = new TokenInterface(haku);
  hakuMetadata = await hakuInterface.getMetadata();

  const createTateTransaction = await tokenFactory.createToken(
    'Tate',
    'TATE',
    18,
    1000,
  );
  const tateTransactionData = parseTransactionData(
    await createTateTransaction.wait(),
  );
  tate = await Token.attach(
    tateTransactionData.events.TokenCreated.arguments.address,
  );
  const tateInterface = new TokenInterface(tate);
  tateMetadata = await tateInterface.getMetadata();

  // const Swap = await getContractFactory('../artifacts/contracts/Swap.sol:Swap');
  // const Swap = await getContractFactory('contracts/Wrapper.sol:Swap');

  const Wrapper = await getContractFactory('Wrapper');
  const wrapper = await Wrapper.deploy(owner.address, user.address);

  console.log(
    `Owner Address: ${owner.address}\nSender Address:${sender.address}\nReceiver Address: ${receiver.address}\nUser Address: ${user.address}\nToken Factory Address: ${tokenFactory.address}\nFuji Address: ${fuji.address}\nHaku Address: ${haku.address}\nTate Address: ${tate.address}\nWrapper Address: ${wrapper.address}`,
  );

  await tokenTransactions(fujiInterface, fujiMetadata);
  await tokenTransactions(hakuInterface, hakuMetadata);
  await tokenTransactions(tateInterface, tateMetadata);

  debugger;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
