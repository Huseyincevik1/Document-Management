    //require("@nomiclabs/hardhat-ethers");
    require("@nomiclabs/hardhat-waffle");

    const PRIVATE_KEY = "******************************************";


    module.exports = {
        solidity: "0.8.0",
        networks: {
          mainnet: {
            url: `https://api.avax.network/ext/bc/C/rpc`,
              accounts: [`${PRIVATE_KEY}`]
          },
          fuji: {
            url: `https://api.avax-test.network/ext/bc/C/rpc`,
              accounts: [`${PRIVATE_KEY}`]
          },
          ganache: {
            url: 'http://localhost:7545/', // Varsayılan Ganache RPC URL'si
              accounts: [`${PRIVATE_KEY}`]
          },
        }
    };
