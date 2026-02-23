module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,       // Ganache GUI default port
      network_id: '5777',
    },
    ganache_cli: {
      host: '127.0.0.1',
      port: 8545,       // ganache-cli default port
      network_id: '*',
    },
  },

  mocha: {
    timeout: 100000,
  },

  compilers: {
    solc: {
      version: '0.8.19',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
        evmVersion: 'paris',
      },
    },
  },

  // Output build artifacts to server directory so the backend can read them
  contracts_build_directory: './server/build/contracts',
};
