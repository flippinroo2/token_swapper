const Storage = artifacts.require('Storage');
const Fuji = artifacts.require('Fuji');
const Haku = artifacts.require('Haku');
const Tate = artifacts.require('Tate');

module.exports = async function (deployer) {
  const { deploy } = deployer;

  await deploy(Storage);
  const storage = await Storage.deployed();

  await deploy(Fuji);
  const fuji = await Fuji.deployed();

  await deploy(Haku);
  const haku = await Haku.deployed();

  await deploy(Tate);
  const tate = await Tate.deployed();
};
