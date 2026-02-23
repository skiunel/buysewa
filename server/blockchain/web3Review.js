import Web3 from 'web3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ipfsService from './ipfs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.GANACHE_URL || 'http://127.0.0.1:7545')
);

let reviewContract;
let contractAddress;

const initContract = async () => {
  try {
    const contractPath = path.resolve(__dirname, '../../build/contracts/ReviewContract.json');

    if (!fs.existsSync(contractPath)) {
      console.warn('ReviewContract.json not found. Run: truffle migrate');
      return null;
    }

    const contractJson = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    const abi = contractJson.abi;

    // Get network ID
    const networkId = Object.keys(contractJson.networks)[0];
    if (!networkId) {
      console.warn('No deployed network found in contract JSON');
      return null;
    }

    contractAddress = contractJson.networks[networkId].address;
    reviewContract = new web3.eth.Contract(abi, contractAddress);
    console.log('Review contract initialized at:', contractAddress);
    return reviewContract;
  } catch (error) {
    console.error('Error initializing contract:', error.message);
    return null;
  }
};

export const getContract = async () => {
  if (!reviewContract) {
    await initContract();
  }
  return reviewContract;
};

export const verifyReviewer = async (userId, productId) => {
  try {
    const contract = await getContract();
    if (!contract) throw new Error('Contract not available');

    const accounts = await web3.eth.getAccounts();
    const adminAccount = accounts[0];

    const tx = await contract.methods
      .verifyReviewer(userId, productId)
      .send({ from: adminAccount, gas: 200000 });

    console.log('Reviewer verified:', userId, 'for product:', productId);
    return tx;
  } catch (error) {
    console.error('Error verifying reviewer:', error);
    throw new Error('Failed to verify reviewer on blockchain');
  }
};

export const isReviewerVerified = async (userId, productId) => {
  try {
    const contract = await getContract();
    if (!contract) return false;
    return await contract.methods.isReviewerVerified(userId, productId).call();
  } catch (error) {
    console.error('Error checking reviewer verification:', error);
    return false;
  }
};

export const hasUserReviewed = async (userId, productId) => {
  try {
    const contract = await getContract();
    if (!contract) return false;
    return await contract.methods.hasUserReviewed(userId, productId).call();
  } catch (error) {
    console.error('Error checking if user has reviewed:', error);
    return false;
  }
};

export const addReview = async (userId, productId, reviewData) => {
  try {
    const ipfsHash = await ipfsService.uploadToIPFS(reviewData);
    const contract = await getContract();
    if (!contract) throw new Error('Contract not available');

    const accounts = await web3.eth.getAccounts();
    const adminAccount = accounts[0];

    const tx = await contract.methods
      .submitReview(userId, productId, ipfsHash)
      .send({ from: adminAccount, gas: 200000 });

    console.log('Review added to blockchain, IPFS hash:', ipfsHash);
    return { tx, ipfsHash };
  } catch (error) {
    console.error('Error adding review to blockchain:', error);
    if (error.message && error.message.includes('IPFS')) throw error;
    if (error.message && error.message.includes('connect')) {
      throw new Error('Cannot connect to Ganache blockchain. Please make sure Ganache is running.');
    }
    throw new Error(`Failed to add review to blockchain: ${error.message}`);
  }
};

export const fetchReviews = async (productId) => {
  try {
    const contract = await getContract();
    if (!contract) return [];

    const reviews = await contract.methods.getReviews(productId).call();

    const reviewsWithData = await Promise.all(
      reviews.map(async (review) => {
        try {
          const reviewData = await ipfsService.getFromIPFS(review.ipfsHash);
          return {
            ...reviewData,
            timestamp: new Date(Number(review.timestamp) * 1000).toISOString(),
            ipfsHash: review.ipfsHash,
          };
        } catch (e) {
          return {
            ipfsHash: review.ipfsHash,
            timestamp: new Date(Number(review.timestamp) * 1000).toISOString(),
            error: 'Could not retrieve from IPFS',
          };
        }
      })
    );

    return reviewsWithData;
  } catch (error) {
    console.error('Error fetching reviews from blockchain:', error);
    throw new Error('Failed to fetch reviews from blockchain');
  }
};

export default {
  getContract,
  verifyReviewer,
  isReviewerVerified,
  hasUserReviewed,
  addReview,
  fetchReviews,
};
