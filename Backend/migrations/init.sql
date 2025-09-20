CREATE TABLE IF NOT EXISTS agents (
id SERIAL PRIMARY KEY,
owner_address VARCHAR(66) NOT NULL,
ipfs_cid TEXT NOT NULL,
agent_name TEXT,
status VARCHAR(32) DEFAULT 'active',
created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
tx_hash TEXT,
chain_agent_id BIGINT
);