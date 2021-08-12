const Fuji = artifacts.require('Fuji');
const Haku = artifacts.require('Haku');
const Tate = artifacts.require('Tate');

module.exports = async function (
  deployer,
  network,
  [owner, sender, receiver, user],
) {
  await deployer.deploy(Fuji, 'Fuji', 'FUJI', 1100);
  const fuji = await Fuji.deployed();

  await deployer.deploy(Haku, 'Haku', 'HAKU', 1050);
  const haku = await Haku.deployed();

  await deployer.deploy(Tate, 'Tate', 'TATE', 1000);
  const tate = await Tate.deployed();
};
