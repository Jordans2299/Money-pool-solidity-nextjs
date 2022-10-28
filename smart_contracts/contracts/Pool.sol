// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Pools{
    address[] allPools;
    constructor(){
    }
    function addPool(address pool) public{
        allPools.push(pool);
    }
    function getAllPools() public view returns(address[] memory){
        return allPools;
    }
}

contract Pool {
    string[] accounts;
    uint256 poolId;
    uint256 targetAmount;
    constructor(string[] memory _accounts, uint256 _targetAmount, uint256 _poolId) {
        accounts = _accounts;
        targetAmount = _targetAmount;
        poolId = _poolId;
    }
    // function setInitialAccounts(string[] memory initialAccounts) public{
    //     accounts = initialAccounts; 
    // }
    // function setTargetAmount(uint256 amount) public{
    //     targetAmount = amount;
    // }
    function getTargetAmount() public view returns(uint256){
        return targetAmount;
    }
    function getId() public view returns(uint256){
        return poolId;
    }
    function addAccount(string memory accountAddress) public{
        accounts.push(accountAddress);
    }
    function getAccounts() public view returns (string[] memory) {
        return accounts;
    }
    receive() external payable{

    }
    function getBalance() external view returns(uint256){
        return address(this).balance;
    }
    function getAddress() external view returns(address){
        return address(this);
    }
}