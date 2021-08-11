const ethers = require('ethers');

async function main() {
  debugger;
  const [deployer] = await ethers.getSigners();

  console.log('Account balance:', (await deployer.getBalance()).toString());

  const Fuji = await ethers.getContractFactory('Fuji');
  const fuji = await Fuji.deploy('Fuji', 'FUJI');

  console.log('Token address:', token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
