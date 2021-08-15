const DEBUG = true;

function getNewTokenData({
  tokenAddress,
  name,
  symbol,
  decimals,
  totalSupply,
}) {
  // const arraylength = event.length;
  // for (let i; i <= arraylength; i++) {
  //   console.log(`counter = ${i}`);
  //   console.log(event[i]);
  // }
  return tokenAddress;
}

function logTransaction({ blockNumber, from, gasUsed, to }) {
  console.log(
    `Transaction: ${tx}\nFrom: ${receipt.from}\nTo: ${receipt.to}\nBlock #: ${receipt.blockNumber}\nGas: ${receipt.gasUsed}`,
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
    logTransaction(transaction);
  }
  let eventObject = {};
  events.forEach(() => {
    debugger;
    // Loop through each event and return just the ones that have the ".event" attribute. The ones that do we will want to grab the ".args" attribute from that. ALSO, look and see what account the ".address" attribute coorelates to.
    // See if "forEach()" has a way to return data and save this whole thing to variable.
  });
  let transactionData = {};
  return transactionData;
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

  const Token = await getContractFactory('Token');
  const Factory = await getContractFactory('TokenFactory');
  const tokenFactory = await Factory.deploy();

  const createFujiTransaction = await tokenFactory.createToken(
    'Fuji',
    'FUJI',
    18,
    100,
  );
  const fujiAddress = getNewTokenData(
    readTransaction(await createFujiTransaction.wait()),
  );
  fuji = await Token.at(fujiAddress);
  debugger;

  const createHakuTransaction = await tokenFactory.createToken(
    'Haku',
    'HAKU',
    18,
    100,
  );

  const createTateTransaction = await tokenFactory.createToken(
    'Tate',
    'TATE',
    18,
    100,
  );

  console.log('Hardhat - Fuji address: %s', fuji.address);
  console.log('Hardhat - Haku address: %s', haku.address);
  console.log('Hardhat - Tate address: %s', tate.address);

  // const Swap = await getContractFactory('../artifacts/contracts/Swap.sol:Swap');
  // const Swap = await getContractFactory('contracts/Wrapper.sol:Swap');

  // const fujiTateSwap = await Swap.deploy(
  //   owner.address,
  //   fuji,
  //   user.address,
  //   tate,
  // );
  // console.log('Hardhat - fujiTateSwap address: %s', fujiTateSwap.address);

  // const hakuTateSwap = await Swap.deploy(
  //   owner.address,
  //   haku,
  //   user.address,
  //   tate,
  // );
  // console.log('Hardhat - hakuTateSwap address: %s', hakuTateSwap.address);

  const Wrapper = await getContractFactory('Wrapper');
  const wrapper = await Wrapper.deploy(owner.address, user.address);
  console.log('Hardhat - Wrapper address: %s', wrapper.address);

  if (DEBUG) {
    // debugger;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
