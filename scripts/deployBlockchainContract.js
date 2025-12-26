/**
 * Smart Contract Deployment Script
 * Deploy ReviewAuth contract to blockchain network
 */

const { ethers } = require('ethers');
require('dotenv').config();

// Contract bytecode and ABI
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "bytes32", "name": "sdcHash", "type": "bytes32"},
      {"indexed": false, "internalType": "bool", "name": "isValid", "type": "bool"},
      {"indexed": false, "internalType": "bool", "name": "isUsed", "type": "bool"}
    ],
    "name": "SDCVerified",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "bytes32", "name": "sdcHash", "type": "bytes32"},
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "orderId", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "SDCRegistered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "reviewId", "type": "uint256"},
      {"indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "reviewer", "type": "address"},
      {"indexed": false, "internalType": "bytes32", "name": "sdcHash", "type": "bytes32"},
      {"indexed": false, "internalType": "string", "name": "ipfsHash", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "rating", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "ReviewSubmitted",
    "type": "event"
  },
  {
    "inputs": [{"internalType": "address", "name": "userAddress", "type": "address"}, {"internalType": "uint256", "name": "productId", "type": "uint256"}],
    "name": "canUserReview",
    "outputs": [{"internalType": "bool", "name": "canReview", "type": "bool"}, {"internalType": "bool", "name": "hasSDC", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStats",
    "outputs": [{"internalType": "uint256", "name": "totalReviews", "type": "uint256"}, {"internalType": "uint256", "name": "totalSDCs", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "productId", "type": "uint256"}],
    "name": "getProductReviewCount",
    "outputs": [{"internalType": "uint256", "name": "count", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "productId", "type": "uint256"}],
    "name": "getProductReviewIds",
    "outputs": [{"internalType": "uint256[]", "name": "reviewIds", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "reviewId", "type": "uint256"}],
    "name": "getReview",
    "outputs": [{"components": [{"internalType": "uint256", "name": "reviewId", "type": "uint256"}, {"internalType": "uint256", "name": "productId", "type": "uint256"}, {"internalType": "address", "name": "reviewer", "type": "address"}, {"internalType": "bytes32", "name": "sdcHash", "type": "bytes32"}, {"internalType": "string", "name": "ipfsHash", "type": "string"}, {"internalType": "uint256", "name": "rating", "type": "uint256"}, {"internalType": "uint256", "name": "timestamp", "type": "uint256"}, {"internalType": "bool", "name": "verified", "type": "bool"}], "internalType": "struct ReviewAuth.Review", "name": "review", "type": "tuple"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "userAddress", "type": "address"}],
    "name": "getUserReviewIds",
    "outputs": [{"internalType": "uint256[]", "name": "reviewIds", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "reviewCounter",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "uint256"}],
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "hashedSDC", "type": "bytes32"}, {"internalType": "address", "name": "userAddress", "type": "address"}, {"internalType": "uint256", "name": "productId", "type": "uint256"}, {"internalType": "uint256", "name": "orderId", "type": "uint256"}],
    "name": "registerSDC",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "hashedSDC", "type": "bytes32"}, {"internalType": "uint256", "name": "productId", "type": "uint256"}, {"internalType": "string", "name": "ipfsHash", "type": "string"}, {"internalType": "uint256", "name": "rating", "type": "uint256"}],
    "name": "submitReview",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "bytes32", "name": "hashedSDC", "type": "bytes32"}],
    "name": "verifySDC",
    "outputs": [{"internalType": "bool", "name": "isValid", "type": "bool"}, {"internalType": "bool", "name": "isUsed", "type": "bool"}, {"internalType": "uint256", "name": "productId", "type": "uint256"}, {"internalType": "address", "name": "userAddress", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Simplified bytecode (you'll need the actual compiled bytecode)
const CONTRACT_BYTECODE = '0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060006003819055506130e0806100656000396000f3fe60806040523480156100105760008080fd5b50600436106101005760003560e01c80634b92a5b811610097578063b9afc7ae11610066578063b9afc7ae1461029e578063d4d8e7ce146102be578063dcd6e8cc146102da578063e5e6f04c146102f857610100565b80634b92a5b8146101f6578063715018a61461021457806393d86e341461021e5780639bd2b3a21461026a57610100565b80632f745c59116100d35780632f745c59146101765780633950935114610196578063422d62cf146101b45780634b92a5b8146101d657610100565b806304fc85181461010557806306fdde031461012357806308306d5f1461014157806318160ddd1461015d575b600080fd5b61010d610316565b6040516101199190615047565b60405180910390f35b61012b610338565b6040516101389190614fed565b60405180910390f35b61015b6004803603810190610156919061495c565b610397565b005b610165610533565b6040516101729190615047565b60405180910390f35b610190600480360381019061018b919061491f565b610539565b604051610199919061509e565b60405180910390f35b6101b860048036038101906101b3919061491f565b61062d565b6040516101c5919061509e565b60405180910390f35b6101de610725565b6040516101eb9190615047565b60405180910390f35b6101fe61072a565b60405161020b9190614fed565b60405180910390f35b61021c610736565b005b610238600480360381019061023391906149c4565b61074d565b604051610259949392919061504c565b505050565b610284600480360381019061027f9190614995565b610816565b60405161028f9190614fed565b60405180910390f35b6102a66108d7565b6040516102b59291906150b9565b60405180910390f35b6102c66108f1565b6040516102d39190614fed565b60405180910390f35b6102e26108fd565b6040516102ef9190614fed565b60405180910390f35b610300610903565b60405161030d9190614fed565b60405180910390f35b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60606040518060400160405280600b81526020017f42555945574101040570726f0000000000000000000000000000000000000000815250905090565b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206001015442116103db576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103d290614fa6565b60405180910390fd5b6104356040518060400160405280600b81526020017f42555945574101040570726f00000000000000000000000000000000000000008152509192509050506104d681610539565b9050610531826104d6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105289190614fed565b60405180910390fd5b505b50565b6000600354905090565b6000803373ffffffffffffffffffffffffffffffffffffffff16145b80156105c157506002600084815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614155b6105fa576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105f190614f7f565b60405180910390fd5b60008273ffffffffffffffffffffffffffffffffffffffff16905060019150915091565b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600101544210156106845760006000fd5b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163b11156106d757fe5b60015481905080505b5050505050565b6000600254905090565b6000600380549050905090565b600080336000807f08c379a0000000000000000000000000000000000000000000000000000000000816040516107669190614fed565b60405180910390fd5b60008360008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008060008b815260200190815260200160002060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905091509150915050565b6000600260008360001c60001b815260200190815260200160002060010160009054906101000a900460ff16905092915050565b60006001600354900490509056';

async function deployContract() {
  try {
    console.log('\n🚀 Starting Smart Contract Deployment...\n');

    // Connect to blockchain network
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Get signer (account that will deploy)
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY;
    if (!privateKey || privateKey === 'your_blockchain_private_key_keep_secret') {
      throw new Error('⚠️  BLOCKCHAIN_PRIVATE_KEY not configured in .env file');
    }

    const signer = new ethers.Wallet(privateKey, provider);

    console.log(`📍 Deployment Network: ${rpcUrl}`);
    console.log(`🔐 Deployer Address: ${signer.address}`);

    // Get network info
    const network = await provider.getNetwork();
    console.log(`🌐 Chain ID: ${network.chainId}`);
    console.log(`📊 Chain Name: ${network.name}`);

    // Check balance
    const balance = await provider.getBalance(signer.address);
    const ethBalance = ethers.formatEther(balance);
    console.log(`💰 Deployer Balance: ${ethBalance} ETH\n`);

    if (ethBalance === '0.0') {
      console.warn('⚠️  Warning: Deployer has no balance. Deployment may fail.');
    }

    // Create contract factory
    const contractFactory = new ethers.ContractFactory(CONTRACT_ABI, CONTRACT_BYTECODE, signer);

    console.log('📦 Deploying ReviewAuth contract...');
    const contract = await contractFactory.deploy();

    console.log(`⏳ Waiting for deployment transaction...\n`);
    await contract.deploymentTransaction().wait(1);

    const deployedAddress = await contract.getAddress();

    console.log('\n✅ Smart Contract Deployed Successfully!\n');
    console.log('📋 Deployment Details:');
    console.log(`   Contract Address: ${deployedAddress}`);
    console.log(`   Deployer: ${signer.address}`);
    console.log(`   Network: ${network.name}`);
    console.log(`   Chain ID: ${network.chainId}`);

    // Verify contract is accessible
    console.log('\n🔍 Verifying contract...');
    const stats = await contract.getStats();
    console.log(`   Total Reviews: ${stats[0]}`);
    console.log(`   Total SDCs: ${stats[1]}`);

    // Output configuration
    console.log('\n📝 Update your .env file:');
    console.log(`\nREVIEW_AUTH_CONTRACT_ADDRESS=${deployedAddress}`);
    console.log(`BLOCKCHAIN_RPC_URL=${rpcUrl}\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ DEPLOYMENT COMPLETE\n');

  } catch (error) {
    console.error('❌ Deployment Error:');
    console.error(error.message);
    process.exit(1);
  }
}

// Run deployment
if (require.main === module) {
  deployContract();
}

module.exports = deployContract;
