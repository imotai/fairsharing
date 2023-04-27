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

    struct Vote {
        address voter;
        bool approve;
        bytes signature;
    }    
    
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
    function claim(uint contributionId, uint points, Vote[] calldata votes) external {
        // TODO: caller should be owner of this contribution
        // TODO: how to prevent multiple claim? maybe need a work record?
        uint approvedVotes;
        // TODO: remove duplicated vote?
        for (uint i=0; i<votes.length; i++) {
            bytes memory data = abi.encodePacked(contributionId, votes[i].voter, votes[i].approve, points);
            address dataSigner = keccak256(data).toEthSignedMessageHash().recover(votes[i].signature);
            require(dataSigner == votes[i].voter, "wrong signature"); 
            if (votes[i].approve) {
                approvedVotes++;
            }
        }
        require (approvedVotes >= totalMembers/2, "not enough voters");

        _mint(msg.sender, points); 
    }

    function deposit() external payable {

    }
}
