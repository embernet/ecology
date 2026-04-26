export interface NavItem {
  label: string;
  href: string;
}

export interface NavSection {
  label: string;
  href?: string;
  children: (NavItem | NavSection)[];
}

export type NavEntry = NavItem | NavSection;

export function isSection(entry: NavEntry): entry is NavSection {
  return 'children' in entry;
}

export const navigation: NavEntry[] = [
  {
    label: 'How to Guide',
    href: '/wiki/how-to-guide',
    children: [
      { label: 'Content Overview', href: '/wiki/how-to-guide-content-overview' },
      { label: 'Creating Your Own Resource Packs', href: '/wiki/how-to-guide-resource-packs' },
    ],
  },
  {
    label: 'Science',
    href: '/wiki/science',
    children: [
      { label: 'Working Scientifically (Years 1-2)', href: '/wiki/years-1-and-2-working-scientifically' },
      {
        label: 'Year 1',
        href: '/wiki/year-1',
        children: [
          { label: 'Plants', href: '/wiki/year-1-plants' },
          { label: 'Animals, including humans', href: '/wiki/year-1-animals-including-humans' },
          { label: 'Seasonal changes', href: '/wiki/year-1-seasonal-changes' },
          { label: 'Everyday materials', href: '/wiki/year-1-everyday-materials' },
        ],
      },
      {
        label: 'Year 2',
        href: '/wiki/year-2',
        children: [
          { label: 'Plants', href: '/wiki/year-2-plants' },
          { label: 'Animals, including humans', href: '/wiki/year-2-animals-including-humans' },
          { label: 'Living things and their habitats', href: '/wiki/year-2-living-things-and-their-habitats' },
          { label: 'Everyday materials', href: '/wiki/year-2-everyday-materials' },
        ],
      },
      {
        label: 'Year 3',
        href: '/wiki/year-3',
        children: [
          { label: 'Plants', href: '/wiki/year-3-plants' },
          { label: 'Light', href: '/wiki/year-3-light' },
        ],
      },
      {
        label: 'Year 4',
        href: '/wiki/year-4',
        children: [
          { label: 'Animals, including humans', href: '/wiki/year-4-animals-including-humans' },
          { label: 'Electricity', href: '/wiki/year-4-electricity' },
          { label: 'Living things and their habitats', href: '/wiki/year-4-living-things-and-their-habitats' },
          { label: 'Sound', href: '/wiki/year-4-sound' },
          { label: 'States of matter', href: '/wiki/year-4-states-of-matter' },
        ],
      },
      {
        label: 'Year 5',
        href: '/wiki/year-5',
        children: [
          { label: 'Earth and space', href: '/wiki/year-5-earth-and-space' },
          { label: 'Living things and their habitats', href: '/wiki/year-5-living-things-and-their-habitats' },
        ],
      },
      {
        label: 'Year 6',
        href: '/wiki/year-6',
        children: [
          { label: 'Evolution and inheritance', href: '/wiki/year-6-evolution-and-inheritance' },
          { label: 'Living things and their habitats', href: '/wiki/year-6-living-things-and-their-habitats' },
        ],
      },
    ],
  },
  {
    label: 'Geography',
    href: '/wiki/geography',
    children: [
      { label: 'Key Stage 1', href: '/wiki/key-stage-1-geography' },
      { label: 'Key Stage 2', href: '/wiki/key-stage-2-geography' },
      { label: 'Physical Geography', href: '/wiki/physical-geography' },
    ],
  },
  {
    label: 'Handouts',
    href: '/wiki/handouts',
    children: [
      { label: 'Bees vs. Wasps', href: '/wiki/handout-bees-vs-wasps' },
      { label: 'Bees vs. Wasps Nests', href: '/wiki/handout-wax-castles-vs-paper-palaces' },
      { label: 'Butterflies vs. Moths', href: '/wiki/handout-butterflies-vs-moths' },
      { label: 'Butterfly & Moth Life-Cycle', href: '/wiki/handout-butterfly-moth-life-cycle' },
      { label: 'Centipedes vs. Millipedes', href: '/wiki/handout-centipedes-vs-millipedes' },
      { label: 'Dragonflies vs. Damselflies', href: '/wiki/handout-dragonflies-vs-damselflies' },
      { label: 'Frogs and Toads', href: '/wiki/handout-frogs-and-toads' },
      { label: 'Grasshoppers vs. Crickets', href: '/wiki/handout-grasshoppers-vs-crickets' },
      { label: 'Snails vs. Slugs', href: '/wiki/handout-snails-vs-slugs' },
    ],
  },
  {
    label: 'Interactive Activities',
    href: '/activities',
    children: [
      { label: 'Butterfly or Moth?', href: '/activities/name-describe-butterfly-moth-y12' },
      { label: 'Name the Butterfly', href: '/activities/name-butterfly-y12' },
      { label: 'Name the Moth', href: '/activities/name-moth-y12' },
      { label: 'Name the Wildflower', href: '/activities/name-wildflower-y12' },
      { label: 'Frog or Toad?', href: '/activities/name-describe-frog-toad-y12' },
      { label: 'Slug or Snail?', href: '/activities/name-describe-slug-snail-y12' },
      { label: 'Name the Snail', href: '/activities/name-snail-y34' },
      { label: 'Frog Life Cycle', href: '/activities/sequence-frog-lifecycle-y12' },
      { label: 'Toad Life Cycle', href: '/activities/sequence-toad-lifecycle-y12' },
      { label: 'Butterfly Life Cycle', href: '/activities/sequence-butterfly-lifecycle-y12' },
      { label: 'Sort: Butterflies & Moths', href: '/activities/sort-butterfly-moth-y12' },
      { label: 'Sort: Frogs & Toads', href: '/activities/sort-frog-toad-y12' },
      { label: 'Sort: Slugs & Snails', href: '/activities/sort-slug-snail-y12' },
      { label: 'Parts of a Butterfly', href: '/activities/label-parts-butterfly-y34' },
      { label: 'Parts of a Flower', href: '/activities/label-parts-flower-y34' },
      { label: 'Parts of a Snail', href: '/activities/label-parts-snail-y34' },
    ],
  },
  {
    label: 'Media Library',
    href: '/media',
    children: [
      { label: 'Images', href: '/media/images' },
      { label: 'Live Streams', href: '/media/live-streams' },
    ],
  },
  {
    label: 'Reference',
    href: '/reference',
    children: [
      { label: 'Dictionary', href: '/dictionary' },
      { label: 'Resource Index', href: '/resources' },
    ],
  },
  {
    label: 'Teaching Resources',
    href: '/wiki/teaching-resources',
    children: [
      { label: 'Teaching Principles', href: '/wiki/teaching-principles-used-to-create-the-learning-resources' },
      { label: 'Useful External Resources', href: '/wiki/other-websites-with-useful-ecology-resources' },
    ],
  },
];

