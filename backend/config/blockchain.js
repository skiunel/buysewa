const { ethers } = require("ethers");
const path = require("path");
const fs = require("fs");

let provider;
let wallet;
let contract;

const getABI = () => {
  // Try loading from blockchain deployment artifacts
  const abiPath = path.join(
    __dirname,
    "..",
    "..",
    "blockchain",
    "artifacts",
    "contracts",
    "ReviewSystem.sol",
    "ReviewSystem.json"
  );

  if (fs.existsSync(abiPath)) {
    const artifact = JSON.parse(fs.readFileSync(abiPath, "utf8"));
    return artifact.abi;
  }

  // Fallback: inline ABI for the core functions
  return [
    "function commitSDC(bytes32 sdcHash) external",
    "function submitReview(bytes32 sdcHash, string memory ipfsHash) external",
    "function getReview(bytes32 sdcHash) external view returns (string memory)",
    "function getReviewDetails(bytes32 sdcHash) external view returns (string memory, address, uint256)",
    "function isSDCCommitted(bytes32 sdcHash) external view returns (bool)",
    "function isSDCUsed(bytes32 sdcHash) external view returns (bool)",
    "function totalSDCsCommitted() external view returns (uint256)",
    "function totalReviewsSubmitted() external view returns (uint256)",
    "event SDCCommitted(bytes32 indexed sdcHash)",
    "event ReviewSubmitted(bytes32 indexed sdcHash, string ipfsHash)",
  ];
};

const initBlockchain = () => {
  try {
    const rpcUrl = process.env.RPC_URL || "http://127.0.0.1:8545";
    provider = new ethers.JsonRpcProvider(rpcUrl);

    if (process.env.PRIVATE_KEY) {
      wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    }

    if (process.env.CONTRACT_ADDRESS && wallet) {
      const abi = getABI();
      contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);
    }

    console.log("Blockchain connection initialized");
    return { provider, wallet, contract };
  } catch (error) {
    console.error("Blockchain init error:", error.message);
    return { provider: null, wallet: null, contract: null };
  }
};

const getContract = () => {
  if (!contract) {
    initBlockchain();
  }
  return contract;
};

const getProvider = () => {
  if (!provider) {
    initBlockchain();
  }
  return provider;
};

const getWallet = () => {
  if (!wallet) {
    initBlockchain();
  }
  return wallet;
};

module.exports = {
  initBlockchain,
  getContract,
  getProvider,
  getWallet,
  getABI,
};
