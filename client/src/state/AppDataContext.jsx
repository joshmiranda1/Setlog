import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../api/client.js';

const AppDataContext = createContext(null);
const ACTIVE_KEY = 'setlog.activeSessionId';

function readActiveId() {
  try {
    const n = Number(localStorage.getItem(ACTIVE_KEY));
    return Number.isInteger(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

function writeActiveId(id) {
  try {
    if (id) localStorage.setItem(ACTIVE_KEY, String(id));
    else localStorage.removeItem(ACTIVE_KEY);
  } catch {
    /* storage unavailable: the active session just won't survive a reload */
  }
}

/**
 * Shared app state, owned by <App>. Pages read it with useAppData().
 * Mutations call the API first and only update local state once the server confirms.
 */
export function useAppDataStore() {
  const [exercises, setExercises] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sets, setSets] = useState([]);
  const [activeSessionId, setActiveSessionIdState] = useState(readActiveId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const setActiveSessionId = useCallback((id) => {
    writeActiveId(id);
    setActiveSessionIdState(id);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ex, se, st] = await Promise.all([api.listExercises(), api.listSessions(), api.listSets()]);
      setExercises(ex);
      setSessions(se);
      setSets(st);
      // Forget an active session that was deleted elsewhere.
      setActiveSessionIdState((id) => {
        if (id && !se.some((s) => s.id === id)) {
          writeActiveId(null);
          return null;
        }
        return id;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const notify = useCallback((message, action) => {
    clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), message, action });
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }, []);
  const dismissToast = useCallback(() => {
    clearTimeout(toastTimer.current);
    setToast(null);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  // Sessions
  const startSession = useCallback(async () => {
    const session = await api.createSession({ note: '' });
    setSessions((list) => [session, ...list]);
    setActiveSessionId(session.id);
    return session;
  }, [setActiveSessionId]);

  const updateSessionNote = useCallback(async (id, note) => {
    const updated = await api.updateSession(id, { note });
    setSessions((list) => list.map((s) => (s.id === id ? updated : s)));
  }, []);

  const deleteSession = useCallback(
    async (id) => {
      await api.deleteSession(id);
      setSessions((list) => list.filter((s) => s.id !== id));
      setSets((list) => list.filter((s) => s.session_id !== id));
      if (id === activeSessionId) setActiveSessionId(null);
    },
    [activeSessionId, setActiveSessionId],
  );

  const finishSession = useCallback(async () => {
    const id = activeSessionId;
    if (!id) return { discarded: false };
    const empty = !sets.some((s) => s.session_id === id);
    // An empty session would only clutter History.
    if (empty) await deleteSession(id);
    setActiveSessionId(null);
    return { discarded: empty };
  }, [activeSessionId, sets, deleteSession, setActiveSessionId]);

  // Sets
  const addSet = useCallback(
    async ({ exercise_id, reps, weight, session_id = activeSessionId }) => {
      const created = await api.createSet({ session_id, exercise_id, reps, weight });
      setSets((list) => [...list, created].sort((a, b) => a.session_id - b.session_id || a.id - b.id));
      return created;
    },
    [activeSessionId],
  );

  const deleteSet = useCallback(
    async (set) => {
      await api.deleteSet(set.id);
      setSets((list) => list.filter((s) => s.id !== set.id));
      notify('Set deleted', {
        label: 'Undo',
        run: async () => {
          await api
            .createSet({ session_id: set.session_id, exercise_id: set.exercise_id, reps: set.reps, weight: set.weight })
            .then((restored) =>
              setSets((list) => [...list, restored].sort((a, b) => a.session_id - b.session_id || a.id - b.id)),
            );
        },
      });
    },
    [notify],
  );

  // Exercises
  const addExercise = useCallback(async (fields) => {
    const created = await api.createExercise(fields);
    setExercises((list) =>
      [...list, created].sort((a, b) => a.muscle_group.localeCompare(b.muscle_group) || a.name.localeCompare(b.name)),
    );
    return created;
  }, []);

  const updateExercise = useCallback(async (id, patch) => {
    const updated = await api.updateExercise(id, patch);
    setExercises((list) =>
      list
        .map((e) => (e.id === id ? updated : e))
        .sort((a, b) => a.muscle_group.localeCompare(b.muscle_group) || a.name.localeCompare(b.name)),
    );
    return updated;
  }, []);

  const deleteExercise = useCallback(async (id) => {
    await api.deleteExercise(id);
    setExercises((list) => list.filter((e) => e.id !== id));
    setSets((list) => list.filter((s) => s.exercise_id !== id));
  }, []);

  const exercisesById = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises]);
  const sessionsById = useMemo(() => new Map(sessions.map((s) => [s.id, s])), [sessions]);

  return {
    exercises,
    sessions,
    sets,
    activeSessionId,
    loading,
    error,
    exercisesById,
    sessionsById,
    toast,
    notify,
    dismissToast,
    reload: load,
    startSession,
    updateSessionNote,
    finishSession,
    deleteSession,
    addSet,
    deleteSet,
    addExercise,
    updateExercise,
    deleteExercise,
  };
}

export function AppDataProvider({ value, children }) {
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>');
  return ctx;
}
