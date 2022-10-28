require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      // This value will be replaced on runtime
      url: process.env.GOERLI_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
