const DEBUG = true;

var owner;

const Wrapper = artifacts.require('Wrapper');

var wrapper;
function debug(value) {
  if (DEBUG) {
    console.log(value);
  }
}

async function deployWrapper(deployer) {
  await deployer.deploy(Wrapper, owner);
  debug(await Wrapper.deployed());
}

module.exports = async function (deployer, network, [primary]) {
  owner = primary;
  await deployWrapper(deployer);
};
