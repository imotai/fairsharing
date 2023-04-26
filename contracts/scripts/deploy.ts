import { ethers } from "hardhat";

async function main() {
  const FairSharing = await ethers.getContractFactory("FairSharing");
  const fairSharing = await FairSharing.deploy("TokenName", "TokenSymbol");

  await fairSharing.deployed();

  console.log(
    `Deployed to ${fairSharing.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
