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

  const crowdEndDate = currentBlockTimestamp + 10;

  // Start the crowdfund
  const startCrowd = await CrowdFundingContract.connect(
    deployer
  ).startCrowdfunding(
    "Project X",
    crowdEndDate,
    ethers.utils.parseEther("1000")
  );

  const balanceBeforeFunding = await acc1.getBalance();
  console.log(
    `Starting funder balance: ${ethers.utils.formatEther(balanceBeforeFunding)}`
  );

  // Fund the crowdfund
  await CrowdFundingContract.connect(acc1).funding(deployer.address, {
    value: ethers.utils.parseEther("10"),
  });

  const balanceAfterFunding = await acc1.getBalance();
  console.log(
    `After funding balance: ${ethers.utils.formatEther(balanceAfterFunding)}`
  );

  console.log(
    balanceBeforeFunding > balanceAfterFunding
      ? "Crowdfund has been funded successfully!"
      : "Something went wrong in the funding process"
  );

  // Withdraw funds

  const balanceBeforeRefunding = await acc1.getBalance();
  console.log(
    `Before refunding balance: ${ethers.utils.formatEther(
      balanceBeforeRefunding
    )}`
  );

  // Check withdraw existence

  const crowdExists =
    (await CrowdFundingContract.connect(acc1).AllCrowds(deployer.address)) &&
    (await CrowdFundingContract.connect(acc1).AllCrowds(deployer.address));

  if (!crowdExists) {
    console.log("No Crowd Found for refunding");
    return;
  }

  // Check Crowd Funding is ended

  const crowdEnded =
    currentBlockTimestamp > Number(crowdExists.date) ? true : false;

  if (!crowdEnded) {
    console.log("Crowd not yet ended. Waiting for it");
    // Wait the Crowd Funding to end
    const waitToEnd = await waitForTimestamp(crowdEndDate);
    waitToEnd && console.log("Crowd fund ended, proceeding to the refunding");
  }

  // Calling the smart contract function to receive back the funds

  const refundCall = await CrowdFundingContract.connect(acc1).refunding(
    deployer.address
  );

  const txRefund = await refundCall.wait();

  const balanceAfterRefunding = await acc1.getBalance();
  console.log(
    `After refunding balance: ${ethers.utils.formatEther(
      balanceAfterRefunding
    )}`
  );

  txRefund &&
    console.log(
      balanceAfterRefunding > balanceBeforeRefunding &&
        "Refunding correctly done"
    );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function waitForTimestamp(timestamp: number) {
  let latest = (await ethers.provider.getBlock("latest")).timestamp;

  while (latest <= timestamp) {
    // Mine new block due to the fact we are in EVM
    await ethers.provider.send("evm_mine", []);

    const newBlock = await ethers.provider.getBlock("latest");

    const currentTimestamp = newBlock.timestamp;

    latest != currentTimestamp &&
      console.log(`Current timestamp: ${currentTimestamp}`);

    latest = currentTimestamp;
  }

  if (latest > timestamp) return true;
}
