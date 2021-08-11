const DEBUG = false;

async function main() {
  const { artifacts, config, ethers, network, waffle, web3 } = hre;
  const { getContractFactory, getSigners } = ethers;
  const { eth, utils } = web3;

  let deployer = { balance: 0 },
    sender = { balance: 0 },
    receiver = { balance: 0 },
    user = { balance: 0 };

  const signers = await getSigners();
  const [signer] = signers;

  deployer.address = signer.address;
  sender.address = signers[1].address;
  receiver.address = signers[2].address;
  user.address = signers[3].address;

  // console.log('Account balance:', (await deployer.getBalance()).toString());

  const Fuji = await getContractFactory('Fuji');
  const fuji = await Fuji.deploy('Fuji', 'FUJI');

  console.log('Hardhat - Fuji address: %s', fuji.address);

  const mintTransaction = await fuji.mint(deployer.address, 10);

  const balanceOfTransaction = await fuji.balanceOf(deployer.address);
  const balance1 = utils.hexToNumber(balanceOfTransaction);
  deployer.balance = balance1;

  if (DEBUG) {
    debugger;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
