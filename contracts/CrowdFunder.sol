// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {TokenMinter} from "./TokenMinter.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {AddressUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

/// TODO: add modifiers
/// TODO: add events
/// TODO: Demonstrates ability to choose appropriate memory types for parameters, variables etc.
/// TODO: Project demonstrates understanding of common EVM developer tooling, e.g. truffle, ganache, hardhat, etc.

contract CrowdFunding is Initializable {
    TokenMinter public CrowdTokenMinter;

    struct singleCrowd {
        string name;
        uint date;
        address owner;
        uint totalFunded; /// @notice expressed in Ethereum
        uint fundingGoal; /// @notice expressed in Ethereum
        mapping(address => uint) crowdFundingTokens;
    }

    /// @notice map where key is fundCrowd owner
    mapping(address => singleCrowd) AllCrowds;

    function initialize() external {
        /// @notice Initialize TokenMinter.sol
        CrowdTokenMinter = new TokenMinter();
    }

    function startCrowdfunding(
        string memory _name,
        uint _date,
        uint256 _fundingGoal
    ) public {
        require(
            !AddressUpgradeable.isContract(msg.sender),
            "Sender is a contract"
        );
        require(_date > 0, "No end date");
        require(_fundingGoal > 0, "No funding amount goal");
        /// @notice fulfill allCrowds with a new crowdfunding
        (
            AllCrowds[msg.sender].name,
            AllCrowds[msg.sender].owner,
            AllCrowds[msg.sender].date,
            AllCrowds[msg.sender].fundingGoal
        ) = (_name, msg.sender, _date, _fundingGoal);
    }

    function funding(address _crowdOwner) public payable {
        require(msg.value > 0, "No funds sent");
        require(
            !AddressUpgradeable.isContract(_crowdOwner) ||
                !AddressUpgradeable.isContract(msg.sender),
            "CrowdOwner or sender is a contract"
        );
        require(
            AllCrowds[_crowdOwner].owner == _crowdOwner,
            "Crowd Funding inexistent"
        );

        uint convertedToCFT = msg.value * 1000;
        CrowdTokenMinter.mint(msg.sender, convertedToCFT);

        /// Emit balanceOf(msg.sender) in tokens and emit also the Ethereums funded
        /// Emit totalSupply of tokens

        /// @dev add funder and him/her funds amount to crowd struct
        AllCrowds[_crowdOwner].crowdFundingTokens[msg.sender] = convertedToCFT;
        AllCrowds[_crowdOwner].totalFunded += msg.value;
        /// Emit totalFunded
    }

    function refunding(address _crowdOwner) public {
        require(
            !AddressUpgradeable.isContract(_crowdOwner) ||
                !AddressUpgradeable.isContract(msg.sender),
            "CrowdOwner or sender is a contract"
        );
        require(
            AllCrowds[_crowdOwner].date > block.timestamp &&
                AllCrowds[_crowdOwner].fundingGoal >
                AllCrowds[_crowdOwner].totalFunded,
            "Crowd Funding still going"
        );
        require(
            AllCrowds[_crowdOwner].owner == _crowdOwner,
            "Crowd Funding inexistent"
        );
        require(
            AllCrowds[_crowdOwner].crowdFundingTokens[msg.sender] > 0,
            "No Funds at this address"
        );

        /// @notice convert funds from crowdFundingTokens to Ethereum
        uint funderEthFunds = AllCrowds[_crowdOwner].crowdFundingTokens[
            msg.sender
        ] / 1000;

        /// @dev wipe out the amount in the storage struct AllCrowds before transferring for security reasons
        AllCrowds[_crowdOwner].crowdFundingTokens[msg.sender] = 0;
        /// @dev burn withdrawal tokens
        CrowdTokenMinter.burn(
            msg.sender,
            AllCrowds[_crowdOwner].crowdFundingTokens[msg.sender]
        );
        /// @dev now we can send the amount to the address
        payable(msg.sender).transfer(funderEthFunds);
    }
}
