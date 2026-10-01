// Integrity checks for the site/ deliverable.
//
// The main failure mode for a static rebuild is a reference that points at an
// asset the build never copied, so these tests walk every HTML and CSS file and
// assert that each local asset reference resolves on disk. Run with:
//
//   node --test scripts/check-site.test.mjs
//
// Zero third-party dependencies: only Node's built-in test runner and fs.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = join(ROOT, 'site');

const ASSET_EXT = new Set([
  '.css', '.js', '.mjs', '.json', '.svg', '.png', '.jpg', '.jpeg', '.webp',
  '.avif', '.gif', '.ico', '.mp4', '.webm', '.otf', '.ttf', '.woff', '.woff2',
]);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const allFiles = walk(SITE);
const htmlFiles = allFiles.filter((f) => extname(f) === '.html');
const cssFiles = allFiles.filter((f) => extname(f) === '.css');

function isExternal(ref) {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|data:)/i.test(ref);
}

function extractHtmlRefs(html) {
  const refs = [];
  const attr = /(?:src|href|data-src|poster|action)\s*=\s*"([^"]+)"/gi;
  let m;
  while ((m = attr.exec(html))) refs.push(m[1]);
  // srcset: "a.png 1x, b.png 2x"
  const srcset = /srcset\s*=\s*"([^"]+)"/gi;
  while ((m = srcset.exec(html))) {
    for (const part of m[1].split(',')) refs.push(part.trim().split(/\s+/)[0]);
  }
  return refs;
}

function extractCssRefs(css) {
  const refs = [];
  const url = /url\(\s*['"]?([^'")]+?)\s*['"]?\s*\)/gi;
  let m;
  while ((m = url.exec(css))) refs.push(m[1]);
  const imp = /@import\s+['"]([^'"]+)['"]/gi;
  while ((m = imp.exec(css))) refs.push(m[1]);
  return refs;
}

// Map a reference to the file it should resolve to, or null when it is not a
// local file (external, fragment, or declared-but-not-captured route link).
function resolveLocal(file, ref) {
  const clean = ref.split('#')[0].split('?')[0];
  if (!clean) return null;
  let decoded = clean;
  try {
    decoded = decodeURIComponent(clean);
  } catch {
    // keep the raw value when it is not valid percent-encoding
  }
  if (decoded.startsWith('/')) return join(SITE, decoded.slice(1));
  return resolve(dirname(file), decoded);
}

function isAssetRef(ref) {
  const clean = ref.split('#')[0].split('?')[0];
  return ASSET_EXT.has(extname(clean).toLowerCase());
}

test('site/index.html exists and is a real home page', () => {
  const index = join(SITE, 'index.html');
  assert.ok(existsSync(index), 'site/index.html must exist');
  const html = readFileSync(index, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/i);
  assert.ok(title && title[1].trim().length > 0, 'index.html must have a non-empty <title>');
  assert.ok(html.length > 10_000, 'index.html looks truncated');
});

test('every local asset reference resolves to a committed file', () => {
  const missing = [];
  for (const file of htmlFiles) {
    for (const ref of extractHtmlRefs(readFileSync(file, 'utf8'))) {
      if (isExternal(ref) || !isAssetRef(ref)) continue;
      const target = resolveLocal(file, ref);
      if (target && !existsSync(target)) {
        missing.push(`${relative(ROOT, file)} -> ${ref}`);
      }
    }
  }
  for (const file of cssFiles) {
    for (const ref of extractCssRefs(readFileSync(file, 'utf8'))) {
      if (isExternal(ref)) continue;
      const target = resolveLocal(file, ref);
      if (target && !existsSync(target)) {
        missing.push(`${relative(ROOT, file)} -> ${ref}`);
      }
    }
  }
  assert.deepEqual(missing, [], `broken local asset references:\n${missing.join('\n')}`);
});

test('the deliverable does not depend on the local recon/ scrape', () => {
  for (const file of [...htmlFiles, ...cssFiles]) {
    const body = readFileSync(file, 'utf8');
    const withoutComments = body.replace(/\/\*[\s\S]*?\*\//g, '');
    assert.ok(
      !/\brecon\//.test(withoutComments),
      `${relative(ROOT, file)} references recon/, which is not shipped`,
    );
  }
});

test('all captured embed iframes are present and non-trivial', () => {
  const embeds = allFiles.filter((f) => f.includes(`${join('site', 'embeds')}`) && extname(f) === '.html');
  assert.ok(embeds.length >= 5, `expected at least 5 captured embeds, found ${embeds.length}`);
  for (const embed of embeds) {
    assert.ok(
      readFileSync(embed, 'utf8').trim().length > 1000,
      `${relative(ROOT, embed)} looks empty`,
    );
  }
});

test('core assets are committed', () => {
  for (const rel of [
    'css/style.css',
    'js/main.js',
    'images/logo.svg',
    'images/hero-video.mp4',
    'images/hero-video.webm',
  ]) {
    assert.ok(existsSync(join(SITE, rel)), `missing required asset site/${rel}`);
  }
});
