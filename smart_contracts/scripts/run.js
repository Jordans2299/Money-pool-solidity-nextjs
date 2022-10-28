const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const poolContractFactory = await hre.ethers.getContractFactory("Pool");

    let users = ["djkjsfkil","jifjedi"];
    let targetAmount = 100;
    let id = 1;

    const poolContract = await poolContractFactory.deploy(users, targetAmount,id);
    await poolContract.deployed();
    console.log("contract deployed to: ", poolContract.address);


    let getAccounts = await poolContract.getAccounts();
    console.log(getAccounts);

    const getTarget = await poolContract.getTargetAmount();
    console.log(targetAmount);

    users = ["jod","mie"];
    targetAmount = 200;
    id = 2;

    const poolContract1 = await poolContractFactory.deploy(users, targetAmount,id);
    await poolContract1.deployed();
    console.log("contract deployed to: ", poolContract1.address);

    const poolsContractFactory = await hre.ethers.getContractFactory("Pools");
    const poolsContract = await poolsContractFactory.deploy();
    const newPool = await poolContract.getAddress();

    const signer = await ethers.provider.getSigner("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    await signer.sendTransaction({
      to: newPool,
      value: 100
    })
    await poolsContract.addPool(newPool);
    const newPool1 = await poolContract1.getAddress();
    await poolsContract.addPool(newPool1);
    getAccounts = await poolsContract.getAllPools();
    for(let i=0;i<getAccounts.length;++i){
      console.log("hi")
      console.log(getAccounts[i]);
      let contrct = await hre.ethers.getContractAt("Pool",getAccounts[i]);
      let amnt = await contrct.getTargetAmount();
      let actAmnt = await contrct.getBalance();
      let eyeD = await contrct.getId();
      console.log("pool id", eyeD);
      console.log("target amount", amnt);
      console.log("actual amount: ", actAmnt);
    }
    


    // let accounts = await poolContract.getAccounts();
    // console.log("accounts before: ")
    // console.log(accounts);

    // console.log("contract balance: ");
    // let balance = await poolContract.getBalance();
    // console.log(balance);

    // let arr = ["sjifiej","iiejwiieruir", "iejirwjeirji"]
    // let addInitialAccounts = await poolContract.setInitialAccounts(arr);
    // await addInitialAccounts.wait();
    
    // accounts = await poolContract.getAccounts();
    // console.log("accounts after: ")
    // console.log(accounts);

    // let addAccount = await poolContract.addAccount("iejwifjewijfio");
    // await addAccount.wait();

    // accounts = await poolContract.getAccounts();
    // console.log("accounts after: ");
    // console.log(accounts);

    // const contractAddress = await poolContract.getAddress();
    // console.log(contractAddress)
    // const signer = await ethers.provider.getSigner("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    // await signer.sendTransaction({
    //   to: contractAddress,
    //   value: ethers.utils.parseEther("1.0")
    // })
    
    // balance = await poolContract.getBalance();
    // console.log("balance after: ");
    // console.log(balance);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});