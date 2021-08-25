const DEBUG = true;

const { ethers } = hre;
const { getContractFactory, getSigners } = ethers;

var signer, owner, user;
var wrapper;
var Token, fuji, haku, tate;
var Factory, tokenFactory;
var Swap, fujiTateSwap, tateHakuSwap;

function setUsers(signers) {
  if (signers) {
    [signer] = signers;
    owner = signer.address;
    user = signers[1].address;
    return;
  }
  [owner] = hre.network.config.provider().addresses;
}
async function deployWrapper() {
  signer = await hre.ethers.getSigner(owner);
  Wrapper = await getContractFactory('Wrapper', signer);
  wrapper = await Wrapper.deploy(owner);
}
async function deployTokens() {
  Factory = await getContractFactory('TokenFactory');
  tokenFactory = await Factory.deploy();

  Token = await getContractFactory('Token');

  const fujiAddress = await wrapper.fuji();
  const hakuAddress = await wrapper.haku();
  const tateAddress = await wrapper.tate();

  // fuji = tokenFactory.createToken('Fuji', 'FUJI', 18, 1100);
  // haku = tokenFactory.createToken('Haku', 'HAKU', 18, 1050);
  // tate = tokenFactory.createToken('Tate', 'TATE', 18, 100);

  fuji = await Token.attach(fujiAddress);
  haku = await Token.attach(hakuAddress);
  tate = await Token.attach(tateAddress);
}

async function deploySwappers() {
  let dataVariable;

  Swap = await getContractFactory('Swap');

  dataVariable = await wrapper.createSwapper(fuji.address, tate.address);
  fujiTateSwap = Swap.attach(await wrapper.getSwapperAddress());

  dataVariable = await wrapper.createUnswapper(tate.address, haku.address);
  tateHakuSwap = Swap.attach(await wrapper.getUnswapperAddress());
}

async function swap() {
  // fuji.approveFrom(address(fuji), address(this), 1100);
  // haku.approveFrom(address(haku), address(this), 1050);
  // tate.approveFrom(address(tate), address(this), 100);

  // fuji.transferFrom(address(fuji), address(this), 100);

  await fujiTateSwap._swap(100);
  await tateHakuSwap._swap(50);
}

async function transferTokens(address) {
  if (DEBUG) {
    console.log('address');
    console.log(address);
  }
  fuji.transferFrom(address(fuji), _submissionAddress, 1000);
  haku.transferFrom(address(haku), _submissionAddress, 1000);
}

async function main() {
  setUsers(await getSigners());
  await deployWrapper();
  await deployTokens();
  await deploySwappers();
  // await swap();
  // await transferTokens(0x808ce8dec9e10bed8d0892aceef9f1b8ec2f52bd);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
