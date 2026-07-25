/**
 * Image asset pipeline.
 *
 * This script takes the raw downloaded photos in src/assets/*-original.jpg and
 * produces two families of assets:
 *
 *  1. The "Before" family: a single, deliberately heavy JPEG at full resolution
 *     and high quality. This mirrors the real-world anti-pattern of shipping one
 *     giant hero image to every device regardless of screen size.
 *
 *  2. The "After" family: multiple responsive widths in modern WebP (plus JPEG
 *     fallbacks), aggressively but tastefully compressed. These feed <picture>
 *     / srcSet so the browser downloads only what the viewport needs.
 *
 * Run with: npm run generate:images
 */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(__dirname, '..', 'src', 'assets');

// Responsive widths used by the optimized <picture>/srcSet in the After page.
const WIDTHS = [640, 1024, 1600, 1920];

async function buildHero() {
  const input = join(ASSETS, 'hero-original.jpg');

  // BEFORE: one huge, high-quality JPEG shipped to all devices (the anti-pattern).
  await sharp(input)
    .resize({ width: 2400, withoutEnlargement: true })
    .jpeg({ quality: 92, mozjpeg: false })
    .toFile(join(ASSETS, 'hero-before.jpg'));

  // AFTER: responsive WebP + JPEG fallback at multiple widths.
  for (const w of WIDTHS) {
    await sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 72, effort: 6 })
      .toFile(join(ASSETS, `hero-${w}.webp`));

    await sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: 70, mozjpeg: true })
      .toFile(join(ASSETS, `hero-${w}.jpg`));
  }
}

async function buildGallery(base) {
  const input = join(ASSETS, `${base}-original.jpg`);
  if (!existsSync(input)) return;

  // BEFORE: full-size JPEG.
  await sharp(input)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 90 })
    .toFile(join(ASSETS, `${base}-before.jpg`));

  // AFTER: compact WebP + JPEG fallback at two sensible widths.
  for (const w of [600, 1000]) {
    await sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 70, effort: 6 })
      .toFile(join(ASSETS, `${base}-${w}.webp`));

    await sharp(input)
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: 68, mozjpeg: true })
      .toFile(join(ASSETS, `${base}-${w}.jpg`));
  }
}

async function main() {
  await buildHero();
  await buildGallery('interior');
  await buildGallery('interior2');
  console.log('Image assets generated in src/assets/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
