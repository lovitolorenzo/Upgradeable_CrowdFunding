pragma solidity ^0.8.0;

import {TokenMinter} from "./TokenMinter.sol";

contract CrowdFunding {
    TokenMinter public CrowdTokenMinter;

    struct singleCrowd {
        string name;
        uint date;
        address owner;
        uint fundingGoal;
        mapping(address => uint) contributions;
    }

    /// @notice map where key is fundCrowd owner
    mapping(address => singleCrowd) AllCrowds;

    constructor() public {
        /// @notice Initialize TokenMinter.sol
        CrowdTokenMinter = new TokenMinter();
    }

    function startCrowdfunding(
        string memory _name,
        uint _date,
        uint256 _fundingGoal
    ) public {
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
            AllCrowds[_crowdOwner].owner != address(0),
            "Crowd Fund inexistent"
        );

        uint convertToCFT = msg.value * 1000;
        CrowdTokenMinter.mint(msg.sender, convertToCFT);

        /// @dev add funder and him/her funds amount to crowd struct
        AllCrowds[_crowdOwner].contributions[msg.sender] = convertToCFT;
    }
}
