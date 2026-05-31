// sync-ecology-content.mjs
//
// Copies/transforms the Biomimicry and "But Why?" source data from the Ecology
// team's internal database (teams/ecology/data) into THIS site's own data/ and
// public/ folders, so the site is fully self-contained and never live-reads from
// the team data directory at runtime.
//
// Run on demand whenever the source content changes:
//   node scripts/sync-ecology-content.mjs
//
// Sources (relative to the site root):
//   ../../data/drafts/biomimicry-primary.json   -> data/biomimicry.json
//   ../../data/conversations.json                -> data/but-why.json   (index, with site URLs)
//   ../../data/conversations/<id>.json           -> public/but-why/conversations/<id>.json
//   ../../apps/but-why-reader/but-why-reader.js  -> public/but-why/but-why-reader.js
//   ../../apps/but-why-reader/but-why-reader.css -> public/but-why/but-why-reader.css

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = join(__dirname, '..');
const TEAM_DATA = join(SITE_ROOT, '..', '..', 'data');
const READER_APP = join(SITE_ROOT, '..', '..', 'apps', 'but-why-reader');

function ensureDir(p) {
  mkdirSync(p, { recursive: true });
}

function readJson(p) {
  return JSON.parse(readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  ensureDir(dirname(p));
  writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
}

// --- 1. Biomimicry ---------------------------------------------------------
const biomimicrySrc = join(TEAM_DATA, 'drafts', 'biomimicry-primary.json');
const biomimicry = readJson(biomimicrySrc);
writeJson(join(SITE_ROOT, 'data', 'biomimicry.json'), biomimicry);
console.log(`biomimicry: ${biomimicry.length} entries -> data/biomimicry.json`);

// --- 2. "But Why?" conversations ------------------------------------------
const convIndexSrc = join(TEAM_DATA, 'conversations.json');
const convIndex = readJson(convIndexSrc);

const publicConvDir = join(SITE_ROOT, 'public', 'but-why', 'conversations');
ensureDir(publicConvDir);

// Build the site-local index (drop the team-relative `file` path; add a public URL).
const siteIndex = convIndex.map((entry) => {
  const { file, ...rest } = entry;
  return { ...rest, url: `/but-why/conversations/${entry.id}.json` };
});
writeJson(join(SITE_ROOT, 'data', 'but-why.json'), siteIndex);
console.log(`but-why index: ${siteIndex.length} conversations -> data/but-why.json`);

// Copy each conversation file into public/ so the reader can fetch it at runtime.
for (const entry of convIndex) {
  const src = join(TEAM_DATA, 'conversations', `${entry.id}.json`);
  if (!existsSync(src)) {
    throw new Error(`Missing conversation file for "${entry.id}": ${src}`);
  }
  copyFileSync(src, join(publicConvDir, `${entry.id}.json`));
}
console.log(`but-why conversations: copied ${convIndex.length} files -> public/but-why/conversations/`);

// --- 3. Reader component (already built and handed over) -------------------
const readerDir = join(SITE_ROOT, 'public', 'but-why');
ensureDir(readerDir);
for (const f of ['but-why-reader.js', 'but-why-reader.css']) {
  const src = join(READER_APP, f);
  if (!existsSync(src)) {
    throw new Error(`Missing reader asset: ${src}`);
  }
  copyFileSync(src, join(readerDir, f));
}
console.log('but-why reader: copied but-why-reader.js + but-why-reader.css -> public/but-why/');

console.log('\nDone. The site now holds its own copy of all Biomimicry and But Why? content.');
