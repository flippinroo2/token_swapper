const Fuji = artifacts.require('Fuji');
const Haku = artifacts.require('Haku');
const Tate = artifacts.require('Tate');

const Swap = artifacts.require('Swap');
const Wrapper = artifacts.require('Wrapper');

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

  // await deployer.deploy(Swap, owner, fuji, user, tate);
  // const fujiTateSwap = await Swap.deployed();

  // await deployer.deploy(Swap, owner, haku, user, tate);
  // const hakuTateSwap = await Swap.deployed();

  // debugger;
  await deployer.deploy(Wrapper, owner, user);
  const wrapper = await Wrapper.deployed();
};
