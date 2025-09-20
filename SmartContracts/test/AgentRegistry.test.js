import { expect } from "chai";
import { ethers } from "hardhat";


describe("AgentRegistry", function () {
it("should register an agent correctly", async function () {
const [owner] = await ethers.getSigners();
const AgentRegistry = await ethers.getContractFactory("AgentRegistry");
const registry = await AgentRegistry.deploy();
await registry.deployed();


const tx = await registry.registerAgent("QmTestCID123");
await tx.wait();


const agent = await registry.getAgent(1);
expect(agent.owner).to.equal(owner.address);
expect(agent.ipfsCid).to.equal("QmTestCID123");
expect(agent.active).to.equal(true);
});
});