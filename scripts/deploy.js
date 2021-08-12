const DEBUG = true;

async function main() {
  const { artifacts, config, ethers, network, waffle, web3 } = hre;
  const { getContractFactory, getSigners } = ethers;
  const { eth, utils } = web3;

  let owner = { balance: 0 },
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

  const Fuji = await getContractFactory('Fuji');
  const fuji = await Fuji.deploy('Fuji', 'FUJI', 1100);
  console.log('Hardhat - Fuji address: %s', fuji.address);

  // const mintTransaction = await fuji.mint(owner.address, 10);
  // const balanceOfTransaction = await fuji.balanceOf(owner.address);
  // owner.balance = utils.hexToNumber(balanceOfTransaction);

  const Haku = await getContractFactory('Haku');
  const haku = await Haku.deploy('Haku', 'HAKU', 1050);
  console.log('Hardhat - Haku address: %s', haku.address);

  const Tate = await getContractFactory('Tate');
  const tate = await Tate.deploy('Tate', 'TATE', 1100);
  console.log('Hardhat - Tate address: %s', tate.address);

  const Swap = await getContractFactory('Swap');

  // const fujiTateSwap = await Swap.deploy(
  //   owner.address,
  //   fuji,
  //   user.address,
  //   tate,
  // );
  // const hakuTateSwap = await Swap.deploy(
  //   owner.address,
  //   haku,
  //   user.address,
  //   tate,
  // );
  // console.log('Hardhat - fujiTateSwap address: %s', fujiTateSwap.address);
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
