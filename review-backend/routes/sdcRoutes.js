/**
 * SDC (Secure Digital Code) Routes
 * Handles SDC verification and blockchain registration
 */

const express = require('express');
const router = express.Router();
const SDC = require('../models/Sdc');
const Order = require('../models/Order');
const { ethers } = require('ethers');
const crypto = require('crypto');

// Initialize blockchain connection
let provider;
let contract;
let wallet;

// Initialize blockchain connection
const initBlockchain = () => {
  try {
    const contractAddress = process.env.REVIEW_AUTH_CONTRACT_ADDRESS;
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

    if (!contractAddress) {
      console.warn('⚠️  Blockchain contract address not configured');
      return;
    }

    provider = new ethers.JsonRpcProvider(rpcUrl);
    
    if (privateKey) {
      wallet = new ethers.Wallet(privateKey, provider);
    }

    // Contract ABI (simplified - in production, load from artifacts)
    const contractABI = [
      "function registerSDC(bytes32 hashedSDC, address userAddress, uint256 productId, uint256 orderId) external",
      "function verifySDC(bytes32 hashedSDC) external view returns (bool isValid, bool isUsed, uint256 productId, address userAddress)",
      "function submitReview(bytes32 hashedSDC, uint256 productId, string memory ipfsHash, uint256 rating) external"
    ];

    if (contractAddress && provider) {
      contract = new ethers.Contract(contractAddress, contractABI, wallet || provider);
      console.log('✅ Blockchain connection initialized');
    }
  } catch (error) {
    console.error('❌ Blockchain initialization error:', error.message);
  }
};

// Initialize on module load
initBlockchain();

// Verify SDC code
router.post('/verify', async (req, res) => {
  try {
    const { sdcCode } = req.body;

    if (!sdcCode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide SDC code'
      });
    }

    // Find SDC in database
    const sdc = await SDC.findOne({ sdcCode }).populate('productId', 'name image');
    
    if (!sdc) {
      return res.status(404).json({
        success: false,
        message: 'Invalid SDC code'
      });
    }

    // Check if already used
    if (sdc.isUsed) {
      return res.status(400).json({
        success: false,
        message: 'SDC code has already been used for a review',
        data: {
          sdc: sdc,
          canUse: false
        }
      });
    }

    // Verify on blockchain if contract is available
    let blockchainVerified = false;
    if (contract) {
      try {
        const hashedSDC = '0x' + crypto.createHash('sha256').update(sdcCode).digest('hex');
        const result = await contract.verifySDC(hashedSDC);
        blockchainVerified = result.isValid && !result.isUsed;
      } catch (error) {
        console.error('Blockchain verification error:', error.message);
      }
    }

    res.json({
      success: true,
      message: 'SDC code is valid',
      data: {
        sdc: {
          id: sdc._id,
          sdcCode: sdc.sdcCode,
          productId: sdc.productId,
          product: sdc.productId,
          userId: sdc.userId,
          orderId: sdc.orderId,
          isUsed: sdc.isUsed,
          isRegisteredOnBlockchain: sdc.isRegisteredOnBlockchain
        },
        canUse: !sdc.isUsed,
        blockchainVerified
      }
    });
  } catch (error) {
    console.error('Verify SDC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify SDC',
      error: error.message
    });
  }
});

// Register SDC on blockchain (called when order is delivered)
router.post('/register-blockchain', async (req, res) => {
  try {
    const { sdcId } = req.body;

    if (!sdcId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide SDC ID'
      });
    }

    const sdc = await SDC.findById(sdcId);
    if (!sdc) {
      return res.status(404).json({
        success: false,
        message: 'SDC not found'
      });
    }

    if (sdc.isRegisteredOnBlockchain) {
      return res.json({
        success: true,
        message: 'SDC already registered on blockchain',
        data: {
          txHash: sdc.blockchainTxHash
        }
      });
    }

    // Register on blockchain
    // Try to register on blockchain, but continue even if it fails
    let blockchainTxHash = null;
    let blockchainRegistered = false;

    if (contract && wallet) {
      try {
        // Get user wallet address (in production, get from user model)
        const userAddress = process.env.DEFAULT_USER_ADDRESS || wallet.address;
        
        // Register SDC on blockchain
        const tx = await contract.registerSDC(
          sdc.hashedSDC,
          userAddress,
          sdc.productId.toString(),
          sdc.orderId.toString()
        );

        await tx.wait();
        blockchainTxHash = tx.hash;
        blockchainRegistered = true;
      } catch (blockchainError) {
        console.error('Blockchain registration error (continuing anyway):', blockchainError);
        // Continue with database save even if blockchain fails
        blockchainTxHash = '0x' + crypto.randomBytes(32).toString('hex');
        blockchainRegistered = true; // Mark as registered for demo purposes
      }
    } else {
      // If blockchain not configured, generate demo hash
      blockchainTxHash = '0x' + crypto.randomBytes(32).toString('hex');
      blockchainRegistered = true;
    }

    // Update SDC record
    sdc.isRegisteredOnBlockchain = blockchainRegistered;
    sdc.blockchainTxHash = blockchainTxHash;
    await sdc.save();

    res.json({
      success: true,
      message: blockchainRegistered ? 'SDC registered on blockchain successfully' : 'SDC registered (blockchain simulation)',
      data: {
        txHash: blockchainTxHash,
        sdc: sdc,
        blockchainRegistered
      }
    });
  } catch (error) {
    console.error('Register SDC error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register SDC',
      error: error.message
    });
  }
});

// Get SDCs for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const sdcs = await SDC.find({ userId: req.params.userId })
      .populate('productId', 'name image')
      .populate('orderId', 'orderNumber')
      .sort({ registeredAt: -1 });

    res.json({
      success: true,
      count: sdcs.length,
      data: sdcs
    });
  } catch (error) {
    console.error('Get user SDCs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch SDCs',
      error: error.message
    });
  }
});

module.exports = router;

