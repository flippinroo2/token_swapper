const DEBUG = true;

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
  debugger;
  const fujiReceipt = createFujiTransaction.receipt;
  const fujiLogs = fujiReceipt[0];
  const fujiArgs = fujiLogs.args;
  const fujiAddress = fujiArgs.tokenAddress;
  const fuji = await Token.at(fujiAddress);
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
