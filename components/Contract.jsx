import styles from "../styles/Contract.module.css";
import { ethers } from 'ethers';
import poolAbi from "../smart_contracts/artifacts/contracts/Pool.sol/Pool.json";

export default function Contract({contractData, user}){
    const poolContractABI= poolAbi.abi;
    const payContract = async () =>{
        try {
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();

                await signer.sendTransaction({
                    to: contractData.address,
                    value: ethers.utils.parseEther("0.1")
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    const isUserInPool = (accounts) =>{
        for(let i=0;i<accounts.length;++i){
            console.log(user)
            console.log(accounts[i])
            if(accounts[i]==user){
                console.log(true);
                return true;
            }
        }
        return false;
    }

    const chooseWinner = () =>{
        try {
            if(ethereum){
                const random = contractData.poolContract.getRandom();
                console.log(random);
                contractData.poolContract.chooseWinner();
            }
        } catch (error) {
            console.log(error)
        }
    }

    return(
        <div className={styles.contractBody}>
            <h1>{contractData.name}</h1>
            <p>{contractData.address}</p>
            <br />
           <p>Pool Members</p>
           
            {contractData.accounts.map(function(account, i){
                return <p key={account}>{account}</p>
            } )}
            <p>Balance: {Number(contractData.balance)/(10e17)} ETH</p>
            <p>Target: {Number(contractData.targetAmount)} ETH</p>
            {isUserInPool(contractData.accounts)? 
            <button onClick={payContract} className={styles.payBtn}>Pay</button>
            : ""}
            <br />
            <br />
            {isUserInPool(contractData.accounts) && Number(contractData.balance)>0? 
            <button onClick={chooseWinner} className={styles.payBtn}>Choose Winner</button>
            : ""}
        </div>
    )
}