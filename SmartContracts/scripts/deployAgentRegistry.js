import { ethers } from "hardhat";


async function main() {
const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
const registry = await AgentRegistry.deploy();
await registry.deployed();


console.log("AgentRegistry deployed to:", registry.address);
}


main().catch((error) => {
console.error(error);
process.exitCode = 1;
});