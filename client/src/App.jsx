import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppDataProvider, useAppDataStore } from './state/AppDataContext.jsx';
import AppLayout from './components/pages/AppLayout.jsx';
import TodayPage from './components/pages/TodayPage.jsx';
import HistoryPage from './components/pages/HistoryPage.jsx';
import ExercisesPage from './components/pages/ExercisesPage.jsx';
import NotFoundPage from './components/pages/NotFoundPage.jsx';

// The chart library is large, so Progress loads only when opened.
const ProgressPage = lazy(() => import('./components/pages/ProgressPage.jsx'));
const ExerciseGuidePage = lazy(() => import('./components/pages/ExerciseGuidePage.jsx'));

export default function App() {
  // exercises, sessions, sets, activeSessionId, loading and error live here.
  const store = useAppDataStore();

  return (
    <AppDataProvider value={store}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<TodayPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route
            path="progress"
            element={
              <Suspense fallback={<p aria-busy="true">Loading chart…</p>}>
                <ProgressPage />
              </Suspense>
            }
          />
          <Route path="exercises" element={<ExercisesPage />} />
          <Route
            path="exercises/guide/:slug"
            element={
              <Suspense fallback={<p aria-busy="true">Loading…</p>}>
                <ExerciseGuidePage />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </AppDataProvider>
  );
}
