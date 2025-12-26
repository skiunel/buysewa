/**
 * Real Blockchain Service - Connects to Ethereum/Polygon via MetaMask
 * Replaces mock blockchain service with real Web3 integration
 */

import { ethers } from 'ethers';

// Contract ABI (matching ReviewAuth.sol)
const CONTRACT_ABI = [
  "function registerSDC(bytes32 hashedSDC, address userAddress, uint256 productId, uint256 orderId) external",
  "function verifySDC(bytes32 hashedSDC) external view returns (bool isValid, bool isUsed, uint256 productId, address userAddress)",
  "function submitReview(bytes32 hashedSDC, uint256 productId, string memory ipfsHash, uint256 rating) external",
  "function getReview(uint256 reviewId) external view returns (tuple(uint256 reviewId, uint256 productId, address reviewer, bytes32 sdcHash, string ipfsHash, uint256 rating, uint256 timestamp, bool verified))",
  "function getProductReviewIds(uint256 productId) external view returns (uint256[] memory)",
  "function getProductReviewCount(uint256 productId) external view returns (uint256)",
  "event SDCRegistered(bytes32 indexed sdcHash, address indexed user, uint256 indexed productId, uint256 orderId, uint256 timestamp)",
  "event ReviewSubmitted(uint256 indexed reviewId, uint256 indexed productId, address indexed reviewer, bytes32 sdcHash, string ipfsHash, uint256 rating, uint256 timestamp)"
];

// Get contract address from environment or use default
const getContractAddress = () => {
  return import.meta.env.VITE_CONTRACT_ADDRESS || process.env.REVIEW_AUTH_CONTRACT_ADDRESS || '';
};

// Get RPC URL from environment
const getRpcUrl = () => {
  return import.meta.env.VITE_BLOCKCHAIN_RPC_URL || 'http://localhost:8545';
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';
};

// Get provider (MetaMask or fallback)
const getProvider = () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return new ethers.BrowserProvider((window as any).ethereum);
  }
  // Fallback to RPC provider
  return new ethers.JsonRpcProvider(getRpcUrl());
};

// Get signer from MetaMask
const getSigner = async () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    const provider = new ethers.BrowserProvider((window as any).ethereum);
    return await provider.getSigner();
  }
  throw new Error('MetaMask not available');
};

// Get contract instance
const getContract = async () => {
  const contractAddress = getContractAddress();
  if (!contractAddress) {
    throw new Error('Contract address not configured');
  }

  const signer = await getSigner();
  return new ethers.Contract(contractAddress, CONTRACT_ABI, signer);
};

// Get read-only contract instance
const getReadOnlyContract = () => {
  const contractAddress = getContractAddress();
  if (!contractAddress) {
    throw new Error('Contract address not configured');
  }

  const provider = getProvider();
  return new ethers.Contract(contractAddress, CONTRACT_ABI, provider);
};

