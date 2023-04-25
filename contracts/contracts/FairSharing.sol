// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract FairSharing is ERC20, Ownable {
    mapping (address => bool) public members;
    uint totalMembers; 
    
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
    
    }

    function addMember(address member) external onlyOwner {
        members[member] = true;
        totalMembers++;
    }

    function removeMember(address member) external onlyOwner {
        members[member] = false;
        totalMembers--;
    }

}
