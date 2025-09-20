import { ethers } from 'ethers';
import CONTRACT_ABI from '../utils/AgentRegistry.json';


export async function registerAgentOnChain({ signer, cid }){
const address = process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS;
if(!address) throw new Error('Missing AgentRegistry address');
const contract = new ethers.Contract(address, CONTRACT_ABI, signer);
const tx = await contract.registerAgent(cid); // example method
await tx.wait();
return tx.hash;
}