// ============ WALLET FUNCTIONS ============
export const walletService = {
  // Check if wallet is connected
  isConnected: async (): Promise<boolean> => {
    if (!isMetaMaskInstalled()) return false;
    
    try {
      const provider = getProvider();
      const accounts = await provider.listAccounts();
      return accounts.length > 0;
    } catch {
      return false;
    }
  },

  // Connect MetaMask wallet
  connect: async (): Promise<{ success: boolean; address?: string; error?: string }> => {
    if (!isMetaMaskInstalled()) {
      return {
        success: false,
        error: 'MetaMask is not installed. Please install MetaMask extension.'
      };
    }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts && accounts.length > 0) {
        return {
          success: true,
          address: accounts[0]
        };
      }

      return {
        success: false,
        error: 'No accounts found'
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to connect wallet'
      };
    }
  },

  // Disconnect wallet
  disconnect: async (): Promise<void> => {
    // MetaMask doesn't have a disconnect method
    // Just clear local storage
    localStorage.removeItem('wallet_address');
  },

  // Get current wallet address
  getAddress: async (): Promise<string | null> => {
    if (!isMetaMaskInstalled()) return null;

    try {
      const provider = getProvider();
      const signer = await provider.getSigner();
      return await signer.getAddress();
    } catch {
      return null;
    }
  },

  // Get network info
  getNetwork: async () => {
    if (!isMetaMaskInstalled()) return null;

    try {
      const provider = getProvider();
      const network = await provider.getNetwork();
      return {
        chainId: Number(network.chainId),
        name: network.name
      };
    } catch {
      return null;
    }
  },

  // Switch network (for Polygon, etc.)
  switchNetwork: async (chainId: number) => {
    if (!isMetaMaskInstalled()) {
      throw new Error('MetaMask not installed');
    }

    try {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // If chain doesn't exist, add it
      if (error.code === 4902) {
        // Add Polygon Mumbai testnet
        await (window as any).ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${chainId.toString(16)}`,
            chainName: 'Polygon Mumbai',
            nativeCurrency: {
              name: 'MATIC',
              symbol: 'MATIC',
              decimals: 18
            },
            rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
            blockExplorerUrls: ['https://mumbai.polygonscan.com']
          }]
        });
      } else {
        throw error;
      }
    }
  }
};

// ============ SMART CONTRACT FUNCTIONS ============
export const blockchainService = {
  // Verify SDC code on blockchain
  verifySDC: async (sdcCode: string): Promise<{
    success: boolean;
    isValid: boolean;
    isUsed: boolean;
    productId?: string;
    userAddress?: string;
    error?: string;
  }> => {
    try {
      const contract = getReadOnlyContract();
      const hashedSDC = ethers.keccak256(ethers.toUtf8Bytes(sdcCode));
      
      const result = await contract.verifySDC(hashedSDC);
      
      return {
        success: true,
        isValid: result.isValid,
        isUsed: result.isUsed,
        productId: result.productId?.toString(),
        userAddress: result.userAddress
      };
    } catch (error: any) {
      return {
        success: false,
        isValid: false,
        isUsed: false,
        error: error.message || 'Failed to verify SDC on blockchain'
      };
    }
  },

  // Register SDC on blockchain (requires wallet connection)
  registerSDC: async (
    sdcCode: string,
    userAddress: string,
    productId: string,
    orderId: string
  ): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> => {
    try {
      const contract = await getContract();
      const hashedSDC = ethers.keccak256(ethers.toUtf8Bytes(sdcCode));

      const tx = await contract.registerSDC(
        hashedSDC,
        userAddress,
        productId,
        orderId
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to register SDC on blockchain'
      };
    }
  },

  // Submit review to blockchain
  submitReview: async (
    sdcCode: string,
    productId: string,
    ipfsHash: string,
    rating: number
  ): Promise<{
    success: boolean;
    txHash?: string;
    reviewId?: string;
    error?: string;
  }> => {
    try {
      const contract = await getContract();
      const hashedSDC = ethers.keccak256(ethers.toUtf8Bytes(sdcCode));

      const tx = await contract.submitReview(
        hashedSDC,
        productId,
        ipfsHash,
        rating
      );

      const receipt = await tx.wait();

      // Parse events to get review ID
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'ReviewSubmitted';
        } catch {
          return false;
        }
      });

      let reviewId = null;
      if (event) {
        const parsed = contract.interface.parseLog(event);
        reviewId = parsed?.args.reviewId?.toString();
      }

      return {
        success: true,
        txHash: receipt.hash,
        reviewId
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to submit review to blockchain'
      };
    }
  },

  // Get review from blockchain
  getReview: async (reviewId: string) => {
    try {
      const contract = getReadOnlyContract();
      const review = await contract.getReview(reviewId);
      
      return {
        success: true,
        data: {
          reviewId: review.reviewId.toString(),
          productId: review.productId.toString(),
          reviewer: review.reviewer,
          sdcHash: review.sdcHash,
          ipfsHash: review.ipfsHash,
          rating: review.rating.toString(),
          timestamp: new Date(Number(review.timestamp) * 1000).toISOString(),
          verified: review.verified
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get review from blockchain'
      };
    }
  },

  // Get product review count
  getProductReviewCount: async (productId: string) => {
    try {
      const contract = getReadOnlyContract();
      const count = await contract.getProductReviewCount(productId);
      
      return {
        success: true,
        count: Number(count)
      };
    } catch (error: any) {
      return {
        success: false,
        count: 0,
        error: error.message
      };
    }
  },

  // Get transaction receipt
  getTransactionReceipt: async (txHash: string) => {
    try {
      const provider = getProvider();
      const receipt = await provider.getTransactionReceipt(txHash);
      
      return {
        success: true,
        data: {
          hash: receipt.hash,
          blockNumber: receipt.blockNumber,
          confirmations: receipt.confirmations,
          status: receipt.status === 1 ? 'success' : 'failed'
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

// ============ IPFS SERVICE ============
// In production, use real IPFS (Pinata, Infura IPFS, etc.)
export const ipfsService = {
  uploadReview: async (reviewData: any): Promise<string> => {
    // For now, generate mock IPFS hash
    // In production, upload to IPFS and return hash
    const mockHash = 'Qm' + Array.from({ length: 44 }, () => 
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]
    ).join('');
    
    // Store in localStorage for demo
    localStorage.setItem(`ipfs_${mockHash}`, JSON.stringify(reviewData));
    
    return mockHash;
  },

  getFromIPFS: async (ipfsHash: string) => {
    const data = localStorage.getItem(`ipfs_${ipfsHash}`);
    if (!data) throw new Error('IPFS data not found');
    return JSON.parse(data);
  }
};

// ============ BLOCKCHAIN EXPLORER ============
export const explorerService = {
  getTxUrl: (txHash: string, network: string = 'mumbai') => {
    const explorers: { [key: string]: string } = {
      mumbai: 'https://mumbai.polygonscan.com/tx/',
      polygon: 'https://polygonscan.com/tx/',
      ethereum: 'https://etherscan.io/tx/',
      sepolia: 'https://sepolia.etherscan.io/tx/',
      localhost: `http://localhost:8545/tx/`
    };
    
    return (explorers[network] || explorers.mumbai) + txHash;
  },

  getAddressUrl: (address: string, network: string = 'mumbai') => {
    const explorers: { [key: string]: string } = {
      mumbai: 'https://mumbai.polygonscan.com/address/',
      polygon: 'https://polygonscan.com/address/',
      ethereum: 'https://etherscan.io/address/',
      sepolia: 'https://sepolia.etherscan.io/address/'
    };
    
    return (explorers[network] || explorers.mumbai) + address;
  }
};

export default {
  wallet: walletService,
  blockchain: blockchainService,
  ipfs: ipfsService,
  explorer: explorerService
};



