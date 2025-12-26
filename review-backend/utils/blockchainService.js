/**
 * Blockchain Payment Service
 * Handles blockchain-based payment processing and SDC registration
 */

const { ethers } = require('ethers');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Contract ABI for ReviewAuth smart contract
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "bytes32", "name": "hashedSDC", "type": "bytes32"},
      {"internalType": "address", "name": "userAddress", "type": "address"},
      {"internalType": "uint256", "name": "productId", "type": "uint256"},
      {"internalType": "uint256", "name": "orderId", "type": "uint256"}
    ],
    "name": "registerSDC",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "hashedSDC", "type": "bytes32"}],
    "name": "verifySDC",
    "outputs": [
      {"internalType": "bool", "name": "isValid", "type": "bool"},
      {"internalType": "bool", "name": "isUsed", "type": "bool"},
      {"internalType": "uint256", "name": "productId", "type": "uint256"},
      {"internalType": "address", "name": "userAddress", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "bytes32", "name": "hashedSDC", "type": "bytes32"},
      {"internalType": "uint256", "name": "productId", "type": "uint256"},
      {"internalType": "string", "name": "ipfsHash", "type": "string"},
      {"internalType": "uint256", "name": "rating", "type": "uint256"}
    ],
    "name": "submitReview",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

class BlockchainPaymentService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.contractAddress = process.env.REVIEW_AUTH_CONTRACT_ADDRESS;
    this.rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';
    this.privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
    this.initialized = false;
  }

  /**
   * Initialize blockchain connection
   */
  async initialize() {
    try {
      // Connect to blockchain network
      this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
      
      // Check if we have a private key for transactions
      if (this.privateKey && this.privateKey !== 'your_blockchain_private_key_keep_secret') {
        this.signer = new ethers.Wallet(this.privateKey, this.provider);
      }

      // Connect to smart contract if address is configured
      if (this.contractAddress && this.contractAddress !== '0x1234567890123456789012345678901234567890') {
        if (!this.signer) {
          console.warn('⚠️  No private key configured. Contract calls will be read-only.');
        }
        
        this.contract = new ethers.Contract(
          this.contractAddress,
          CONTRACT_ABI,
          this.signer || this.provider
        );
      }

      this.initialized = true;
      console.log('✅ Blockchain service initialized');
      console.log(`   RPC URL: ${this.rpcUrl}`);
      console.log(`   Contract: ${this.contractAddress || 'Not configured'}`);
      
      return true;
    } catch (error) {
      console.error('❌ Blockchain initialization error:', error.message);
      this.initialized = false;
      return false;
    }
  }

  /**
   * Generate SDC (Secure Digital Code)
   * @returns {object} {code, hash}
   */
  generateSDC() {
    try {
      // Generate random 32-byte code
      const randomBytes = crypto.randomBytes(32);
      const sdcCode = randomBytes.toString('hex').toUpperCase();
      
      // Create hash using keccak256 (Ethereum standard)
      const hash = ethers.keccak256('0x' + sdcCode);
      
      return {
        code: sdcCode,
        hash: hash,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error generating SDC:', error);
      throw error;
    }
  }

  /**
   * Register SDC on blockchain
   * @param {string} sdcCode - The SDC code
   * @param {string} userAddress - User's wallet address
   * @param {number} productId - Product ID
   * @param {number} orderId - Order ID
   * @returns {object} Transaction details
   */
  async registerSDCOnBlockchain(sdcCode, userAddress, productId, orderId) {
    try {
      if (!this.initialized || !this.contract) {
        throw new Error('Blockchain service not properly initialized');
      }

      if (!this.signer) {
        throw new Error('No signer available for blockchain transactions');
      }

      // Hash the SDC code
      const sdcHash = ethers.keccak256('0x' + sdcCode);

      // Call smart contract
      const tx = await this.contract.registerSDC(
        sdcHash,
        userAddress,
        productId,
        orderId
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? 'confirmed' : 'failed'
      };
    } catch (error) {
      console.error('Error registering SDC on blockchain:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verify SDC on blockchain
   * @param {string} sdcCode - The SDC code to verify
   * @returns {object} Verification result
   */
  async verifySDCOnBlockchain(sdcCode) {
    try {
      if (!this.initialized || !this.contract) {
        throw new Error('Blockchain service not properly initialized');
      }

      // Hash the SDC code
      const sdcHash = ethers.keccak256('0x' + sdcCode);

      // Call smart contract
      const result = await this.contract.verifySDC(sdcHash);

      return {
        isValid: result.isValid,
        isUsed: result.isUsed,
        productId: result.productId.toString(),
        userAddress: result.userAddress
      };
    } catch (error) {
      console.error('Error verifying SDC on blockchain:', error.message);
      return {
        isValid: false,
        isUsed: false,
        error: error.message
      };
    }
  }

  /**
   * Submit review on blockchain
   * @param {string} sdcCode - The SDC code
   * @param {number} productId - Product ID
   * @param {string} ipfsHash - IPFS hash of review
   * @param {number} rating - Rating (1-5)
   * @returns {object} Transaction details
   */
  async submitReviewOnBlockchain(sdcCode, productId, ipfsHash, rating) {
    try {
      if (!this.initialized || !this.contract) {
        throw new Error('Blockchain service not properly initialized');
      }

      if (!this.signer) {
        throw new Error('No signer available for blockchain transactions');
      }

      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Hash the SDC code
      const sdcHash = ethers.keccak256('0x' + sdcCode);

      // Call smart contract
      const tx = await this.contract.submitReview(
        sdcHash,
        productId,
        ipfsHash,
        rating
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      return {
        success: true,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        status: receipt.status === 1 ? 'confirmed' : 'failed'
      };
    } catch (error) {
      console.error('Error submitting review on blockchain:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get blockchain network info
   * @returns {object} Network details
   */
  async getNetworkInfo() {
    try {
      if (!this.provider) {
        return { connected: false };
      }

      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();

      return {
        connected: true,
        chainId: network.chainId,
        chainName: network.name,
        blockNumber: blockNumber,
        rpcUrl: this.rpcUrl
      };
    } catch (error) {
      return { connected: false, error: error.message };
    }
  }

  /**
   * Hash SDC code for local verification
   * @param {string} sdcCode - The SDC code
   * @returns {string} Hashed code
   */
  hashSDC(sdcCode) {
    return ethers.keccak256('0x' + sdcCode);
  }
}

// Export singleton instance
module.exports = BlockchainPaymentService;
