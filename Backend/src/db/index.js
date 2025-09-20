import { Pool } from 'pg';
import { DATABASE_URL } from '../config/index.js';


export const pool = new Pool({ connectionString: DATABASE_URL });


export async function query(text, params) {
const start = Date.now();
const res = await pool.query(text, params);
const duration = Date.now() - start;
console.log('Executed query', { text, duration, rows: res.rowCount });
return res;
}