import { create } from '@storacha/client';
import { WEB3_STORAGE_TOKEN } from '../config/index.js';

/**
 * IPFS Service for handling decentralized storage operations
 * Provides comprehensive functionality for storing and retrieving agent configurations
 */

// Configuration and validation
if (!WEB3_STORAGE_TOKEN) {
    throw new Error('WEB3_STORAGE_TOKEN not set in environment variables');
}

// Initialize w3up client
let client = null;

/**
 * Initialize the w3up client
 */
async function initializeClient() {
    if (!client) {
        client = await create();
        await client.login(WEB3_STORAGE_TOKEN);
    }
    return client;
}

// Cache for frequently accessed data
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Retry configuration
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Utility function to add delay
 * @param {number} ms - Milliseconds to delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Validate JSON data before uploading
 * @param {Object} json - JSON data to validate
 * @param {string} filename - Filename for validation
 */
function validateInput(json, filename) {
    if (!json || typeof json !== 'object') {
        throw new Error('Invalid JSON data: must be a valid object');
    }
    
    if (!filename || typeof filename !== 'string' || filename.trim() === '') {
        throw new Error('Invalid filename: must be a non-empty string');
    }
    
    // Validate required agent fields
    if (json.name && (typeof json.name !== 'string' || json.name.trim() === '')) {
        throw new Error('Agent name must be a non-empty string');
    }
    
    if (json.modules && (!Array.isArray(json.modules) || json.modules.length === 0)) {
        throw new Error('Agent modules must be a non-empty array');
    }
    
    // Check JSON size (limit to 1MB)
    const jsonString = JSON.stringify(json);
    if (jsonString.length > 1024 * 1024) {
        throw new Error('JSON data too large: maximum 1MB allowed');
    }
}

/**
 * Retry wrapper for async operations
 * @param {Function} operation - Async operation to retry
 * @param {number} attempts - Number of retry attempts
 * @param {number} delayMs - Delay between retries
 */
async function withRetry(operation, attempts = RETRY_ATTEMPTS, delayMs = RETRY_DELAY) {
    let lastError;
    
    for (let i = 0; i < attempts; i++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            console.warn(`IPFS operation attempt ${i + 1} failed:`, error.message);
            
            if (i < attempts - 1) {
                await delay(delayMs * Math.pow(2, i)); // Exponential backoff
            }
        }
    }
    
    throw new Error(`IPFS operation failed after ${attempts} attempts: ${lastError.message}`);
}

/**
 * Pin JSON data to IPFS with comprehensive error handling and validation
 * @param {Object} json - JSON data to upload
 * @param {string} filename - Filename for the uploaded data
 * @param {Object} options - Additional options for upload
 * @returns {Promise<string>} IPFS CID
 */
export async function pinJSONToIPFS(json, filename = 'agent-config.json', options = {}) {
    try {
        // Validate input
        validateInput(json, filename);
        
        // Check cache first
        const cacheKey = `${filename}-${JSON.stringify(json)}`;
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log('Returning cached IPFS CID:', cached.cid);
            return cached.cid;
        }
        
        // Prepare data for upload
        const jsonString = JSON.stringify(json, null, 2); // Pretty print for readability
        const blob = new Blob([jsonString], { type: 'application/json' });
        const file = new File([blob], filename, { 
            type: 'application/json',
            lastModified: Date.now()
        });
        
        // Upload with retry logic
        const cid = await withRetry(async () => {
            const w3upClient = await initializeClient();
            return await w3upClient.uploadFile(file);
        });
        
        // Validate CID format
        if (!cid || typeof cid !== 'string' || cid.length < 10) {
            throw new Error('Invalid CID returned from IPFS');
        }
        
        // Cache the result
        cache.set(cacheKey, {
            cid,
            timestamp: Date.now()
        });
        
        console.log(`Successfully uploaded to IPFS: ${cid}`);
        return cid;
        
    } catch (error) {
        console.error('Failed to pin JSON to IPFS:', error);
        throw new Error(`IPFS upload failed: ${error.message}`);
    }
}

/**
 * Retrieve JSON data from IPFS
 * @param {string} cid - IPFS CID to retrieve
 * @returns {Promise<Object>} Retrieved JSON data
 */
