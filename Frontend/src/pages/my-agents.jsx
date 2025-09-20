import Head from 'next/head';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
  PlayIcon,
  PauseIcon,
  TrashIcon,
  EyeIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default function MyAgentsPage() {
  const agents = [
    {
      id: 1,
      name: 'DeFi Yield Optimizer',
      description: 'Automatically finds and executes the best yield farming opportunities.',
      status: 'active',
      executions: 1247,
      lastRun: '2 hours ago',
      gasUsed: '0.023 ETH',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'NFT Floor Tracker',
      description: 'Monitors NFT floor prices and sends alerts.',
      status: 'paused',
      executions: 892,
      lastRun: '1 day ago',
      gasUsed: '0.015 ETH',
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      name: 'Governance Voter',
      description: 'Automatically votes on governance proposals.',
      status: 'active',
      executions: 234,
      lastRun: '5 minutes ago',
      gasUsed: '0.008 ETH',
      createdAt: '2024-01-20'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <Head>
        <title>My Agents - ARC Agents</title>
        <meta name="description" content="Manage your deployed AI agents." />
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Agents</h1>
          <p className="text-xl text-gray-600">
            Manage and monitor your deployed AI agents
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="card text-center"
          >
            <div className="text-3xl font-bold gradient-text mb-2">{agents.length}</div>
            <div className="text-gray-600">Total Agents</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="card text-center"
          >
            <div className="text-3xl font-bold gradient-text mb-2">
              {agents.filter(a => a.status === 'active').length}
            </div>
            <div className="text-gray-600">Active</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card text-center"
          >
            <div className="text-3xl font-bold gradient-text mb-2">
              {agents.reduce((sum, agent) => sum + agent.executions, 0).toLocaleString()}
            </div>
            <div className="text-gray-600">Total Executions</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card text-center"
          >
            <div className="text-3xl font-bold gradient-text mb-2">
              {agents.reduce((sum, agent) => sum + parseFloat(agent.gasUsed), 0).toFixed(3)} ETH
            </div>
            <div className="text-gray-600">Gas Used</div>
          </motion.div>
        </div>

        {/* Agents List */}
        <div className="space-y-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{agent.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                      {agent.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{agent.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Executions</p>
                      <p className="font-semibold text-gray-900">{agent.executions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Run</p>
                      <p className="font-semibold text-gray-900">{agent.lastRun}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gas Used</p>
                      <p className="font-semibold text-gray-900">{agent.gasUsed}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Created</p>
                      <p className="font-semibold text-gray-900">{agent.createdAt}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 ml-6">
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <ChartBarIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Cog6ToothIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  {agent.status === 'active' ? (
                    <button className="p-2 border border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors">
                      <PauseIcon className="w-5 h-5 text-yellow-600" />
                    </button>
                  ) : (
                    <button className="p-2 border border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                      <PlayIcon className="w-5 h-5 text-green-600" />
                    </button>
                  )}
                  
                  <button className="p-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                    <TrashIcon className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {agents.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No agents yet</h3>
            <p className="text-gray-600 mb-6">Create your first AI agent to get started</p>
            <button className="btn-primary">
              Create Agent
            </button>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
