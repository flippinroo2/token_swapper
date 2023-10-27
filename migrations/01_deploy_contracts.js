var owner;

const Wrapper = artifacts.require('Wrapper');

var wrapper;

async function deployWrapper(deployer) {
  await deployer.deploy(Wrapper, owner);
  wrapper = await Wrapper.deployed();
}

module.exports = async function (deployer, network, [primary]) {
  owner = primary;
  await deployWrapper(deployer);
};
