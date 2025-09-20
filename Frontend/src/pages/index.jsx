import Head from 'next/head';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  RocketLaunchIcon, 
  ShieldCheckIcon,
  BoltIcon,
  GlobeAltIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: CpuChipIcon,
      title: 'AI-Powered Agents',
      description: 'Create intelligent agents with advanced AI capabilities and custom logic.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Decentralized',
      description: 'Built on Arbitrum with smart contract security and IPFS storage.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: BoltIcon,
      title: 'Lightning Fast',
      description: 'Optimized for L2 with minimal gas costs and instant execution.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: GlobeAltIcon,
      title: 'Cross-Chain Ready',
      description: 'Deploy agents across multiple chains with unified management.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const stats = [
    { label: 'Agents Created', value: '1,234', icon: '🤖' },
    { label: 'Total Executions', value: '45.6K', icon: '⚡' },
    { label: 'Active Users', value: '892', icon: '👥' },
    { label: 'Gas Saved', value: '98%', icon: '💰' }
  ];

  return (
    <Layout>
      <Head>
        <title>ARC Agents - AI Agent Creator on Arbitrum</title>
        <meta name="description" content="Create, deploy, and manage AI agents on Arbitrum with drag-and-drop simplicity." />
      </Head>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="gradient-text">Create AI Agents</span>
                <br />
                <span className="text-gray-800">on Arbitrum</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Build, deploy, and manage intelligent AI agents with drag-and-drop simplicity. 
                Powered by smart contracts and optimized for the Arbitrum ecosystem.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/builder" className="btn-primary text-lg px-8 py-4">
                <RocketLaunchIcon className="w-6 h-6 mr-2" />
                Start Building
              </Link>
              <Link href="/marketplace" className="btn-secondary text-lg px-8 py-4">
                <SparklesIcon className="w-6 h-6 mr-2" />
                Explore Marketplace
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose ARC Agents?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of decentralized AI with our cutting-edge platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="card group hover:scale-105"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of developers creating the next generation of AI agents on Arbitrum.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/builder" 
                className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <RocketLaunchIcon className="w-6 h-6 mr-2 inline" />
                Get Started Free
              </Link>
              <Link 
                href="/marketplace" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-xl transition-all duration-200"
              >
                Browse Templates
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}