export async function getJSONFromIPFS(cid) {
    try {
        if (!cid || typeof cid !== 'string') {
            throw new Error('Invalid CID: must be a non-empty string');
        }
        
        // Check cache first
        const cached = cache.get(cid);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            console.log('Returning cached JSON data for CID:', cid);
            return cached.data;
        }
        
        // Retrieve from IPFS with retry logic
        const data = await withRetry(async () => {
            const response = await fetch(`https://${cid}.ipfs.w3s.link/`);
            
            if (!response.ok) {
                throw new Error(`Failed to retrieve data from IPFS: ${response.status} ${response.statusText}`);
            }
            
            const text = await response.text();
            
            try {
                return JSON.parse(text);
            } catch (parseError) {
                throw new Error(`Invalid JSON data retrieved from IPFS: ${parseError.message}`);
            }
        });
        
        // Cache the result
        cache.set(cid, {
            data,
            timestamp: Date.now()
        });
        
        console.log(`Successfully retrieved JSON from IPFS: ${cid}`);
        return data;
        
    } catch (error) {
        console.error('Failed to get JSON from IPFS:', error);
        throw new Error(`IPFS retrieval failed: ${error.message}`);
    }
}

/**
 * Pin multiple files to IPFS as a directory
 * @param {Array<Object>} files - Array of file objects with name and content
 * @param {string} directoryName - Name for the directory
 * @returns {Promise<string>} IPFS CID for the directory
 */
export async function pinDirectoryToIPFS(files, directoryName = 'agent-files') {
    try {
        if (!Array.isArray(files) || files.length === 0) {
            throw new Error('Files must be a non-empty array');
        }
        
        const fileObjects = files.map((file, index) => {
            if (!file.name || !file.content) {
                throw new Error(`File at index ${index} must have name and content properties`);
            }
            
            const blob = new Blob([file.content], { type: file.type || 'text/plain' });
            return new File([blob], file.name, { 
                type: file.type || 'text/plain',
                lastModified: Date.now()
            });
        });
        
        const cid = await withRetry(async () => {
            const w3upClient = await initializeClient();
            // Note: w3up-client doesn't support directory uploads directly
            // For now, we'll upload the first file and return its CID
            // In a production environment, you might want to use a different approach
            if (fileObjects.length === 1) {
                return await w3upClient.uploadFile(fileObjects[0]);
            } else {
                throw new Error('Directory uploads not supported with w3up-client. Please upload files individually.');
            }
        });
        
        console.log(`Successfully uploaded directory to IPFS: ${cid}`);
        return cid;
        
    } catch (error) {
        console.error('Failed to pin directory to IPFS:', error);
        throw new Error(`IPFS directory upload failed: ${error.message}`);
    }
}

/**
 * Validate IPFS CID format
 * @param {string} cid - CID to validate
 * @returns {boolean} Whether the CID is valid
 */
export function isValidCID(cid) {
    if (!cid || typeof cid !== 'string') return false;
    
    // Check for common IPFS CID patterns
    const cidPatterns = [
        /^Qm[a-zA-Z0-9]{44}$/, // CIDv0
        /^baf[a-zA-Z0-9]{56}$/, // CIDv1
        /^b[a-zA-Z0-9]{58,}$/ // Other CIDv1 variants
    ];
    
    return cidPatterns.some(pattern => pattern.test(cid));
}

/**
 * Get file information from IPFS
 * @param {string} cid - IPFS CID
 * @returns {Promise<Object>} File information
 */
export async function getFileInfo(cid) {
    try {
        if (!isValidCID(cid)) {
            throw new Error('Invalid CID format');
        }
        
        const res = await client.get(cid);
        if (!res || !res.ok) {
            throw new Error(`Failed to get file info: ${res?.status || 'Unknown error'}`);
        }
        
        const files = await res.files();
        if (!files || files.length === 0) {
            throw new Error('No files found');
        }
        
        const file = files[0];
        return {
            name: file.name,
            size: file.size,
            type: file.type,
            cid: cid,
            lastModified: file.lastModified
        };
        
    } catch (error) {
        console.error('Failed to get file info:', error);
        throw new Error(`File info retrieval failed: ${error.message}`);
    }
}

/**
 * Clear the IPFS cache
 */
export function clearCache() {
    cache.clear();
    console.log('IPFS cache cleared');
}

/**
 * Get cache statistics
 * @returns {Object} Cache statistics
 */
export function getCacheStats() {
    return {
        size: cache.size,
        entries: Array.from(cache.keys())
    };
}

/**
 * Health check for IPFS service
 * @returns {Promise<Object>} Health status
 */
export async function healthCheck() {
    try {
        // Try to upload a small test file
        const testData = { test: true, timestamp: Date.now() };
        const cid = await pinJSONToIPFS(testData, 'health-check.json');
        
        // Try to retrieve it
        const retrieved = await getJSONFromIPFS(cid);
        
        return {
            status: 'healthy',
            cid: cid,
            retrieved: retrieved.test === true,
            timestamp: new Date().toISOString()
        };
        
    } catch (error) {
        return {
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}