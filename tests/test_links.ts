// test_links.ts
//
// Integrity checks for the cross-link layer (lib/curriculum-links.ts). Run via
// tsx so the '@/' alias and TS modules resolve:
//
//   npx tsx tests/test_links.ts
//
// Guards two ways the cross-links could rot silently:
//   1. Dead links — a resolved target page must be a real content/*.md file.
//   2. Forward/inverse drift — if a detail page links to a curriculum page,
//      that page's "Related" panel must link back, and vice-versa.

import { BIOMIMICRY } from '@/lib/biomimicry';
import { CONVERSATIONS } from '@/lib/but-why';
import { resolvePageSlugs, relatedForPage } from '@/lib/curriculum-links';
import { getPostSlugs } from '@/lib/content';

let pass = 0;
let fail = 0;
function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  PASS  ${name}`);
    pass++;
  } catch (err) {
    console.error(`  FAIL  ${name}: ${(err as Error).message}`);
    fail++;
  }
}
function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

const realSlugs = new Set(getPostSlugs().map((f) => f.replace(/\.md$/, '')));

// Collect every (item, slug) edge the forward resolver produces.
const bioEdges: { id: string; slug: string }[] = [];
for (const e of BIOMIMICRY) {
  for (const l of e.curriculum_links) {
    for (const slug of resolvePageSlugs(l.subject, l.key_stage, l.year_groups, l.topic)) {
      bioEdges.push({ id: e.id, slug });
    }
  }
}
const bwEdges: { id: string; slug: string }[] = [];
for (const c of CONVERSATIONS) {
  for (const t of c.curriculum.topics) {
    for (const slug of resolvePageSlugs('Science', c.curriculum.key_stage, c.curriculum.year_groups, t)) {
      bwEdges.push({ id: c.id, slug });
    }
  }
}

test('every resolved cross-link target is a real wiki page (no dead links)', () => {
  for (const { id, slug } of [...bioEdges, ...bwEdges]) {
    assert(realSlugs.has(slug), `"${id}" links to non-existent page "${slug}"`);
  }
});

test('forward biomimicry links round-trip through the inverse index', () => {
  for (const { id, slug } of bioEdges) {
    const back = relatedForPage(slug).biomimicry.map((b) => b.id);
    assert(back.includes(id), `${id} → ${slug} not reflected in relatedForPage("${slug}")`);
  }
});

test('forward But Why? links round-trip through the inverse index', () => {
  for (const { id, slug } of bwEdges) {
    const back = relatedForPage(slug).butWhy.map((b) => b.id);
    assert(back.includes(id), `${id} → ${slug} not reflected in relatedForPage("${slug}")`);
  }
});

test('the cross-link layer produces at least some edges (resolver not broken)', () => {
  assert(bioEdges.length > 0, 'no biomimicry edges resolved — resolver or nav mapping is broken');
  assert(bwEdges.length > 0, 'no But Why? edges resolved — resolver or nav mapping is broken');
});

console.log('');
console.log(`Results: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
