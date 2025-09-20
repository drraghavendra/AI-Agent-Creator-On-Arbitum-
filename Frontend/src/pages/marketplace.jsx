import Head from 'next/head';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

export default function MarketplacePage() {
  const agents = [
    {
      id: 1,
      name: 'DeFi Yield Optimizer',
      description: 'Automatically finds and executes the best yield farming opportunities across multiple protocols.',
      creator: '0x1234...5678',
      price: '0.1 ETH',
      rating: 4.8,
      downloads: 1234,
      tags: ['DeFi', 'Yield', 'Automation'],
      image: '🚀'
    },
    {
      id: 2,
      name: 'NFT Floor Tracker',
      description: 'Monitors NFT floor prices and sends alerts when prices drop below your target.',
      creator: '0x9876...5432',
      price: '0.05 ETH',
      rating: 4.6,
      downloads: 892,
      tags: ['NFT', 'Monitoring', 'Alerts'],
      image: '🎨'
    },
    {
      id: 3,
      name: 'Governance Voter',
      description: 'Automatically votes on governance proposals based on your predefined criteria.',
      creator: '0x4567...8901',
      price: '0.08 ETH',
      rating: 4.9,
      downloads: 567,
      tags: ['Governance', 'Voting', 'DAO'],
      image: '🗳️'
    },
    {
      id: 4,
      name: 'Arbitrage Bot',
      description: 'Detects and executes arbitrage opportunities across DEXs on Arbitrum.',
      creator: '0x2345...6789',
      price: '0.15 ETH',
      rating: 4.7,
      downloads: 2341,
      tags: ['Arbitrage', 'DEX', 'Trading'],
      image: '⚡'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Marketplace - ARC Agents</title>
        <meta name="description" content="Discover and deploy pre-built AI agents from our marketplace." />
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Agent Marketplace</h1>
          <p className="text-xl text-gray-600">
            Discover and deploy pre-built AI agents created by the community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <button className="btn-secondary flex items-center">
            <FunnelIcon className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card group hover:scale-105 cursor-pointer"
            >
              {/* Agent Image */}
              <div className="text-6xl mb-4 text-center">{agent.image}</div>
              
              {/* Agent Info */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {agent.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {agent.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                  {agent.rating}
                </div>
                <div className="flex items-center">
                  <EyeIcon className="w-4 h-4 mr-1" />
                  {agent.downloads.toLocaleString()}
                </div>
              </div>

              {/* Creator and Price */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">by</p>
                  <p className="text-sm font-medium text-gray-700">{agent.creator}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">{agent.price}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                <button className="flex-1 btn-primary text-sm py-2">
                  Deploy
                </button>
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <HeartIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="btn-secondary">
            Load More Agents
          </button>
        </div>
      </div>
    </Layout>
  );
}
