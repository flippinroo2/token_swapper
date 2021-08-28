const DEBUG = true;

var owner, user;

const Wrapper = artifacts.require('Wrapper');

var wrapper;
async function deployWrapper(deployer) {
  await deployer.deploy(Wrapper, owner);
  wrapper = await Wrapper.deployed();
}

module.exports = async function (deployer, network, [primary, secondary]) {
  owner = primary;
  user = secondary;
  await deployWrapper(deployer);
};
