import { useState, useRef, useCallback, useMemo } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { uploadJsonToIPFS } from '../hooks/useIPFS';
import { CONTRACT_ADDRESSES, AGENT_REGISTRY_ABI } from '../lib/rainbowkit';
import { useChainId } from 'wagmi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { 
  PlusIcon, 
  TrashIcon, 
  RocketLaunchIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const TEMPLATES = [
  { id: 'defi-sma', title: 'DeFi SMA Bot', modules: ['PriceFeed', 'SMA', 'OrderExecutor'] },
  { id: 'gov-watcher', title: 'Governance Watcher', modules: ['ProposalFeed', 'RuleEngine', 'TxSigner'] },
];

const INITIAL_AGENT_STATE = {
  name: '',
  description: '',
  modules: [],
  trigger: 'manual'
};

export default function AgentBuilder() {
  const [agent, setAgent] = useState(INITIAL_AGENT_STATE);
  const [deploying, setDeploying] = useState(false);
  const [error, setError] = useState(null);
  const [deploymentStep, setDeploymentStep] = useState('');
  const canvasRef = useRef(null);
  
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { writeContract, data: hash, isPending, error: contractError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Memoized validation
  const isFormValid = useMemo(() => 
    agent.name.trim() && agent.modules.length > 0, 
    [agent.name, agent.modules.length]
  );

  // Optimized drag handlers with useCallback
  const onDragStart = useCallback((e, template) => {
    e.dataTransfer.setData('application/json', JSON.stringify(template));
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setError(null);
    
    try {
      const template = JSON.parse(e.dataTransfer.getData('application/json'));
      setAgent(prev => ({
        ...prev,
        modules: [...prev.modules, ...template.modules],
        name: prev.name || template.title
      }));
    } catch (err) {
      setError('Failed to parse template data');
      console.error('Drop error:', err);
    }
  }, []);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  // Optimized input handlers
  const handleNameChange = useCallback((e) => {
    setAgent(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    setAgent(prev => ({ ...prev, description: e.target.value }));
  }, []);

  const handleTriggerChange = useCallback((e) => {
    setAgent(prev => ({ ...prev, trigger: e.target.value }));
  }, []);

  // Get contract address for current chain
  const contractAddress = useMemo(() => {
    if (chainId === 421614) return CONTRACT_ADDRESSES.arbitrumSepolia.agentRegistry;
    if (chainId === 42161) return CONTRACT_ADDRESSES.arbitrum.agentRegistry;
    return null;
  }, [chainId]);

  // Optimized deploy function with contract integration
  const deploy = useCallback(async () => {
    if (!isConnected) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!contractAddress) {
      toast.error('Unsupported network. Please switch to Arbitrum or Arbitrum Sepolia');
      return;
    }

    if (!isFormValid) {
      setError('Please provide a name and at least one module');
      return;
    }

    setDeploying(true);
    setError(null);

    try {
      // Step 1: Upload to IPFS
      setDeploymentStep('Uploading to IPFS...');
      toast.loading('Uploading agent configuration to IPFS...', { id: 'ipfs-upload' });
      
      const cid = await uploadJsonToIPFS(agent);
      toast.success('Successfully uploaded to IPFS!', { id: 'ipfs-upload' });

      // Step 2: Register on blockchain
      setDeploymentStep('Registering on blockchain...');
      toast.loading('Registering agent on blockchain...', { id: 'blockchain-register' });

      writeContract({
        address: contractAddress,
        abi: AGENT_REGISTRY_ABI,
        functionName: 'registerAgent',
        args: [cid],
      });

    } catch (err) {
      const errorMessage = err.message || 'Deployment failed';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Deploy error:', err);
      setDeploying(false);
    }
  }, [agent, isFormValid, isConnected, contractAddress, writeContract]);

  // Handle successful deployment
  useMemo(() => {
    if (isConfirmed && hash) {
      toast.success('Agent successfully deployed!', { id: 'blockchain-register' });
      setAgent(INITIAL_AGENT_STATE);
      setDeploying(false);
      setDeploymentStep('');
    }
  }, [isConfirmed, hash]);

  // Handle contract errors
  useMemo(() => {
    if (contractError) {
      toast.error(`Contract error: ${contractError.message}`, { id: 'blockchain-register' });
      setDeploying(false);
      setDeploymentStep('');
    }
  }, [contractError]);


  // Memoized template list to prevent unnecessary re-renders
  const templateList = useMemo(() => 
    TEMPLATES.map(template => (
      <motion.div 
        key={template.id} 
        draggable 
        onDragStart={(e) => onDragStart(e, template)} 
        className="p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 cursor-grab active:cursor-grabbing transition-all duration-200 group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <h4 className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">
          {template.title}
        </h4>
        <div className="text-sm text-gray-500 mt-1">
          {template.modules.join(' • ')}
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Drag to canvas to add
        </div>
      </motion.div>
    )), 
    [onDragStart]
  );

  // Memoized module list
  const moduleList = useMemo(() => 
    agent.modules.map((module, index) => (
      <motion.div 
        key={`${module}-${index}`} 
        className="flex items-center justify-between p-3 bg-white border border-primary-200 rounded-lg shadow-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center">
          <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
          <span className="font-medium text-gray-900">{module}</span>
        </div>
        <button
          onClick={() => setAgent(prev => ({
            ...prev,
            modules: prev.modules.filter((_, i) => i !== index)
          }))}
          className="p-1 hover:bg-red-100 rounded-md transition-colors"
          disabled={deploying}
        >
          <TrashIcon className="w-4 h-4 text-gray-400 hover:text-red-500" />
        </button>
      </motion.div>
    )), 
    [agent.modules, deploying]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Templates Panel */}
      <aside className="lg:col-span-1">
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <PlusIcon className="w-5 h-5 mr-2 text-primary-600" />
            Templates
          </h3>
          <div className="space-y-3">
            {templateList}
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <section className="lg:col-span-2">
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Agent Canvas</h3>
          
          {/* Drag and Drop Area */}
          <div 
            ref={canvasRef} 
            onDrop={onDrop} 
            onDragOver={onDragOver}
            className={`min-h-[200px] border-2 border-dashed rounded-xl p-6 transition-all duration-200 ${
              agent.modules.length === 0 
                ? 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50' 
                : 'border-primary-200 bg-primary-50'
            }`}
          >
            {agent.modules.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎯</div>
                <p className="text-gray-500 text-lg">Drop templates here to build your agent</p>
                <p className="text-gray-400 text-sm mt-2">Drag from the templates panel on the left</p>
              </div>
            ) : (
              <div className="space-y-3">
                {moduleList}
              </div>
            )}
          </div>

          {/* Configuration Form */}
          <div className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Name
              </label>
              <input 
                className="input-field"
                placeholder="Enter agent name" 
                value={agent.name} 
                onChange={handleNameChange}
                disabled={deploying}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea 
                className="input-field min-h-[100px] resize-none"
                placeholder="Describe what your agent does" 
                value={agent.description} 
                onChange={handleDescriptionChange}
                disabled={deploying}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trigger Type
              </label>
              <select 
                className="input-field"
                value={agent.trigger} 
                onChange={handleTriggerChange}
                disabled={deploying}
              >
                <option value="manual">Manual Execution</option>
                <option value="event">On-chain Event</option>
                <option value="cron">Scheduled (Cron)</option>
              </select>
            </div>

            {/* Error Display */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start"
                role="alert"
              >
                <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-3 mt-0.5" />
                <div>
                  <h4 className="text-red-800 font-medium">Deployment Error</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Deployment Status */}
            {deploying && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  <div>
                    <h4 className="text-blue-800 font-medium">Deploying Agent</h4>
                    <p className="text-blue-700 text-sm mt-1">{deploymentStep}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Deploy Button */}
            <motion.button 
              onClick={deploy} 
              disabled={deploying || !isFormValid || !isConnected}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center ${
                deploying || !isFormValid || !isConnected
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'btn-primary'
              }`}
              whileHover={!deploying && isFormValid && isConnected ? { scale: 1.02 } : {}}
              whileTap={!deploying && isFormValid && isConnected ? { scale: 0.98 } : {}}
            >
              {deploying ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Deploying...
                </>
              ) : !isConnected ? (
                'Connect Wallet to Deploy'
              ) : (
                <>
                  <RocketLaunchIcon className="w-6 h-6 mr-2" />
                  Deploy Agent
                </>
              )}
            </motion.button>

            {/* Success Message */}
            {isConfirmed && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center"
              >
                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3" />
                <div>
                  <h4 className="text-green-800 font-medium">Agent Deployed Successfully!</h4>
                  <p className="text-green-700 text-sm mt-1">
                    Your agent has been registered on the blockchain.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}