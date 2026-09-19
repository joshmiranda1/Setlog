// Every database operation goes through the Express API with fetch.

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Could not reach the Setlog server. Is it running?', 0);
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const fallback = res.status >= 500 ? 'The server could not complete that request.' : 'Request failed.';
    throw new ApiError(data?.error || fallback, res.status);
  }
  return data;
}

export const api = {
  listExercises: () => request('/exercises'),
  createExercise: (exercise) => request('/exercises', { method: 'POST', body: exercise }),
  updateExercise: (id, patch) => request(`/exercises/${id}`, { method: 'PATCH', body: patch }),
  deleteExercise: (id) => request(`/exercises/${id}`, { method: 'DELETE' }),

  listSessions: () => request('/sessions'),
  createSession: (session = {}) => request('/sessions', { method: 'POST', body: session }),
  updateSession: (id, patch) => request(`/sessions/${id}`, { method: 'PATCH', body: patch }),
  deleteSession: (id) => request(`/sessions/${id}`, { method: 'DELETE' }),

  listSets: () => request('/sets'),
  createSet: (set) => request('/sets', { method: 'POST', body: set }),
  deleteSet: (id) => request(`/sets/${id}`, { method: 'DELETE' }),
};
