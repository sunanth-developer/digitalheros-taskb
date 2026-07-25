/**
 * Copy the Vite production build into the repo root so GitHub Pages can serve
 * it from the `main` branch / (root) without switching Pages Source.
 *
 * Flow:
 *   1. npm run build  →  writes dist/
 *   2. this script     →  syncs dist/index.html + dist/assets → repo root
 *   3. git commit/push →  Pages picks up the compiled site
 */
import { cpSync, rmSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const assetsOut = join(root, 'assets');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html missing — run vite build first');
  process.exit(1);
}

cpSync(join(dist, 'index.html'), join(root, 'index.html'));

if (existsSync(assetsOut)) {
  rmSync(assetsOut, { recursive: true, force: true });
}
mkdirSync(assetsOut, { recursive: true });
cpSync(join(dist, 'assets'), assetsOut, { recursive: true });

cpSync(join(dist, '.nojekyll'), join(root, '.nojekyll'));

console.log('Published dist/ → repo root (index.html + assets/) for GitHub Pages');
