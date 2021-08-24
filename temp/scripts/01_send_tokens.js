const { ethers } = hre;
const { getContractFactory, getSigners } = ethers;

var Token, Wrapper;
var fuji, haku;

const submissionAddress = '0x808cE8deC9E10beD8d0892aCEEf9F1B8ec2F52Bd';

async function main() {
  let dataVariable;

  const signers = await getSigners();
  const [signer] = signers;

  owner = signer.address;
  user = signers[1].address;

  const Wrapper = await getContractFactory('Wrapper');
  // wrapper = await Wrapper.deploy(owner);

  const fujiAddress = await wrapper.fuji();
  const hakuAddress = await wrapper.haku();

  const fuji = await Token.attach(fujiAddress);
  const haku = await Token.attach(hakuAddress);

  dataVariable = await fuji.transfer(1000, submissionAddress);
  dataVariable = await haku.transfer(1000, submissionAddress);
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
