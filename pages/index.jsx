import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import styles from '../styles/Home.module.css'
import Script from 'next/script'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faX
} from "@fortawesome/free-solid-svg-icons";
import { ethers } from 'ethers';
import poolAbi from "../smart_contracts/artifacts/contracts/Pool.sol/Pool.json";
import poolsAbi from "../smart_contracts/artifacts/contracts/Pool.sol/Pools.json";
import Contract from '../components/Contract';
//require("dotenv").config();


export default function Home() {
  //const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const poolsContractAddress = process.env.NEXT_PUBLIC_POOLS_ADDRESS;
  //const poolsContractAddress = "0xCD8ce1Ae2C61F5c04BC4239876Ab26249db9B193";
  const poolContractABI = poolAbi.abi;
  const poolsContractABI = poolsAbi.abi;

  const [account, setAccount] = useState("");
  const [members, setMembers] = useState([]);
  const [member, setMember] = useState("");
  const [addedAccounts, setAddedAccounts] = useState([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [allContracts, setAllContracts] = useState([]);
  const [walletConnectErrorTxt, setWalletConnectErrorTxt] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [contractName, setContractName] = useState("");

  const addMemberInput = useRef(null);

  useEffect(() => {
    connectWallet()
  }, [])

  const connectWallet = async () => {
    try {
      const ethereum = window.ethereum;
      if (!ethereum) {
        setWalletConnectErrorTxt("Cannot locate wallet. Do you have MetaMask installed?");
        console.log("no metamask :(");
      }
      else {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          console.log("connected account: ", accounts[0]);
          setWalletConnectErrorTxt("");
          setAccount(ethers.utils.getAddress(accounts[0])); //getAddress applies checksum which applies capitalization verfiying its a valid address
          setWalletConnected(true);
          //getAccounts();
        }
        else {
          setWalletConnectErrorTxt("Cannot find MetaMask account. Make sure you are signed in!");
          console.log("no connected account :/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // const getAccounts = async () => {
  //   try {
  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const wavePortalContract = new ethers.Contract(contractAddress, poolContractABI, signer);

  //       let getAddedAccounts = await wavePortalContract.getAccounts();
  //       setAddedAccounts(getAddedAccounts);
  //       console.log(addedAccounts);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  const newTarget = (event) => {
    setTargetAmount(event.target.value);
  }
  const newName = (event) => {
    setContractName(event.target.value);
  }

  const newMember = (event) => {
    setMember(event.target.value)
  }

  const addMember = () => {
    if (!members.includes(member)) {
      setMembers(members => [...members, member]);
      addMemberInput.current.value = "";
    }
  }

  const deleteMember = (d) => {
    setMembers(members.filter(item => item !== d))
  }

  const createPool = async () => {
    if (account !== "" && member.length > 0 && targetAmount.length>0 && !isNaN(targetAmount)) {
      try {
        if (ethereum) {

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const bCode = poolAbi.bytecode;
          const poolContractFactory = new ethers.ContractFactory(poolContractABI, bCode, signer);
          console.log(contractName);
          const newPool = await poolContractFactory.deploy(members, targetAmount, contractName);
          await newPool.deployed();
          console.log(newPool.address);

          addPoolToPools(newPool.address);
        }
      } catch (error) {
        console.log(error);
      }
    }
    {
      console.log("Could not process request: empty fields")
    }
  }

  const addPoolToPools = async (pool) => {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(poolsContractAddress, poolsContractABI, signer);

        const allPools = await wavePortalContract.addPool(pool);
        console.log(allPools);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAllPools = async () => {
    try {
      if (ethereum) {
        setAllContracts([]);
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(poolsContractAddress, poolsContractABI, signer);

        const allPools = await wavePortalContract.getAllPools();
        console.log(allPools);
        for (let i = 0; i < allPools.length; ++i) {
          const poolContract = new ethers.Contract(allPools[i], poolContractABI, signer);
          const ta = await poolContract.getTargetAmount();
          const bal = await poolContract.getBalance();
          const allAccounts = await poolContract.getAccounts();
          const _name = await poolContract.getName();
          const contract = {
            address: allPools[i],
            targetAmount: ta,
            balance: bal,
            accounts: allAccounts,
            poolContract: poolContract,
            name: _name
          }
          setAllContracts(allContracts => [...allContracts, contract])
        }
        console.log(allContracts)
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Money Pool</title>
        <meta name="description" content="Sports betting app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main >
        {/* <Script src="https://kit.fontawesome.com/1c37cb57ef.js"></Script> */}
        <div className={styles.main}>
          {account !== "" ? <p>Hello {account}</p> : <button className={styles.connectBtn} onClick={connectWallet}> CONNECT WALLET</button>}
          {account === "" ? <p className={styles.errorTxt}>{walletConnectErrorTxt}</p> :""}
          <h1>Money Pool</h1>
          <div>
            <h2>Current Participants</h2>
            {members.map(d => (
              <div>
                <p className={styles.currMembers}>{d}</p>
                <button className={styles.deleteMember} onClick={() => deleteMember(d)}>
                  <FontAwesomeIcon icon={faX} />
                </button>
              </div>))}
            <div className={styles.createContractBody}>
              <h2>Add participants</h2>
              <br />
              <label htmlFor="participant1"></label>
              <input type="text" name='participant1' ref={addMemberInput} placeholder='User Address...' onChange={newMember} className={styles.newUserInput} />
              <br />
              <button onClick={addMember} className={styles.plusBtn}>
                <FontAwesomeIcon icon={faPlus} /> Add User
              </button>
              <input type="text" name='newContractName' onChange={newName} placeholder='Name...' className={styles.newContractAmount}/>

              {/* <label htmlFor="newContractAmount">Target Amount</label> */}
              <input type="number" name='newContractAmount' min="0.1" max="10.0" step="0.1" onChange={newTarget} placeholder='Target Amount...' className={styles.newContractAmount}/>

              <br />
              <button onClick={createPool} className={styles.createBtn}>Create Pool</button>
            </div>
            <button onClick={getAllPools} className={styles.createBtn}>Get Pools</button>
          </div>
        </div>

        {allContracts.length > 0 ?
          <div>
            <h2 className={styles.contractSectionHeader}>Contracts</h2>
            <div className={styles.contractSection}>

              {allContracts.map(function (contract, i) {
                return <Contract key={contract.address} contractData={contract} user={account} />
              })}
            </div>
          </div>
          : ""}

      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
