require("dotenv").config();
const HDWalletProvider = require("truffle-hdwallet-provider");
const mnemonic = process.env.MNEMONIC;
const infuraAccessToken = process.env.INFURA_ACCESS_TOKEN;

module.exports = {
    networks: {
        ropsten: {
            provider: () =>
                new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infuraAccessToken),
            network_id: 3,
            gas: 7900000,
            gasPrice: 20000000000
        },
        mainnet: {
            provider: () =>
                new HDWalletProvider(mnemonic, "https://mainnet.infura.io/" + infuraAccessToken),
            network_id: 1,
            gasPrice: 20000000000
        }
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};
