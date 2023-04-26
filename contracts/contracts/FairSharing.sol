// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract FairSharing is ERC20, Ownable {
    using ECDSA for bytes32;

    // Mapping to store the membership status of an address. true: active, false: inactive
    mapping (address => bool) public members;
    // Array to store the list of member addresses. Contain both active and inactive members
    address[] public membersList;
    uint totalMembers; 
    
    constructor(string memory name, string memory symbol, address[] memory _membersList) ERC20(name, symbol) {
        membersList = _membersList;
    }

    function addMember(address member) external onlyOwner {
        members[member] = true;
        membersList.push(member);
        totalMembers++;
    }

    function removeMember(address member) external onlyOwner {
        members[member] = false;
        totalMembers--;
    }
 
    // TODO: 
    // - A map record claim status. 
    // - Create a struct {member, approve, signature}
    // - Pass in an array of this struct. 
    // - verify every signature in this array
    function claim(uint contributionId, address member, bool approve, uint points, bytes calldata signature) external {
        // TODO: how to prevent multiple claim? maybe need a work record?
        bytes memory data = abi.encodePacked(contributionId, member, approve, points);
        address dataSigner = keccak256(data).toEthSignedMessageHash().recover(signature);
        require(dataSigner == member);
        _mint(member, points); 
    }

    function deposit() external payable {

    }
}
