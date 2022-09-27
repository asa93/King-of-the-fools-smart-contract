// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TreasureChest {
    address payable public currentDepositer;
    uint256 public currentDeposit;

    event Deposit(address depositer, uint256 amount);

    function deposit() public payable {
        require(
            msg.value >= 1 ether && msg.value > (currentDeposit * 3) / 2,
            "Deposit amount too low"
        );

        if (currentDepositer != address(0)) {
            currentDepositer.call{value: address(this).balance};
        }
        currentDeposit = msg.value;
        emit Deposit(msg.sender, currentDeposit);
    }
}
