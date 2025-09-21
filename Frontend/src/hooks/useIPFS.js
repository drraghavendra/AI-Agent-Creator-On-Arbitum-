import { create } from '@storacha/client';

/**
 * Upload JSON data to IPFS using the new w3up-client
 * @param {Object} json - The JSON object to upload
 * @returns {Promise<string>} - The IPFS CID
 */
export async function uploadJsonToIPFS(json) {
  try {
    // Create w3up client
    const client = await create();
    
    // Get the token from environment variables
    const token = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
    if (!token) {
      throw new Error('Missing WEB3_STORAGE token. Please add NEXT_PUBLIC_WEB3STORAGE_TOKEN to your .env.local file');
    }
    
    // Login with the token
    await client.login(token);
    
    // Create a blob from the JSON data
    const blob = new Blob([JSON.stringify(json, null, 2)], { 
      type: 'application/json' 
    });
    
    // Create a file from the blob
    const file = new File([blob], 'agent-config.json', {
      type: 'application/json'
    });
    
    // Upload the file to IPFS
    const cid = await client.uploadFile(file);
    
    console.log('Successfully uploaded to IPFS:', cid);
    return cid;
    
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error(`Failed to upload to IPFS: ${error.message}`);
  }
}

/**
 * Retrieve JSON data from IPFS using CID
 * @param {string} cid - The IPFS CID
 * @returns {Promise<Object>} - The JSON object
 */
export async function getJsonFromIPFS(cid) {
  try {
    const client = await create();
    const token = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
    
    if (!token) {
      throw new Error('Missing WEB3_STORAGE token');
    }
    
    await client.login(token);
    
    // Retrieve the file from IPFS
    const response = await fetch(`https://${cid}.ipfs.w3s.link/`);
    
    if (!response.ok) {
      throw new Error(`Failed to retrieve from IPFS: ${response.statusText}`);
    }
    
    const json = await response.json();
    return json;
    
  } catch (error) {
    console.error('IPFS retrieval error:', error);
    throw new Error(`Failed to retrieve from IPFS: ${error.message}`);
  }
}

/**
 * Validate IPFS CID format
 * @param {string} cid - The CID to validate
 * @returns {boolean} - Whether the CID is valid
 */
export function isValidCID(cid) {
  // Basic CID validation (starts with Qm for v0 or bafy for v1)
  return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z2-7]{52})$/.test(cid);
}