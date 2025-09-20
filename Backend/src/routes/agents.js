import express from 'express';
import { pinJSONToIPFS } from '../services/ipfs.js';
import { registerAgentOnChain } from '../services/chain.js';
import { query } from '../db/index.js';
import { agentQueue } from '../services/queue.js';


const router = express.Router();


// POST /api/agents : create agent
router.post('/', async (req, res) => {
try {
const { name, config, owner } = req.body;
if (!config) return res.status(400).json({ error: 'Missing config' });


// 1) Pin to IPFS
const cid = await pinJSONToIPFS({ name, config, owner, createdAt: new Date().toISOString() });


// 2) Register on chain via backend signer (or optionally require client-side signature)
const { txHash, agentId } = await registerAgentOnChain(cid);


// 3) Persist to Postgres
const result = await query(
`INSERT INTO agents(owner_address, ipfs_cid, agent_name, tx_hash, chain_agent_id) VALUES($1,$2,$3,$4,$5) RETURNING *`,
[owner || null, cid, name || null, txHash, agentId || null]
);


const agentRow = result.rows[0];


// 4) Enqueue initial job for rig execution (optional)
await agentQueue.add('initial-run', { agentId: agentRow.id, ipfsCid: cid, owner: owner });


res.json({ success: true, agent: agentRow, txHash, agentId });
} catch (err) {
console.error(err);
res.status(500).json({ error: err.message });
}
});


// GET /api/agents/:id
router.get('/:id', async (req, res) => {
const id = req.params.id;
const r = await query('SELECT * FROM agents WHERE id = $1', [id]);
if (r.rows.length === 0) return res.status(404).json({ error: 'Not found' });
res.json(r.rows[0]);
});


export default router;