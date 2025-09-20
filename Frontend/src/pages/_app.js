import '../styles/globals.css';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { Web3Modal, EthereumClient, w3mConnectors } from '@web3modal/react';


const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
const chains = [arbitrum];
const { publicClient } = configureChains(chains, [publicProvider()]);
const wagmiConfig = createConfig({ autoConnect: true, connectors: w3mConnectors({ projectId, chains }), publicClient });
const ethereumClient = new EthereumClient(wagmiConfig, chains);


export default function App({ Component, pageProps }) {
return (
<WagmiConfig config={wagmiConfig}>
<Component {...pageProps} />
<Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
</WagmiConfig>
);
}