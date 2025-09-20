// SPDX-License-Identifier: MIT
struct Agent {
address owner;
string ipfsCid;
bool active;
}


uint256 public agentCount;
mapping(uint256 => Agent) public agents;


IERC20 public paymentToken;
uint256 public agentFee;


bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
bytes32 public constant MARKETPLACE_ROLE = keccak256("MARKETPLACE_ROLE");


event AgentRegistered(uint256 indexed agentId, address indexed owner, string ipfsCid);


constructor(IERC20 _paymentToken, uint256 _agentFee) {
paymentToken = _paymentToken;
agentFee = _agentFee;
_setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
_setupRole(ADMIN_ROLE, msg.sender);
}


modifier onlyAgentOwner(uint256 agentId) {
require(agents[agentId].owner == msg.sender, "Not agent owner");
_;
}


function registerAgent(string calldata ipfsCid) external nonReentrant returns (uint256) {
require(paymentToken.transferFrom(msg.sender, address(this), agentFee), "Payment failed");
agentCount++;
agents[agentCount] = Agent(msg.sender, ipfsCid, true);
emit AgentRegistered(agentCount, msg.sender, ipfsCid);
return agentCount;
}


function getAgent(uint256 agentId) external view override returns (address owner, string memory ipfsCid, bool active) {
Agent storage agent = agents[agentId];
return (agent.owner, agent.ipfsCid, agent.active);
}


function deactivateAgent(uint256 agentId) external onlyRole(ADMIN_ROLE) {
agents[agentId].active = false;
}


function updateFee(uint256 newFee) external onlyRole(ADMIN_ROLE) {
agentFee = newFee;
}


function setPaymentToken(IERC20 newToken) external onlyRole(ADMIN_ROLE) {
paymentToken = newToken;
}
}