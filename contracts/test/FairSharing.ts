import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { utils } from 'ethers'

describe("FairSharing", function () {
  async function deployFairSharingFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = 1_000_000_000;

    // Contracts are deployed using the first signer/account by default
    const [owner, ...otherAccounts] = await ethers.getSigners();
    const members = [await otherAccounts[0].getAddress(), await otherAccounts[1].getAddress(), await otherAccounts[2].getAddress()]

    const FairSharing = await ethers.getContractFactory("FairSharing");
    const fairSharing = await FairSharing.deploy("TokenName", "TokenSymbol", members);

    return { fairSharing, owner, otherAccounts };
  }
  describe("Claim", function () {
    it("Should claim right amount token", async function () {
      const { fairSharing, otherAccounts } = await loadFixture(deployFairSharingFixture);
      const contributionId = 1
      const points = utils.parseEther("1")
      const votes = await Promise.all(otherAccounts.slice(0, 2).map(async (voterAccount)=>{
        const voter = await voterAccount.getAddress()
        const approve = true
        const msgHash = utils.solidityKeccak256(
          ['uint256', 'address', 'bool', 'uint256'], 
          [contributionId, voter, approve, points]
        ) 
        const signature = await voterAccount.signMessage(utils.arrayify(msgHash))
        return {
          voter,
          approve: true,
          signature,
        }
      }))

      const claimer = otherAccounts[0]
      const claimerAddress = await claimer.getAddress()

      const tx = await fairSharing.connect(claimer).claim(contributionId, points, votes)
      await tx.wait()

      const claimedToken = await fairSharing.balanceOf(claimerAddress)

      expect(claimedToken.eq(points)).to.be.true;
    });
  });


});
