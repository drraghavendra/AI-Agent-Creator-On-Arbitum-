import { Web3Storage } from 'web3.storage';


export async function uploadJsonToIPFS(json) {
const token = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
if(!token) throw new Error('Missing WEB3_STORAGE token');
const client = new Web3Storage({ token });
const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
const file = new File([blob], 'agent-config.json');
const cid = await client.put([file], { wrapWithDirectory: false });
return cid;
}