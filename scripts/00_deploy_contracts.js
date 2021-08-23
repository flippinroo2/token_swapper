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

  const signers = await getSigners();
  const [signer] = signers;

  owner.address = signer.address;
  user.address = signers[1].address;

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
  fuji = Token.attach(dataVariable.to);

  const createHakuTransaction = await tokenFactory.createToken(
    'Haku',
    'HAKU',
    18,
    1050,
  );
  dataVariable = await createHakuTransaction.wait();
  haku = Token.attach(dataVariable.to);

  const createTateTransaction = await tokenFactory.createToken(
    'Tate',
    'TATE',
    18,
    1000,
  );
  dataVariable = await createTateTransaction.wait();
  tate = Token.attach(dataVariable.to);

  const Wrapper = await getContractFactory('Wrapper');
  wrapper = await Wrapper.deploy(owner.address, user.address);

  const Swap = await getContractFactory('Swap');

  const createFujiSwap = await wrapper.createFujiSwap(
    fuji.address,
    tate.address,
  );
  await createFujiSwap.wait();

  fujiTateSwap = Swap.attach(await wrapper._fujiTateSwapper());

  const createHakuSwap = await wrapper.createHakuSwap(
    haku.address,
    tate.address,
  );
  await createHakuSwap.wait();

  hakuTateSwap = Swap.attach(await wrapper._hakuTateSwapper());

  debugger;

  dataVariable = await fuji.balanceOf(tokenFactory.address);

  debugger;

  const fujiTateSwapTransaction = await fujiTateSwap._swap(7);
  const hakuTateSwapTransaction = await hakuTateSwap._swap(4);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