/** Recursively flatten all leaf NavItems (pages with hrefs) from a list of entries. */
function flattenLeaves(entries: (NavItem | NavSection)[]): NavItem[] {
  const result: NavItem[] = [];
  for (const entry of entries) {
    if (!isSection(entry)) {
      result.push(entry);
    } else {
      result.push(...flattenLeaves(entry.children));
    }
  }
  return result;
}

export interface SiblingPages {
  prev: NavItem | null;
  next: NavItem | null;
  /** The label of the parent section, e.g. "Handouts" */
  sectionLabel: string | null;
  /** The href of the parent section landing page, if it has one */
  sectionHref: string | null;
}

/**
 * Given a slug (e.g. "handout-bees-vs-wasps"), find the prev and next
 * sibling leaf pages within the same top-level section.
 * Returns nulls when not found or at the boundary.
 */
export function getActivitySiblings(activityId: string): SiblingPages {
  const href = `/activities/${activityId}`

  const activitiesSection = navigation.find(
    (entry): entry is NavSection => isSection(entry) && entry.href === '/activities'
  )

  if (!activitiesSection) {
    return { prev: null, next: null, sectionLabel: 'Interactive Activities', sectionHref: '/activities' }
  }

  const leaves = flattenLeaves(activitiesSection.children)
  const idx = leaves.findIndex((l) => l.href === href)

  return {
    prev: idx > 0 ? leaves[idx - 1] : null,
    next: idx < leaves.length - 1 ? leaves[idx + 1] : null,
    sectionLabel: 'Interactive Activities',
    sectionHref: '/activities',
  }
}

export function getSiblingPages(slug: string): SiblingPages {
  const href = `/wiki/${slug}`;

  // Check if this is a top-level section landing page
  const sectionNode = navigation.find(entry => isSection(entry) && entry.href === href);
  if (sectionNode) {
    return {
      prev: null,
      next: null,
      sectionLabel: 'Home',
      sectionHref: '/'
    };
  }

  // Check if this is a nested section landing page (e.g. Year 1 under Science)
  for (const entry of navigation) {
    if (!isSection(entry)) continue;
    for (const child of entry.children) {
      if (isSection(child) && child.href === href) {
        return {
          prev: null,
          next: null,
          sectionLabel: entry.label,
          sectionHref: entry.href ?? null,
        };
      }
    }
  }

  for (const entry of navigation) {
    if (!isSection(entry)) continue;
    const leaves = flattenLeaves(entry.children);
    // Only bother with sections that have more than 1 child leaf
    if (leaves.length < 2) continue;
    const idx = leaves.findIndex((l) => l.href === href);
    if (idx === -1) continue;
    return {
      prev: idx > 0 ? leaves[idx - 1] : null,
      next: idx < leaves.length - 1 ? leaves[idx + 1] : null,
      sectionLabel: entry.label,
      sectionHref: entry.href ?? null,
    };
  }

  return { prev: null, next: null, sectionLabel: null, sectionHref: null };
}
