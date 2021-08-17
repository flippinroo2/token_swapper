const DEBUG = true;

async function refreshAllowances(token) {
  const tokenAllowanceTransaction = await token.allowance(
    owner.address,
    token.address,
  );
  const tokenAllowance = tokenAllowanceTransaction.toNumber();

  const adminAllowanceTransaction = await token.allowance(
    owner.address,
    admin.address,
  );
  admin.ownerAllowance = adminAllowanceTransaction.toNumber();

  const ownerAllowanceTransaction = await token.allowance(
    admin.address,
    owner.address,
  );
  owner.ownerAllowance = ownerAllowanceTransaction.toNumber();

  const senderAllowanceTransaction = await token.allowance(
    owner.address,
    sender.address,
  );
  sender.ownerAllowance = senderAllowanceTransaction.toNumber();

  const receiverAllowanceTransaction = await token.allowance(
    owner.address,
    receiver.address,
  );
  receiver.ownerAllowance = receiverAllowanceTransaction.toNumber();

  const userAllowanceTransaction = await token.allowance(
    owner.address,
    user.address,
  );
  user.ownerAllowance = userAllowanceTransaction.toNumber();

  return tokenAllowance;
}

async function refreshBalances(token) {
  const tokenBalanceTransaction = await token.balanceOf(token.address);
  const tokenBalance = tokenBalanceTransaction.toNumber();

  const adminBalanceTransaction = await token.balanceOf(admin.address);
  admin.balance = adminBalanceTransaction.toNumber();

  const ownerBalanceTransaction = await token.balanceOf(owner.address);
  owner.balance = ownerBalanceTransaction.toNumber();

  const senderBalanceTransaction = await token.balanceOf(sender.address);
  sender.balance = senderBalanceTransaction.toNumber();

  const receiverBalanceTransaction = await token.balanceOf(receiver.address);
  receiver.balance = receiverBalanceTransaction.toNumber();

  const userBalanceTransaction = await token.balanceOf(user.address);
  user.balance = userBalanceTransaction.toNumber();

  return tokenBalance;
}

function logTransaction(transactionHash, blockNumber, from, gasUsed, to) {
  console.log(
    `Transaction: ${transactionHash}\nFrom: ${from}\nTo: ${to}\nBlock #: ${blockNumber}\nGas: ${gasUsed}`,
  );
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

let admin = { balance: 0 },
  owner = { balance: 0 },
  sender = { balance: 0 },
  receiver = { balance: 0 },
  user = { balance: 0 };

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

  // const fuji2 = await Token.connect(
  //   fujiTransactionData.events.TokenCreated.arguments.address,
  // );

  admin.address = await fuji.getAdmin();

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
    `Admin Address: ${admin.address}\nOwner Address: ${owner.address}\nSender Address:${sender.address}\nReceiver Address: ${receiver.address}\nUser Address: ${user.address}\nToken Factory Address: ${tokenFactory.address}\nFuji Address: ${fuji.address}\nHaku Address: ${haku.address}\nTate Address: ${tate.address}\nWrapper Address: ${wrapper.address}`,
  );

  if (DEBUG) {
    // debugger;
    const totalSupplyTransaction = await fuji.totalSupply();
    const fujiTotalSupply = totalSupplyTransaction.toNumber();

    const fujiBalance = await refreshBalances(fuji);

    const approvalTransaction = await fuji.approve(
      admin.address,
      fujiTotalSupply,
    );
    const adminApproveFuji = approvalTransaction.value.toNumber();

    const approvalFromTransaction = await fuji.approveFrom(
      admin.address,
      owner.address,
      fujiTotalSupply,
    );

    const fujiOwnerAllowance = await refreshAllowances(fuji);

    // const transferTransaction = await fuji.transfer();
    await fuji.transferFrom(admin.address, owner.address, 100);
    await fuji.transferFrom(admin.address, sender.address, 200);
    await fuji.transferFrom(admin.address, receiver.address, 500);
    await fuji.transferFrom(admin.address, user.address, 50);

    await refreshBalances(fuji);

    debugger;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
