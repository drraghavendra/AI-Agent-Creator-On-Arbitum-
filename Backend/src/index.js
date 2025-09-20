import express from 'express';
import bodyParser from 'body-parser';
import agentsRouter from './routes/agents.js';
import { PORT } from './config/index.js';
import './workers/rigWorker.js'; // start worker


const app = express();
app.use(bodyParser.json({ limit: '2mb' }));


app.use('/api/agents', agentsRouter);


app.get('/', (req, res) => res.send('AI Agents Backend is running'));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));