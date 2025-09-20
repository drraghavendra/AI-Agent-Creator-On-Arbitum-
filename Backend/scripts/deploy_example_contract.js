// Use this locally to deploy AgentRegistry via hardhat and copy ABI to artifacts/
// Example is intentionally short — run with `node scripts/deploy_example_contract.js` after configuring Hardhat


import { ethers } from 'hardhat';


async function main() {
const AgentRegistry = await ethers.getContractFactory('AgentRegistry');
const reg = await AgentRegistry.deploy();
await reg.deployed();
console.log('AgentRegistry deployed to', reg.address);
}


main().catch((err) => { console.error(err); process.exit(1); });