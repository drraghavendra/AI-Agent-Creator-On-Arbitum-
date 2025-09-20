import dotenv from 'dotenv';
dotenv.config();


export const PORT = process.env.PORT || 4000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const REDIS_URL = process.env.REDIS_URL;
export const WEB3_STORAGE_TOKEN = process.env.WEB3_STORAGE_TOKEN;
export const AGENT_REGISTRY_ADDRESS = process.env.AGENT_REGISTRY_ADDRESS;
export const ETH_PRIVATE_KEY = process.env.ETH_PRIVATE_KEY;
export const RPC_URL = process.env.RPC_URL;