import { Router } from 'express';
import { query } from '../db.js';
import { HttpError, parseId } from '../http.js';

const router = Router();

// GET /api/sets              -> every set (single-user app, small data)
// GET /api/sets?session_id=N -> sets for one session
router.get('/', async (req, res) => {
  const params = [];
  let where = '';
  if (req.query.session_id !== undefined) {
    params.push(parseId(req.query.session_id, 'session_id'));
    where = 'WHERE session_id = $1';
  }
  const { rows } = await query(
    `SELECT id, session_id, exercise_id, reps, weight FROM sets ${where} ORDER BY session_id, id`,
    params,
  );
  res.json(rows);
});

router.post('/', async (req, res) => {
  const sessionId = parseId(req.body?.session_id, 'session_id');
  const exerciseId = parseId(req.body?.exercise_id, 'exercise_id');
  const reps = Number(req.body?.reps);
  const weight = Number(req.body?.weight);
  if (!Number.isInteger(reps) || reps < 1 || reps > 1000) {
    throw new HttpError(400, 'Reps must be a whole number from 1 to 1000');
  }
  if (!Number.isFinite(weight) || weight < 0 || weight > 2000) {
    throw new HttpError(400, 'Weight must be between 0 and 2000 kg');
  }
  const { rows } = await query(
    `INSERT INTO sets (session_id, exercise_id, reps, weight) VALUES ($1, $2, $3, $4)
     RETURNING id, session_id, exercise_id, reps, weight`,
    [sessionId, exerciseId, reps, Math.round(weight * 100) / 100],
  );
  res.status(201).json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  const { rowCount } = await query('DELETE FROM sets WHERE id = $1', [parseId(req.params.id)]);
  if (!rowCount) throw new HttpError(404, 'Set not found');
  res.status(204).end();
});

export default router;
