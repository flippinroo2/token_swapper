const { ethers } = hre;
const { getContractFactory, getSigners } = ethers;

var Factory, Swap, Token, Wrapper;

var fuji,
  fujiTateSwap,
  haku,
  owner,
  tate,
  tateHakuSwap,
  tokenFactory,
  user,
  wrapper;

async function main() {
  let dataVariable;

  const signers = await getSigners();
  const [signer] = signers;

  owner = signer.address;
  user = signers[1].address;

  const Wrapper = await getContractFactory('Wrapper');
  wrapper = await Wrapper.deploy(owner);

  const Factory = await getContractFactory('TokenFactory');
  tokenFactory = await Factory.deploy();

  const Token = await getContractFactory('Token');

  // const createFujiTransaction = await tokenFactory.createToken(
  //   'Fuji',
  //   'FUJI',
  //   18,
  //   1100,
  // );
  // dataVariable = await createFujiTransaction.wait();

  // const createHakuTransaction = await tokenFactory.createToken(
  //   'Haku',
  //   'HAKU',
  //   18,
  //   1050,
  // );
  // dataVariable = await createHakuTransaction.wait();

  // const createTateTransaction = await tokenFactory.createToken(
  //   'Tate',
  //   'TATE',
  //   18,
  //   1000,
  // );
  // dataVariable = await createTateTransaction.wait();

  const Swap = await getContractFactory('Swap');

  // const tokens = await tokenFactory.queryFilter('TokenCreated');

  // for (const token of tokens) {
  //   const [address] = token.args;
  //   const tempToken = await Token.attach(address);
  //   const symbol = await tempToken._symbol();
  //   if (symbol === 'FUJI') {
  //     fuji = tempToken;
  //   }
  //   if (symbol === 'HAKU') {
  //     haku = tempToken;
  //   }
  //   if (symbol === 'TATE') {
  //     tate = tempToken;
  //   }
  // }

  const fujiAddress = await wrapper.fuji();
  const hakuAddress = await wrapper.haku();
  const tateAddress = await wrapper.tate();

  const fuji = await Token.attach(fujiAddress);
  const haku = await Token.attach(hakuAddress);
  const tate = await Token.attach(tateAddress);

  dataVariable = await wrapper.createSwapper(fuji.address, tate.address);
  fujiTateSwap = Swap.attach(await wrapper.getSwapperAddress());

  dataVariable = await wrapper.createUnswapper(tate.address, haku.address);
  tateHakuSwap = Swap.attach(await wrapper.getUnswapperAddress());

  const fujiTateSwapTransaction = await fujiTateSwap._swap(100);
  const tateHakuSwapTransaction = await tateHakuSwap._swap(50);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
