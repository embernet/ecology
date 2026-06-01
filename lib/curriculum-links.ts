/**
 * Cross-link routing between content sections and curriculum wiki pages.
 *
 * This is the SINGLE SOURCE OF TRUTH for "which curriculum page does a
 * biomimicry example / But Why? conversation connect to" — and, by inversion,
 * "which examples and conversations belong on a given curriculum page".
 *
 * Why it lives here and not in data/*.json:
 *  - Wiki slugs/anchors are THIS site's information architecture, not domain
 *    content, so they don't belong in the upstream team data.
 *  - `scripts/sync-ecology-content.mjs` overwrites data/biomimicry.json and
 *    data/but-why.json wholesale, so targets stored there would be lost.
 *
 * The resolver is deliberately CONSERVATIVE: it only emits an edge when a
 * topic maps cleanly onto an existing page AND the page's year group matches
 * the item. A missing link is fine; a wrong link is not (accuracy first).
 * Page availability is derived from `navigation.ts`, so it can never point at
 * a page that doesn't exist.
 */
import { navigation, isSection, type NavSection } from '@/lib/navigation';
import { BIOMIMICRY, type CurriculumLink } from '@/lib/biomimicry';
import { CONVERSATIONS } from '@/lib/but-why';
import { getPostBySlug } from '@/lib/content';

function norm(s: string): string {
  return s.toLowerCase().replace(/,/g, '').replace(/\s+/g, ' ').trim();
}

/** The leading phrase of a topic string, before any "—" or "(" qualifier. */
function topicHead(topic: string): string {
  return norm(topic.split(/[—(]/)[0]);
}

/** Build year-number → (normalised topic label → wiki slug) from the Science nav. */
function buildScienceIndex(): Map<number, Map<string, string>> {
  const out = new Map<number, Map<string, string>>();
  const science = navigation.find(
    (e): e is NavSection => isSection(e) && e.label === 'Science',
  );
  if (!science) return out;

  for (const child of science.children) {
    if (!isSection(child)) continue;
    const m = child.label.match(/Year\s+(\d+)/i);
    if (!m) continue;
    const year = parseInt(m[1], 10);
    const topicMap = new Map<string, string>();
    for (const leaf of child.children) {
      if (isSection(leaf) || !leaf.href.startsWith('/wiki/')) continue;
      topicMap.set(norm(leaf.label), leaf.href.replace('/wiki/', ''));
    }
    out.set(year, topicMap);
  }
  return out;
}

const SCIENCE_INDEX = buildScienceIndex();

/**
 * Variant topic phrasings → the normalised Science nav label they map to.
 * Kept tight on purpose; anything not listed and not an exact label match
 * simply produces no link.
 */
const TOPIC_ALIASES: Record<string, string> = {
  'deciduous and evergreen trees': 'plants',
  'flowers and fruit': 'plants',
  'how plants reproduce': 'plants',
  pollination: 'plants',
  amphibians: 'living things and their habitats',
  adaptation: 'evolution and inheritance',
  'evolution and adaptation': 'evolution and inheritance',
};

function yearNums(yearGroups: string[]): number[] {
  return yearGroups
    .map((y) => parseInt(y.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n));
}

function keyStageNums(keyStage: string): number[] {
  return [...keyStage.matchAll(/KS(\d)/g)].map((m) => parseInt(m[1], 10));
}

/**
 * Resolve the wiki page slugs a single curriculum reference points at.
 * Returns [] when there is no confident, existing destination.
 */
export function resolvePageSlugs(
  subject: string,
  keyStage: string,
  yearGroups: string[],
  topic: string,
): string[] {
  const slugs = new Set<string>();
  const head = topicHead(topic);
  const label = TOPIC_ALIASES[head] ?? head;

  // Science maps by (year, topic) onto the year pages that actually exist.
  if (subject === 'Science') {
    for (const y of yearNums(yearGroups)) {
      const slug = SCIENCE_INDEX.get(y)?.get(label);
      if (slug) slugs.add(slug);
    }
  }

  // Geography maps to the key-stage landing pages.
  if (subject === 'Geography') {
    for (const ks of keyStageNums(keyStage)) {
      if (ks === 1) slugs.add('key-stage-1-geography');
      if (ks === 2) slugs.add('key-stage-2-geography');
    }
  }

  // Other subjects (D&T, Maths, Art, English) have no curriculum pages yet.
  return [...slugs];
}

export interface ResolvedTarget {
  slug: string;
  title: string;
}

let titleCache: Record<string, string> | null = null;
function titleFor(slug: string): string {
  if (!titleCache) titleCache = {};
  if (titleCache[slug] === undefined) {
    const post = getPostBySlug(slug);
    titleCache[slug] = (post?.frontmatter.title as string) || slug;
  }
  return titleCache[slug];
}

/** Forward direction: the curriculum pages a biomimicry link points at. */
export function targetsForBiomimicryLink(link: CurriculumLink): ResolvedTarget[] {
  return resolvePageSlugs(link.subject, link.key_stage, link.year_groups, link.topic).map(
    (slug) => ({ slug, title: titleFor(slug) }),
  );
}

export interface RelatedExplorations {
  biomimicry: { id: string; title: string; emoji: string }[];
  butWhy: { id: string; title: string }[];
}

/**
 * Inverse direction: every biomimicry example and But Why? conversation that
 * connects to a given curriculum page. Drives the "Related" panel on wiki pages.
 */
export function relatedForPage(slug: string): RelatedExplorations {
  const biomimicry = BIOMIMICRY.filter((e) =>
    e.curriculum_links.some((l) =>
      resolvePageSlugs(l.subject, l.key_stage, l.year_groups, l.topic).includes(slug),
    ),
  ).map((e) => ({ id: e.id, title: e.title, emoji: e.emoji }));

  const butWhy = CONVERSATIONS.filter((c) =>
    c.curriculum.topics.some((t) =>
      resolvePageSlugs(
        'Science',
        c.curriculum.key_stage,
        c.curriculum.year_groups,
        t,
      ).includes(slug),
    ),
  ).map((c) => ({ id: c.id, title: c.title }));

  return { biomimicry, butWhy };
}
