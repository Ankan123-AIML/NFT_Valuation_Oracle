export const CONTRACT_ADDRESSES = {
  VALUATION_ORACLE: "0x1234567890123456789012345678901234567890", // Replace with actual deployed address
};

export const SUPPORTED_CHAINS = {
  ETHEREUM: 1,
  GOERLI: 5,
  POLYGON: 137,
  MUMBAI: 80001,
};

export const CHAIN_NAMES = {
  [SUPPORTED_CHAINS.ETHEREUM]: "Ethereum Mainnet",
  [SUPPORTED_CHAINS.GOERLI]: "Goerli Testnet",
  [SUPPORTED_CHAINS.POLYGON]: "Polygon",
  [SUPPORTED_CHAINS.MUMBAI]: "Mumbai Testnet",
};

export const RPC_URLS = {
  [SUPPORTED_CHAINS.ETHEREUM]: "https://mainnet.infura.io/v3/YOUR_INFURA_KEY",
  [SUPPORTED_CHAINS.GOERLI]: "https://goerli.infura.io/v3/YOUR_INFURA_KEY",
  [SUPPORTED_CHAINS.POLYGON]: "https://polygon-rpc.com",
  [SUPPORTED_CHAINS.MUMBAI]: "https://rpc-mumbai.maticvigil.com",
};