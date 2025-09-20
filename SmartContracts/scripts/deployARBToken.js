import { ethers } from "hardhat";


async function main() {
const ARBToken = await ethers.getContractFactory("ARBToken");
const arb = await ARBToken.deploy(ethers.utils.parseEther("1000000"));
await arb.deployed();


console.log("ARBToken deployed to:", arb.address);
}


main().catch((error) => {
console.error(error);
process.exitCode = 1;
});