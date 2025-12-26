/**
 * Hardhat deployment script for ReviewAuth smart contract
 * 
 * Usage:
 *   npx hardhat run scripts/deploy.js --network localhost
 *   npx hardhat run scripts/deploy.js --network hardhat
 */

const hre = require("hardhat");

async function main() {
  console.log("Starting deployment of ReviewAuth contract...");

  // Get the contract factory
  const ReviewAuth = await hre.ethers.getContractFactory("ReviewAuth");

  // Deploy the contract
  console.log("Deploying ReviewAuth...");
  const reviewAuth = await ReviewAuth.deploy();

  // Wait for deployment
  await reviewAuth.waitForDeployment();

  // Get the deployed contract address
  const address = await reviewAuth.getAddress();
  console.log("ReviewAuth deployed to:", address);

  // Save deployment info to a file for backend use
  const deploymentInfo = {
    contractAddress: address,
    network: hre.network.name,
    deployer: (await hre.ethers.getSigners())[0].address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };

  console.log("\n=== Deployment Information ===");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  console.log("\n=== Save this information to your .env file ===");
  console.log(`REVIEW_AUTH_CONTRACT_ADDRESS=${address}`);

  return address;
}

// Execute deployment
main()
  .then((address) => {
    console.log("\n✅ Deployment successful!");
    console.log(`Contract address: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

