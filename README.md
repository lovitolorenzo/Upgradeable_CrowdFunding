# CrowdFunding Contract

This project is a decentralized crowd funding smart contract implemented on the Ethereum blockchain. It uses the OpenZeppelin library and demonstrates the ability to choose appropriate memory types for parameters, variables etc. and understanding of common EVM developer tooling such as hardhat.

## Key Features

Start a crowdfunding campaign by setting a name, end date and funding goal.
Participants can contribute funds to the campaign by sending Ethereum to the contract.
The smart contract converts the received Ethereum to tokens using the TokenMinter contract.
The total supply of tokens generated and distributed can be tracked.
The contract also emits events such as StartCrowdfunding, FundingSuccessful, RefundingSuccessful, and TotalSupplyOfCrowdToken which can be used to track the progress of the crowdfunding campaign.

## Requirements

- Node.js
- Hardhat
- Ethers.js
- OpenZeppelin

## Installation and Deployment

Clone the repository and navigate to the project directory:

`git clone https://github.com/[username]/CrowdFunding.git
cd CrowdFunding`

Install the required dependencies:
`yarn add`

Compile the contracts using Hardhat.

`yarn hardhat compile`

Deploy the contracts to the local blockchain.

`yarn hardhat run ./script/index.ts`

Interacting with the Contract
Once the contracts are deployed, they can be interacted with using Hardhat console or any other Ethereum client.

## License

This project is licensed under the MIT License - see the LICENSE file for details. Additionally, the contracts are upgradeable.
