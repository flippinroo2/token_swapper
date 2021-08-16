const ReceiverAddress = '0x7D4c5963bD77f761e5eEF54263592b9D616F6448';
const Wrapper = artifacts.require('Wrapper');
// const Swap = artifacts.require('Swap');
// const Template = artifacts.require('Template');
const Token = artifacts.require('Token');
const TokenFactory = artifacts.require('TokenFactory');

module.exports = async function (
  deployer,
  network,
  [owner, sender, receiver, user],
) {
  const { chain, emitter, logger, networks, provider } = deployer;

  const factory = await deployer.deploy(TokenFactory);

  const fuji = await deployer.deploy(Token, 'Fuji', 'FUJI', 18, 1100);
  const haku = await deployer.deploy(Token, 'Haku', 'HAKU', 18, 1050);
  const tate = await deployer.deploy(Token, 'Tate', 'TATE', 18, 1000); // The deployed contract uses the address of the last item here.

  // const fuji = await Token.at('');
  // const haku = await Token.at('');
  // const tate = await Token.at('');

  // const fujiNew = await Token.new('Fuji', 'FUJI', 1100);
  // const hakuNew = await Token.new('Haku', 'HAKU', 1050);
  // const tateNew = await Token.new('Tate', 'TATE', 1000);

  const addresses = {
    wrapper: wrapper.address,
    tokenFactory: factory.address,
    fuji: fuji.address,
    haku: haku.address,
    tate: tate.address,
  };

  await deployer.deploy(Wrapper, ReceiverAddress, sender);
  const wrapper = await Wrapper.deployed();

  // await deployer.deploy(Swap, owner, fuji, user, tate);
  // const fujiTateSwap = await Swap.deployed();

  // await deployer.deploy(Swap, owner, haku, user, tate);
  // const hakuTateSwap = await Swap.deployed();

  console.log('Addresses:');
  console.dir(addresses);
};
