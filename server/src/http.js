export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function parseId(value, field = 'id') {
  const n = Number(value);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `${field} must be a positive integer`);
  return n;
}

export function requireText(value, field, { max = 100 } = {}) {
  if (typeof value !== 'string' || !value.trim()) throw new HttpError(400, `${field} is required`);
  const text = value.trim();
  if (text.length > max) throw new HttpError(400, `${field} must be at most ${max} characters`);
  return text;
}

export function optionalText(value, field, { max = 500 } = {}) {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'string') throw new HttpError(400, `${field} must be text`);
  if (value.length > max) throw new HttpError(400, `${field} must be at most ${max} characters`);
  return value;
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
  // Postgres error codes: https://www.postgresql.org/docs/current/errcodes-appendix.html
  switch (err.code) {
    case '23505':
      return res.status(409).json({ error: 'An exercise with that name already exists' });
    case '23503':
      return res.status(400).json({ error: 'That session or exercise no longer exists' });
    case '23514':
    case '22P02':
    case '22003':
      return res.status(400).json({ error: 'Invalid value' });
    case 'ECONNREFUSED':
    case '28P01':
    case '3D000':
      console.error(err.message);
      return res.status(503).json({ error: 'Database unavailable. Is PostgreSQL running and configured in server/.env?' });
    default:
      if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Malformed JSON body' });
      console.error(err);
      return res.status(500).json({ error: 'Something went wrong on the server' });
  }
}
