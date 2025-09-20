import Head from 'next/head';
import Layout from '../components/Layout';
import AgentBuilder from '../components/AgentBuilder';

export default function BuilderPage() {
  return (
    <Layout>
      <Head>
        <title>Agent Builder - ARC Agents</title>
        <meta name="description" content="Build and deploy AI agents with our drag-and-drop builder." />
      </Head>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Agent Builder</h1>
          <p className="text-xl text-gray-600">
            Create intelligent AI agents with drag-and-drop simplicity
          </p>
        </div>
        
        <AgentBuilder />
      </div>
    </Layout>
  );
}
