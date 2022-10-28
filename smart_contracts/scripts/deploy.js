// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {

  const [owner, randomPerson] = await hre.ethers.getSigners();
  const poolContractFactory = await hre.ethers.getContractFactory("Pool");

  let users = ["0x262926c280ee96b8b06b19eb972285ac8db7d54f"];
  let targetAmount = 100;
  let id = 1;

  const poolContract = await poolContractFactory.deploy(users, targetAmount,id);
  await poolContract.deployed();
  console.log(poolContract.address);

  const poolsContractFactory = await hre.ethers.getContractFactory("Pools");
  const poolsContract = await poolsContractFactory.deploy();
  await poolsContract.deployed();
  await poolsContract.addPool(poolContract.address);
  console.log(poolsContract.address);
  // const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  // const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
  // const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

  // const lockedAmount = hre.ethers.utils.parseEther("1");

  // const Lock = await hre.ethers.getContractFactory("Lock");
  // const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

  // await lock.deployed();

  // console.log(
  //   `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
  // );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
