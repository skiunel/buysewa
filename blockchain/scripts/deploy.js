const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying ReviewSystem contract...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log(
    "Account balance:",
    (await hre.ethers.provider.getBalance(deployer.address)).toString()
  );

  const ReviewSystem = await hre.ethers.getContractFactory("ReviewSystem");
  const reviewSystem = await ReviewSystem.deploy();
  await reviewSystem.waitForDeployment();

  const contractAddress = await reviewSystem.getAddress();
  console.log("\nReviewSystem deployed to:", contractAddress);
  console.log("Owner:", await reviewSystem.owner());

  // Save deployment info for backend consumption
  const deploymentInfo = {
    address: contractAddress,
    deployer: deployer.address,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };

  const deployDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deployDir)) {
    fs.mkdirSync(deployDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(deployDir, `${hre.network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Copy ABI to a shared location for the backend
  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    "ReviewSystem.sol",
    "ReviewSystem.json"
  );

  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    const abiOutput = {
      abi: artifact.abi,
      address: contractAddress,
      network: hre.network.name,
    };

    fs.writeFileSync(
      path.join(deployDir, "ReviewSystemABI.json"),
      JSON.stringify(abiOutput, null, 2)
    );
    console.log("\nABI + address saved to deployments/ReviewSystemABI.json");
  }

  console.log("\nDeployment complete!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
