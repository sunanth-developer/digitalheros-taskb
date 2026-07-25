import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';

/*
 * BOTH demo pages are code-split.
 * - Before chunk includes criticalBloat + huge JPEGs (intentionally heavy).
 * - After chunk stays lean (WebP, memo, lazy gallery).
 * Lazy-loading Before is essential so visiting /after never evaluates the
 * main-thread busy-wait in criticalBloat.js.
 */
const Before = lazy(() => import('./pages/Before.jsx'));
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
