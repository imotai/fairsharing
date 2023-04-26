import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { utils } from 'ethers'

describe("FairSharing", function () {
  async function deployFairSharingFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    const lockedAmount = ONE_GWEI;
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, ...otherAccounts] = await ethers.getSigners();
    const members = [await otherAccounts[0].getAddress(), await otherAccounts[1].getAddress(), await otherAccounts[2].getAddress()]

    const FairSharing = await ethers.getContractFactory("FairSharing");
    const fairSharing = await FairSharing.deploy("TokenName", "TokenSymbol", members);

    return { fairSharing, owner, otherAccounts };
  }
  describe("Claim", function () {
    it("Should claim right amount token", async function () {
      const { fairSharing, owner } = await loadFixture(deployFairSharingFixture);
      const contributionId = 1
      const address = await owner.getAddress()
      const points = utils.parseEther("1")
      const msgHash = utils.solidityKeccak256(
        ['uint256', 'address', 'bool', 'uint256'], 
        [contributionId, address, true, points]
      ) 
      const signature = owner.signMessage(utils.arrayify(msgHash))

      const tx = await fairSharing.claim(contributionId, address, true, points, signature)
      await tx.wait()

      const claimedToken = await fairSharing.balanceOf(address)

      expect(claimedToken.eq(points)).to.be.true;
    });
  });


});
