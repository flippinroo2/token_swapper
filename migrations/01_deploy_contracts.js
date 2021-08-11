/* eslint-disable no-undef */
const DEBUG = false;

const { cache, resolver, require } = artifacts;
const TestToken = artifacts.require('TestToken');

module.exports = async function (deployer) {
  if (DEBUG) {
    const { chain, networks, provider } = deployer;
    const { migration_directory } = config;
    const { agent, connected, headers, host, httpAgent, send } = provider;
    const { eth, networkType, providers, utils } = web3;
    debugger;
  }

  await deployer.deploy(TestToken, 'TEST');
  const testToken = await TestToken.deployed();

  if (DEBUG) {
    debugger;
  }
};
