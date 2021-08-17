const DEBUG = true;

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

async function main() {
  const { artifacts, config, ethers, network, waffle, web3 } = hre;
  const { getContractFactory, getSigners } = ethers;
  const { eth, utils } = web3;

  let admin = { balance: 0 },
    owner = { balance: 0 },
    sender = { balance: 0 },
    receiver = { balance: 0 },
    user = { balance: 0 };

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

    const balanceOfTransaction1 = await fuji.balanceOf(fuji.address);
    const fujiBalance = balanceOfTransaction1.toNumber();

    const balanceOfTransaction2 = await fuji.balanceOf(admin.address);
    admin.balance = balanceOfTransaction2.toNumber();

    const approvalTransaction = await fuji.approve(
      admin.address,
      fujiTotalSupply,
    );
    const adminApproveFuji = approvalTransaction.value.toNumber();

    const allowanceTransaction = await fuji.allowance(
      fuji.address,
      admin.address,
    );
    debugger;
    admin.fujiAllowance = allowanceTransaction.toNumber();

    const approvalFromTransaction = await fuji.approveFrom(
      admin.address,
      owner.address,
      fujiTotalSupply,
    );
    debugger;
    admin.fujiAllowance = allowanceTransaction.toNumber();
    // const transferTransaction = await fuji.transfer();
    const transferFromTransaction = await fuji.transferFrom(
      admin.address,
      receiver.address,
      50,
    );
    // const transferFromTransaction = await fuji.transferFrom(
    //   owner.address,
    //   receiver.address,
    //   50,
    // );

    const balanceOfTransaction3 = await fuji.balanceOf(fuji.address);
    const balance3 = balanceOfTransaction3.toNumber();

    const balanceOfTransaction4 = await fuji.balanceOf(admin.address);
    const balance4 = balanceOfTransaction4.toNumber();
    debugger;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
