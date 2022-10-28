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
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const poolsContractAddress = process.env.NEXT_PUBLIC_POOLS_ADDRESS;
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
          setAccount(accounts[0]);
          setWalletConnected(true);
          getAccounts();
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

  const getAccounts = async () => {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, poolContractABI, signer);

        let getAddedAccounts = await wavePortalContract.getAccounts();
        setAddedAccounts(getAddedAccounts);
        console.log(addedAccounts);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const newTarget = (event) => {
    setTargetAmount(event.target.value);
  }

  const newMember = (event) => {
    setMember(event.target.value)
  }

  const addMember = () => {
    console.log(member);
    if (!members.includes(member)) {
      setMembers(members => [...members, member]);
      addMemberInput.current.value = "";
    }
    console.log(members);
  }

  const deleteMember = (d) => {
    console.log("delete: ")
    console.log(d)
    setMembers(members.filter(item => item !== d))
  }

  const createPool = async () => {
    if (account !== "" && member.length > 0 && targetAmount.length>0 && !isNaN(targetAmount)) {
      try {
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const bCode = "0x60806040523480156200001157600080fd5b50604051620011153803806200111583398181016040528101906200003791906200041e565b82600090805190602001906200004f92919062000067565b508160028190555080600181905550505050620007c1565b828054828255906000526020600020908101928215620000b4579160200282015b82811115620000b3578251829081620000a29190620006da565b509160200191906001019062000088565b5b509050620000c39190620000c7565b5090565b5b80821115620000eb5760008181620000e19190620000ef565b50600101620000c8565b5090565b508054620000fd90620004d3565b6000825580601f1062000111575062000132565b601f01602090049060005260206000209081019062000131919062000135565b5b50565b5b808211156200015057600081600090555060010162000136565b5090565b6000604051905090565b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b620001b8826200016d565b810181811067ffffffffffffffff82111715620001da57620001d96200017e565b5b80604052505050565b6000620001ef62000154565b9050620001fd8282620001ad565b919050565b600067ffffffffffffffff82111562000220576200021f6200017e565b5b602082029050602081019050919050565b600080fd5b600080fd5b600067ffffffffffffffff8211156200025957620002586200017e565b5b62000264826200016d565b9050602081019050919050565b60005b838110156200029157808201518184015260208101905062000274565b60008484015250505050565b6000620002b4620002ae846200023b565b620001e3565b905082815260208101848484011115620002d357620002d262000236565b5b620002e084828562000271565b509392505050565b600082601f8301126200030057620002ff62000168565b5b8151620003128482602086016200029d565b91505092915050565b6000620003326200032c8462000202565b620001e3565b9050808382526020820190506020840283018581111562000358576200035762000231565b5b835b81811015620003a657805167ffffffffffffffff81111562000381576200038062000168565b5b808601620003908982620002e8565b855260208501945050506020810190506200035a565b5050509392505050565b600082601f830112620003c857620003c762000168565b5b8151620003da8482602086016200031b565b91505092915050565b6000819050919050565b620003f881620003e3565b81146200040457600080fd5b50565b6000815190506200041881620003ed565b92915050565b6000806000606084860312156200043a57620004396200015e565b5b600084015167ffffffffffffffff8111156200045b576200045a62000163565b5b6200046986828701620003b0565b93505060206200047c8682870162000407565b92505060406200048f8682870162000407565b9150509250925092565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680620004ec57607f821691505b602082108103620005025762000501620004a4565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026200056c7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826200052d565b6200057886836200052d565b95508019841693508086168417925050509392505050565b6000819050919050565b6000620005bb620005b5620005af84620003e3565b62000590565b620003e3565b9050919050565b6000819050919050565b620005d7836200059a565b620005ef620005e682620005c2565b8484546200053a565b825550505050565b600090565b62000606620005f7565b62000613818484620005cc565b505050565b5b818110156200063b576200062f600082620005fc565b60018101905062000619565b5050565b601f8211156200068a57620006548162000508565b6200065f846200051d565b810160208510156200066f578190505b620006876200067e856200051d565b83018262000618565b50505b505050565b600082821c905092915050565b6000620006af600019846008026200068f565b1980831691505092915050565b6000620006ca83836200069c565b9150826002028217905092915050565b620006e58262000499565b67ffffffffffffffff8111156200070157620007006200017e565b5b6200070d8254620004d3565b6200071a8282856200063f565b600060209050601f8311600181146200075257600084156200073d578287015190505b620007498582620006bc565b865550620007b9565b601f198416620007628662000508565b60005b828110156200078c5784890151825560018201915060208501945060208101905062000765565b86831015620007ac5784890151620007a8601f8916826200069c565b8355505b6001600288020188555050505b505050505050565b61094480620007d16000396000f3fe6080604052600436106100595760003560e01c806312065fe0146100655780632ad26a041461009057806338cc4831146100b95780635d1ca631146100e45780638a48ac031461010f57806391ac4b881461013a57610060565b3661006057005b600080fd5b34801561007157600080fd5b5061007a610165565b60405161008791906102b3565b60405180910390f35b34801561009c57600080fd5b506100b760048036038101906100b29190610428565b61016d565b005b3480156100c557600080fd5b506100ce6101a5565b6040516100db91906104b2565b60405180910390f35b3480156100f057600080fd5b506100f96101ad565b60405161010691906102b3565b60405180910390f35b34801561011b57600080fd5b506101246101b7565b604051610131919061060e565b60405180910390f35b34801561014657600080fd5b5061014f610290565b60405161015c91906102b3565b60405180910390f35b600047905090565b6000819080600181540180825580915050600190039060005260206000200160009091909190915090816101a1919061083c565b5050565b600030905090565b6000600154905090565b60606000805480602002602001604051908101604052809291908181526020016000905b828210156102875783829060005260206000200180546101fa9061065f565b80601f01602080910402602001604051908101604052809291908181526020018280546102269061065f565b80156102735780601f1061024857610100808354040283529160200191610273565b820191906000526020600020905b81548152906001019060200180831161025657829003601f168201915b5050505050815260200190600101906101db565b50505050905090565b6000600254905090565b6000819050919050565b6102ad8161029a565b82525050565b60006020820190506102c860008301846102a4565b92915050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b610335826102ec565b810181811067ffffffffffffffff82111715610354576103536102fd565b5b80604052505050565b60006103676102ce565b9050610373828261032c565b919050565b600067ffffffffffffffff821115610393576103926102fd565b5b61039c826102ec565b9050602081019050919050565b82818337600083830152505050565b60006103cb6103c684610378565b61035d565b9050828152602081018484840111156103e7576103e66102e7565b5b6103f28482856103a9565b509392505050565b600082601f83011261040f5761040e6102e2565b5b813561041f8482602086016103b8565b91505092915050565b60006020828403121561043e5761043d6102d8565b5b600082013567ffffffffffffffff81111561045c5761045b6102dd565b5b610468848285016103fa565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061049c82610471565b9050919050565b6104ac81610491565b82525050565b60006020820190506104c760008301846104a3565b92915050565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610533578082015181840152602081019050610518565b60008484015250505050565b600061054a826104f9565b6105548185610504565b9350610564818560208601610515565b61056d816102ec565b840191505092915050565b6000610584838361053f565b905092915050565b6000602082019050919050565b60006105a4826104cd565b6105ae81856104d8565b9350836020820285016105c0856104e9565b8060005b858110156105fc57848403895281516105dd8582610578565b94506105e88361058c565b925060208a019950506001810190506105c4565b50829750879550505050505092915050565b600060208201905081810360008301526106288184610599565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061067757607f821691505b60208210810361068a57610689610630565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b6000600883026106f27fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff826106b5565b6106fc86836106b5565b95508019841693508086168417925050509392505050565b6000819050919050565b600061073961073461072f8461029a565b610714565b61029a565b9050919050565b6000819050919050565b6107538361071e565b61076761075f82610740565b8484546106c2565b825550505050565b600090565b61077c61076f565b61078781848461074a565b505050565b5b818110156107ab576107a0600082610774565b60018101905061078d565b5050565b601f8211156107f0576107c181610690565b6107ca846106a5565b810160208510156107d9578190505b6107ed6107e5856106a5565b83018261078c565b50505b505050565b600082821c905092915050565b6000610813600019846008026107f5565b1980831691505092915050565b600061082c8383610802565b9150826002028217905092915050565b610845826104f9565b67ffffffffffffffff81111561085e5761085d6102fd565b5b610868825461065f565b6108738282856107af565b600060209050601f8311600181146108a65760008415610894578287015190505b61089e8582610820565b865550610906565b601f1984166108b486610690565b60005b828110156108dc578489015182556001820191506020850194506020810190506108b7565b868310156108f957848901516108f5601f891682610802565b8355505b6001600288020188555050505b50505050505056fea264697066735822122079bb1481d9da0c5ccd37536d75fdd4fa78cab6a119e70b04cdaa228d3e68f22064736f6c63430008110033";
          const poolContractFactory = new ethers.ContractFactory(poolContractABI, bCode, signer);
          const newPool = await poolContractFactory.deploy(members, targetAmount, 2);
          await newPool.deployed();
          console.log(newPool.address);

          addPoolToPools(newPool.address);
        }
      } catch (error) {
        console.log(error);
      }
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
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(poolsContractAddress, poolsContractABI, signer);

        const allPools = await wavePortalContract.getAllPools();
        console.log(allPools);
        for (let i = 0; i < allPools.length; ++i) {
          const poolContract = new ethers.Contract(allPools[i], poolContractABI, signer);
          const ta = await poolContract.getTargetAmount();
          const bal = await poolContract.getBalance();
          const contractId = await poolContract.getId();
          const allAccounts = await poolContract.getAccounts();
          const contract = {
            address: allPools[i],
            id: contractId,
            targetAmount: ta,
            balance: bal,
            accounts: allAccounts
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
            <h2>Current Participant</h2>
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

              {/* <label htmlFor="newContractAmount">Target Amount</label> */}
              <input type="number" name='newContractAmount' min="0.001" max="1.0" step="0.001" onChange={newTarget} placeholder='Target Amount...' className={styles.newContractAmount}/>

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
                return <Contract key={contract.address} contractData={contract} contractId={contract.id} user={account} />
                // return <p key={contract.id}>{contract.accounts}</p>
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
