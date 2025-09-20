import Head from 'next/head';
import Layout from '../components/Layout';
import AgentBuilder from '../components/AgentBuilder';


export default function Home() {
return (
<Layout>
<Head>
<title>ARC Agents Studio</title>
</Head>


<main className="container">
<h1>ARC Agents Studio — No-Code AI Agents on Arbitrum</h1>
<AgentBuilder />
</main>
</Layout>
);
}