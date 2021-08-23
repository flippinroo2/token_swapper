const { ethers } = hre;

const { getContractFactory, getSigners } = ethers;

var Factory, Swap, Token, Wrapper;

var fuji,
  fujiTateSwap,
  haku,
  hakuTateSwap,
  owner = {
    name: 'owner',
    fujiAllowance: 0,
    hakuAllowance: 0,
    tateAllowance: 0,
  },
  tate,
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

  const balances = {
    tokenFactory: {},
    fuji: {},
    fujiTateSwap: {},
    haku: {},
    hakuTateSwap: {},
    owner: {},
    tate: {},
    user: {},
  };

  const signers = await getSigners();
  const [signer] = signers;

  owner.address = signer.address;
  user.address = signers[1].address;

  const Wrapper = await getContractFactory('Wrapper');
  wrapper = await Wrapper.deploy(owner.address, user.address);

  const Factory = await getContractFactory('TokenFactory');
  tokenFactory = await Factory.deploy();

  const Token = await getContractFactory('Token');

  const createFujiTransaction = await tokenFactory.createToken(
    'Fuji',
    'FUJI',
    18,
    1100,
  );
  dataVariable = await createFujiTransaction.wait();

  const createHakuTransaction = await tokenFactory.createToken(
    'Haku',
    'HAKU',
    18,
    1050,
  );
  dataVariable = await createHakuTransaction.wait();

  const createTateTransaction = await tokenFactory.createToken(
    'Tate',
    'TATE',
    18,
    1000,
  );
  dataVariable = await createTateTransaction.wait();

  const Swap = await getContractFactory('Swap');

  const tokens = await tokenFactory.queryFilter('TokenCreated');

  for (const token of tokens) {
    const [address] = token.args;
    const tempToken = await Token.attach(address);
    const symbol = await tempToken._symbol();
    if (symbol === 'FUJI') {
      fuji = tempToken;
    }
    if (symbol === 'HAKU') {
      haku = tempToken;
    }
    if (symbol === 'TATE') {
      tate = tempToken;
    }
  }

  const createFujiSwap = await wrapper.createFujiSwap(
    fuji.address,
    tate.address,
  );

  const fujiTateSwapper = await wrapper._fujiTateSwapper();

  fujiTateSwap = Swap.attach(fujiTateSwapper);

  const createHakuSwap = await wrapper.createHakuSwap(
    haku.address,
    tate.address,
  );

  const hakuTateSwapper = await wrapper._hakuTateSwapper();

  hakuTateSwap = Swap.attach(hakuTateSwapper);

  dataVariable = await fuji.balanceOf(tokenFactory.address);
  balances.tokenFactory.fuji = dataVariable.toNumber();
  dataVariable = await fuji.balanceOf(fuji.address);
  balances.fuji.fuji = dataVariable.toNumber();
  dataVariable = await fuji.balanceOf(owner.address);
  balances.owner.fuji = dataVariable.toNumber();
  dataVariable = await fuji.balanceOf(user.address);
  balances.user.fuji = dataVariable.toNumber();
  dataVariable = await fuji.balanceOf(fujiTateSwap.address);
  balances.fujiTateSwap.fuji = dataVariable.toNumber();
  dataVariable = await fuji.balanceOf(hakuTateSwap.address);
  balances.hakuTateSwap.fuji = dataVariable.toNumber();

  dataVariable = await haku.balanceOf(tokenFactory.address);
  balances.tokenFactory.haku = dataVariable.toNumber();
  dataVariable = await haku.balanceOf(haku.address);
  balances.haku.haku = dataVariable.toNumber();
  dataVariable = await haku.balanceOf(owner.address);
  balances.owner.haku = dataVariable.toNumber();
  dataVariable = await haku.balanceOf(user.address);
  balances.user.haku = dataVariable.toNumber();
  dataVariable = await haku.balanceOf(fujiTateSwap.address);
  balances.fujiTateSwap.haku = dataVariable.toNumber();
  dataVariable = await haku.balanceOf(hakuTateSwap.address);
  balances.hakuTateSwap.haku = dataVariable.toNumber();

  dataVariable = await tate.balanceOf(tokenFactory.address);
  balances.tokenFactory.tate = dataVariable.toNumber();
  dataVariable = await tate.balanceOf(tate.address);
  balances.tate.tate = dataVariable.toNumber();
  dataVariable = await tate.balanceOf(owner.address);
  balances.owner.tate = dataVariable.toNumber();
  dataVariable = await tate.balanceOf(user.address);
  balances.user.tate = dataVariable.toNumber();
  dataVariable = await tate.balanceOf(fujiTateSwap.address);
  balances.fujiTateSwap.tate = dataVariable.toNumber();
  dataVariable = await tate.balanceOf(hakuTateSwap.address);
  balances.hakuTateSwap.tate = dataVariable.toNumber();

  // owner - "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  // user - "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
  // wrapper - "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
  // tokenFactory - "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  // fuji - "0xCafac3dD18aC6c6e92c921884f9E4176737C052c"
  // haku - "0x9f1ac54BEF0DD2f6f3462EA0fa94fC62300d3a8e"
  // tate - "0xbf9fBFf01664500A33080Da5d437028b07DFcC55"
  // fujiTateSwap - "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be"
  // hakuTateSwap - "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968"

  // debugger;

  // dataVariable = await fuji.transferFrom(fuji.address, owner.address, 100);
  // const transferReceipt = dataVariable.wait();

  debugger;

  const fujiTateSwapTransaction = await fujiTateSwap._swap(7);
  const hakuTateSwapTransaction = await hakuTateSwap._swap(4);

  dataVariable = await fuji.balanceOf(tokenFactory.address);
  balances.tokenFactory.fuji = dataVariable.toNumber();
  dataVariable = await fuji.balanceOf(fuji.address);
  balances.fuji.fuji = dataVariable.toNumber();
  dataVariable = await fuji.balanceOf(owner.address);
  balances.owner.fuji = dataVariable.toNumber();
  dataVariable = await fuji.balanceOf(user.address);
  balances.user.fuji = dataVariable.toNumber();
  dataVariable = await fuji.balanceOf(fujiTateSwap.address);
  balances.fujiTateSwap.fuji = dataVariable.toNumber();
  dataVariable = await fuji.balanceOf(hakuTateSwap.address);
  balances.hakuTateSwap.fuji = dataVariable.toNumber();

  dataVariable = await haku.balanceOf(tokenFactory.address);
  balances.tokenFactory.haku = dataVariable.toNumber();
  dataVariable = await haku.balanceOf(haku.address);
  balances.haku.haku = dataVariable.toNumber();
  dataVariable = await haku.balanceOf(owner.address);
  balances.owner.haku = dataVariable.toNumber();
  dataVariable = await haku.balanceOf(user.address);
  balances.user.haku = dataVariable.toNumber();
  dataVariable = await haku.balanceOf(fujiTateSwap.address);
  balances.fujiTateSwap.haku = dataVariable.toNumber();
  dataVariable = await haku.balanceOf(hakuTateSwap.address);
  balances.hakuTateSwap.haku = dataVariable.toNumber();

  dataVariable = await tate.balanceOf(tokenFactory.address);
  balances.tokenFactory.tate = dataVariable.toNumber();
  dataVariable = await tate.balanceOf(tate.address);
  balances.tate.tate = dataVariable.toNumber();
  dataVariable = await tate.balanceOf(owner.address);
  balances.owner.tate = dataVariable.toNumber();
  dataVariable = await tate.balanceOf(user.address);
  balances.user.tate = dataVariable.toNumber();
  dataVariable = await tate.balanceOf(fujiTateSwap.address);
  balances.fujiTateSwap.tate = dataVariable.toNumber();
  dataVariable = await tate.balanceOf(hakuTateSwap.address);
  balances.hakuTateSwap.tate = dataVariable.toNumber();

  debugger;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
