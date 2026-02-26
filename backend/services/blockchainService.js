const { getContract, getProvider } = require("../config/blockchain");

/**
 * Commit an SDC hash to the blockchain.
 * @param {string} sdcHash - The keccak256 hash of the SDC (bytes32 hex string).
 * @returns {Object} - { txHash, blockNumber }
 */
const commitSDCToChain = async (sdcHash) => {
  try {
    const contract = getContract();
    if (!contract) {
      console.warn("Blockchain not configured, using mock transaction");
      return {
        txHash:
          "0x" + require("crypto").randomBytes(32).toString("hex"),
        blockNumber: Math.floor(Math.random() * 1000000),
      };
    }

    const tx = await contract.commitSDC(sdcHash);
    const receipt = await tx.wait();

    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error("Blockchain commitSDC error:", error.message);
    throw new Error("Failed to commit SDC to blockchain");
  }
};

/**
 * Submit a review to the blockchain.
 * @param {string} sdcHash - The keccak256 hash of the SDC (bytes32 hex string).
 * @param {string} ipfsHash - The IPFS CID of the review content.
 * @returns {Object} - { txHash, blockNumber }
 */
const submitReviewToChain = async (sdcHash, ipfsHash) => {
  try {
    const contract = getContract();
    if (!contract) {
      console.warn("Blockchain not configured, using mock transaction");
      return {
        txHash:
          "0x" + require("crypto").randomBytes(32).toString("hex"),
        blockNumber: Math.floor(Math.random() * 1000000),
      };
    }

    const tx = await contract.submitReview(sdcHash, ipfsHash);
    const receipt = await tx.wait();

    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
    };
  } catch (error) {
    console.error("Blockchain submitReview error:", error.message);
    throw new Error("Failed to submit review to blockchain");
  }
};

/**
 * Get a review from the blockchain by SDC hash.
 * @param {string} sdcHash - The keccak256 hash of the SDC.
 * @returns {Object} - { ipfsHash, submitter, timestamp }
 */
const getReviewFromChain = async (sdcHash) => {
  try {
    const contract = getContract();
    if (!contract) {
      return null;
    }

    const [ipfsHash, submitter, timestamp] =
      await contract.getReviewDetails(sdcHash);
    return {
      ipfsHash,
      submitter,
      timestamp: Number(timestamp),
    };
  } catch (error) {
    console.error("Blockchain getReview error:", error.message);
    return null;
  }
};

/**
 * Check if an SDC is committed on the blockchain.
 */
const isSDCCommittedOnChain = async (sdcHash) => {
  try {
    const contract = getContract();
    if (!contract) return false;
    return await contract.isSDCCommitted(sdcHash);
  } catch (error) {
    return false;
  }
};

/**
 * Check if an SDC has been used for a review.
 */
const isSDCUsedOnChain = async (sdcHash) => {
  try {
    const contract = getContract();
    if (!contract) return false;
    return await contract.isSDCUsed(sdcHash);
  } catch (error) {
    return false;
  }
};

/**
 * Get blockchain stats (total SDCs and reviews).
 */
const getBlockchainStats = async () => {
  try {
    const contract = getContract();
    if (!contract) {
      return { totalSDCs: 0, totalReviews: 0 };
    }
    const [totalSDCs, totalReviews] = await Promise.all([
      contract.totalSDCsCommitted(),
      contract.totalReviewsSubmitted(),
    ]);
    return {
      totalSDCs: Number(totalSDCs),
      totalReviews: Number(totalReviews),
    };
  } catch (error) {
    return { totalSDCs: 0, totalReviews: 0 };
  }
};

module.exports = {
  commitSDCToChain,
  submitReviewToChain,
  getReviewFromChain,
  isSDCCommittedOnChain,
  isSDCUsedOnChain,
  getBlockchainStats,
};
