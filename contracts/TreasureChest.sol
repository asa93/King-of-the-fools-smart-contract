// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract TreasureChest is ReentrancyGuard {
    address payable public kingOfFools;
    uint256 public currentDeposit;
    uint256 constant INIT_PRICE = 1 ether;

    /// @dev freed deposits that are ready for claim
    mapping(address => uint256) balances;

    event Deposit(address depositer, uint256 amount);
    event Withdrawal(address beneficiary, uint256 amount);

    function deposit() public payable nonReentrant {
        require(
            msg.value >= INIT_PRICE && msg.value >= (currentDeposit * 3) / 2,
            "Deposit amount too low"
        );

        balances[kingOfFools] = msg.value;

        kingOfFools = payable(msg.sender);
        currentDeposit = msg.value;

        emit Deposit(msg.sender, currentDeposit);
    }

    /// @dev we use a withdraw method instead of a direct transfer for improved security
    function withdraw() public nonReentrant {
        require(balances[msg.sender] > 0, "No funds available");
        msg.sender.call{value: balances[msg.sender]};
        emit Withdrawal(msg.sender, balances[msg.sender]);
        balances[msg.sender] = 0;
    }

    /// @dev we disable fallback in case a user accidentally send funds because we don't want to handle that case
    receive() external payable {
        revert("use deposit method");
    }
}
