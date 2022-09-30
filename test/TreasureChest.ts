import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("TreasureChest", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const TreasureChest = await ethers.getContractFactory("TreasureChest");
    const chest = await TreasureChest.deploy();

    return { chest, owner, otherAccount };
  }

  describe("Deposits", function () {
    it("Should fail to deposit if amount below 1 eth", async function () {
      const { chest } = await loadFixture(deployFixture);

      await expect(
        chest.deposit({ value: ethers.utils.parseEther("0.1") })
      ).to.be.revertedWith("Deposit amount too low");
    });

    it("Should fail to deposit if amount not 1.5x previous deposit", async function () {
      const { chest } = await loadFixture(deployFixture);

      await chest.deposit({ value: ethers.utils.parseEther("1") });

      await expect(
        chest.deposit({ value: ethers.utils.parseEther("1") })
      ).to.be.revertedWith("Deposit amount too low");
    });
    it("Shouldn't fail to deposit if amount is ok", async function () {
      const { chest } = await loadFixture(deployFixture);

      await expect(chest.deposit({ value: ethers.utils.parseEther("1") })).not
        .to.be.reverted;
    });
    it("Shouldn fail to deposit using fallback", async function () {
      const { chest, owner } = await loadFixture(deployFixture);

      await expect(
        owner.sendTransaction({
          to: chest.address,
          value: ethers.utils.parseEther("1"), // Sends exactly 1.0 ether
        })
      ).to.be.revertedWith("Use deposit method");
    });
  });
  describe("Withdrawals", function () {
    it("Shouldn't fail to withdraw if deposits are freed", async function () {
      const { chest } = await loadFixture(deployFixture);

      await chest.deposit({ value: ethers.utils.parseEther("1") });

      await chest.deposit({ value: ethers.utils.parseEther("1.5") });

      await expect(chest.withdraw()).not.to.be.reverted;
    });
    it("Should fail to withdraw if deposits are not freed", async function () {
      const { chest } = await loadFixture(deployFixture);

      await chest.deposit({ value: ethers.utils.parseEther("1") });

      await expect(chest.withdraw()).to.be.revertedWith("No funds available");
    });
  });
  describe("Events", function () {
    it("Should emit Deposit event", async function () {
      const { chest, owner } = await loadFixture(deployFixture);

      const depositAmount = ethers.utils.parseEther("1");
      await expect(chest.deposit({ value: depositAmount }))
        .to.emit(chest, "Deposit")
        .withArgs(await owner.getAddress(), depositAmount);
    });

    it("Should emit Withdrawal event", async function () {
      const { chest, owner } = await loadFixture(deployFixture);

      let depositAmount = ethers.utils.parseEther("1");
      await chest.deposit({ value: depositAmount });

      depositAmount = ethers.utils.parseEther("1.5");
      await chest.deposit({ value: depositAmount });

      await expect(chest.withdraw())
        .to.emit(chest, "Withdrawal")
        .withArgs(await owner.getAddress(), depositAmount);
    });
  });
});
