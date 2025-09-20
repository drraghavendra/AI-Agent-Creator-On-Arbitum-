import { Web3Storage } from 'web3.storage';
import { WEB3_STORAGE_TOKEN } from '../config/index.js';


if (!WEB3_STORAGE_TOKEN) throw new Error('WEB3_STORAGE_TOKEN not set in env');
const client = new Web3Storage({ token: WEB3_STORAGE_TOKEN });


export async function pinJSONToIPFS(json, filename = 'agent-config.json') {
const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
const file = new File([blob], filename);
const cid = await client.put([file], { wrapWithDirectory: false });
return cid;
}