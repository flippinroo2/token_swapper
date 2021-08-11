const Web3 = require('web3');
const protocol = 'http';
const ip = 'localhost';
const port = 9650;

module.exports = {
  debug: true,
  stacktrace: true,
  stacktraceExtra: true,
  networks: {
    // MNEMONIC - walnut budget shift deer remove morning any move humble debris cheese soon
    localhost: {
      provider: function () {
        return new Web3.providers.HttpProvider(`http://127.0.0.1:7545`, {
          keepAlive: true,
        });
      },
      network_id: '*', // Match any network id
    },
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*', // Match any network id
    },
    avalanche: {
      provider: function () {
        return new Web3.providers.HttpProvider(
          `${protocol}://${ip}:${port}/ext/bc/C/rpc`,
        );
      },
      network_id: '*',
      gas: 3000000,
      gasPrice: 225000000000,
      // "startnode node1 --db-type=memdb --staking-enabled=true --http-port=9650 --staking-port=9651 --log-level=debug --bootstrap-ips= --staking-tls-cert-file=certs/keys1/staker.crt --staking-tls-key-file=certs/keys1/staker.key",
      // "startnode node2 --db-type=memdb --staking-enabled=true --http-port=9652 --staking-port=9653 --log-level=debug --bootstrap-ips=127.0.0.1:9651 --bootstrap-ids=NodeID-7Xhw2mDxuDS44j42TCB6U5579esbSt3Lg --staking-tls-cert-file=certs/keys2/staker.crt --staking-tls-key-file=certs/keys2/staker.key",}
    },
  },
  build_directory: './artifacts',
  contracts_directory: './contracts',
  contracts_build_directory: './artifacts',
  migration_directory: './migrations',
  compilers: {
    solc: {
      version: '^0.8.0',
      evmVersion: 'petersburg',
      optimizer: {
        enabled: true,
        runs: 2000,
      },
    },
  },
};
