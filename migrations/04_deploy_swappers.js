const DEBUG = false;

var owner, user;

const Wrapper = artifacts.require('Wrapper');
const Swap = artifacts.require('Swap');

var wrapper, fujiTateSwapper, tateHakuSwapper;

async function getWrapper(deployer) {
  wrapper = await Wrapper.deployed();
}

async function createSwappers(deployer) {
  function getSwapCreatedEvent(events) {
    return events.logs.filter((item) => {
      const { event } = item;
      if (event == 'SwapCreated') {
        return item;
      }
    });
  }

  const fujiTateSwapCreatedTransaction = await wrapper.createSwapper(
    'FujiTateSwapper',
    fuji.address,
    tate.address,
  );
  const [fujiTateSwapCreatedEvent] = getSwapCreatedEvent(
    fujiTateSwapCreatedTransaction,
  );
  const fujiTateSwapAddress = fujiTateSwapCreatedEvent.args.swap_;
  fujiTateSwapper = Swap.at(fujiTateSwapAddress);

  const tateHakuSwapCreatedTransaction = await wrapper.createSwapper(
    'TateHakuSwapper',
    tate.address,
    haku.address,
  );
  const [tateHakuSwapCreatedEvent] = getSwapCreatedEvent(
    tateHakuSwapCreatedTransaction,
  );
  const tateHakuSwapAddress = tateHakuSwapCreatedEvent.args.swap_;
  tateHakuSwapper = Swap.at(tateHakuSwapAddress);
  debugger;
}

module.exports = async function (deployer, network, [primary, secondary]) {
  owner = primary;
  user = secondary;
  await getWrapper(deployer);
  await createSwappers(deployer);
};
