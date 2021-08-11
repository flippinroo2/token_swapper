/* eslint-disable no-undef */
const DEBUG = false;

const { cache, resolver, require } = artifacts;
const Storage = artifacts.require('Storage');
const AvaxWrapper = artifacts.require('AvaxWrapper');

module.exports = async function (deployer) {
  if (DEBUG) {
    const { chain, networks, provider } = deployer;
    const { migration_directory } = config;
    const { agent, connected, headers, host, httpAgent, send } = provider;
    const { eth, networkType, providers, utils } = web3;
    debugger;
  }

  await deployer.deploy(Storage);
  const storage = await Storage.deployed();

  await deployer.deploy(AvaxWrapper);
  const avaxWrapper = await AvaxWrapper.deployed();

  if (DEBUG) {
    debugger;
  }
};
