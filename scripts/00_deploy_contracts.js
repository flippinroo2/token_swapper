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
  tokenFactory.on('TokenCreated', async (address) => {
    const tempToken = Token.attach(address);
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
    debugger;
  });

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

  debugger;

  const Wrapper = await getContractFactory('Wrapper');
  wrapper = await Wrapper.deploy(owner.address, user.address);

  const Swap = await getContractFactory('Swap');

  const createFujiSwap = await wrapper.createFujiSwap(
    fuji.address,
    tate.address,
  );

  const createFujiSwapReceipt = await createFujiSwap.wait();

  const fujiTateSwapper = await wrapper._fujiTateSwapper();

  fujiTateSwap = Swap.attach(fujiTateSwapper);

  const createHakuSwap = await wrapper.createHakuSwap(
    haku.address,
    tate.address,
  );

  const hakuTateSwapReceipt = await createHakuSwap.wait();

  const hakuTateSwapper = await wrapper._hakuTateSwapper();

  hakuTateSwap = Swap.attach(hakuTateSwapper);

  debugger;

  // wrapper - "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9"
  // tokenFactory - "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  // fuji - "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  // haku - "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  // tate - "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  // fujiTateSwap - "0x856e4424f806D16E8CBC702B3c0F2ede5468eae5"
  // hakuTateSwap - "0xb0279Db6a2F1E01fbC8483FCCef0Be2bC6299cC3"

  // const fujiTateSwapTransaction = await fujiTateSwap._swap(7);
  // const hakuTateSwapTransaction = await hakuTateSwap._swap(4);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
