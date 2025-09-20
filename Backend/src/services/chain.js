import { Wallet, JsonRpcProvider, Contract } from 'ethers';
import { AGENT_REGISTRY_ADDRESS, ETH_PRIVATE_KEY, RPC_URL } from '../config/index.js';
import AgentRegistryArtifact from '../../artifacts/AgentRegistry.json' assert { type: 'json' };


const provider = new JsonRpcProvider(RPC_URL);
const wallet = new Wallet(ETH_PRIVATE_KEY, provider);
const contract = new Contract(AGENT_REGISTRY_ADDRESS, AgentRegistryArtifact.abi, wallet);


export async function registerAgentOnChain(ipfsCid) {
// sends transaction to registerAgent
const tx = await contract.registerAgent(ipfsCid);
const receipt = await tx.wait();
// Find AgentRegistered event (ABI event)
const ev = receipt.events?.find((e) => e.event === 'AgentRegistered');
const agentId = ev ? ev.args.agentId.toString() : null;
return { txHash: receipt.transactionHash, agentId };
}