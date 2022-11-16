import { HardhatUserConfig } from "hardhat/config";
import variables from "./variables";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  // networks: {
  //   mumbai: {
  //     url: variables.rpc_url,
  //     accounts: [
  //       variables.owner_of_nft_private_key,
  //       variables.owner_of_nft_market_private_key,
  //     ],
  //   },
  // },
};

export default config;
