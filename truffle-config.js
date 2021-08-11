module.exports = {
  debug: true,
  stacktrace: true,
  stacktraceExtra: true,
  networks: {
    // MNEMONIC - walnut budget shift deer remove morning any move humble debris cheese soon
    localhost: {
      host: '127.0.0.1',
      network_id: '*', // Match any network id
    },
    development: {
      host: '127.0.0.1',
      network_id: '*', // Match any network id
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
