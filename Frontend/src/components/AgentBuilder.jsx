import { useState, useRef } from 'react';


const TEMPLATES = [
{ id: 'defi-sma', title: 'DeFi SMA Bot', modules: ['PriceFeed','SMA','OrderExecutor'] },
{ id: 'gov-watcher', title: 'Governance Watcher', modules: ['ProposalFeed','RuleEngine','TxSigner'] },
];


export default function AgentBuilder(){
const [agent, setAgent] = useState({ name:'', description:'', modules:[], trigger:'manual' });
const [deploying, setDeploying] = useState(false);
const canvasRef = useRef(null);


function onDragStart(e, tpl){ e.dataTransfer.setData('application/json', JSON.stringify(tpl)); }
function onDrop(e){ e.preventDefault(); const tpl = JSON.parse(e.dataTransfer.getData('application/json')); setAgent(prev=>({...prev, modules:[...prev.modules, ...tpl.modules], name: prev.name || tpl.title})); }
function onDragOver(e){ e.preventDefault(); }


async function deploy(){
if(!agent.name || agent.modules.length===0) return alert('Provide name + modules');
setDeploying(true);
try{
const cid = await uploadJsonToIPFS(agent);
// TODO: call AgentRegistry contract with cid via wagmi/ethers
alert('Uploaded to IPFS CID: ' + cid);
setAgent({ name:'', description:'', modules:[], trigger:'manual' });
}catch(e){ console.error(e); alert('Failed: '+e.message); }
finally{ setDeploying(false); }
}


return (
<div className="builder grid">
<aside className="panel">
<h3>Templates</h3>
{TEMPLATES.map(t=> (
<div key={t.id} draggable onDragStart={(e)=>onDragStart(e,t)} className="template">{t.title}<div className="muted">{t.modules.join(', ')}</div></div>
))}
</aside>


<section className="panel canvas" ref={canvasRef} onDrop={onDrop} onDragOver={onDragOver}>
<h3>Canvas</h3>
{agent.modules.length===0 ? <div className="placeholder">Drop templates here</div> : agent.modules.map((m,i)=>(<div key={i} className="module">{m}</div>))}


<div className="config">
<input placeholder="Agent name" value={agent.name} onChange={(e)=>setAgent({...agent, name:e.target.value})} />
<textarea placeholder="Description" value={agent.description} onChange={(e)=>setAgent({...agent, description:e.target.value})} />
<select value={agent.trigger} onChange={(e)=>setAgent({...agent, trigger:e.target.value})}>
<option value="manual">Manual</option>
<option value="event">On-chain Event</option>
<option value="cron">Cron (Off-chain)</option>
</select>


<button onClick={deploy} disabled={deploying}>{deploying ? 'Deploying...' : 'Upload to IPFS & Register'}</button>
</div>
</section>


<aside className="panel">
<h3>Deployed</h3>
<div className="muted">No agents yet (mocked UI).</div>
</aside>
</div>
);
}