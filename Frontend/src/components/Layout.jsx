import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HomeIcon, 
  CogIcon, 
  ShoppingBagIcon, 
  ClipboardDocumentListIcon, 
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

/**
 * Main Layout Component with RainbowKit Integration
 * Beautiful, modern design with smooth animations
 */
export default function Layout({ children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();

    // Navigation items with icons
    const navigationItems = [
        { path: '/', label: 'Home', icon: HomeIcon },
        { path: '/builder', label: 'Agent Builder', icon: CogIcon },
        { path: '/marketplace', label: 'Marketplace', icon: ShoppingBagIcon },
        { path: '/my-agents', label: 'My Agents', icon: ClipboardDocumentListIcon },
        { path: '/analytics', label: 'Analytics', icon: ChartBarIcon }
    ];

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [router.pathname]);

    // Check if current path is active
    const isActivePath = (path) => {
        if (path === '/') {
            return router.pathname === '/';
        }
        return router.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <header className="sticky top-0 z-50 glass-effect border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and Brand */}
                        <Link href="/" className="flex items-center space-x-3 group">
                            <motion.div
                                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="text-white text-xl font-bold">🤖</span>
                            </motion.div>
                            <div>
                                <h1 className="text-xl font-bold gradient-text">ARC Agents</h1>
                                <p className="text-xs text-gray-500">AI Agent Creator</p>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-1">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = isActivePath(item.path);
                                
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                            isActive
                                                ? 'bg-primary-100 text-primary-700 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="font-medium">{item.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Wallet Connection */}
                        <div className="flex items-center space-x-4">
                            <ConnectButton 
                                chainStatus="icon"
                                accountStatus={{
                                    smallScreen: 'avatar',
                                    largeScreen: 'full',
                                }}
                                showBalance={{
                                    smallScreen: false,
                                    largeScreen: true,
                                }}
                            />

                            {/* Mobile Menu Toggle */}
                            <button
                                className="md:hidden p-2 rounded-xl hover:bg-white/50 transition-colors"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle navigation menu"
                            >
                                {isMenuOpen ? (
                                    <XMarkIcon className="w-6 h-6 text-gray-600" />
                                ) : (
                                    <Bars3Icon className="w-6 h-6 text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.nav
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-white/20 bg-white/90 backdrop-blur-lg"
                        >
                            <div className="px-4 py-4 space-y-2">
                                {navigationItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = isActivePath(item.path);
                                    
                                    return (
                                        <Link
                                            key={item.path}
                                            href={item.path}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                                isActive
                                                    ? 'bg-primary-100 text-primary-700'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="mt-20 bg-white/80 backdrop-blur-lg border-t border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand */}
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">🤖</span>
                                </div>
                                <span className="text-xl font-bold gradient-text">ARC Agents</span>
                            </div>
                            <p className="text-gray-600 mb-4 max-w-md">
                                Create, deploy, and manage AI agents on Arbitrum. Build the future of decentralized automation.
                            </p>
                            <div className="flex items-center space-x-2">
                                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                                    🌐 Arbitrum
                                </span>
                                <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">
                                    🚀 L2 Optimized
                                </span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
                            <ul className="space-y-2">
                                <li><Link href="/builder" className="text-gray-600 hover:text-primary-600 transition-colors">Agent Builder</Link></li>
                                <li><Link href="/marketplace" className="text-gray-600 hover:text-primary-600 transition-colors">Marketplace</Link></li>
                                <li><Link href="/my-agents" className="text-gray-600 hover:text-primary-600 transition-colors">My Agents</Link></li>
                                <li><Link href="/analytics" className="text-gray-600 hover:text-primary-600 transition-colors">Analytics</Link></li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Resources</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Documentation</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">GitHub</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Support</a></li>
                                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Discord</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mt-8 pt-8 text-center">
                        <p className="text-gray-500 text-sm">
                            © 2024 ARC Agents. Built for Arbitrum — Powered by smart contracts and AI.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}