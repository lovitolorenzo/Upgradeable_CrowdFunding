import { ethers } from "hardhat";

async function main() {
  // Get current block timestamp from EVM
  let currentBlock = await ethers.provider.getBlock("latest");
  let currentBlockTimestamp = currentBlock.timestamp;

  // Deploy the contract using EVM
  const CrowdFundingContractFactory = await ethers.getContractFactory(
    "CrowdFunding"
  );
  const CrowdFundingContract = await CrowdFundingContractFactory.deploy();

  // Wait for the deployment to be confirmed
  const deployedCrowdFundingContract = await CrowdFundingContract.deployed();

  // We need to initialize it due to the fact it is upgradeable
  const initializedCrowdFundingContract =
    await deployedCrowdFundingContract.initialize();

  await initializedCrowdFundingContract.wait();

  // Get EVM's funded wallets
  const [deployer, acc1, acc2] = await ethers.getSigners();

  // Start the crowdfund
  const startCrowd = await CrowdFundingContract.connect(
    deployer
  ).startCrowdfunding(
    "Project X",
    currentBlockTimestamp + 100,
    ethers.utils.parseEther("1000")
  );

  const balanceBeforeFunding = await acc1.getBalance();
  console.log(
    `Starting Funder balance: ${ethers.utils.formatEther(balanceBeforeFunding)}`
  );

  // Fund the crowdfund
  await CrowdFundingContract.connect(acc1).funding(deployer.address, {
    value: ethers.utils.parseEther("10"),
  });

  const balanceAfterFunding = await acc1.getBalance();
  console.log(
    `Starting Funder balance: ${ethers.utils.formatEther(balanceAfterFunding)}`
  );

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
