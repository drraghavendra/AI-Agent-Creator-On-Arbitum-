import { configureChains, createConfig } from 'wagmi';
import { arbitrum } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';


export function setupWagmi(){
const chains = [arbitrum];
const { publicClient } = configureChains(chains, [publicProvider()]);
const config = createConfig({ autoConnect: true, publicClient });
return { config, chains };
}