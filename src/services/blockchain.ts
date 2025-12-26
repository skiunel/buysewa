// Mock Blockchain Service - Simulates Smart Contract Interactions
// In production, this would interact with actual blockchain (Ethereum, Polygon, etc.)

// Simulated delay
const delay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Mock blockchain storage
const mockBlockchain = {
  reviews: JSON.parse(localStorage.getItem('blockchain_reviews') || '[]'),
  transactions: JSON.parse(localStorage.getItem('blockchain_txns') || '[]'),
  sdcCodes: JSON.parse(localStorage.getItem('blockchain_sdcs') || '{}')
};

const saveBlockchain = () => {
  localStorage.setItem('blockchain_reviews', JSON.stringify(mockBlockchain.reviews));
  localStorage.setItem('blockchain_txns', JSON.stringify(mockBlockchain.transactions));
  localStorage.setItem('blockchain_sdcs', JSON.stringify(mockBlockchain.sdcCodes));
};

// Generate mock blockchain hash
const generateHash = () => {
  return '0x' + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
};

// Generate mock IPFS hash
const generateIPFSHash = () => {
  return 'Qm' + Array.from({ length: 44 }, () => 
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]
  ).join('');
};

// ============ SMART CONTRACT SIMULATION ============
export const smartContract = {
  // Check if wallet is connected
  isWalletConnected: async () => {
    await delay(300);
    const wallet = localStorage.getItem('mock_wallet_address');
    return !!wallet;
  },

  // Connect wallet (MetaMask simulation)
  connectWallet: async () => {
    await delay(500);
    // Simulate MetaMask connection
    const mockAddress = '0x' + Array.from({ length: 40 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    localStorage.setItem('mock_wallet_address', mockAddress);
    return {
      success: true,
      address: mockAddress
    };
  },

  // Disconnect wallet
  disconnectWallet: async () => {
    localStorage.removeItem('mock_wallet_address');
    return { success: true };
  },

  // Get wallet address
  getWalletAddress: () => {
    return localStorage.getItem('mock_wallet_address');
  },

  // Verify SDC code on blockchain
  verifySDC: async (sdcCode: string) => {
    await delay();
    const isValid = mockBlockchain.sdcCodes[sdcCode];
    return {
      success: true,
      valid: !!isValid,
      data: isValid || null
    };
  },

  // Register SDC code on blockchain
  registerSDC: async (sdcCode: string, orderData: any) => {
    await delay(1000);
    const txHash = generateHash();
    
    mockBlockchain.sdcCodes[sdcCode] = {
      orderId: orderData.orderId,
      userId: orderData.userId,
      productId: orderData.productId,
      registeredAt: new Date().toISOString(),
      txHash
    };

    mockBlockchain.transactions.push({
      hash: txHash,
      type: 'SDC_REGISTRATION',
      timestamp: new Date().toISOString(),
      data: { sdcCode }
    });

    saveBlockchain();

    return {
      success: true,
      txHash,
      sdcCode
    };
  },

  // Submit review to blockchain
  submitReview: async (reviewData: any) => {
    await delay(1500);
    
    // Verify SDC first
    const sdcValid = await smartContract.verifySDC(reviewData.sdcCode);
    if (!sdcValid.valid) {
      throw new Error('Invalid SDC code - Review cannot be verified');
    }

    // Upload to IPFS (simulated)
    const ipfsHash = await ipfsService.uploadReview(reviewData);

    // Create blockchain transaction
    const txHash = generateHash();
    const blockchainReview = {
      id: `blockchain-review-${Date.now()}`,
      productId: reviewData.productId,
      userId: reviewData.userId,
      rating: reviewData.rating,
      ipfsHash,
      txHash,
      sdcCode: reviewData.sdcCode,
      timestamp: new Date().toISOString(),
      verified: true
    };

    mockBlockchain.reviews.push(blockchainReview);
    mockBlockchain.transactions.push({
      hash: txHash,
      type: 'REVIEW_SUBMISSION',
      timestamp: new Date().toISOString(),
      data: { reviewId: blockchainReview.id, ipfsHash }
    });

    saveBlockchain();

    return {
      success: true,
      txHash,
      ipfsHash,
      reviewId: blockchainReview.id
    };
  },

  // Get review from blockchain
  getReview: async (txHash: string) => {
    await delay();
    const review = mockBlockchain.reviews.find((r: any) => r.txHash === txHash);
    if (!review) throw new Error('Review not found on blockchain');
    return { success: true, data: review };
  },

  // Get all reviews for a product from blockchain
  getProductReviews: async (productId: number) => {
    await delay();
    const reviews = mockBlockchain.reviews.filter((r: any) => r.productId === productId);
    return { success: true, data: reviews };
  },

  // Check review eligibility
  checkReviewEligibility: async (userId: string, productId: number) => {
    await delay();
    
    // Check if user has a valid SDC for this product
    const userSDCs = Object.entries(mockBlockchain.sdcCodes).filter(([_, data]: any) => 
      data.userId === userId && data.productId === productId
    );

    // Check if user already reviewed this product
    const existingReview = mockBlockchain.reviews.find((r: any) => 
      r.userId === userId && r.productId === productId
    );

    return {
      success: true,
      eligible: userSDCs.length > 0 && !existingReview,
      reason: existingReview ? 'Already reviewed' : userSDCs.length === 0 ? 'No verified purchase' : 'Eligible'
    };
  },

  // Get transaction details
  getTransaction: async (txHash: string) => {
    await delay();
    const txn = mockBlockchain.transactions.find((t: any) => t.hash === txHash);
    if (!txn) throw new Error('Transaction not found');
    return { success: true, data: txn };
  },

  // Get blockchain stats
  getStats: async () => {
    await delay();
    return {
      success: true,
      data: {
        totalReviews: mockBlockchain.reviews.length,
        totalSDCs: Object.keys(mockBlockchain.sdcCodes).length,
        totalTransactions: mockBlockchain.transactions.length,
        verificationRate: mockBlockchain.reviews.length > 0 ? 100 : 0
      }
    };
  }
};

// ============ IPFS SERVICE SIMULATION ============
export const ipfsService = {
  // Upload review data to IPFS
  uploadReview: async (reviewData: any) => {
    await delay(800);
    const ipfsHash = generateIPFSHash();
    
    // Simulate IPFS storage
    const ipfsData = {
      hash: ipfsHash,
      data: {
        productId: reviewData.productId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        images: reviewData.images || [],
        timestamp: new Date().toISOString()
      }
    };

    localStorage.setItem(`ipfs_${ipfsHash}`, JSON.stringify(ipfsData));
    return ipfsHash;
  },

  // Retrieve data from IPFS
  getFromIPFS: async (ipfsHash: string) => {
    await delay(500);
    const data = localStorage.getItem(`ipfs_${ipfsHash}`);
    if (!data) throw new Error('IPFS data not found');
    return { success: true, data: JSON.parse(data) };
  },

  // Upload image to IPFS
  uploadImage: async (file: File) => {
    await delay(1000);
    const ipfsHash = generateIPFSHash();
    
    // In production, this would upload to IPFS
    // For now, create object URL
    const url = URL.createObjectURL(file);
    localStorage.setItem(`ipfs_img_${ipfsHash}`, url);
    
    return { success: true, hash: ipfsHash, url };
  }
};

// ============ BLOCKCHAIN EXPLORER ============
export const blockchainExplorer = {
  // Get explorer URL for transaction
  getTxUrl: (txHash: string) => {
    // Mock Etherscan/Polygonscan URL
    return `https://polygonscan.com/tx/${txHash}`;
  },

  // Get explorer URL for address
  getAddressUrl: (address: string) => {
    return `https://polygonscan.com/address/${address}`;
  }
};

// ============ GAS ESTIMATION ============
export const gasEstimator = {
  estimateReviewSubmission: async () => {
    await delay(300);
    return {
      success: true,
      gasPrice: '12 gwei',
      estimatedCost: '0.0024 MATIC (~NPR 0.50)',
      estimatedTime: '2-5 seconds'
    };
  }
};

export default {
  contract: smartContract,
  ipfs: ipfsService,
  explorer: blockchainExplorer,
  gas: gasEstimator
};
