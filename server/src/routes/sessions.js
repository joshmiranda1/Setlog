import { Router } from 'express';
import { query } from '../db.js';
import { HttpError, optionalText, parseId } from '../http.js';

const router = Router();

router.get('/', async (_req, res) => {
  const { rows } = await query('SELECT id, date, note FROM sessions ORDER BY date DESC, id DESC');
  res.json(rows);
});

router.get('/:id', async (req, res) => {
  const { rows } = await query('SELECT id, date, note FROM sessions WHERE id = $1', [parseId(req.params.id)]);
  if (!rows[0]) throw new HttpError(404, 'Session not found');
  res.json(rows[0]);
});

router.post('/', async (req, res) => {
  const note = optionalText(req.body?.note, 'note');
  const { rows } = await query('INSERT INTO sessions (note) VALUES ($1) RETURNING id, date, note', [note]);
  res.status(201).json(rows[0]);
});

router.patch('/:id', async (req, res) => {
  const id = parseId(req.params.id);
  const note = optionalText(req.body?.note, 'note');
  const { rows } = await query('UPDATE sessions SET note = $2 WHERE id = $1 RETURNING id, date, note', [id, note]);
  if (!rows[0]) throw new HttpError(404, 'Session not found');
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  const { rowCount } = await query('DELETE FROM sessions WHERE id = $1', [parseId(req.params.id)]);
  if (!rowCount) throw new HttpError(404, 'Session not found');
  res.status(204).end();
});

export default router;
