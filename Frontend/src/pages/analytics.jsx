import Head from 'next/head';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

export default function AnalyticsPage() {
  const stats = [
    {
      title: 'Total Executions',
      value: '12,847',
      change: '+12.5%',
      trend: 'up',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Gas Saved',
      value: '98.2%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUpIcon,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Avg Response Time',
      value: '1.2s',
      change: '-0.3s',
      trend: 'up',
      icon: ClockIcon,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Total Gas Cost',
      value: '0.456 ETH',
      change: '-15.2%',
      trend: 'down',
      icon: CurrencyDollarIcon,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const topAgents = [
    { name: 'DeFi Yield Optimizer', executions: 3247, gasUsed: '0.123 ETH', efficiency: '98.5%' },
    { name: 'NFT Floor Tracker', executions: 2891, gasUsed: '0.098 ETH', efficiency: '97.8%' },
    { name: 'Governance Voter', executions: 2156, gasUsed: '0.076 ETH', efficiency: '99.1%' },
    { name: 'Arbitrage Bot', executions: 1987, gasUsed: '0.089 ETH', efficiency: '96.9%' },
    { name: 'Price Alert System', executions: 1654, gasUsed: '0.045 ETH', efficiency: '98.2%' }
  ];

  return (
    <Layout>
      <Head>
        <title>Analytics - ARC Agents</title>
        <meta name="description" content="Analytics and insights for your AI agents." />
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
          <p className="text-xl text-gray-600">
            Insights and performance metrics for your AI agents
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUpIcon className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDownIcon className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600">{stat.title}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Execution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Execution Trends</h3>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600">Chart visualization would go here</p>
                <p className="text-sm text-gray-500">Integration with charting library</p>
              </div>
            </div>
          </motion.div>

          {/* Gas Usage Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="card"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Gas Usage</h3>
            <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <TrendingUpIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <p className="text-gray-600">Gas usage visualization would go here</p>
                <p className="text-sm text-gray-500">Real-time gas tracking</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Top Agents Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Top Performing Agents</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Agent Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Executions</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Gas Used</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {topAgents.map((agent, index) => (
                  <motion.tr
                    key={agent.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-primary-600 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{agent.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-700">{agent.executions.toLocaleString()}</td>
                    <td className="py-4 px-4 text-gray-700">{agent.gasUsed}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {agent.efficiency}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Performance Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="card text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="font-semibold text-gray-900 mb-2">Lightning Fast</h4>
            <p className="text-gray-600 text-sm">Your agents are 98% faster than traditional methods</p>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="font-semibold text-gray-900 mb-2">Cost Efficient</h4>
            <p className="text-gray-600 text-sm">Save 98.2% on gas costs compared to L1</p>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl mb-2">🎯</div>
            <h4 className="font-semibold text-gray-900 mb-2">Highly Reliable</h4>
            <p className="text-gray-600 text-sm">99.8% uptime with smart contract security</p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}




