const DEBUG = true;

var owner, user;

var fuji, haku, tate;

function setUsers(signers) {
  [signer] = signers;
  if (signer) {
    owner = signer.address;
    user = signers[1].address;
    return;
  }
  [owner] = hre.network.config.provider().addresses;
}

async function getTokens(deployer) {
  debugger;
}

async function transferTokens(address) {
  debugger;
  if (DEBUG) {
    console.log('address');
    console.log(address);
  }
  fuji.approveFrom(fuji.address, address, 1000);
  fuji.transferFrom(fuji.address, address, 1000);

  haku.approveFrom(haku.address, address, 1000);
  haku.transferFrom(haku.address, address, 1000);
}

async function getBalances(addresses) {
  return await Promise.all(
    addresses.map(async (item, index) => {
      let fujiBalance, hakuBalance, tateBalance;
      fujiBalance = await fuji.balanceOf(item);
      hakuBalance = await haku.balanceOf(item);
      tateBalance = await tate.balanceOf(item);
      return {
        fuji: fujiBalance.toNumber(),
        haku: hakuBalance.toNumber(),
        tate: tateBalance.toNumber(),
      };
    }),
  );
}

module.exports = async function (deployer, network, [primary, secondary]) {
  owner = primary;
  user = secondary;

  const { chain, emitter, logger, networks, provider } = deployer;

  if (DEBUG) {
    debugger;
  }

  debugger;

  if (DEBUG) {
    debugger;
  }
};
