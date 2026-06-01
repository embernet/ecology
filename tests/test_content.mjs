// test_content.mjs
//
// Data-contract tests for the Biomimicry and "But Why?" sections. These validate
// the SITE'S OWN copied data (data/biomimicry.json, data/but-why.json, and the
// files under public/but-why/) — i.e. that the self-contained copy the site ships
// is well-formed and complete. Run after `node scripts/sync-ecology-content.mjs`.
//
//   node tests/test_content.mjs

import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));

let pass = 0;
let fail = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    pass++;
  } catch (err) {
    console.error(`  FAIL  ${name}: ${err.message}`);
    fail++;
  }
}
function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

// --- Biomimicry ------------------------------------------------------------
const biomimicry = readJson('data/biomimicry.json');

test('biomimicry: is a non-empty array', () => {
  assert(Array.isArray(biomimicry) && biomimicry.length > 0, 'expected non-empty array');
});

test('biomimicry: every entry has the required fields', () => {
  const required = [
    'id',
    'title',
    'emoji',
    'creature',
    'where_you_might_see_it',
    'natures_problem',
    'natures_solution',
    'what_people_made',
    'try_this',
    'curriculum_links',
  ];
  for (const e of biomimicry) {
    for (const f of required) {
      assert(e[f] !== undefined && e[f] !== '', `entry "${e.id}" missing field "${f}"`);
    }
    assert(Array.isArray(e.curriculum_links) && e.curriculum_links.length > 0,
      `entry "${e.id}" has no curriculum_links`);
  }
});

test('biomimicry: every curriculum link is well-formed', () => {
  for (const e of biomimicry) {
    for (const l of e.curriculum_links) {
      for (const f of ['subject', 'key_stage', 'year_groups', 'topic', 'how']) {
        assert(l[f] !== undefined, `entry "${e.id}" link missing "${f}"`);
      }
      assert(Array.isArray(l.year_groups) && l.year_groups.length > 0,
        `entry "${e.id}" link has no year_groups`);
    }
  }
});

test('biomimicry: ids are unique', () => {
  const ids = biomimicry.map((e) => e.id);
  assert(new Set(ids).size === ids.length, 'duplicate ids found');
});

// --- But Why? --------------------------------------------------------------
const butWhy = readJson('data/but-why.json');

test('but-why: index is a non-empty array', () => {
  assert(Array.isArray(butWhy) && butWhy.length > 0, 'expected non-empty array');
});

test('but-why: every index entry is well-formed and self-contained', () => {
  for (const c of butWhy) {
    for (const f of ['id', 'title', 'summary', 'curriculum', 'url']) {
      assert(c[f] !== undefined && c[f] !== '', `conversation "${c.id}" missing "${f}"`);
    }
    assert(c.curriculum.year_groups?.length > 0, `conversation "${c.id}" has no year_groups`);
    assert(c.url === `/but-why/conversations/${c.id}.json`,
      `conversation "${c.id}" has unexpected url "${c.url}"`);
    // The index must point at a file the site actually ships.
    assert(existsSync(join(ROOT, 'public', c.url)),
      `conversation "${c.id}" url does not resolve to a shipped file`);
  }
});

test('but-why: every conversation file satisfies the reader contract', () => {
  for (const c of butWhy) {
    const conv = readJson(join('public', c.url));
    for (const f of ['title', 'setting', 'characters', 'turns']) {
      assert(conv[f] !== undefined, `conversation "${c.id}" missing reader field "${f}"`);
    }
    assert(conv.characters.child && conv.characters.adult,
      `conversation "${c.id}" missing child/adult character names`);
    assert(Array.isArray(conv.turns) && conv.turns.length > 0,
      `conversation "${c.id}" has no turns`);
    for (const t of conv.turns) {
      assert(t.speaker === 'child' || t.speaker === 'adult',
        `conversation "${c.id}" has a turn with invalid speaker "${t.speaker}"`);
      assert(typeof t.text === 'string' && t.text.length > 0,
        `conversation "${c.id}" has an empty turn`);
    }
    // Teacher-only fields must be present in the source so the reader's
    // "For teachers" panel has something to show.
    assert(conv.the_heart_of_it, `conversation "${c.id}" missing the_heart_of_it`);
  }
});

// --- Reader assets ---------------------------------------------------------
test('reader assets are shipped in public/but-why/', () => {
  for (const f of ['but-why-reader.js', 'but-why-reader.css']) {
    assert(existsSync(join(ROOT, 'public', 'but-why', f)), `missing public/but-why/${f}`);
  }
});

// --- Search-index coverage -------------------------------------------------
// Guards the regression where a whole content section is invisible to site
// search because it was never wired into scripts/build-search-index.ts.
// Run `npx tsx scripts/build-search-index.ts` first (run_all.sh does this).
test('search index covers every biomimicry example and But Why? conversation', () => {
  const indexPath = join(ROOT, 'public', 'search-index.json');
  assert(existsSync(indexPath),
    'public/search-index.json missing — run `npx tsx scripts/build-search-index.ts` first');
  const index = readJson('public/search-index.json');

  const indexedBiomimicry = new Set(
    index.filter((e) => e.type === 'biomimicry').map((e) => e.id),
  );
  for (const e of biomimicry) {
    assert(indexedBiomimicry.has(e.id),
      `biomimicry "${e.id}" is missing from the search index — wire it into build-search-index.ts`);
  }

  const indexedButWhy = new Set(
    index.filter((e) => e.type === 'butwhy').map((e) => e.id),
  );
  for (const c of butWhy) {
    assert(indexedButWhy.has(c.id),
      `but-why "${c.id}" is missing from the search index — wire it into build-search-index.ts`);
  }
});

// --- Resource-index wiring -------------------------------------------------
// Cheap structural guard: the Resource Index page must compose every section
// adapter, so each section's items appear as reusable resources. If a new
// section is added without an adapter spread here, this fails.
test('resource index page composes every content-section adapter', () => {
  const page = readFileSync(join(ROOT, 'app', 'resources', 'page.tsx'), 'utf8');
  for (const fn of [
    'getActivitiesForResourceIndex',
    'getBiomimicryForResourceIndex',
    'getButWhyForResourceIndex',
  ]) {
    assert(page.includes(fn),
      `app/resources/page.tsx does not call ${fn}() — that section is absent from the Resource Index`);
  }
});

console.log('');
console.log(`Results: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
