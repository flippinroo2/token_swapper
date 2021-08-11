const Storage = artifacts.require('Storage');
const Fuji = artifacts.require('Fuji');
const Haku = artifacts.require('Haku');
const Tate = artifacts.require('Tate');

module.exports = async function (deployer) {
  await deployer.deploy(Storage);
  const storage = await Storage.deployed();

  await deployer.deploy(Fuji);
  const fuji = await Fuji.deployed();

  await deployer.deploy(Haku);
  const haku = await Haku.deployed();

  await deployer.deploy(Tate);
  const tate = await Tate.deployed();
};
