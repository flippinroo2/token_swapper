// const Fuji = artifacts.require('Fuji');
// const Haku = artifacts.require('Haku');
// const Tate = artifacts.require('Tate');
const Token = artifacts.require('Token');

// const Swap = artifacts.require('Swap');
const Wrapper = artifacts.require('Wrapper');

module.exports = async function (
  deployer,
  network,
  [owner, sender, receiver, user],
) {
  // await deployer.deploy(Token, 'Fuji', 'FUJI', 1100);
  // const fuji = await Token.deployed();

  // await deployer.deploy(Token, 'Haku', 'HAKU', 1050);
  // const haku = await Token.deployed();

  // await deployer.deploy(Token, 'Tate', 'TATE', 1000);
  // const tate = await Token.deployed();

  // await deployer.deploy(Swap, owner, fuji, user, tate);
  // const fujiTateSwap = await Swap.deployed();

  // await deployer.deploy(Swap, owner, haku, user, tate);
  // const hakuTateSwap = await Swap.deployed();

  // debugger;
  await deployer.deploy(
    Wrapper,
    '0x7D4c5963bD77f761e5eEF54263592b9D616F6448',
    sender,
  );
  const wrapper = await Wrapper.deployed();
};
