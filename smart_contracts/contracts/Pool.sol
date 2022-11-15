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
    address[] accounts;
    uint256 targetAmount;
    string name;
    uint256 private random;
    event Winner(address account, uint256 amount, bool success);
    mapping(address => bool) public received;
    constructor(address[] memory _accounts, uint256 _targetAmount, string memory _name) {
        accounts = _accounts;
        targetAmount = _targetAmount;
        name = _name;
        random = (block.timestamp + block.difficulty) % accounts.length;
    }
    function getTargetAmount() public view returns(uint256){
        return targetAmount;
    }
    function addAccount(address accountAddress) public{
        accounts.push(accountAddress);
    }
    function getName() public view returns (string memory){
        return name;
    }
    function getAccounts() public view returns (address[] memory) {
        return accounts;
    }
    function getAccountsLength() public view returns (uint256){
        return accounts.length;
    }
    function getAccountAtIndex(uint256 index) public view returns (address){
        return accounts[index];
    }
    receive() external payable{
        //require(!received[msg.sender], "You can only send once");
        random = (block.difficulty + block.timestamp + random) % accounts.length;
        //require((targetAmount - address(this).balance) >= msg.sender.balance,"You are sending too much money");
        received[msg.sender] = true;
    }
    function getRandom() external view returns(uint256){
        return random;
    }
    function chooseWinner() public{
        address addy = accounts[random];
        console.log(addy," balance: ",addy.balance);
        // while(received[addy]==false){
        //     random = (block.difficulty + block.timestamp + random) % accounts.length;
        //     addy = accounts[random];
        // }
        console.log("chosen addy: ", addy);
        (bool success, ) = (addy).call{value: address(this).balance}("");
        emit Winner(addy, address(this).balance, success);
        require(success, "Failed to withdraw money from contract.");
        console.log(addy," balance: ",addy.balance);
    }
    function getBalance() external view returns(uint256){
        return address(this).balance;
    }
    function getAddress() external view returns(address){
        return address(this);
    }
}