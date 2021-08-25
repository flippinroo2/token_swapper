const { ethers } = hre;

const { getContractFactory, getSigners } = ethers;

var Factory, Swap, Token, Wrapper;

var fuji,
  fujiTateSwap,
  haku,
  owner = {
    name: 'owner',
    fujiAllowance: 0,
    hakuAllowance: 0,
    tateAllowance: 0,
  },
  tate,
  tateHakuSwap,
  tokenFactory,
  user = {
    name: 'user',
    fujiAllowance: 0,
    fujiBalance: 0,
    hakuAllowance: 0,
    hakuBalance: 0,
    tateAllowance: 0,
    tateBalance: 0,
  },
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

// owner - "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
// user - "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

// wrapper - "0x5FbDB2315678afecb367f032d93F642f64180aa3"
// tokenFactory - "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

// fuji - "0x8Ff3801288a85ea261E4277d44E1131Ea736F77B"

// haku - "0x4CEc804494d829bEA93AB8eA7045A7efBED3c229"

// tate - "0xb385A0bAA2F8f30C660ABd207e8624863fcf30AE"

// fujiTateSwap - "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968"
// tateHakuSwap - "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883"

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
