# ARC Agents Frontend

A beautiful, modern frontend for the AI Agent Creator platform built on Arbitrum. Features RainbowKit wallet integration, drag-and-drop agent building, and seamless smart contract interaction.

## 🚀 Features

- **RainbowKit Integration**: Connect with 20+ wallets including MetaMask, WalletConnect, Coinbase Wallet
- **Modern UI**: Beautiful, responsive design with Tailwind CSS and Framer Motion animations
- **Agent Builder**: Drag-and-drop interface for creating AI agents
- **Smart Contract Integration**: Direct interaction with deployed AgentRegistry contract
- **IPFS Storage**: Decentralized storage for agent configurations
- **Multi-Chain Support**: Arbitrum and Arbitrum Sepolia testnet
- **Real-time Updates**: Live transaction status and deployment progress

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Web3**: Wagmi v2, RainbowKit, Viem
- **Icons**: Heroicons
- **Notifications**: React Hot Toast
- **Storage**: @storacha/client (IPFS)

## 📦 Installation

1. **Install Dependencies**
   ```bash
   cd Frontend
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file in the Frontend directory:
   ```env
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
   NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_web3_storage_token
   ```

3. **Get WalletConnect Project ID**
   - Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - Create a new project
   - Copy the Project ID to your `.env.local`

4. **Get Web3.Storage Token**
   - Visit [Web3.Storage](https://web3.storage/)
   - Create an account and generate an API token
   - Add it to your `.env.local`

## 🚀 Development

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Network Configuration

The app is configured for:
- **Arbitrum Sepolia Testnet** (Chain ID: 421614)
- **Arbitrum Mainnet** (Chain ID: 42161)

### Contract Addresses
- **Arbitrum Sepolia**: `0x2c30833D315914E5B2107a66255fC71f4c781668`
- **Arbitrum Mainnet**: TBD (update in `src/lib/rainbowkit.ts`)

## 📱 Pages

### 🏠 Home (`/`)
- Hero section with call-to-action
- Feature highlights
- Statistics dashboard
- Getting started guide

### 🤖 Agent Builder (`/builder`)
- Drag-and-drop agent creation
- Template library
- Real-time deployment to blockchain
- IPFS integration for metadata storage

### 🛒 Marketplace (`/marketplace`)
- Browse community-created agents
- Search and filter functionality
- Agent ratings and reviews
- One-click deployment

### 📋 My Agents (`/my-agents`)
- Manage deployed agents
- View execution statistics
- Start/stop agent operations
- Performance monitoring

### 📊 Analytics (`/analytics`)
- Performance metrics
- Gas usage tracking
- Execution trends
- Top performing agents

## 🔧 Configuration

### RainbowKit Setup
The app uses RainbowKit for wallet connection with the following features:
- Multi-wallet support
- Chain switching
- Account management
- Transaction status

### Contract Integration
- **ABI**: Located in `src/lib/rainbowkit.ts`
- **Addresses**: Configured for multiple networks
- **Functions**: registerAgent, getAgent, getAgentsByOwner

### IPFS Integration
- **Provider**: @storacha/client
- **Storage**: Agent configurations and metadata
- **Retrieval**: Automatic CID resolution via w3s.link gateway

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`from-primary-600 to-primary-700`)
- **Secondary**: Gray scale
- **Accent**: Cyan gradient (`from-accent-600 to-accent-700`)

### Components
- **Cards**: Rounded corners, subtle shadows, hover effects
- **Buttons**: Gradient backgrounds, hover animations
- **Forms**: Clean inputs with focus states
- **Animations**: Smooth transitions with Framer Motion

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, gradient text
- **Body**: Clean, readable text

## 🔒 Security

- **Wallet Security**: All transactions require user approval
- **Smart Contract**: Deployed and verified on Arbitrum
- **IPFS**: Decentralized, immutable storage
- **Environment Variables**: Sensitive data in `.env.local`

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Not Connecting**
   - Ensure you're on a supported network (Arbitrum/Arbitrum Sepolia)
   - Check if WalletConnect Project ID is correct
   - Try refreshing the page

2. **Contract Interaction Fails**
   - Verify you have enough ETH for gas
   - Check if contract is deployed on current network
   - Ensure wallet is connected

3. **IPFS Upload Issues**
   - Verify Web3.Storage token is valid
   - Check network connection
   - Ensure you're using the new w3up-client format
   - Try uploading smaller files

### Getting Help
- Check browser console for error messages
- Verify all environment variables are set
- Ensure you're using the latest version of dependencies

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for the Arbitrum ecosystem**
