# Migration Guide: web3.storage to @storacha/client

This guide helps you migrate from the deprecated `web3.storage` package to the new `@storacha/client` package.

## 🚨 Important Changes

The `web3.storage` package has been deprecated. We've updated the entire codebase to use the new `@storacha/client` package.

## 📦 Package Changes

### Frontend (`Frontend/package.json`)
```json
// OLD (deprecated)
"web3.storage": "^6.1.0"

// NEW (updated)
"@storacha/client": "^1.0.0"
```

### Backend (`Backend/package.json`)
```json
// OLD (deprecated)
"web3.storage": "^6.1.0"

// NEW (updated)
"@storacha/client": "^1.0.0"
```

## 🔧 Code Changes

### Frontend IPFS Hook (`Frontend/src/hooks/useIPFS.js`)

#### Before (Old API)
```javascript
import { Web3Storage } from 'web3.storage';

export async function uploadJsonToIPFS(json) {
  const token = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
  const client = new Web3Storage({ token });
  const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
  const file = new File([blob], 'agent-config.json');
  const cid = await client.put([file], { wrapWithDirectory: false });
  return cid;
}
```

#### After (New API)
```javascript
import { create } from '@storacha/client';

export async function uploadJsonToIPFS(json) {
  const client = await create();
  const token = process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
  await client.login(token);
  
  const blob = new Blob([JSON.stringify(json, null, 2)], { 
    type: 'application/json' 
  });
  const file = new File([blob], 'agent-config.json', {
    type: 'application/json'
  });
  
  const cid = await client.uploadFile(file);
  return cid;
}
```

### Backend IPFS Service (`Backend/migrations/ipfs.js`)

#### Before (Old API)
```javascript
import { Web3Storage } from 'web3.storage';

const client = new Web3Storage({ token: WEB3_STORAGE_TOKEN });

export async function pinJSONToIPFS(json, filename) {
  const cid = await client.put([file], uploadOptions);
  return cid;
}
```

#### After (New API)
```javascript
import { create } from '@storacha/client';

let client = null;

async function initializeClient() {
  if (!client) {
    client = await create();
    await client.login(WEB3_STORAGE_TOKEN);
  }
  return client;
}

export async function pinJSONToIPFS(json, filename) {
  const w3upClient = await initializeClient();
  const cid = await w3upClient.uploadFile(file);
  return cid;
}
```

## 🚀 Installation Steps

### 1. Update Dependencies

**Frontend:**
```bash
cd Frontend
npm uninstall web3.storage
npm install @storacha/client@^1.0.0
```

**Backend:**
```bash
cd Backend
npm uninstall web3.storage
npm install @storacha/client@^1.0.0
```

### 2. Environment Variables

No changes needed to environment variables. The same `WEB3_STORAGE_TOKEN` is used:

```env
# Frontend/.env.local
NEXT_PUBLIC_WEB3STORAGE_TOKEN=your_token_here

# Backend/.env
WEB3_STORAGE_TOKEN=your_token_here
```

### 3. Get New Token (if needed)

If you need a new token:

1. Visit [Web3.Storage](https://web3.storage/)
2. Sign in to your account
3. Go to "API Keys" section
4. Create a new API key
5. Copy the token to your environment files

## 🔄 API Differences

### Upload Methods

| Old API | New API |
|---------|---------|
| `client.put([file], options)` | `client.uploadFile(file)` |
| `client.get(cid)` | `fetch(\`https://\${cid}.ipfs.w3s.link/\`)` |

### Key Changes

1. **Client Initialization**: Must use `create()` and `login()` methods
2. **File Upload**: Single file upload with `uploadFile()` instead of array
3. **File Retrieval**: Use HTTP fetch instead of client.get()
4. **Directory Uploads**: Not directly supported (upload files individually)

## 🐛 Troubleshooting

### Common Issues

1. **"Client not initialized" error**
   - Ensure you call `await client.login(token)` before uploading
   - Check that your token is valid

2. **"Directory uploads not supported"**
   - w3up-client doesn't support directory uploads
   - Upload files individually or use a different approach

3. **"Invalid CID" errors**
   - The new client returns CIDs in a different format
   - Update your CID validation patterns

### Migration Checklist

- [ ] Remove old `web3.storage` package
- [ ] Install new `@web3-storage/w3up-client` package
- [ ] Update import statements
- [ ] Replace `new Web3Storage()` with `create()` and `login()`
- [ ] Replace `client.put()` with `client.uploadFile()`
- [ ] Replace `client.get()` with `fetch()` for retrieval
- [ ] Test upload and retrieval functionality
- [ ] Update any CID validation logic

## 📚 Additional Resources

- [Storacha Client Documentation](https://github.com/storacha/client)
- [Web3.Storage Migration Guide](https://web3.storage/docs/how-tos/migrate-from-web3-storage-js/)
- [IPFS Gateway Documentation](https://web3.storage/docs/how-tos/retrieve/)

## ✅ Verification

After migration, verify that:

1. ✅ Agent uploads work correctly
2. ✅ IPFS CIDs are generated properly
3. ✅ Agent retrieval from IPFS works
4. ✅ No deprecation warnings in console
5. ✅ All existing functionality is preserved

---

**Note**: This migration maintains full backward compatibility with existing IPFS CIDs and data.
