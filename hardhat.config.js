require('@nomiclabs/hardhat-waffle');
const fs = require('fs');
const privateKey =
  fs.readFileSync('.secret').toString().trim() ||
  '7f413c5e312b32956d82218dfc2640ea72aa8087bedd977afc60ef486418f4ac';

module.exports = {
  defaultNetwork: 'mumbai',
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: 'https://matic-mumbai.chainstacklabs.com',
      accounts: [privateKey],
    },
    matic: {
      url: 'https://rpc-mainnet.maticvigil.com',
      accounts: [privateKey],
    },
  },
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
