import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "@nomiclabs/hardhat-etherscan";

require("dotenv").config();

const { API_URL, RESERVE3_PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "goerli",
  networks: {
    hardhat: {},
    goerli: {
      accounts: [RESERVE3_PRIVATE_KEY ? RESERVE3_PRIVATE_KEY : ""], //deployer
      url: API_URL,
      //blockGasLimit: 100000000000000,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
