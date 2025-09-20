import { Queue, Worker, QueueScheduler } from 'bullmq';
import { REDIS_URL } from '../config/index.js';


export const agentQueue = new Queue('agent-execution', { connection: { url: REDIS_URL } });
export const agentQueueScheduler = new QueueScheduler('agent-execution', { connection: { url: REDIS_URL } });


export function startRigWorker(processFunction) {
// processFunction(job) handles execution
const worker = new Worker(
'agent-execution',
async (job) => {
console.log('Processing job', job.id, job.name, job.data);
return processFunction(job);
},
{ connection: { url: REDIS_URL } }
);


worker.on('failed', (job, err) => console.error('Job failed', job.id, err));
worker.on('completed', (job) => console.log('Job completed', job.id));
return worker;
}