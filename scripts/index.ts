import { ethers } from "hardhat";

// Define an async function to deploy the contract
async function main() {
  // Get wallets from EVM
  const [deployer, acc1, acc2] = await ethers.getSigners();

  // Deploy the contract using EVM
  const myTokenContractFactory = await ethers.getContractFactory("MyToken");
  const myTokenContract = await myTokenContractFactory.deploy();

  // Wait for the deployment to be confirmed
  await myTokenContract.deployed();

  // Start the crowdfund
  await myTokenContract.startCrowdfunding(
    "Project X",
    1602217600,
    ethers.utils.parseEther("1000")
  );

  // Fund the crowdfund
  await myTokenContract.funding({ value: ethers.utils.parseEther("10") });

  // End the crowdfund
  // Add code to end the crowdfund here

  console.log("Crowdfund started and funded successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
