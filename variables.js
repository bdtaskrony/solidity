require("dotenv").config();

const owner_of_nft_private_key = process.env.OWNER_OF_NFT_PRIVATE_KEY;
const owner_of_nft_market_private_key = process.env.OWNER_OF_MARKETPLACE;
const rpc_url = process.env.RPC_URL;
const nft_contract_address = process.env.NFT_CONTRACT_ADDRESS;
const nft_market_contract_address = process.env.NFT_MARKET_CONTRACT_ADDRESS;

const variables = {
  owner_of_nft_private_key,
  owner_of_nft_market_private_key,
  rpc_url,
  nft_contract_address,
  nft_market_contract_address
};

exports.default= variables;
