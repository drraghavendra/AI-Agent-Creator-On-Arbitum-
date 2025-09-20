-- Enable UUID extension for better primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types for better data integrity
CREATE TYPE agent_status AS ENUM ('active', 'inactive', 'paused', 'deleted');
CREATE TYPE chain_type AS ENUM ('arbitrum', 'ethereum', 'polygon', 'base');

-- Main agents table with optimized structure
CREATE TABLE IF NOT EXISTS agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_address CHAR(42) NOT NULL CHECK (owner_address ~ '^0x[a-fA-F0-9]{40}$'),
    ipfs_cid VARCHAR(255) NOT NULL CHECK (ipfs_cid ~ '^Qm[a-zA-Z0-9]{44}$|^baf[a-zA-Z0-9]{56}$'),
    agent_name VARCHAR(255) NOT NULL CHECK (length(agent_name) >= 1 AND length(agent_name) <= 255),
    description TEXT,
    status agent_status DEFAULT 'active',
    chain_type chain_type DEFAULT 'arbitrum',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    tx_hash CHAR(66) CHECK (tx_hash ~ '^0x[a-fA-F0-9]{64}$'),
    chain_agent_id BIGINT UNIQUE CHECK (chain_agent_id > 0),
    gas_used BIGINT,
    gas_price BIGINT,
    block_number BIGINT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Agent modules table for better normalization
CREATE TABLE IF NOT EXISTS agent_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    module_name VARCHAR(100) NOT NULL CHECK (length(module_name) >= 1),
    module_type VARCHAR(50) NOT NULL,
    configuration JSONB DEFAULT '{}'::jsonb,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(agent_id, module_name)
);

-- Agent triggers table
CREATE TABLE IF NOT EXISTS agent_triggers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('manual', 'event', 'cron', 'price', 'time')),
    trigger_config JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Agent executions/activity log
CREATE TABLE IF NOT EXISTS agent_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    execution_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    input_data JSONB DEFAULT '{}'::jsonb,
    output_data JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    gas_used BIGINT,
    tx_hash CHAR(66) CHECK (tx_hash ~ '^0x[a-fA-F0-9]{64}$'),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    execution_time_ms INTEGER
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address CHAR(42) UNIQUE NOT NULL CHECK (wallet_address ~ '^0x[a-fA-F0-9]{40}$'),
    username VARCHAR(50) UNIQUE,
    email VARCHAR(255) UNIQUE,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Agent analytics table
CREATE TABLE IF NOT EXISTS agent_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    executions_count INTEGER DEFAULT 0,
    successful_executions INTEGER DEFAULT 0,
    failed_executions INTEGER DEFAULT 0,
    total_gas_used BIGINT DEFAULT 0,
    avg_execution_time_ms DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(agent_id, date)
);

