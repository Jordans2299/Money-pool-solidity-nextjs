const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const poolContractFactory = await hre.ethers.getContractFactory("Pool");
    const wallet1 = await hre.ethers.Wallet.createRandom().connect(ethers.provider).address;
    const wallet2 = await hre.ethers.Wallet.createRandom().connect(ethers.provider).address;
    let users = [wallet1,wallet2,"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"];
    let targetAmount = 100;

    const poolContract = await poolContractFactory.deploy(users, targetAmount,"my pool");
    await poolContract.deployed();
    console.log("contract deployed to: ", poolContract.address);

    let getAccounts = await poolContract.getAccounts();
    console.log(getAccounts);

    let getname = await poolContract.getName();
    console.log(getname);

    const getTarget = await poolContract.getTargetAmount();
    console.log(getTarget);

    let random = await poolContract.getRandom();
    console.log(random);

    let signer = await ethers.provider.getSigner("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    await signer.sendTransaction({
      to: poolContract.address,
      value: 10
    })

    let bal = await poolContract.getBalance();
    console.log("contract balance:", bal);

    random = await poolContract.getRandom();
    console.log(random);
    await poolContract.chooseWinner();

    bal = await poolContract.getBalance();
    console.log("contract balance:", bal);



    // const poolContract1 = await poolContractFactory.deploy(users, targetAmount,id);
    // await poolContract1.deployed();
    // console.log("contract deployed to: ", poolContract1.address);

    // const poolsContractFactory = await hre.ethers.getContractFactory("Pools");
    // const poolsContract = await poolsContractFactory.deploy();
    // const newPool = await poolContract.getAddress();

    // const signer = await ethers.provider.getSigner("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    // await signer.sendTransaction({
    //   to: newPool,
    //   value: 100
    // })
    // await poolsContract.addPool(newPool);
    // const newPool1 = await poolContract1.getAddress();
    // await poolsContract.addPool(newPool1);
    // getAccounts = await poolsContract.getAllPools();
    // for(let i=0;i<getAccounts.length;++i){
    //   console.log("hi")
    //   console.log(getAccounts[i]);
    //   let contrct = await hre.ethers.getContractAt("Pool",getAccounts[i]);
    //   let amnt = await contrct.getTargetAmount();
    //   let actAmnt = await contrct.getBalance();
    //   let eyeD = await contrct.getId();
    //   console.log("pool id", eyeD);
    //   console.log("target amount", amnt);
    //   console.log("actual amount: ", actAmnt);
    // }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});