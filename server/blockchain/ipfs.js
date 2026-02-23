import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

// Configure IPFS client - local node
let ipfs;
try {
  ipfs = create({ host: '127.0.0.1', port: '5001', protocol: 'http' });
} catch (e) {
  console.warn('IPFS client initialization failed:', e.message);
}

export const uploadToIPFS = async (reviewData) => {
  if (!ipfs) throw new Error('IPFS client not initialized');

  try {
    const reviewJSON = JSON.stringify(reviewData);
    const { cid } = await ipfs.add(Buffer.from(reviewJSON));
    return cid.toString();
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to local IPFS node. Please make sure IPFS daemon is running.');
    }
    throw new Error(`Failed to upload review to IPFS: ${error.message}`);
  }
};

export const getFromIPFS = async (ipfsHash) => {
  if (!ipfs) throw new Error('IPFS client not initialized');

  try {
    const stream = ipfs.cat(ipfsHash);
    let data = [];
    for await (const chunk of stream) {
      data.push(chunk);
    }
    const reviewJSON = Buffer.concat(data).toString();
    return JSON.parse(reviewJSON);
  } catch (error) {
    console.error('Error retrieving from IPFS:', error);
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to local IPFS node. Please make sure IPFS daemon is running.');
    }
    throw new Error(`Failed to retrieve review from IPFS: ${error.message}`);
  }
};

export default { uploadToIPFS, getFromIPFS };
