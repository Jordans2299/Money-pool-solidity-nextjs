import styles from "../styles/Contract.module.css";
import { ethers } from 'ethers';
import poolAbi from "../smart_contracts/artifacts/contracts/Pool.sol/Pool.json";

export default function Contract({contractData,contractId, user}){
    const poolContractABI= poolAbi.abi;
    const payContract = async () =>{
        try {
            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();

                await signer.sendTransaction({
                    to: contractData.address,
                    value: ethers.utils.parseEther("0.001")
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    const isUserInPool = (accounts) =>{
        console.log(user)
        console.log(accounts)
        for(let i=0;i<accounts.length;++i){
            if(accounts[i]==user){
                console.log(true);
                return true;
            }
        }
        return false;
    }

    return(
        <div id={contractId} className={styles.contractBody}>
            <p>{Number(contractId)}</p>
            <p>{contractData.address}</p>
            <br />
           <p>Contract Addresses</p>
           
            {contractData.accounts.map(function(account, i){
                return <p>{account}</p>
            } )}
            <p>Balance: {Number(contractData.balance)}</p>
            <p>Target: {Number(contractData.targetAmount)}</p>
            {isUserInPool(contractData.accounts)? 
            <button onClick={payContract} className={styles.payBtn}>Pay</button>
            : ""}
        </div>
    )
}