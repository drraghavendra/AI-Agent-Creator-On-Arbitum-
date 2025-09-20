// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AgentRegistry
 * @dev Minimal registry for AI agents with IPFS metadata storage
 * @notice Optimized for low gas deployment costs
 */
contract AgentRegistry {
    // Packed struct for gas optimization (3 slots -> 2 slots)
    struct Agent {
        address owner;      // 20 bytes
        string ipfsCid;     // dynamic
        bool active;        // 1 byte
        uint32 createdAt;   // 4 bytes (timestamp fits in 32 bits until 2106)
    }

    // State variables
    uint256 public agentCount;
    mapping(uint256 => Agent) public agents;
    mapping(address => uint256[]) public ownerAgents;
    
    IERC20 public paymentToken;
    uint256 public agentFee;
    address public owner;

    // Events
    event AgentRegistered(uint256 indexed agentId, address indexed owner, string ipfsCid);
    event AgentDeactivated(uint256 indexed agentId);
    event FeeUpdated(uint256 newFee);
    event PaymentTokenUpdated(address indexed newToken);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier validAgentId(uint256 agentId) {
        require(agentId > 0 && agentId <= agentCount, "Invalid agent ID");
        _;
    }

    /**
     * @dev Initialize the contract (can only be called once)
     */
    function initialize(IERC20 _paymentToken, uint256 _agentFee) external {
        require(owner == address(0), "Already initialized");
        require(address(_paymentToken) != address(0), "Invalid token");
        
        owner = msg.sender;
        paymentToken = _paymentToken;
        agentFee = _agentFee;
    }

    /**
     * @dev Register a new agent with IPFS metadata
     */
    function registerAgent(string calldata ipfsCid) external returns (uint256) {
        require(bytes(ipfsCid).length > 0, "Empty CID");
        require(paymentToken.transferFrom(msg.sender, address(this), agentFee), "Payment failed");
        
        agentCount++;
        uint256 agentId = agentCount;
        
        agents[agentId] = Agent({
            owner: msg.sender,
            ipfsCid: ipfsCid,
            active: true,
            createdAt: uint32(block.timestamp)
        });
        
        ownerAgents[msg.sender].push(agentId);
        emit AgentRegistered(agentId, msg.sender, ipfsCid);
        return agentId;
    }


    /**
     * @dev Get agent information by ID
     */
    function getAgent(uint256 agentId) external view validAgentId(agentId) 
        returns (address, string memory, bool, uint32) 
    {
        Agent storage agent = agents[agentId];
        return (agent.owner, agent.ipfsCid, agent.active, agent.createdAt);
    }

    /**
     * @dev Get all agent IDs owned by an address
     */
    function getAgentsByOwner(address owner) external view returns (uint256[] memory) {
        return ownerAgents[owner];
    }

    /**
     * @dev Deactivate an agent (owner only)
     */
    function deactivateAgent(uint256 agentId) external onlyOwner validAgentId(agentId) {
        require(agents[agentId].active, "Already inactive");
        agents[agentId].active = false;
        emit AgentDeactivated(agentId);
    }

    /**
     * @dev Update the registration fee (owner only)
     */
    function updateFee(uint256 newFee) external onlyOwner {
        agentFee = newFee;
        emit FeeUpdated(newFee);
    }

    /**
     * @dev Set a new payment token (owner only)
     */
    function setPaymentToken(IERC20 newToken) external onlyOwner {
        require(address(newToken) != address(0), "Invalid token");
        paymentToken = newToken;
        emit PaymentTokenUpdated(address(newToken));
    }

    /**
     * @dev Emergency withdraw function (owner only)
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        if (token == address(0)) {
            uint256 balance = address(this).balance;
            uint256 withdrawAmount = amount == 0 ? balance : amount;
            require(withdrawAmount <= balance, "Insufficient balance");
            (bool success, ) = payable(msg.sender).call{value: withdrawAmount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20 tokenContract = IERC20(token);
            uint256 balance = tokenContract.balanceOf(address(this));
            uint256 withdrawAmount = amount == 0 ? balance : amount;
            require(withdrawAmount <= balance, "Insufficient balance");
            require(tokenContract.transfer(msg.sender, withdrawAmount), "Token transfer failed");
        }
    }
}