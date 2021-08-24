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

  // const signers = await getSigners();
  // const [signer] = signers;

  [owner] = hre.network.config.provider().addresses;
  // owner = signer.address;
  // user = signers[1].address;
  const signer = await hre.ethers.getSigner(owner);

  const Wrapper = await getContractFactory('Wrapper', signer);
  wrapper = await Wrapper.deploy(owner);

  const Factory = await getContractFactory('TokenFactory');
  tokenFactory = await Factory.deploy();

  const Token = await getContractFactory('Token');

  const Swap = await getContractFactory('Swap');

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

  // SWAP
  await fujiTateSwap._swap(100);
  await tateHakuSwap._swap(50);

  // TRANSFER
  await wrapper.submitTokens();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
