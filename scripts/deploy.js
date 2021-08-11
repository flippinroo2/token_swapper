async function main() {
  const { artifacts, config, ethers, network, waffle } = hre;
  const { getContractFactory, getSigners } = ethers;

  const [deployer] = await getSigners();

  console.log('Account balance:', (await deployer.getBalance()).toString());

  const Fuji = await getContractFactory('Fuji');
  const fuji = await Fuji.deploy('Fuji', 'FUJI');

  console.log('Fuji address:', fuji.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
