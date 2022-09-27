// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TreasureChest is ReentrancyGuard {
    address payable public currentDepositer;
    uint256 public currentDeposit;

    event Deposit(address depositer, uint256 amount);

    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    function deposit() public payable nonReentrant {
        require(
            msg.value >= 1 ether && msg.value > (currentDeposit * 3) / 2,
            "Deposit amount too low"
        );

        if (currentDepositer != address(0) && address(this).balance > 0) {
            currentDepositer.call{value: address(this).balance};
        }
        currentDeposit = msg.value;
        emit Deposit(msg.sender, currentDeposit);
    }
}
