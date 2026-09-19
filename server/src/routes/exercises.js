import { Router } from 'express';
import { query } from '../db.js';
import { HttpError, parseId, requireText } from '../http.js';

const router = Router();

router.get('/', async (_req, res) => {
  const { rows } = await query('SELECT id, name, muscle_group FROM exercises ORDER BY muscle_group, name');
  res.json(rows);
});

router.post('/', async (req, res) => {
  const name = requireText(req.body?.name, 'name');
  const muscleGroup = requireText(req.body?.muscle_group, 'muscle_group', { max: 40 });
  const { rows } = await query(
    'INSERT INTO exercises (name, muscle_group) VALUES ($1, $2) RETURNING id, name, muscle_group',
    [name, muscleGroup],
  );
  res.status(201).json(rows[0]);
});

router.patch('/:id', async (req, res) => {
  const id = parseId(req.params.id);
  const name = req.body?.name === undefined ? null : requireText(req.body.name, 'name');
  const muscleGroup =
    req.body?.muscle_group === undefined ? null : requireText(req.body.muscle_group, 'muscle_group', { max: 40 });
  const { rows } = await query(
    `UPDATE exercises SET name = COALESCE($2, name), muscle_group = COALESCE($3, muscle_group)
     WHERE id = $1 RETURNING id, name, muscle_group`,
    [id, name, muscleGroup],
  );
  if (!rows[0]) throw new HttpError(404, 'Exercise not found');
  res.json(rows[0]);
});

router.delete('/:id', async (req, res) => {
  const { rowCount } = await query('DELETE FROM exercises WHERE id = $1', [parseId(req.params.id)]);
  if (!rowCount) throw new HttpError(404, 'Exercise not found');
  res.status(204).end();
});

export default router;
