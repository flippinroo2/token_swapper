const DEBUG = false;

const ReceiverAddress = '0x7D4c5963bD77f761e5eEF54263592b9D616F6448';
const Wrapper = artifacts.require('Wrapper');
// const Swap = artifacts.require('Swap');
// const Template = artifacts.require('Template');
const Token = artifacts.require('Token');
const TokenFactory = artifacts.require('TokenFactory');

function logTransaction(transactionHash, blockNumber, from, gasUsed, to) {
  console.log(
    `Transaction: ${transactionHash}\nFrom: ${from}\nTo: ${to}\nBlock #: ${blockNumber}\nGas: ${gasUsed}`,
  );
}

function parseTransactionData({
  blockHash,
  blockNumber,
  // confirmations,
  // events,
  from,
  gasUsed,
  logs,
  status,
  to,
  transactionHash,
  transactionIndex,
  // type,
}) {
  if (DEBUG) {
    logTransaction(transactionHash, blockNumber, from, gasUsed, to);
  }

  let eventObject = {};
  logs.forEach((element, index, array) => {
    // console.log('element:');
    // console.dir(element);
    // console.log(`index ${index}`);
    if (index === 0) {
    }
    const argsProperty = element.hasOwnProperty('args');
    // const eventString = `event${index}`;
    let eventArguments = {};
    if (argsProperty) {
    }
    eventObject[element.event] = {
      address: element.args.tokenAddress,
      name: element.args.name,
      symbol: element.args.symbol,
      decimals: element.args.decimals.words[0],
      totalSupply: element.args.totalSupply.words[0],
      signature: element.eventSignature,
      arguments: eventArguments,
      type: element.type,
    };

    if (index === array.length - 1) {
    }
  });
  return {
    from,
    to,
    transactionIndex,
    transactionHash,
    gasUsed,
    // type,
    status,
    blockNumber,
    blockHash,
    // confirmations,
    events: eventObject,
  };
}

module.exports = async function (
  deployer,
  network,
  [owner, sender, receiver, user],
) {
  const { chain, emitter, logger, networks, provider } = deployer;

  await deployer.deploy(TokenFactory);
  const factory = await TokenFactory.deployed();

  // const fuji = await deployer.deploy(Token, 'Fuji', 'FUJI', 18, 1100);
  // const haku = await deployer.deploy(Token, 'Haku', 'HAKU', 18, 1050);
  // const tate = await deployer.deploy(Token, 'Tate', 'TATE', 18, 1000); // The deployed contract uses the address of the last item here.

  const fujiTransaction = await factory.createToken('Fuji', 'FUJI', 18, 1100);
  const fujiTransactionData = parseTransactionData(fujiTransaction.receipt);
  const fujiAddress = fujiTransactionData.events.TokenCreated.address;
  const fuji = await Token.at(fujiAddress);

  const hakuTransaction = await factory.createToken('Haku', 'HAKU', 18, 1050);
  const hakuTransactionData = parseTransactionData(hakuTransaction.receipt);
  const hakuAddress = hakuTransactionData.events.TokenCreated.address;
  const haku = await Token.at(hakuAddress);

  const tateTransaction = await factory.createToken('Tate', 'TATE', 18, 1000);
  const tateTransactionData = parseTransactionData(tateTransaction.receipt);
  const tateAddress = tateTransactionData.events.TokenCreated.address;
  const tate = await Token.at(tateAddress);

  // const fujiNew = await Token.new('Fuji', 'FUJI', 1100);
  // const hakuNew = await Token.new('Haku', 'HAKU', 1050);
  // const tateNew = await Token.new('Tate', 'TATE', 1000);

  await deployer.deploy(Wrapper, ReceiverAddress, sender);
  const wrapper = await Wrapper.deployed();

  // await deployer.deploy(Swap, owner, fuji, user, tate);
  // const fujiTateSwap = await Swap.deployed();

  // await deployer.deploy(Swap, owner, haku, user, tate);
  // const hakuTateSwap = await Swap.deployed();

  const addresses = {
    wrapper: wrapper.address,
    tokenFactory: factory.address,
    fuji: fuji.address,
    haku: haku.address,
    tate: tate.address,
  };

  console.log('Addresses:');
  console.dir(addresses);

  if (DEBUG) {
    debugger;
  }
};
