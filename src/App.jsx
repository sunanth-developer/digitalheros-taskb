import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Before from './pages/Before.jsx';

/*
 * The After page is loaded with React.lazy() so its (optimized) code — including
 * the below-the-fold Gallery — ships as a separate chunk. This keeps the initial
 * JS payload small, which directly helps Total Blocking Time and Time to Interactive.
 */
const After = lazy(() => import('./pages/After.jsx'));

export default function App() {
  return (
    <Suspense fallback={<div style={{ padding: 48 }}>Loading…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/before" element={<Before />} />
        <Route path="/after" element={<After />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
