import { ethers } from "hardhat";

async function main() {
  const TreasureChest = await ethers.getContractFactory("TreasureChest");
  const chest = await TreasureChest.deploy();

  await chest.deployed();

  console.log(`TreasureChest deployed to ${chest.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//chest = await ethers.getContractAt("0x5FbDB2315678afecb367f032d93F642f64180aa3", "TreasureChest")
