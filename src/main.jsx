import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/global.css';

/*
 * HashRouter is used so the SPA works on any static host (GitHub Pages,
 * Netlify, Vercel) without server-side route rewrites: deep links like
 * /#/before and /#/after resolve entirely on the client, so refreshing or
 * loading them directly (e.g. when Lighthouse navigates) never 404s.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
