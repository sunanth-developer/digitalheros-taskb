import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite is configured with the React plugin only.
// Code-splitting in the "After" page is achieved via React.lazy() + dynamic import(),
// which Vite automatically turns into a separate chunk at build time.
export default defineConfig({
  // Relative base so the build works under any path (GitHub Pages project
  // subpath, Netlify, Vercel, or opened locally) without hardcoding a repo name.
  base: './',
  plugins: [react()],
  build: {
    // Emit sourcemaps off for a leaner production bundle (smaller transfer size).
    sourcemap: false,
  },
});