-- Create indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_agents_owner_address ON agents(owner_address);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_chain_type ON agents(chain_type);
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agents_chain_agent_id ON agents(chain_agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_tx_hash ON agents(tx_hash);
CREATE INDEX IF NOT EXISTS idx_agents_updated_at ON agents(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_agent_modules_agent_id ON agent_modules(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_modules_type ON agent_modules(module_type);

CREATE INDEX IF NOT EXISTS idx_agent_triggers_agent_id ON agent_triggers(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_triggers_type ON agent_triggers(trigger_type);
CREATE INDEX IF NOT EXISTS idx_agent_triggers_active ON agent_triggers(is_active);

CREATE INDEX IF NOT EXISTS idx_agent_executions_agent_id ON agent_executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_status ON agent_executions(status);
CREATE INDEX IF NOT EXISTS idx_agent_executions_started_at ON agent_executions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_executions_tx_hash ON agent_executions(tx_hash);

CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet ON user_profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

CREATE INDEX IF NOT EXISTS idx_agent_analytics_agent_id ON agent_analytics(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_analytics_date ON agent_analytics(date DESC);
CREATE INDEX IF NOT EXISTS idx_agent_analytics_agent_date ON agent_analytics(agent_id, date);

-- Create GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_agents_metadata_gin ON agents USING GIN(metadata);
CREATE INDEX IF NOT EXISTS idx_agent_modules_config_gin ON agent_modules USING GIN(configuration);
CREATE INDEX IF NOT EXISTS idx_agent_triggers_config_gin ON agent_triggers USING GIN(trigger_config);
CREATE INDEX IF NOT EXISTS idx_agent_executions_input_gin ON agent_executions USING GIN(input_data);
CREATE INDEX IF NOT EXISTS idx_agent_executions_output_gin ON agent_executions USING GIN(output_data);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agent_triggers_updated_at BEFORE UPDATE ON agent_triggers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update last_active_at for users
CREATE OR REPLACE FUNCTION update_user_last_active()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles 
    SET last_active_at = now() 
    WHERE wallet_address = NEW.owner_address;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update user activity when agent is created/updated
CREATE TRIGGER update_user_activity_on_agent_change 
    AFTER INSERT OR UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_user_last_active();

-- Create view for agent summary with module count
CREATE OR REPLACE VIEW agent_summary AS
SELECT 
    a.id,
    a.owner_address,
    a.agent_name,
    a.description,
    a.status,
    a.chain_type,
    a.created_at,
    a.updated_at,
    a.chain_agent_id,
    COUNT(am.id) as module_count,
    COUNT(at.id) as trigger_count,
    COALESCE(ae.execution_count, 0) as total_executions,
    COALESCE(ae.success_rate, 0) as success_rate
FROM agents a
LEFT JOIN agent_modules am ON a.id = am.agent_id
LEFT JOIN agent_triggers at ON a.id = at.agent_id AND at.is_active = true
LEFT JOIN (
    SELECT 
        agent_id,
        COUNT(*) as execution_count,
        ROUND(
            (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*)) * 100, 2
        ) as success_rate
    FROM agent_executions 
    GROUP BY agent_id
) ae ON a.id = ae.agent_id
GROUP BY a.id, a.owner_address, a.agent_name, a.description, a.status, 
         a.chain_type, a.created_at, a.updated_at, a.chain_agent_id, 
         ae.execution_count, ae.success_rate;

-- Create function to get agent statistics
CREATE OR REPLACE FUNCTION get_agent_stats(agent_uuid UUID)
RETURNS TABLE (
    total_executions BIGINT,
    successful_executions BIGINT,
    failed_executions BIGINT,
    success_rate DECIMAL(5,2),
    avg_execution_time_ms DECIMAL(10,2),
    total_gas_used BIGINT,
    last_execution_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_executions,
        COUNT(*) FILTER (WHERE status = 'completed') as successful_executions,
        COUNT(*) FILTER (WHERE status = 'failed') as failed_executions,
        ROUND(
            (COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 2
        ) as success_rate,
        ROUND(AVG(execution_time_ms), 2) as avg_execution_time_ms,
        SUM(gas_used) as total_gas_used,
        MAX(started_at) as last_execution_at
    FROM agent_executions 
    WHERE agent_id = agent_uuid;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing (optional)
-- INSERT INTO user_profiles (wallet_address, username, display_name) VALUES 
-- ('0x1234567890123456789012345678901234567890', 'testuser', 'Test User');

-- Add comments for documentation
COMMENT ON TABLE agents IS 'Main table storing AI agent information and blockchain metadata';
COMMENT ON TABLE agent_modules IS 'Stores individual modules/components for each agent';
COMMENT ON TABLE agent_triggers IS 'Defines trigger conditions for agent execution';
COMMENT ON TABLE agent_executions IS 'Logs all agent execution attempts and results';
COMMENT ON TABLE user_profiles IS 'User profile information linked to wallet addresses';
COMMENT ON TABLE agent_analytics IS 'Daily aggregated analytics for agent performance';

COMMENT ON COLUMN agents.owner_address IS 'Ethereum wallet address of the agent owner (42 chars with 0x prefix)';
COMMENT ON COLUMN agents.ipfs_cid IS 'IPFS content identifier for agent metadata';
COMMENT ON COLUMN agents.metadata IS 'Additional JSON metadata for the agent';
COMMENT ON COLUMN agents.chain_agent_id IS 'Agent ID from the smart contract on the blockchain';