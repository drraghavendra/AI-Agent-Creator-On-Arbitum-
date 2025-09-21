import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";


const config: HardhatUserConfig = {

    
solidity: "0.8.20",
networks: {
arbitrumSepolia: {
url: process.env.RPC_URL,
accounts: [process.env.DEPLOYER_PRIVATE_KEY]
}
}
};


export default config;