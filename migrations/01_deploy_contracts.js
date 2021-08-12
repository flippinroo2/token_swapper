const Storage = artifacts.require('Storage');
const Fuji = artifacts.require('Fuji');
const Haku = artifacts.require('Haku');
const Tate = artifacts.require('Tate');

module.exports = async function (
  deployer,
  network,
  [owner, sender, receiver, user],
) {
  // const { chain, deploy, finish, link, networks, provider, start, then } = deployer;

  await deployer.deploy(Storage);
  const storage = await Storage.deployed();

  await deployer.deploy(Fuji, 'Fuji', 'FUJI');
  const fuji = await Fuji.deployed();

  await deployer.deploy(Haku, 'Haku', 'HAKU');
  const haku = await Haku.deployed();

  await deployer.deploy(Tate, 'Tate', 'TATE');
  const tate = await Tate.deployed();
};
