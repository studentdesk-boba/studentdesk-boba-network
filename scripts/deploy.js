const hre = require("hardhat");

/**
 *
 * Network: Polygon (Matic) Mumbai Testnet
 * Chainlink VRF Coordinator address: 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255
 * LINK token address:                0x326C977E6efc84E512bB9C30f76E30c160eD06FB
 * Key Hash: 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4
 */
 const VRFCoordinator = "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255";
 const LINKToken = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
 const keyHash ='0x4447a51eaaa911ffc387867dc26cf8b8119ac8d00d2cac4512c57a18b0a90d1a';
 

async function main() {
  const StudentDesk = await hre.ethers.getContractFactory("StudentDesk");
  const studentDesk = await StudentDesk.deploy();
  await studentDesk.deployed();
  console.log("StudentDesk deployed to:", studentDesk.address);

  const Token = await hre.ethers.getContractFactory("PostToken");
  const token = await Token.deploy(studentDesk.address);
  await token.deployed();
  console.log("Token deployed to:", token.address);

  const MintNFT = await hre.ethers.getContractFactory("MintRewardNFT");
  const mintnft = await MintNFT.deploy();
  await mintnft.deployed();
  console.log("MintNFT deployed to:", mintnft.address);

  const StudentdeskMemoryGame = await hre.ethers.getContractFactory(
    "MemoryGameNFT"
  );
  const studentDeskMemoryGame = await StudentdeskMemoryGame.deploy();
  await studentDeskMemoryGame.deployed();
  console.log("MemoryGameNFT deployed to:", studentDeskMemoryGame.address);

  const StudentdeskLottery = await hre.ethers.getContractFactory(
    "LuckyLotteryNFT"
  );
  const studentdeskLottery = await StudentdeskLottery.deploy();
  await studentdeskLottery.deployed();
  console.log("LuckyLottery deployed to:", studentdeskLottery.address);

  const Contest = await hre.ethers.getContractFactory("ContestToken");
  const contest = await Contest.deploy(studentDesk.address);
  await contest.deployed();
  console.log("contest deployed to:", contest.address);

  const RandomNumberGenerator = await hre.ethers.getContractFactory(
    "RandomNumberGenerator"
  );
  const randomNumberGenerator = await RandomNumberGenerator.deploy(
    VRFCoordinator,
    LINKToken,
    keyHash
  );
  await randomNumberGenerator.deployed();
  console.log(
    "RandomNumberGenerator deployed to:",
    randomNumberGenerator.address
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
