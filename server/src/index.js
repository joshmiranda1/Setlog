import express from 'express';
import { pool } from './db.js';
import { errorHandler } from './http.js';
import exercises from './routes/exercises.js';
import sessions from './routes/sessions.js';
import sets from './routes/sets.js';

const app = express();
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', async (_req, res) => {
  await pool.query('SELECT 1');
  res.json({ ok: true });
});

app.use('/api/exercises', exercises);
app.use('/api/sessions', sessions);
app.use('/api/sets', sets);

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));
app.use(errorHandler);

const port = Number(process.env.PORT) || 4000;
const server = app.listen(port, () => console.log(`Setlog API listening on http://localhost:${port}`));

const shutdown = () => server.close(() => pool.end().then(() => process.exit(0)));
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
