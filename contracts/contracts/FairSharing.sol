// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import {ERC20} from '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@aragon/osx/core/dao/DAO.sol';

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract FairSharing is ERC20, Ownable, DAO {
  using ECDSA for bytes32;

  // Mapping to store the membership status of an address. true: active, false: inactive
  mapping(address => bool) public members;
  // Array to store the list of member addresses. Contain both active and inactive members
  address[] public membersList;
  uint totalMembers;

  mapping(uint => bool) public claimed;

  struct Vote {
    address voter;
    bool approve;
    bytes signature;
  }

  constructor(
    string memory name,
    string memory symbol,
    address[] memory _membersList
  ) ERC20(name, symbol) {
    membersList = _membersList;
    for (uint i = 0; i < _membersList.length; i++) {
      members[_membersList[i]] = true;
    }
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

  function claim(
    uint contributionId,
    uint points,
    Vote[] calldata votes
  ) external {
    require(!claimed[contributionId], 'Already claimed');
    require(members[msg.sender], 'Not a member');
    uint approvedVotes;
    // TODO: remove duplicated vote?
    for (uint i = 0; i < votes.length; i++) {
      bytes memory data = abi.encodePacked(
        msg.sender,
        contributionId,
        votes[i].voter,
        votes[i].approve,
        points
      );
      address dataSigner = keccak256(data).toEthSignedMessageHash().recover(
        votes[i].signature
      );
      require(dataSigner == votes[i].voter, 'Wrong signature');
      if (votes[i].approve) {
        approvedVotes++;
      }
    }
    require(approvedVotes >= totalMembers / 2, 'Not enough voters');

    _mint(msg.sender, points);
    claimed[contributionId] = true;
  }

  function sharing() external payable {
    uint totalToken;
    for (uint i = 0; i < membersList.length; i++) {
      if (members[membersList[i]]) {
        totalToken += balanceOf(membersList[i]);
      }
    }
    uint valuePerToken = msg.value / totalToken;

    for (uint i = 0; i < membersList.length; i++) {
      if (members[membersList[i]]) {
        (bool success, ) = membersList[i].call{
          value: valuePerToken * balanceOf(membersList[i])
        }('');
        require(success, 'Transfer failed');
      }
    }
  }
}
