import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import { fileURLToPath } from 'url';
import path from 'path';

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, 'dist');
app.use(express.static(distDir));

const connectionString = process.env.DATABASE_URL;
const pool = connectionString ? new Pool({ connectionString }) : null;

async function ensureTable() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS portfolio_data (
      id INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL
    )
  `);
}

async function getData() {
  if (!pool) return null;
  const result = await pool.query('SELECT data FROM portfolio_data WHERE id = 1');
  return result.rows[0]?.data || null;
}

async function saveData(data) {
  if (!pool) {
    throw new Error('DATABASE_URL is not configured');
  }
  const payload = JSON.stringify(data);
  await pool.query(
    `INSERT INTO portfolio_data (id, data)
     VALUES (1, $1::jsonb)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
    [payload]
  );
  return data;
}

app.get('/api/portfolio', async (_req, res) => {
  try {
    await ensureTable();
    const data = await getData();
    res.json(data || { ok: false, message: 'No data saved yet' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/portfolio', async (req, res) => {
  try {
    await ensureTable();
    const saved = await saveData(req.body);
    res.json({ ok: true, data: saved });
  } catch (error) {
    console.error('Portfolio save failed', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
