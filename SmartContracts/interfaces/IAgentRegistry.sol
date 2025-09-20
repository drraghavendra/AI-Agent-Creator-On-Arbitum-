// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


interface IAgentRegistry {
function registerAgent(string calldata ipfsCid) external returns (uint256);
function getAgent(uint256 agentId) external view returns (address owner, string memory ipfsCid, bool active);
}