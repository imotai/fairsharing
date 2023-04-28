import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { utils } from "ethers";

describe("FairSharing", function () {
  async function deployFairSharingFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, ...otherAccounts] = await ethers.getSigners();
    const members = [
      await otherAccounts[0].getAddress(),
      await otherAccounts[1].getAddress(),
      await otherAccounts[2].getAddress(),
    ];

    const FairSharing = await ethers.getContractFactory("FairSharing");
    const fairSharing = await FairSharing.deploy(
      "TokenName",
      "TokenSymbol",
      members
    );

    return { fairSharing, owner, otherAccounts };
  }
  describe("Claim", function () {
    it("Caller should be a member", async function () {
      const { fairSharing, otherAccounts } = await loadFixture(
        deployFairSharingFixture
      );
      const contributor = otherAccounts[0];
      const contributionId = 1;
      const points = utils.parseEther("1");
      const votes = await Promise.all(
        otherAccounts.slice(0, 2).map(async (voterAccount) => {
          const voter = await voterAccount.getAddress();
          const approve = true;
          const msgHash = utils.solidityKeccak256(
            ["address", "uint256", "address", "bool", "uint256"],
            [contributor.address, contributionId, voter, approve, points]
          );
          const signature = await voterAccount.signMessage(
            utils.arrayify(msgHash)
          );
          return {
            voter,
            approve,
            signature,
          };
        })
      );

      await expect(
        fairSharing.claim(contributionId, points, votes)
      ).to.be.revertedWith("Not a member");
    });

    it("Caller should be the contributor", async function () {
      const { fairSharing, owner, otherAccounts } = await loadFixture(deployFairSharingFixture);
      const contributionId = 1
      const contributor = otherAccounts[0];
      const points = utils.parseEther("1")
      const votes = await Promise.all(otherAccounts.slice(0, 2).map(async (voterAccount)=>{
        const voter = await voterAccount.getAddress()
        const approve = true
        const msgHash = utils.solidityKeccak256(
          ['address', 'uint256', 'address', 'bool', 'uint256'],
          [contributor.address, contributionId, voter, approve, points]
        )
        const signature = await voterAccount.signMessage(utils.arrayify(msgHash))
        return {
          voter,
          approve,
          signature,
        }
      }))
      const claimer = otherAccounts[1]; // difference from contributor

      await expect(fairSharing.connect(claimer).claim(contributionId, points, votes)).to.be.revertedWith("Wrong signature");
    });

    it("Should claim right amount token", async function () {
      const { fairSharing, otherAccounts } = await loadFixture(
        deployFairSharingFixture
      );
      const contributionId = 1;
      const contributor = otherAccounts[0];
      const points = utils.parseEther("1");
      const votes = await Promise.all(
        otherAccounts.slice(0, 2).map(async (voterAccount) => {
          const voter = await voterAccount.getAddress();
          const approve = true;
          const msgHash = utils.solidityKeccak256(
            ["address", "uint256", "address", "bool", "uint256"],
            [contributor.address, contributionId, voter, approve, points]
          );
          const signature = await voterAccount.signMessage(
            utils.arrayify(msgHash)
          );
          return {
            voter,
            approve,
            signature,
          };
        })
      );

      const claimer = contributor;

      const tx = await fairSharing
        .connect(claimer)
        .claim(contributionId, points, votes);
      await tx.wait();

      const claimedToken = await fairSharing.balanceOf(claimer.address);
      expect(claimedToken.eq(points)).to.be.true;
    });

    it("Should prevent double claim", async function () {
      const { fairSharing, otherAccounts } = await loadFixture(
        deployFairSharingFixture
      );
      const contributionId = 1;
      const contributor = otherAccounts[0];
      const points = utils.parseEther("1");
      const votes = await Promise.all(
        otherAccounts.slice(0, 2).map(async (voterAccount) => {
          const voter = await voterAccount.getAddress();
          const approve = true;
          const msgHash = utils.solidityKeccak256(
            ["address", "uint256", "address", "bool", "uint256"],
            [contributor.address, contributionId, voter, approve, points]
          );
          const signature = await voterAccount.signMessage(
            utils.arrayify(msgHash)
          );
          return {
            voter,
            approve,
            signature,
          };
        })
      );

      const claimer = contributor;

      const tx = await fairSharing
        .connect(claimer)
        .claim(contributionId, points, votes);
      await tx.wait();

      await expect(
        fairSharing.claim(contributionId, points, votes)
      ).to.be.revertedWith("Already claimed");
    });
  });
});
