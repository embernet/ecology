# Additional Interactive Activities — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 52 interactive activities across 6 gap fills and 4 new organism pairs (bees/wasps, dragonflies/damselflies, grasshoppers/crickets, centipedes/millipedes), taking the site from 43 to ~95 activities.

**Architecture:** All activities are TypeScript data in `data/activities.ts`; images are defined in `data/activity-images.ts` and generated via Gemini Imagen 4 using the existing `scripts/generate-activity-images.ts` script. Navigation entries in `lib/navigation.ts` are manually maintained. No routing, templating, or layout changes are needed — the existing 4 templates handle all new activity types.

**Tech Stack:** TypeScript, Next.js static export, Tailwind CSS; Gemini Imagen 4 (`imagen-4.0-generate-001`) via `scripts/generate-activity-images.ts`; dev server via `npm run dev` in `projects/ecology/`

**Note on commits:** Do not commit automatically. The developer will test each pair in the browser and commit when satisfied.

**Note on callout coordinates:** Coordinates in `label-parts` activities are approximate — calibrate against generated images after generation.

---

## File Structure

| File | Change |
|------|--------|
| `data/activity-images.ts` | Extend `category` union type; add 44 image metadata objects |
| `data/activities.ts` | Add 52 activity definitions |
| `lib/navigation.ts` | Fix 4 existing hrefs; add 19 new nav entries |
| `public/activity-images/` | Receive 44 new PNG files from image generation script |

---

## Task 1: Gap Fills — 6 Missing Year-Group Variants

**Files:**
- Modify: `data/activities.ts` (insert before the closing `]`, after the last snail label-parts entry at line ~1075)
- Modify: `lib/navigation.ts` (fix 4 existing hrefs)

- [ ] **Step 1: Add 6 gap-fill activity definitions to `data/activities.ts`**

Insert the following block immediately before the closing `]` of the `ACTIVITIES` array (after `label-parts-snail-y56`):

```typescript
  // ── GAP FILLS ─────────────────────────────────────────────────────────────

  {
    id: 'name-snail-y12',
    title: 'Name the Snail',
    description: 'Drag the name labels to match each snail.',
    template: 'name-describe',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'common-garden-snail-01', role: 'garden-snail' },
      { image_id: 'white-lipped-snail-01', role: 'white-lipped' },
      { image_id: 'brown-lipped-snail-01', role: 'brown-lipped' },
    ],
    name_labels: {
      'garden-snail': 'Common Garden Snail',
      'white-lipped': 'White-lipped Snail',
      'brown-lipped': 'Brown-lipped Snail',
    },
    description_labels: {
      'garden-snail': ['Has a large brown shell'],
      'white-lipped': ['Has a white-rimmed opening'],
      'brown-lipped': ['Has a brown-rimmed opening'],
    },
    description_box_count: 1,
    label_pool: [
      'Common Garden Snail', 'White-lipped Snail', 'Brown-lipped Snail',
      'Has a large brown shell', 'Has a white-rimmed opening', 'Has a brown-rimmed opening',
    ],
  },
  {
    id: 'label-parts-butterfly-y12',
    title: 'Parts of a Butterfly',
    description: 'Drag the labels to the correct parts of the butterfly.',
    template: 'label-parts',
    year_groups: ['y12'],
    subjects: [{ image_id: 'red-admiral-01', role: 'subject' }],
    callouts: [
      { role: 'wing', x: 23, y: 35, label: 'Wing' },
      { role: 'body', x: 50, y: 50, label: 'Body' },
      { role: 'antennae', x: 52, y: 22, label: 'Antennae' },
    ],
    label_pool: ['Wing', 'Body', 'Antennae'],
  },
  {
    id: 'label-parts-flower-y12',
    title: 'Parts of a Flower',
    description: 'Drag the labels to the correct parts of this flower.',
    template: 'label-parts',
    year_groups: ['y12'],
    subjects: [{ image_id: 'common-poppy-01', role: 'subject' }],
    callouts: [
      { role: 'petal', x: 25, y: 20, label: 'Petal' },
      { role: 'stem', x: 50, y: 80, label: 'Stem' },
      { role: 'leaf', x: 72, y: 70, label: 'Leaf' },
    ],
    label_pool: ['Petal', 'Stem', 'Leaf'],
  },
  {
    id: 'label-parts-snail-y12',
    title: 'Parts of a Snail',
    description: 'Drag the labels to the correct parts of this garden snail.',
    template: 'label-parts',
    year_groups: ['y12'],
    subjects: [{ image_id: 'common-garden-snail-01', role: 'subject' }],
    callouts: [
      { role: 'shell', x: 60, y: 25, label: 'Shell' },
      { role: 'foot', x: 35, y: 75, label: 'Foot' },
      { role: 'eye-stalks', x: 22, y: 25, label: 'Eye stalks' },
    ],
    label_pool: ['Shell', 'Foot', 'Eye stalks'],
  },
  {
    id: 'sort-frog-toad-y56',
    title: 'Sort: Frogs and Toads',
    description: 'Sort each life stage into the correct group. Can you identify the scientific name for each?',
    template: 'sort-classify',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'frogspawn-01', role: 'item-1' },
      { image_id: 'frog-tadpole-back-legs-01', role: 'item-2' },
      { image_id: 'froglet-01', role: 'item-3' },
      { image_id: 'adult-common-frog-01', role: 'item-4' },
      { image_id: 'toadspawn-01', role: 'item-5' },
      { image_id: 'toad-tadpole-01', role: 'item-6' },
      { image_id: 'toadlet-01', role: 'item-7' },
      { image_id: 'adult-common-toad-01', role: 'item-8' },
    ],
    categories: [
      { label: 'Common Frog (Rana temporaria)', image_ids: ['frogspawn-01', 'frog-tadpole-back-legs-01', 'froglet-01', 'adult-common-frog-01'] },
      { label: 'Common Toad (Bufo bufo)', image_ids: ['toadspawn-01', 'toad-tadpole-01', 'toadlet-01', 'adult-common-toad-01'] },
    ],
    label_pool: [],
  },
  {
    id: 'sort-slug-snail-y56',
    title: 'Sort: Slugs and Snails',
    description: 'Sort all seven creatures. Slugs lack a visible external shell; snails carry one throughout their lives.',
    template: 'sort-classify',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'garden-slug-01', role: 'item-1' },
      { image_id: 'great-black-slug-01', role: 'item-2' },
      { image_id: 'leopard-slug-01', role: 'item-3' },
      { image_id: 'netted-field-slug-01', role: 'item-4' },
      { image_id: 'common-garden-snail-01', role: 'item-5' },
      { image_id: 'white-lipped-snail-01', role: 'item-6' },
      { image_id: 'brown-lipped-snail-01', role: 'item-7' },
    ],
    categories: [
      { label: 'Slug (no external shell)', image_ids: ['garden-slug-01', 'great-black-slug-01', 'leopard-slug-01', 'netted-field-slug-01'] },
      { label: 'Snail (has a shell)', image_ids: ['common-garden-snail-01', 'white-lipped-snail-01', 'brown-lipped-snail-01'] },
    ],
    label_pool: [],
  },
```

- [ ] **Step 2: Fix 4 nav hrefs in `lib/navigation.ts`**

In the `Interactive Activities` children array, update these four entries:

```typescript
// BEFORE:
{ label: 'Name the Snail', href: '/activities/name-snail-y34' },
{ label: 'Parts of a Butterfly', href: '/activities/label-parts-butterfly-y34' },
{ label: 'Parts of a Flower', href: '/activities/label-parts-flower-y34' },
{ label: 'Parts of a Snail', href: '/activities/label-parts-snail-y34' },

// AFTER:
{ label: 'Name the Snail', href: '/activities/name-snail-y12' },
{ label: 'Parts of a Butterfly', href: '/activities/label-parts-butterfly-y12' },
{ label: 'Parts of a Flower', href: '/activities/label-parts-flower-y12' },
{ label: 'Parts of a Snail', href: '/activities/label-parts-snail-y12' },
```

- [ ] **Step 3: Type-check**

```bash
cd projects/ecology && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Verify in dev server**

```bash
npm run dev
```

Visit:
- `/activities/name-snail-y12` — 3 snails, 1 description box each
- `/activities/label-parts-butterfly-y12` — 3 callout labels (Wing, Body, Antennae)
- `/activities/label-parts-flower-y12` — 3 callout labels (Petal, Stem, Leaf)
- `/activities/label-parts-snail-y12` — 3 callout labels (Shell, Foot, Eye stalks)
- `/activities/sort-frog-toad-y56` — 8 items, categories with scientific names
- `/activities/sort-slug-snail-y56` — 7 items, categories with descriptive labels

---

## Task 2: Extend `ActivityImage` Category Type

**Files:**
- Modify: `data/activity-images.ts` lines 6–15 (the `category` union type)

- [ ] **Step 1: Replace the `category` union type**

```typescript
// BEFORE:
  category:
    | 'butterfly'
    | 'moth'
    | 'frog-lifecycle'
    | 'toad-lifecycle'
    | 'butterfly-lifecycle'
    | 'wildflower'
    | 'slug'
    | 'snail'

// AFTER:
  category:
    | 'butterfly'
    | 'moth'
    | 'frog-lifecycle'
    | 'toad-lifecycle'
    | 'butterfly-lifecycle'
    | 'wildflower'
    | 'slug'
    | 'snail'
    | 'bee'
    | 'wasp'
    | 'bee-lifecycle'
    | 'dragonfly'
    | 'damselfly'
    | 'dragonfly-lifecycle'
    | 'grasshopper'
    | 'cricket'
    | 'grasshopper-lifecycle'
    | 'centipede'
    | 'millipede'
```

- [ ] **Step 2: Type-check**

```bash
cd projects/ecology && npx tsc --noEmit
```

Expected: no errors.

---

## Task 3: Bees & Wasps — Image Metadata

**Files:**
- Modify: `data/activity-images.ts` (append before closing `]` of `ACTIVITY_IMAGES`)

- [ ] **Step 1: Add 12 image metadata entries**

Append before the closing `]` of `ACTIVITY_IMAGES`:

```typescript
  // ── UK BEES ───────────────────────────────────────────────────────────────
  {
    id: 'honey-bee-01',
    filename: 'honey-bee.png',
    common_name: 'Honey Bee',
    latin_name: 'Apis mellifera',
    category: 'bee',
    description: 'Worker bee, side view, amber-brown and black striped abdomen, hairy thorax, veined wings folded at rest',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Honey Bee (Apis mellifera), worker, viewed from the side. Show the amber-brown and black striped abdomen, densely hairy golden-brown thorax, delicately veined wings folded along the body, short antennae, and compound eyes. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'buff-tailed-bumblebee-01',
    filename: 'buff-tailed-bumblebee.png',
    common_name: 'Buff-tailed Bumblebee',
    latin_name: 'Bombus terrestris',
    category: 'bee',
    description: 'Worker, top view, large round densely furry body, yellow bands on thorax and abdomen, creamy-buff tail',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Buff-tailed Bumblebee (Bombus terrestris), worker, viewed from above. Show the large, rounded, densely furry body with yellow bands on the thorax and abdomen, a creamy-buff tail, and short broad wings. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'red-tailed-bumblebee-01',
    filename: 'red-tailed-bumblebee.png',
    common_name: 'Red-tailed Bumblebee',
    latin_name: 'Bombus lapidarius',
    category: 'bee',
    description: 'Worker, top view, all-black furry body with vivid orange-red tail',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Red-tailed Bumblebee (Bombus lapidarius), worker, viewed from above. Show the all-black densely furry body with a vivid orange-red tail. Large, rounded body shape with short wings. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'common-carder-bee-01',
    filename: 'common-carder-bee.png',
    common_name: 'Common Carder Bee',
    latin_name: 'Bombus pascuorum',
    category: 'bee',
    description: 'Worker, top view, ginger-brown furry body with darker brown banding on abdomen',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Common Carder Bee (Bombus pascuorum), worker, viewed from above. Show the ginger-brown furry body with subtle darker brown banding across the abdomen. Medium-sized, rounded, densely hairy body with short wings. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  // ── UK WASPS ──────────────────────────────────────────────────────────────
  {
    id: 'common-wasp-01',
    filename: 'common-wasp.png',
    common_name: 'Common Wasp',
    latin_name: 'Vespula vulgaris',
    category: 'wasp',
    description: 'Worker, side view, smooth yellow and black banded abdomen, narrow waist, folded wings, anchor-shaped face mark',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Common Wasp (Vespula vulgaris), worker, viewed from the side. Show the smooth, hairless yellow and black banded abdomen, distinctly narrow waist (petiole), folded narrow wings, and yellow face with a distinctive anchor-shaped black mark. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'german-wasp-01',
    filename: 'german-wasp.png',
    common_name: 'German Wasp',
    latin_name: 'Vespula germanica',
    category: 'wasp',
    description: 'Worker, side view, smooth yellow and black banded abdomen, three black dots on face (not anchor)',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a German Wasp (Vespula germanica), worker, viewed from the side. Show the smooth yellow and black striped abdomen, narrow waist, folded wings, and yellow face with three round black dots — not an anchor shape. Very similar in overall appearance to the common wasp. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'hornet-01',
    filename: 'hornet.png',
    common_name: 'Hornet',
    latin_name: 'Vespa crabro',
    category: 'wasp',
    description: 'Side view, large body significantly bigger than a common wasp, reddish-brown thorax, yellow and reddish-brown banded abdomen',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Hornet (Vespa crabro), viewed from the side. Show the large body — noticeably bigger than a common wasp — with a reddish-brown thorax, yellow and reddish-brown banded abdomen, large broad head with prominent eyes, and minimal body hair. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'tree-wasp-01',
    filename: 'tree-wasp.png',
    common_name: 'Tree Wasp',
    latin_name: 'Dolichovespula sylvestris',
    category: 'wasp',
    description: 'Worker, side view, slender yellow and black striped body, slightly more elongated than common wasp',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Tree Wasp (Dolichovespula sylvestris), worker, viewed from the side. Show the slender yellow and black striped body with a slightly more elongated shape than the common wasp, narrow waist, and folded wings. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  // ── BEE LIFE CYCLE ────────────────────────────────────────────────────────
  {
    id: 'bee-egg-01',
    filename: 'bee-egg.png',
    common_name: 'Honey Bee Egg',
    latin_name: 'Apis mellifera',
    category: 'bee-lifecycle',
    description: 'Tiny white oval egg standing upright at the base of an open hexagonal beeswax cell',
    suitable_for: ['sequencing'],
    prompt: 'Scientific illustration of a Honey Bee egg (Apis mellifera) inside a single open hexagonal beeswax cell, viewed from slightly above the cell opening. Show the tiny white oval egg standing upright at the base of the golden wax cell. The cell and egg fill most of the frame. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'bee-larva-01',
    filename: 'bee-larva.png',
    common_name: 'Honey Bee Larva',
    latin_name: 'Apis mellifera',
    category: 'bee-lifecycle',
    description: 'White legless grub curled at the base of an open hexagonal beeswax cell',
    suitable_for: ['sequencing'],
    prompt: 'Scientific illustration of a Honey Bee larva (Apis mellifera) curled inside an open hexagonal beeswax cell, viewed from slightly above. Show the white, legless, c-shaped grub at the base of the golden wax cell. The cell and larva fill most of the frame. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'bee-pupa-01',
    filename: 'bee-pupa.png',
    common_name: 'Honey Bee Pupa',
    latin_name: 'Apis mellifera',
    category: 'bee-lifecycle',
    description: 'Cross-section of a sealed beeswax cell revealing a pale cream bee pupa with recognisable head and body form',
    suitable_for: ['sequencing'],
    prompt: 'Scientific illustration of a Honey Bee pupa (Apis mellifera) inside a sealed beeswax cell, shown in cross-section to reveal the pupa inside. Show the pale cream pupa with a recognisable bee body form — head, thorax, and abdomen visible — inside the wax-capped cell. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  // ── BEE ANATOMY ───────────────────────────────────────────────────────────
  {
    id: 'honey-bee-anatomy-01',
    filename: 'honey-bee-anatomy.png',
    common_name: 'Honey Bee (anatomy)',
    latin_name: 'Apis mellifera',
    category: 'bee',
    description: 'Side view showing all major body parts: head, thorax, abdomen, forewings, hindwings, six legs, pollen basket on hind leg, stinger at abdomen tip',
    suitable_for: ['labelling'],
    prompt: 'Scientific illustration of a Honey Bee (Apis mellifera), worker, side view, clearly showing all major body parts for anatomical study. Show the distinct head with compound eyes and antennae, thorax with attached forewings and hindwings (wings spread slightly for clarity), abdomen with yellow-and-black banding, six legs with a visible corbiculum (pollen basket) on the hind leg, and a visible stinger at the abdomen tip. Clean white background, no text or labels, detailed natural history illustration, suitable for primary school level anatomy labelling.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
```

- [ ] **Step 2: Type-check**

```bash
cd projects/ecology && npx tsc --noEmit
```

Expected: no errors.

---

## Task 4: Bees & Wasps — Generate Images

**Files:**
- Output: `public/activity-images/` (12 new PNG files)

- [ ] **Step 1: Run image generation script**

```bash
cd projects/ecology && GEMINI_API_KEY=<your-key> npx tsx scripts/generate-activity-images.ts \
  honey-bee.png buff-tailed-bumblebee.png red-tailed-bumblebee.png common-carder-bee.png \
  common-wasp.png german-wasp.png hornet.png tree-wasp.png \
  bee-egg.png bee-larva.png bee-pupa.png honey-bee-anatomy.png
```

Expected: 12 files generated in `public/activity-images/`, each reported with KB size.

- [ ] **Step 2: Visually inspect all 12 images**

Open `public/activity-images/` and inspect each PNG. Check:
- Correct species depicted (especially distinguishing bees from wasps by hairiness/shape)
- Plain white background, no embedded text
- `honey-bee-anatomy.png` shows pollen basket on hind leg and stinger clearly
- `bee-pupa.png` shows a cross-section of the sealed cell, not just the outside

If any image is incorrect, regenerate with `--force` flag and revised prompt if needed.

---

## Task 5: Bees & Wasps — Activities

**Files:**
- Modify: `data/activities.ts` (append before closing `]`)

- [ ] **Step 1: Add 13 Bees & Wasps activity definitions**

Append before the closing `]` of `ACTIVITIES` (after the gap fills added in Task 1):

```typescript
  // ── BEE OR WASP — SORT & CLASSIFY ─────────────────────────────────────────

  {
    id: 'sort-bee-wasp-y12',
    title: 'Bee or Wasp?',
    description: 'Drag each insect into the correct group.',
    template: 'sort-classify',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'honey-bee-01', role: 'item-1' },
      { image_id: 'buff-tailed-bumblebee-01', role: 'item-2' },
      { image_id: 'common-wasp-01', role: 'item-3' },
      { image_id: 'hornet-01', role: 'item-4' },
    ],
    categories: [
      { label: 'Bee', image_ids: ['honey-bee-01', 'buff-tailed-bumblebee-01'] },
      { label: 'Wasp', image_ids: ['common-wasp-01', 'hornet-01'] },
    ],
    label_pool: [],
  },
  {
    id: 'sort-bee-wasp-y34',
    title: 'Bee or Wasp?',
    description: 'Sort all eight insects. Bees are rounder and furrier; wasps have a narrow waist and smooth body.',
    template: 'sort-classify',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'honey-bee-01', role: 'item-1' },
      { image_id: 'buff-tailed-bumblebee-01', role: 'item-2' },
      { image_id: 'red-tailed-bumblebee-01', role: 'item-3' },
      { image_id: 'common-carder-bee-01', role: 'item-4' },
      { image_id: 'common-wasp-01', role: 'item-5' },
      { image_id: 'german-wasp-01', role: 'item-6' },
      { image_id: 'hornet-01', role: 'item-7' },
      { image_id: 'tree-wasp-01', role: 'item-8' },
    ],
    categories: [
      { label: 'Bee', image_ids: ['honey-bee-01', 'buff-tailed-bumblebee-01', 'red-tailed-bumblebee-01', 'common-carder-bee-01'] },
      { label: 'Wasp', image_ids: ['common-wasp-01', 'german-wasp-01', 'hornet-01', 'tree-wasp-01'] },
    ],
    label_pool: [],
  },
  {
    id: 'sort-bee-wasp-y56',
    title: 'Bee or Wasp?',
    description: 'Sort all eight insects into family groups. Bees belong to Apidae; most wasps to Vespidae.',
    template: 'sort-classify',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'honey-bee-01', role: 'item-1' },
      { image_id: 'buff-tailed-bumblebee-01', role: 'item-2' },
      { image_id: 'red-tailed-bumblebee-01', role: 'item-3' },
      { image_id: 'common-carder-bee-01', role: 'item-4' },
      { image_id: 'common-wasp-01', role: 'item-5' },
      { image_id: 'german-wasp-01', role: 'item-6' },
      { image_id: 'hornet-01', role: 'item-7' },
      { image_id: 'tree-wasp-01', role: 'item-8' },
    ],
    categories: [
      { label: 'Bee (Apidae)', image_ids: ['honey-bee-01', 'buff-tailed-bumblebee-01', 'red-tailed-bumblebee-01', 'common-carder-bee-01'] },
      { label: 'Wasp (Vespidae)', image_ids: ['common-wasp-01', 'german-wasp-01', 'hornet-01', 'tree-wasp-01'] },
    ],
    label_pool: [],
  },

  // ── NAME THE BEE — NAME & DESCRIBE ────────────────────────────────────────

  {
    id: 'name-bee-y12',
    title: 'Name the Bee',
    description: 'Drag the name labels to match each bee.',
    template: 'name-describe',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'honey-bee-01', role: 'honey-bee' },
      { image_id: 'buff-tailed-bumblebee-01', role: 'bumblebee' },
      { image_id: 'red-tailed-bumblebee-01', role: 'red-tailed' },
      { image_id: 'common-carder-bee-01', role: 'carder' },
    ],
    name_labels: {
      'honey-bee': 'Honey Bee',
      'bumblebee': 'Buff-tailed Bumblebee',
      'red-tailed': 'Red-tailed Bumblebee',
      'carder': 'Common Carder Bee',
    },
    description_labels: {
      'honey-bee': ['Makes honey'],
      'bumblebee': ['Has a yellow tail'],
      'red-tailed': ['Has a red tail'],
      'carder': ['Ginger and brown fur'],
    },
    description_box_count: 1,
    label_pool: [
      'Honey Bee', 'Buff-tailed Bumblebee', 'Red-tailed Bumblebee', 'Common Carder Bee',
      'Makes honey', 'Has a yellow tail', 'Has a red tail', 'Ginger and brown fur',
    ],
  },
  {
    id: 'name-bee-y34',
    title: 'Name the Bee',
    description: 'Name each bee and add two description labels.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'honey-bee-01', role: 'honey-bee' },
      { image_id: 'buff-tailed-bumblebee-01', role: 'bumblebee' },
      { image_id: 'red-tailed-bumblebee-01', role: 'red-tailed' },
      { image_id: 'common-carder-bee-01', role: 'carder' },
    ],
    name_labels: {
      'honey-bee': 'Honey Bee',
      'bumblebee': 'Buff-tailed Bumblebee',
      'red-tailed': 'Red-tailed Bumblebee',
      'carder': 'Common Carder Bee',
    },
    description_labels: {
      'honey-bee': ['Lives in a hive', 'Has pollen baskets on hind legs'],
      'bumblebee': ['Yellow-and-black striped', 'White or yellow tail'],
      'red-tailed': ['Black body with red tail', 'Often seen on red flowers'],
      'carder': ['Ginger-brown furry body', 'Nests in long grass'],
    },
    description_box_count: 2,
    label_pool: [
      'Honey Bee', 'Buff-tailed Bumblebee', 'Red-tailed Bumblebee', 'Common Carder Bee',
      'Lives in a hive', 'Has pollen baskets on hind legs',
      'Yellow-and-black striped', 'White or yellow tail',
      'Black body with red tail', 'Often seen on red flowers',
      'Ginger-brown furry body', 'Nests in long grass',
    ],
  },
  {
    id: 'name-bee-y56',
    title: 'Name the Bee',
    description: 'Name each bee and add three description labels, including the scientific name.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'honey-bee-01', role: 'honey-bee' },
      { image_id: 'buff-tailed-bumblebee-01', role: 'bumblebee' },
      { image_id: 'red-tailed-bumblebee-01', role: 'red-tailed' },
      { image_id: 'common-carder-bee-01', role: 'carder' },
    ],
    name_labels: {
      'honey-bee': 'Honey Bee',
      'bumblebee': 'Buff-tailed Bumblebee',
      'red-tailed': 'Red-tailed Bumblebee',
      'carder': 'Common Carder Bee',
    },
    description_labels: {
      'honey-bee': ['Apis mellifera', 'Social colony of up to 60,000', 'Carries pollen in corbiculae (pollen baskets)'],
      'bumblebee': ['Bombus terrestris', 'Produces only small amounts of honey', 'Key pollinator of clover and tomatoes'],
      'red-tailed': ['Bombus lapidarius', 'Males have yellow facial hair', 'Nests underground in dry soil'],
      'carder': ['Bombus pascuorum', 'Collects moss and grass for nesting', 'Active from March to November'],
    },
    description_box_count: 3,
    label_pool: [
      'Honey Bee', 'Buff-tailed Bumblebee', 'Red-tailed Bumblebee', 'Common Carder Bee',
      'Apis mellifera', 'Social colony of up to 60,000', 'Carries pollen in corbiculae (pollen baskets)',
      'Bombus terrestris', 'Produces only small amounts of honey', 'Key pollinator of clover and tomatoes',
      'Bombus lapidarius', 'Males have yellow facial hair', 'Nests underground in dry soil',
      'Bombus pascuorum', 'Collects moss and grass for nesting', 'Active from March to November',
    ],
  },

  // ── NAME THE WASP — NAME & DESCRIBE ───────────────────────────────────────

  {
    id: 'name-wasp-y34',
    title: 'Name the Wasp',
    description: 'Name each wasp and add two description labels.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'common-wasp-01', role: 'common-wasp' },
      { image_id: 'german-wasp-01', role: 'german-wasp' },
      { image_id: 'hornet-01', role: 'hornet' },
      { image_id: 'tree-wasp-01', role: 'tree-wasp' },
    ],
    name_labels: {
      'common-wasp': 'Common Wasp',
      'german-wasp': 'German Wasp',
      'hornet': 'Hornet',
      'tree-wasp': 'Tree Wasp',
    },
    description_labels: {
      'common-wasp': ['Yellow and black stripes', 'Anchor-shaped mark on face'],
      'german-wasp': ['Three dots on face', 'Often found in buildings'],
      'hornet': ['Much larger than a wasp', 'Brown and yellow markings'],
      'tree-wasp': ['Slender black and yellow body', 'Nests in trees or bushes'],
    },
    description_box_count: 2,
    label_pool: [
      'Common Wasp', 'German Wasp', 'Hornet', 'Tree Wasp',
      'Yellow and black stripes', 'Anchor-shaped mark on face',
      'Three dots on face', 'Often found in buildings',
      'Much larger than a wasp', 'Brown and yellow markings',
      'Slender black and yellow body', 'Nests in trees or bushes',
    ],
  },
  {
    id: 'name-wasp-y56',
    title: 'Name the Wasp',
    description: 'Name each wasp and add three description labels, including the scientific name.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'common-wasp-01', role: 'common-wasp' },
      { image_id: 'german-wasp-01', role: 'german-wasp' },
      { image_id: 'hornet-01', role: 'hornet' },
      { image_id: 'tree-wasp-01', role: 'tree-wasp' },
    ],
    name_labels: {
      'common-wasp': 'Common Wasp',
      'german-wasp': 'German Wasp',
      'hornet': 'Hornet',
      'tree-wasp': 'Tree Wasp',
    },
    description_labels: {
      'common-wasp': ['Vespula vulgaris', 'Anchor-shaped mark on face', 'Builds nests from chewed wood pulp'],
      'german-wasp': ['Vespula germanica', 'Three dots on face (not anchor)', 'Often nests in lofts and outbuildings'],
      'hornet': ['Vespa crabro', 'UK\'s largest eusocial wasp', 'Reddish-brown and yellow — not aggressive unless threatened'],
      'tree-wasp': ['Dolichovespula sylvestris', 'Usually nests in trees or bushes', 'Smaller colonies than common wasp'],
    },
    description_box_count: 3,
    label_pool: [
      'Common Wasp', 'German Wasp', 'Hornet', 'Tree Wasp',
      'Vespula vulgaris', 'Anchor-shaped mark on face', 'Builds nests from chewed wood pulp',
      'Vespula germanica', 'Three dots on face (not anchor)', 'Often nests in lofts and outbuildings',
      'Vespa crabro', 'UK\'s largest eusocial wasp', 'Reddish-brown and yellow — not aggressive unless threatened',
      'Dolichovespula sylvestris', 'Usually nests in trees or bushes', 'Smaller colonies than common wasp',
    ],
  },

  // ── BEE LIFE CYCLE — SEQUENCE ─────────────────────────────────────────────

  {
    id: 'sequence-bee-lifecycle-y12',
    title: 'Bee Life Cycle',
    description: 'Put the life cycle stages in the correct order.',
    template: 'sequence',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'bee-egg-01', role: 'egg' },
      { image_id: 'bee-larva-01', role: 'larva' },
      { image_id: 'bee-pupa-01', role: 'pupa' },
      { image_id: 'honey-bee-01', role: 'adult' },
    ],
    correct_order: ['bee-egg-01', 'bee-larva-01', 'bee-pupa-01', 'honey-bee-01'],
    stage_labels: {
      'bee-egg-01': 'Egg',
      'bee-larva-01': 'Larva',
      'bee-pupa-01': 'Pupa',
      'honey-bee-01': 'Adult',
    },
  },
  {
    id: 'sequence-bee-lifecycle-y34',
    title: 'Bee Life Cycle',
    description: 'Put the four stages of the bee life cycle in the correct order.',
    template: 'sequence',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'bee-egg-01', role: 'egg' },
      { image_id: 'bee-larva-01', role: 'larva' },
      { image_id: 'bee-pupa-01', role: 'pupa' },
      { image_id: 'honey-bee-01', role: 'adult' },
    ],
    correct_order: ['bee-egg-01', 'bee-larva-01', 'bee-pupa-01', 'honey-bee-01'],
    stage_labels: {
      'bee-egg-01': 'Egg (laid in cell)',
      'bee-larva-01': 'Larva (grub)',
      'bee-pupa-01': 'Pupa (sealed cell)',
      'honey-bee-01': 'Adult bee',
    },
  },
  {
    id: 'sequence-bee-lifecycle-y56',
    title: 'Bee Life Cycle',
    description: 'Arrange the complete metamorphosis stages in order. This is the same life cycle type as butterflies.',
    template: 'sequence',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'bee-egg-01', role: 'egg' },
      { image_id: 'bee-larva-01', role: 'larva' },
      { image_id: 'bee-pupa-01', role: 'pupa' },
      { image_id: 'honey-bee-01', role: 'adult' },
    ],
    correct_order: ['bee-egg-01', 'bee-larva-01', 'bee-pupa-01', 'honey-bee-01'],
    stage_labels: {
      'bee-egg-01': 'Egg (in hexagonal wax cell)',
      'bee-larva-01': 'Larva (fed by worker bees)',
      'bee-pupa-01': 'Pupa (cell sealed with wax)',
      'honey-bee-01': 'Adult (complete metamorphosis)',
    },
  },

  // ── PARTS OF A BEE — LABEL THE PARTS ─────────────────────────────────────

  {
    id: 'label-parts-bee-y34',
    title: 'Parts of a Bee',
    description: 'Drag the labels to the correct parts of this honey bee.',
    template: 'label-parts',
    year_groups: ['y34'],
    subjects: [{ image_id: 'honey-bee-anatomy-01', role: 'subject' }],
    callouts: [
      { role: 'head', x: 15, y: 42, label: 'Head' },
      { role: 'thorax', x: 38, y: 38, label: 'Thorax' },
      { role: 'abdomen', x: 72, y: 45, label: 'Abdomen' },
      { role: 'antennae', x: 18, y: 20, label: 'Antennae' },
      { role: 'wings', x: 45, y: 18, label: 'Wings' },
      { role: 'legs', x: 38, y: 68, label: 'Legs' },
    ],
    label_pool: ['Head', 'Thorax', 'Abdomen', 'Antennae', 'Wings', 'Legs'],
  },
  {
    id: 'label-parts-bee-y56',
    title: 'Parts of a Bee',
    description: 'Label the parts of this honey bee using the correct scientific terms.',
    template: 'label-parts',
    year_groups: ['y56'],
    subjects: [{ image_id: 'honey-bee-anatomy-01', role: 'subject' }],
    callouts: [
      { role: 'head', x: 15, y: 42, label: 'Head' },
      { role: 'thorax', x: 38, y: 38, label: 'Thorax' },
      { role: 'abdomen', x: 72, y: 45, label: 'Abdomen' },
      { role: 'antennae', x: 18, y: 20, label: 'Antennae' },
      { role: 'forewings', x: 40, y: 18, label: 'Forewings' },
      { role: 'hindwings', x: 52, y: 22, label: 'Hindwings' },
      { role: 'stinger', x: 82, y: 55, label: 'Stinger' },
      { role: 'pollen-basket', x: 48, y: 72, label: 'Pollen basket' },
    ],
    label_pool: ['Head', 'Thorax', 'Abdomen', 'Antennae', 'Forewings', 'Hindwings', 'Stinger', 'Pollen basket'],
  },
```

- [ ] **Step 2: Type-check**

```bash
cd projects/ecology && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify in dev server**

Test each new activity. For each, check interactive mode (drag-drop works), answers mode (labels placed correctly), and print mode (fits A4).

---

## Task 6: Bees & Wasps — Navigation

**Files:**
- Modify: `lib/navigation.ts`

- [ ] **Step 1: Add 5 nav entries to the `Interactive Activities` children array**

Append after the existing entries (before the closing `]` of the children array):

```typescript
      { label: 'Bee or Wasp?', href: '/activities/sort-bee-wasp-y12' },
      { label: 'Name the Bee', href: '/activities/name-bee-y12' },
      { label: 'Name the Wasp', href: '/activities/name-wasp-y34' },
      { label: 'Bee Life Cycle', href: '/activities/sequence-bee-lifecycle-y12' },
      { label: 'Parts of a Bee', href: '/activities/label-parts-bee-y34' },
```

- [ ] **Step 2: Verify nav renders**

Start dev server and check the Interactive Activities nav dropdown shows all 5 new Bees & Wasps entries.

---

## Task 7: Dragonflies & Damselflies — Image Metadata

**Files:**
- Modify: `data/activity-images.ts` (append before closing `]`)

- [ ] **Step 1: Add 12 image metadata entries**

```typescript
  // ── UK DRAGONFLIES ────────────────────────────────────────────────────────
  {
    id: 'emperor-dragonfly-01',
    filename: 'emperor-dragonfly.png',
    common_name: 'Emperor Dragonfly',
    latin_name: 'Anax imperator',
    category: 'dragonfly',
    description: 'Male, top view resting with wings spread horizontally, brilliant blue-green abdomen, clear wings',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting', 'sequencing'],
    prompt: 'Field guide illustration of an Emperor Dragonfly (Anax imperator), male, viewed from above with wings held horizontally as when resting. Show the brilliant blue abdomen with a black dorsal stripe, bright green thorax, and large clear wings with visible venation. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'four-spotted-chaser-01',
    filename: 'four-spotted-chaser.png',
    common_name: 'Four-spotted Chaser',
    latin_name: 'Libellula quadrimaculata',
    category: 'dragonfly',
    description: 'Top view, wings spread, golden-brown wings each with a distinctive dark spot at midpoint and wingtip, yellow-brown abdomen',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Four-spotted Chaser dragonfly (Libellula quadrimaculata), viewed from above with wings spread. Show the golden-brown tinted wings — each with a dark spot at midpoint and a smaller spot near the wingtip, giving four spots total. The abdomen is yellow-brown with black markings. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'common-darter-01',
    filename: 'common-darter.png',
    common_name: 'Common Darter',
    latin_name: 'Sympetrum striolatum',
    category: 'dragonfly',
    description: 'Male, side view perching on a twig, slender orange-red abdomen, clear wings',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Common Darter dragonfly (Sympetrum striolatum), male, perching on a thin twig viewed from the side. Show the slender orange-red abdomen, yellowish thorax with dark markings, and clear wings with a small yellow costa stripe. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'brown-hawker-01',
    filename: 'brown-hawker.png',
    common_name: 'Brown Hawker',
    latin_name: 'Aeshna grandis',
    category: 'dragonfly',
    description: 'Top view, wings spread, distinctive amber-tinted wings, dark brown abdomen with blue and yellow spots',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Brown Hawker dragonfly (Aeshna grandis), viewed from above with wings spread. Show the distinctive amber-tinted wings (all four wings are amber/golden), dark brown abdomen with blue and yellow spots, and large compound eyes. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  // ── UK DAMSELFLIES ────────────────────────────────────────────────────────
  {
    id: 'azure-damselfly-01',
    filename: 'azure-damselfly.png',
    common_name: 'Azure Damselfly',
    latin_name: 'Coenagrion puella',
    category: 'damselfly',
    description: 'Male, side view perching on a reed stem, wings folded along body, blue and black banded abdomen',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of an Azure Damselfly (Coenagrion puella), male, perching on a reed stem viewed from the side. Show the wings folded along the body (characteristic damselfly resting posture), bright blue abdomen with black banding, and distinctive U-shaped black mark on segment 2. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'blue-tailed-damselfly-01',
    filename: 'blue-tailed-damselfly.png',
    common_name: 'Blue-tailed Damselfly',
    latin_name: 'Ischnura elegans',
    category: 'damselfly',
    description: 'Male, side view, wings folded along body, mostly black body with a single bright blue segment near the tail tip',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Blue-tailed Damselfly (Ischnura elegans), male, perching on a stem viewed from the side. Show the wings folded along the body, a mostly black abdomen with a single distinctive bright blue segment near the tail tip (segment 8), and a green and black thorax. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'common-blue-damselfly-01',
    filename: 'common-blue-damselfly.png',
    common_name: 'Common Blue Damselfly',
    latin_name: 'Enallagma cyathigerum',
    category: 'damselfly',
    description: 'Male, side view, wings folded, bright blue with black banding, mushroom-shaped mark on segment 2',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Common Blue Damselfly (Enallagma cyathigerum), male, perching on a stem viewed from the side. Show the wings folded along the body, bright blue abdomen with black banding, and a distinctive mushroom or lollipop-shaped black mark on segment 2. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'banded-demoiselle-01',
    filename: 'banded-demoiselle.png',
    common_name: 'Banded Demoiselle',
    latin_name: 'Calopteryx splendens',
    category: 'damselfly',
    description: 'Male, wings partly open showing iridescent blue-black band across each wing, iridescent blue-green body',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Banded Demoiselle (Calopteryx splendens), male, with wings held slightly open to show the distinctive dark blue-black band across the middle of each wing. Show the iridescent metallic blue-green body. Unlike most damselflies, the wings are broad and rounded. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  // ── DRAGONFLY LIFE CYCLE ──────────────────────────────────────────────────
  {
    id: 'dragonfly-egg-01',
    filename: 'dragonfly-egg.png',
    common_name: 'Dragonfly Egg',
    latin_name: 'Anax imperator',
    category: 'dragonfly-lifecycle',
    description: 'Cluster of oval dragonfly eggs inserted into an aquatic plant stem, cutaway view showing eggs inside the stem',
    suitable_for: ['sequencing'],
    prompt: 'Scientific illustration of dragonfly eggs (Anax imperator) inserted into an aquatic plant stem, shown in partial cutaway to reveal the pale oval eggs embedded inside the stem tissue. The plant stem is submerged in water. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'dragonfly-nymph-01',
    filename: 'dragonfly-nymph.png',
    common_name: 'Dragonfly Nymph',
    latin_name: 'Anax imperator',
    category: 'dragonfly-lifecycle',
    description: 'Aquatic nymph, side view, large compound eyes, six legs, wing buds visible, gills at abdomen tip',
    suitable_for: ['sequencing'],
    prompt: 'Scientific illustration of a dragonfly nymph (Anax imperator), viewed from the side. Show the aquatic larval stage: robust body, large compound eyes, six legs, visible wing buds on the thorax, and rectal gills at the tip of the abdomen. The nymph looks like an alien-like aquatic insect — quite different from the adult. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'dragonfly-emerging-01',
    filename: 'dragonfly-emerging.png',
    common_name: 'Dragonfly Emerging',
    latin_name: 'Anax imperator',
    category: 'dragonfly-lifecycle',
    description: 'Adult dragonfly climbing out of its split nymph casing on a reed stem above water, wings unfurling',
    suitable_for: ['sequencing'],
    prompt: 'Scientific illustration of a dragonfly (Anax imperator) in the process of emerging from its nymph casing. Show the adult climbing out of the split-open empty nymph skin clinging to a reed stem above the water surface, wings just beginning to unfurl and expand. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  // ── DRAGONFLY ANATOMY ─────────────────────────────────────────────────────
  {
    id: 'dragonfly-anatomy-01',
    filename: 'dragonfly-anatomy.png',
    common_name: 'Emperor Dragonfly (anatomy)',
    latin_name: 'Anax imperator',
    category: 'dragonfly',
    description: 'Top view with wings spread, all major anatomy parts clearly visible: head with large compound eyes, thorax, elongated abdomen, forewings and hindwings, six legs',
    suitable_for: ['labelling'],
    prompt: 'Scientific illustration of an Emperor Dragonfly (Anax imperator), top view with wings fully spread for anatomical study. Clearly show: the large head dominated by compound eyes, the thorax, the long segmented abdomen, the two pairs of wings (forewings and hindwings — slightly different shape), and the six legs attached to the thorax. Wings should show clear venation. Clean white background, no text or labels, detailed natural history illustration suitable for primary school anatomy labelling.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
```

- [ ] **Step 2: Type-check**

```bash
cd projects/ecology && npx tsc --noEmit
```

---

## Task 8: Dragonflies & Damselflies — Generate Images

- [ ] **Step 1: Run image generation**

```bash
cd projects/ecology && GEMINI_API_KEY=<your-key> npx tsx scripts/generate-activity-images.ts \
  emperor-dragonfly.png four-spotted-chaser.png common-darter.png brown-hawker.png \
  azure-damselfly.png blue-tailed-damselfly.png common-blue-damselfly.png banded-demoiselle.png \
  dragonfly-egg.png dragonfly-nymph.png dragonfly-emerging.png dragonfly-anatomy.png
```

- [ ] **Step 2: Visually inspect all 12 images**

Check:
- Dragonflies shown with wings spread horizontally (resting posture)
- Damselflies shown with wings folded along body (resting posture)
- `dragonfly-nymph.png` looks aquatic and alien — not like the adult
- `dragonfly-emerging.png` shows both the empty nymph casing and the emerging adult
- `dragonfly-anatomy.png` clearly distinguishes forewings from hindwings (hindwings slightly broader at base)

---

## Task 9: Dragonflies & Damselflies — Activities

**Files:**
- Modify: `data/activities.ts` (append before closing `]`)

- [ ] **Step 1: Add 13 Dragonflies & Damselflies activity definitions**

```typescript
  // ── DRAGONFLY OR DAMSELFLY — SORT & CLASSIFY ──────────────────────────────

  {
    id: 'sort-dragonfly-damselfly-y12',
    title: 'Dragonfly or Damselfly?',
    description: 'Drag each insect into the correct group.',
    template: 'sort-classify',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'emperor-dragonfly-01', role: 'item-1' },
      { image_id: 'four-spotted-chaser-01', role: 'item-2' },
      { image_id: 'azure-damselfly-01', role: 'item-3' },
      { image_id: 'banded-demoiselle-01', role: 'item-4' },
    ],
    categories: [
      { label: 'Dragonfly', image_ids: ['emperor-dragonfly-01', 'four-spotted-chaser-01'] },
      { label: 'Damselfly', image_ids: ['azure-damselfly-01', 'banded-demoiselle-01'] },
    ],
    label_pool: [],
  },
  {
    id: 'sort-dragonfly-damselfly-y34',
    title: 'Dragonfly or Damselfly?',
    description: 'Sort all eight insects. Hint: look at where the wings are when the insect is resting.',
    template: 'sort-classify',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'emperor-dragonfly-01', role: 'item-1' },
      { image_id: 'four-spotted-chaser-01', role: 'item-2' },
      { image_id: 'common-darter-01', role: 'item-3' },
      { image_id: 'brown-hawker-01', role: 'item-4' },
      { image_id: 'azure-damselfly-01', role: 'item-5' },
      { image_id: 'blue-tailed-damselfly-01', role: 'item-6' },
      { image_id: 'common-blue-damselfly-01', role: 'item-7' },
      { image_id: 'banded-demoiselle-01', role: 'item-8' },
    ],
    categories: [
      { label: 'Dragonfly (wings out when resting)', image_ids: ['emperor-dragonfly-01', 'four-spotted-chaser-01', 'common-darter-01', 'brown-hawker-01'] },
      { label: 'Damselfly (wings folded when resting)', image_ids: ['azure-damselfly-01', 'blue-tailed-damselfly-01', 'common-blue-damselfly-01', 'banded-demoiselle-01'] },
    ],
    label_pool: [],
  },
  {
    id: 'sort-dragonfly-damselfly-y56',
    title: 'Dragonfly or Damselfly?',
    description: 'Sort all eight species into their suborders. Dragonflies are Anisoptera; damselflies are Zygoptera.',
    template: 'sort-classify',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'emperor-dragonfly-01', role: 'item-1' },
      { image_id: 'four-spotted-chaser-01', role: 'item-2' },
      { image_id: 'common-darter-01', role: 'item-3' },
      { image_id: 'brown-hawker-01', role: 'item-4' },
      { image_id: 'azure-damselfly-01', role: 'item-5' },
      { image_id: 'blue-tailed-damselfly-01', role: 'item-6' },
      { image_id: 'common-blue-damselfly-01', role: 'item-7' },
      { image_id: 'banded-demoiselle-01', role: 'item-8' },
    ],
    categories: [
      { label: 'Dragonfly (Anisoptera)', image_ids: ['emperor-dragonfly-01', 'four-spotted-chaser-01', 'common-darter-01', 'brown-hawker-01'] },
      { label: 'Damselfly (Zygoptera)', image_ids: ['azure-damselfly-01', 'blue-tailed-damselfly-01', 'common-blue-damselfly-01', 'banded-demoiselle-01'] },
    ],
    label_pool: [],
  },

  // ── NAME THE DRAGONFLY — NAME & DESCRIBE ──────────────────────────────────

  {
    id: 'name-dragonfly-y12',
    title: 'Name the Dragonfly',
    description: 'Drag the name labels to match each dragonfly.',
    template: 'name-describe',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'emperor-dragonfly-01', role: 'emperor' },
      { image_id: 'four-spotted-chaser-01', role: 'chaser' },
      { image_id: 'common-darter-01', role: 'darter' },
      { image_id: 'brown-hawker-01', role: 'hawker' },
    ],
    name_labels: {
      'emperor': 'Emperor Dragonfly',
      'chaser': 'Four-spotted Chaser',
      'darter': 'Common Darter',
      'hawker': 'Brown Hawker',
    },
    description_labels: {
      'emperor': ['Bright blue body'],
      'chaser': ['Four spots on wings'],
      'darter': ['Orange-red body'],
      'hawker': ['Brown with amber wings'],
    },
    description_box_count: 1,
    label_pool: [
      'Emperor Dragonfly', 'Four-spotted Chaser', 'Common Darter', 'Brown Hawker',
      'Bright blue body', 'Four spots on wings', 'Orange-red body', 'Brown with amber wings',
    ],
  },
  {
    id: 'name-dragonfly-y34',
    title: 'Name the Dragonfly',
    description: 'Name each dragonfly and add two description labels.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'emperor-dragonfly-01', role: 'emperor' },
      { image_id: 'four-spotted-chaser-01', role: 'chaser' },
      { image_id: 'common-darter-01', role: 'darter' },
      { image_id: 'brown-hawker-01', role: 'hawker' },
    ],
    name_labels: {
      'emperor': 'Emperor Dragonfly',
      'chaser': 'Four-spotted Chaser',
      'darter': 'Common Darter',
      'hawker': 'Brown Hawker',
    },
    description_labels: {
      'emperor': ['Bright blue and green body', 'UK\'s largest dragonfly'],
      'chaser': ['Four dark wing spots', 'Perches flat on vegetation'],
      'darter': ['Red-orange in males', 'Often perches on low stems'],
      'hawker': ['All-amber tinted wings', 'Yellow spots on dark abdomen'],
    },
    description_box_count: 2,
    label_pool: [
      'Emperor Dragonfly', 'Four-spotted Chaser', 'Common Darter', 'Brown Hawker',
      'Bright blue and green body', 'UK\'s largest dragonfly',
      'Four dark wing spots', 'Perches flat on vegetation',
      'Red-orange in males', 'Often perches on low stems',
      'All-amber tinted wings', 'Yellow spots on dark abdomen',
    ],
  },
  {
    id: 'name-dragonfly-y56',
    title: 'Name the Dragonfly',
    description: 'Name each dragonfly and add three description labels, including the scientific name.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'emperor-dragonfly-01', role: 'emperor' },
      { image_id: 'four-spotted-chaser-01', role: 'chaser' },
      { image_id: 'common-darter-01', role: 'darter' },
      { image_id: 'brown-hawker-01', role: 'hawker' },
    ],
    name_labels: {
      'emperor': 'Emperor Dragonfly',
      'chaser': 'Four-spotted Chaser',
      'darter': 'Common Darter',
      'hawker': 'Brown Hawker',
    },
    description_labels: {
      'emperor': ['Anax imperator', 'Males blue, females green', 'Hunts over open water, rarely perches'],
      'chaser': ['Libellula quadrimaculata', 'Both sexes look alike', 'Fiercely territorial over ponds'],
      'darter': ['Sympetrum striolatum', 'Most common UK dragonfly', 'Males deepen to red in autumn sunshine'],
      'hawker': ['Aeshna grandis', 'All four wings have amber tint', 'Flies along woodland rides and ponds'],
    },
    description_box_count: 3,
    label_pool: [
      'Emperor Dragonfly', 'Four-spotted Chaser', 'Common Darter', 'Brown Hawker',
      'Anax imperator', 'Males blue, females green', 'Hunts over open water, rarely perches',
      'Libellula quadrimaculata', 'Both sexes look alike', 'Fiercely territorial over ponds',
      'Sympetrum striolatum', 'Most common UK dragonfly', 'Males deepen to red in autumn sunshine',
      'Aeshna grandis', 'All four wings have amber tint', 'Flies along woodland rides and ponds',
    ],
  },

  // ── NAME THE DAMSELFLY — NAME & DESCRIBE ──────────────────────────────────

  {
    id: 'name-damselfly-y34',
    title: 'Name the Damselfly',
    description: 'Name each damselfly and add two description labels.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'azure-damselfly-01', role: 'azure' },
      { image_id: 'blue-tailed-damselfly-01', role: 'blue-tailed' },
      { image_id: 'common-blue-damselfly-01', role: 'common-blue' },
      { image_id: 'banded-demoiselle-01', role: 'demoiselle' },
    ],
    name_labels: {
      'azure': 'Azure Damselfly',
      'blue-tailed': 'Blue-tailed Damselfly',
      'common-blue': 'Common Blue Damselfly',
      'demoiselle': 'Banded Demoiselle',
    },
    description_labels: {
      'azure': ['Blue and black patterned body', 'Found near slow-moving water'],
      'blue-tailed': ['Mostly black with blue tail tip', 'Perches on waterside plants'],
      'common-blue': ['Bright blue male, brown female', 'Very common near ponds'],
      'demoiselle': ['Dark band across each wing', 'Fluttery, butterfly-like flight'],
    },
    description_box_count: 2,
    label_pool: [
      'Azure Damselfly', 'Blue-tailed Damselfly', 'Common Blue Damselfly', 'Banded Demoiselle',
      'Blue and black patterned body', 'Found near slow-moving water',
      'Mostly black with blue tail tip', 'Perches on waterside plants',
      'Bright blue male, brown female', 'Very common near ponds',
      'Dark band across each wing', 'Fluttery, butterfly-like flight',
    ],
  },
  {
    id: 'name-damselfly-y56',
    title: 'Name the Damselfly',
    description: 'Name each damselfly and add three description labels, including the scientific name.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'azure-damselfly-01', role: 'azure' },
      { image_id: 'blue-tailed-damselfly-01', role: 'blue-tailed' },
      { image_id: 'common-blue-damselfly-01', role: 'common-blue' },
      { image_id: 'banded-demoiselle-01', role: 'demoiselle' },
    ],
    name_labels: {
      'azure': 'Azure Damselfly',
      'blue-tailed': 'Blue-tailed Damselfly',
      'common-blue': 'Common Blue Damselfly',
      'demoiselle': 'Banded Demoiselle',
    },
    description_labels: {
      'azure': ['Coenagrion puella', 'U-shaped black mark on segment 2', 'One of the commonest UK damselflies'],
      'blue-tailed': ['Ischnura elegans', 'Females can be green, tan, or violet', 'Tolerates brackish and polluted water'],
      'common-blue': ['Enallagma cyathigerum', 'Mushroom-shaped mark on segment 2', 'Often seen in large numbers'],
      'demoiselle': ['Calopteryx splendens', 'Males: blue-black wing band; females: all iridescent', 'Prefers clear, fast-flowing rivers'],
    },
    description_box_count: 3,
    label_pool: [
      'Azure Damselfly', 'Blue-tailed Damselfly', 'Common Blue Damselfly', 'Banded Demoiselle',
      'Coenagrion puella', 'U-shaped black mark on segment 2', 'One of the commonest UK damselflies',
      'Ischnura elegans', 'Females can be green, tan, or violet', 'Tolerates brackish and polluted water',
      'Enallagma cyathigerum', 'Mushroom-shaped mark on segment 2', 'Often seen in large numbers',
      'Calopteryx splendens', 'Males: blue-black wing band; females: all iridescent', 'Prefers clear, fast-flowing rivers',
    ],
  },

  // ── DRAGONFLY LIFE CYCLE — SEQUENCE ───────────────────────────────────────

  {
    id: 'sequence-dragonfly-lifecycle-y12',
    title: 'Dragonfly Life Cycle',
    description: 'Put the life cycle stages in the correct order.',
    template: 'sequence',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'dragonfly-egg-01', role: 'egg' },
      { image_id: 'dragonfly-nymph-01', role: 'nymph' },
      { image_id: 'dragonfly-emerging-01', role: 'emerging' },
      { image_id: 'emperor-dragonfly-01', role: 'adult' },
    ],
    correct_order: ['dragonfly-egg-01', 'dragonfly-nymph-01', 'dragonfly-emerging-01', 'emperor-dragonfly-01'],
    stage_labels: {
      'dragonfly-egg-01': 'Egg',
      'dragonfly-nymph-01': 'Nymph',
      'dragonfly-emerging-01': 'Emerging',
      'emperor-dragonfly-01': 'Adult',
    },
  },
  {
    id: 'sequence-dragonfly-lifecycle-y34',
    title: 'Dragonfly Life Cycle',
    description: 'Put the four stages of the dragonfly life cycle in the correct order.',
    template: 'sequence',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'dragonfly-egg-01', role: 'egg' },
      { image_id: 'dragonfly-nymph-01', role: 'nymph' },
      { image_id: 'dragonfly-emerging-01', role: 'emerging' },
      { image_id: 'emperor-dragonfly-01', role: 'adult' },
    ],
    correct_order: ['dragonfly-egg-01', 'dragonfly-nymph-01', 'dragonfly-emerging-01', 'emperor-dragonfly-01'],
    stage_labels: {
      'dragonfly-egg-01': 'Egg (laid in water)',
      'dragonfly-nymph-01': 'Aquatic nymph',
      'dragonfly-emerging-01': 'Emerging adult',
      'emperor-dragonfly-01': 'Adult dragonfly',
    },
  },
  {
    id: 'sequence-dragonfly-lifecycle-y56',
    title: 'Dragonfly Life Cycle',
    description: 'Arrange the incomplete metamorphosis stages in order. Unlike butterflies, dragonflies have no pupal stage.',
    template: 'sequence',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'dragonfly-egg-01', role: 'egg' },
      { image_id: 'dragonfly-nymph-01', role: 'nymph' },
      { image_id: 'dragonfly-emerging-01', role: 'emerging' },
      { image_id: 'emperor-dragonfly-01', role: 'adult' },
    ],
    correct_order: ['dragonfly-egg-01', 'dragonfly-nymph-01', 'dragonfly-emerging-01', 'emperor-dragonfly-01'],
    stage_labels: {
      'dragonfly-egg-01': 'Egg (inserted into aquatic plant)',
      'dragonfly-nymph-01': 'Nymph (aquatic, up to 5 years)',
      'dragonfly-emerging-01': 'Emergence (splits nymph casing)',
      'emperor-dragonfly-01': 'Adult (incomplete metamorphosis)',
    },
  },

  // ── PARTS OF A DRAGONFLY — LABEL THE PARTS ────────────────────────────────

  {
    id: 'label-parts-dragonfly-y34',
    title: 'Parts of a Dragonfly',
    description: 'Drag the labels to the correct parts of this dragonfly.',
    template: 'label-parts',
    year_groups: ['y34'],
    subjects: [{ image_id: 'dragonfly-anatomy-01', role: 'subject' }],
    callouts: [
      { role: 'head', x: 10, y: 42, label: 'Head' },
      { role: 'thorax', x: 28, y: 40, label: 'Thorax' },
      { role: 'abdomen', x: 65, y: 48, label: 'Abdomen' },
      { role: 'forewings', x: 30, y: 18, label: 'Forewings' },
      { role: 'hindwings', x: 42, y: 22, label: 'Hindwings' },
      { role: 'compound-eyes', x: 10, y: 28, label: 'Compound eyes' },
    ],
    label_pool: ['Head', 'Thorax', 'Abdomen', 'Forewings', 'Hindwings', 'Compound eyes'],
  },
  {
    id: 'label-parts-dragonfly-y56',
    title: 'Parts of a Dragonfly',
    description: 'Label the parts of this dragonfly using the correct scientific terms.',
    template: 'label-parts',
    year_groups: ['y56'],
    subjects: [{ image_id: 'dragonfly-anatomy-01', role: 'subject' }],
    callouts: [
      { role: 'head', x: 10, y: 42, label: 'Head' },
      { role: 'compound-eyes', x: 10, y: 28, label: 'Compound eyes' },
      { role: 'thorax', x: 28, y: 40, label: 'Thorax' },
      { role: 'abdomen', x: 65, y: 48, label: 'Abdomen' },
      { role: 'forewings', x: 30, y: 18, label: 'Forewings' },
      { role: 'hindwings', x: 42, y: 22, label: 'Hindwings' },
      { role: 'legs', x: 28, y: 62, label: 'Legs' },
    ],
    label_pool: ['Head', 'Compound eyes', 'Thorax', 'Abdomen', 'Forewings', 'Hindwings', 'Legs'],
  },
```

- [ ] **Step 2: Type-check and verify**

```bash
cd projects/ecology && npx tsc --noEmit
```

Then visit each new activity in the dev server.

---

## Task 10: Dragonflies & Damselflies — Navigation

- [ ] **Step 1: Add 5 nav entries**

```typescript
      { label: 'Dragonfly or Damselfly?', href: '/activities/sort-dragonfly-damselfly-y12' },
      { label: 'Name the Dragonfly', href: '/activities/name-dragonfly-y12' },
      { label: 'Name the Damselfly', href: '/activities/name-damselfly-y34' },
      { label: 'Dragonfly Life Cycle', href: '/activities/sequence-dragonfly-lifecycle-y12' },
      { label: 'Parts of a Dragonfly', href: '/activities/label-parts-dragonfly-y34' },
```

---

## Task 11: Grasshoppers & Crickets — Image Metadata

**Files:**
- Modify: `data/activity-images.ts` (append before closing `]`)

- [ ] **Step 1: Add 11 image metadata entries**

```typescript
  // ── UK GRASSHOPPERS ───────────────────────────────────────────────────────
  {
    id: 'common-green-grasshopper-01',
    filename: 'common-green-grasshopper.png',
    common_name: 'Common Green Grasshopper',
    latin_name: 'Omocestus viridulus',
    category: 'grasshopper',
    description: 'Side view, bright green body, short antennae, wings folded along body',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Common Green Grasshopper (Omocestus viridulus), viewed from the side. Show the bright green body with short antennae (much shorter than the body), wings folded along the abdomen, and powerful hind legs. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'meadow-grasshopper-01',
    filename: 'meadow-grasshopper.png',
    common_name: 'Meadow Grasshopper',
    latin_name: 'Chorthippus parallelus',
    category: 'grasshopper',
    description: 'Side view, green-brown body, short antennae, reduced hindwings (flightless female)',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting', 'sequencing'],
    prompt: 'Field guide illustration of a female Meadow Grasshopper (Chorthippus parallelus), viewed from the side. Show the green-brown mottled body, short antennae, short wing stubs (female is flightless — hindwings are vestigial), and powerful hind legs. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'field-grasshopper-01',
    filename: 'field-grasshopper.png',
    common_name: 'Field Grasshopper',
    latin_name: 'Chorthippus brunneus',
    category: 'grasshopper',
    description: 'Side view, brown-grey mottled body, short antennae, full-length wings (can fly)',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Field Grasshopper (Chorthippus brunneus), viewed from the side. Show the variable brown-grey mottled body, short antennae, full-length wings reaching the abdomen tip, and powerful hind legs. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'common-groundhopper-01',
    filename: 'common-groundhopper.png',
    common_name: 'Common Ground-hopper',
    latin_name: 'Tetrix undulata',
    category: 'grasshopper',
    description: 'Top view, tiny mottled grey-brown body, pronotum extends to cover abdomen tip, looks like a tiny chip of bark',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Common Ground-hopper (Tetrix undulata), viewed from above. Show the tiny (10–15mm) mottled grey-brown body where the pronotum (back shield) extends all the way back to cover the tip of the abdomen — a distinctive feature. The insect looks like a tiny chip of bark or gravel. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  // ── UK CRICKETS ───────────────────────────────────────────────────────────
  {
    id: 'common-field-cricket-01',
    filename: 'common-field-cricket.png',
    common_name: 'Common Field Cricket',
    latin_name: 'Gryllus campestris',
    category: 'cricket',
    description: 'Side view, shiny black body, long filamentous cerci at tail, very long antennae, wings present',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Common Field Cricket (Gryllus campestris), viewed from the side. Show the shiny jet-black body with a yellow-orange patch at the wing base, very long antennae (much longer than the body), two long cerci (tails), and flat wings. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'dark-bush-cricket-01',
    filename: 'dark-bush-cricket.png',
    common_name: 'Dark Bush Cricket',
    latin_name: 'Pholidoptera griseoaptera',
    category: 'cricket',
    description: 'Side view, dark brown body, vestigial wing stubs only, very long antennae, female has curved ovipositor',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Dark Bush Cricket (Pholidoptera griseoaptera), female, viewed from the side. Show the dark brown body with only tiny vestigial wing stubs (this species is essentially flightless), very long antennae (longer than the body), and a long curved ovipositor at the tail. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'oak-bush-cricket-01',
    filename: 'oak-bush-cricket.png',
    common_name: 'Oak Bush Cricket',
    latin_name: 'Meconema thalassinum',
    category: 'cricket',
    description: 'Side view, pale green, delicate and slender, very long antennae, wings present',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of an Oak Bush Cricket (Meconema thalassinum), viewed from the side. Show the pale green, slender, delicate body with extremely long antennae (much longer than the body) and transparent wings. This species is small and fragile-looking compared to other crickets. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'speckled-bush-cricket-01',
    filename: 'speckled-bush-cricket.png',
    common_name: 'Speckled Bush Cricket',
    latin_name: 'Leptophyes punctatissima',
    category: 'cricket',
    description: 'Side view, green body densely covered in small black speckles, extremely long antennae',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Speckled Bush Cricket (Leptophyes punctatissima), viewed from the side. Show the green body densely covered in small black speckles, and extremely long filamentous antennae (at least twice the body length). The body is plump and rounded. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  // ── GRASSHOPPER LIFE CYCLE ────────────────────────────────────────────────
  {
    id: 'grasshopper-eggs-01',
    filename: 'grasshopper-eggs.png',
    common_name: 'Grasshopper Egg Pod',
    latin_name: 'Chorthippus parallelus',
    category: 'grasshopper-lifecycle',
    description: 'Cutaway view of sandy soil showing a pale sausage-shaped egg pod (ootheca) containing rows of small eggs',
    suitable_for: ['sequencing'],
    prompt: 'Scientific illustration showing a grasshopper egg pod (ootheca) in sandy soil, with a cutaway section revealing the pale yellow-white sausage-shaped pod containing rows of small oval eggs. The surrounding soil is visible as context. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'grasshopper-nymph-01',
    filename: 'grasshopper-nymph.png',
    common_name: 'Grasshopper Nymph',
    latin_name: 'Chorthippus parallelus',
    category: 'grasshopper-lifecycle',
    description: 'Side view, small grasshopper-shaped nymph without wings, looks like a miniature adult',
    suitable_for: ['sequencing'],
    prompt: 'Scientific illustration of a grasshopper nymph (Chorthippus parallelus), viewed from the side. Show a small grasshopper-shaped insect without wings — it looks like a miniature version of the adult but completely lacks wings. Show the short antennae, powerful hind legs, and segmented body. This is incomplete metamorphosis — the nymph resembles the adult throughout development. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  // ── GRASSHOPPER ANATOMY ───────────────────────────────────────────────────
  {
    id: 'grasshopper-anatomy-01',
    filename: 'grasshopper-anatomy.png',
    common_name: 'Meadow Grasshopper (anatomy)',
    latin_name: 'Chorthippus parallelus',
    category: 'grasshopper',
    description: 'Side view, all major anatomy parts clearly visible: head, pronotum, forewings (tegmina), hindwings, abdomen, antennae, powerful jumping hind legs, ovipositor (female)',
    suitable_for: ['labelling'],
    prompt: 'Scientific illustration of a female Meadow Grasshopper (Chorthippus parallelus), side view, clearly showing all major body parts for anatomical study. Show: the head with short antennae, the pronotum (saddle-shaped shield behind the head), the forewings (tegmina — leathery outer wings), hindwings (if visible), the segmented abdomen, the six legs with large powerful hind legs for jumping, and the curved ovipositor at the tail. Clean white background, no text or labels, detailed natural history illustration suitable for primary school anatomy labelling.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
```

- [ ] **Step 2: Type-check**

```bash
cd projects/ecology && npx tsc --noEmit
```

---

## Task 12: Grasshoppers & Crickets — Generate Images

- [ ] **Step 1: Run image generation**

```bash
cd projects/ecology && GEMINI_API_KEY=<your-key> npx tsx scripts/generate-activity-images.ts \
  common-green-grasshopper.png meadow-grasshopper.png field-grasshopper.png common-groundhopper.png \
  common-field-cricket.png dark-bush-cricket.png oak-bush-cricket.png speckled-bush-cricket.png \
  grasshopper-eggs.png grasshopper-nymph.png grasshopper-anatomy.png
```

- [ ] **Step 2: Visually inspect all 11 images**

Check:
- Grasshoppers have clearly SHORT antennae; crickets have LONG antennae (longer than body)
- `common-groundhopper.png` shows the pronotum extending to cover the abdomen tip
- `grasshopper-nymph.png` looks like a miniature adult — no wings at all
- `grasshopper-anatomy.png` shows pronotum, tegmina, and ovipositor clearly

---

## Task 13: Grasshoppers & Crickets — Activities

**Files:**
- Modify: `data/activities.ts` (append before closing `]`)

- [ ] **Step 1: Add 11 Grasshoppers & Crickets activity definitions**

```typescript
  // ── GRASSHOPPER OR CRICKET — SORT & CLASSIFY ──────────────────────────────

  {
    id: 'sort-grasshopper-cricket-y12',
    title: 'Grasshopper or Cricket?',
    description: 'Drag each insect into the correct group.',
    template: 'sort-classify',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'meadow-grasshopper-01', role: 'item-1' },
      { image_id: 'field-grasshopper-01', role: 'item-2' },
      { image_id: 'common-field-cricket-01', role: 'item-3' },
      { image_id: 'dark-bush-cricket-01', role: 'item-4' },
    ],
    categories: [
      { label: 'Grasshopper', image_ids: ['meadow-grasshopper-01', 'field-grasshopper-01'] },
      { label: 'Cricket', image_ids: ['common-field-cricket-01', 'dark-bush-cricket-01'] },
    ],
    label_pool: [],
  },
  {
    id: 'sort-grasshopper-cricket-y34',
    title: 'Grasshopper or Cricket?',
    description: 'Sort all eight insects. Hint: look at the length of the antennae.',
    template: 'sort-classify',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'common-green-grasshopper-01', role: 'item-1' },
      { image_id: 'meadow-grasshopper-01', role: 'item-2' },
      { image_id: 'field-grasshopper-01', role: 'item-3' },
      { image_id: 'common-groundhopper-01', role: 'item-4' },
      { image_id: 'common-field-cricket-01', role: 'item-5' },
      { image_id: 'dark-bush-cricket-01', role: 'item-6' },
      { image_id: 'oak-bush-cricket-01', role: 'item-7' },
      { image_id: 'speckled-bush-cricket-01', role: 'item-8' },
    ],
    categories: [
      { label: 'Grasshopper (short antennae)', image_ids: ['common-green-grasshopper-01', 'meadow-grasshopper-01', 'field-grasshopper-01', 'common-groundhopper-01'] },
      { label: 'Cricket (long antennae)', image_ids: ['common-field-cricket-01', 'dark-bush-cricket-01', 'oak-bush-cricket-01', 'speckled-bush-cricket-01'] },
    ],
    label_pool: [],
  },
  {
    id: 'sort-grasshopper-cricket-y56',
    title: 'Grasshopper or Cricket?',
    description: 'Sort all eight insects. Crickets\' antennae are longer than their body; grasshoppers\' antennae are much shorter.',
    template: 'sort-classify',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'common-green-grasshopper-01', role: 'item-1' },
      { image_id: 'meadow-grasshopper-01', role: 'item-2' },
      { image_id: 'field-grasshopper-01', role: 'item-3' },
      { image_id: 'common-groundhopper-01', role: 'item-4' },
      { image_id: 'common-field-cricket-01', role: 'item-5' },
      { image_id: 'dark-bush-cricket-01', role: 'item-6' },
      { image_id: 'oak-bush-cricket-01', role: 'item-7' },
      { image_id: 'speckled-bush-cricket-01', role: 'item-8' },
    ],
    categories: [
      { label: 'Grasshopper (Acrididae / Tetrigidae)', image_ids: ['common-green-grasshopper-01', 'meadow-grasshopper-01', 'field-grasshopper-01', 'common-groundhopper-01'] },
      { label: 'Cricket (Gryllidae / Tettigoniidae)', image_ids: ['common-field-cricket-01', 'dark-bush-cricket-01', 'oak-bush-cricket-01', 'speckled-bush-cricket-01'] },
    ],
    label_pool: [],
  },

  // ── NAME THE GRASSHOPPER — NAME & DESCRIBE ────────────────────────────────

  {
    id: 'name-grasshopper-y34',
    title: 'Name the Grasshopper',
    description: 'Name each grasshopper and add two description labels.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'common-green-grasshopper-01', role: 'green' },
      { image_id: 'meadow-grasshopper-01', role: 'meadow' },
      { image_id: 'field-grasshopper-01', role: 'field' },
      { image_id: 'common-groundhopper-01', role: 'groundhopper' },
    ],
    name_labels: {
      'green': 'Common Green Grasshopper',
      'meadow': 'Meadow Grasshopper',
      'field': 'Field Grasshopper',
      'groundhopper': 'Common Ground-hopper',
    },
    description_labels: {
      'green': ['Bright green body', 'Found in long grass'],
      'meadow': ['Short wings — cannot fly far', 'Common in meadows and verges'],
      'field': ['Variable brown colouring', 'Can fly — fully-winged'],
      'groundhopper': ['Tiny and well camouflaged', 'Pronotum covers the abdomen'],
    },
    description_box_count: 2,
    label_pool: [
      'Common Green Grasshopper', 'Meadow Grasshopper', 'Field Grasshopper', 'Common Ground-hopper',
      'Bright green body', 'Found in long grass',
      'Short wings — cannot fly far', 'Common in meadows and verges',
      'Variable brown colouring', 'Can fly — fully-winged',
      'Tiny and well camouflaged', 'Pronotum covers the abdomen',
    ],
  },
  {
    id: 'name-grasshopper-y56',
    title: 'Name the Grasshopper',
    description: 'Name each grasshopper and add three description labels, including the scientific name.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'common-green-grasshopper-01', role: 'green' },
      { image_id: 'meadow-grasshopper-01', role: 'meadow' },
      { image_id: 'field-grasshopper-01', role: 'field' },
      { image_id: 'common-groundhopper-01', role: 'groundhopper' },
    ],
    name_labels: {
      'green': 'Common Green Grasshopper',
      'meadow': 'Meadow Grasshopper',
      'field': 'Field Grasshopper',
      'groundhopper': 'Common Ground-hopper',
    },
    description_labels: {
      'green': ['Omocestus viridulus', 'Stridulates by rubbing hind legs on forewings', 'Bright green with some brown variation'],
      'meadow': ['Chorthippus parallelus', 'Females have reduced hindwings and cannot fly', 'Very common in unimproved grassland'],
      'field': ['Chorthippus brunneus', 'Males have fully developed wings and can fly', 'Prefers dry, warm, short grassland'],
      'groundhopper': ['Tetrix undulata', 'Pronotum (back shield) reaches tip of abdomen', 'Active in early spring — unlike most grasshoppers'],
    },
    description_box_count: 3,
    label_pool: [
      'Common Green Grasshopper', 'Meadow Grasshopper', 'Field Grasshopper', 'Common Ground-hopper',
      'Omocestus viridulus', 'Stridulates by rubbing hind legs on forewings', 'Bright green with some brown variation',
      'Chorthippus parallelus', 'Females have reduced hindwings and cannot fly', 'Very common in unimproved grassland',
      'Chorthippus brunneus', 'Males have fully developed wings and can fly', 'Prefers dry, warm, short grassland',
      'Tetrix undulata', 'Pronotum (back shield) reaches tip of abdomen', 'Active in early spring — unlike most grasshoppers',
    ],
  },

  // ── NAME THE CRICKET — NAME & DESCRIBE ────────────────────────────────────

  {
    id: 'name-cricket-y34',
    title: 'Name the Cricket',
    description: 'Name each cricket and add two description labels.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'common-field-cricket-01', role: 'field-cricket' },
      { image_id: 'dark-bush-cricket-01', role: 'dark-bush' },
      { image_id: 'oak-bush-cricket-01', role: 'oak-bush' },
      { image_id: 'speckled-bush-cricket-01', role: 'speckled' },
    ],
    name_labels: {
      'field-cricket': 'Common Field Cricket',
      'dark-bush': 'Dark Bush Cricket',
      'oak-bush': 'Oak Bush Cricket',
      'speckled': 'Speckled Bush Cricket',
    },
    description_labels: {
      'field-cricket': ['Shiny black body', 'Loud chirp heard in summer'],
      'dark-bush': ['Dark brown, almost wingless', 'Found in hedgerows and scrub'],
      'oak-bush': ['Pale green and fragile', 'Lives in tree canopies'],
      'speckled': ['Green with black speckles', 'Very long antennae'],
    },
    description_box_count: 2,
    label_pool: [
      'Common Field Cricket', 'Dark Bush Cricket', 'Oak Bush Cricket', 'Speckled Bush Cricket',
      'Shiny black body', 'Loud chirp heard in summer',
      'Dark brown, almost wingless', 'Found in hedgerows and scrub',
      'Pale green and fragile', 'Lives in tree canopies',
      'Green with black speckles', 'Very long antennae',
    ],
  },
  {
    id: 'name-cricket-y56',
    title: 'Name the Cricket',
    description: 'Name each cricket and add three description labels, including the scientific name.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'common-field-cricket-01', role: 'field-cricket' },
      { image_id: 'dark-bush-cricket-01', role: 'dark-bush' },
      { image_id: 'oak-bush-cricket-01', role: 'oak-bush' },
      { image_id: 'speckled-bush-cricket-01', role: 'speckled' },
    ],
    name_labels: {
      'field-cricket': 'Common Field Cricket',
      'dark-bush': 'Dark Bush Cricket',
      'oak-bush': 'Oak Bush Cricket',
      'speckled': 'Speckled Bush Cricket',
    },
    description_labels: {
      'field-cricket': ['Gryllus campestris', 'Now very rare — mainly found in Sussex', 'Males sing from burrow entrances'],
      'dark-bush': ['Pholidoptera griseoaptera', 'Flightless — only tiny wing stubs remain', 'Females have a long curved ovipositor'],
      'oak-bush': ['Meconema thalassinum', 'Silent — drums on leaves rather than chirping', 'Hunts small invertebrates at night'],
      'speckled': ['Leptophyes punctatissima', 'Antennae twice the body length', 'Calls at ultrasonic frequencies'],
    },
    description_box_count: 3,
    label_pool: [
      'Common Field Cricket', 'Dark Bush Cricket', 'Oak Bush Cricket', 'Speckled Bush Cricket',
      'Gryllus campestris', 'Now very rare — mainly found in Sussex', 'Males sing from burrow entrances',
      'Pholidoptera griseoaptera', 'Flightless — only tiny wing stubs remain', 'Females have a long curved ovipositor',
      'Meconema thalassinum', 'Silent — drums on leaves rather than chirping', 'Hunts small invertebrates at night',
      'Leptophyes punctatissima', 'Antennae twice the body length', 'Calls at ultrasonic frequencies',
    ],
  },

  // ── GRASSHOPPER LIFE CYCLE — SEQUENCE ─────────────────────────────────────

  {
    id: 'sequence-grasshopper-lifecycle-y34',
    title: 'Grasshopper Life Cycle',
    description: 'Put the three stages of the grasshopper life cycle in the correct order.',
    template: 'sequence',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'grasshopper-eggs-01', role: 'eggs' },
      { image_id: 'grasshopper-nymph-01', role: 'nymph' },
      { image_id: 'meadow-grasshopper-01', role: 'adult' },
    ],
    correct_order: ['grasshopper-eggs-01', 'grasshopper-nymph-01', 'meadow-grasshopper-01'],
    stage_labels: {
      'grasshopper-eggs-01': 'Egg pod (in soil)',
      'grasshopper-nymph-01': 'Nymph (wingless)',
      'meadow-grasshopper-01': 'Adult grasshopper',
    },
  },
  {
    id: 'sequence-grasshopper-lifecycle-y56',
    title: 'Grasshopper Life Cycle',
    description: 'Arrange the incomplete metamorphosis stages in order. There is no pupal stage — compare with the butterfly life cycle.',
    template: 'sequence',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'grasshopper-eggs-01', role: 'eggs' },
      { image_id: 'grasshopper-nymph-01', role: 'nymph' },
      { image_id: 'meadow-grasshopper-01', role: 'adult' },
    ],
    correct_order: ['grasshopper-eggs-01', 'grasshopper-nymph-01', 'meadow-grasshopper-01'],
    stage_labels: {
      'grasshopper-eggs-01': 'Egg pod (ootheca) in soil',
      'grasshopper-nymph-01': 'Nymph (instar — resembles adult)',
      'meadow-grasshopper-01': 'Adult (incomplete metamorphosis)',
    },
  },

  // ── PARTS OF A GRASSHOPPER — LABEL THE PARTS ──────────────────────────────

  {
    id: 'label-parts-grasshopper-y34',
    title: 'Parts of a Grasshopper',
    description: 'Drag the labels to the correct parts of this grasshopper.',
    template: 'label-parts',
    year_groups: ['y34'],
    subjects: [{ image_id: 'grasshopper-anatomy-01', role: 'subject' }],
    callouts: [
      { role: 'head', x: 12, y: 42, label: 'Head' },
      { role: 'pronotum', x: 28, y: 35, label: 'Pronotum' },
      { role: 'abdomen', x: 65, y: 45, label: 'Abdomen' },
      { role: 'antennae', x: 15, y: 22, label: 'Antennae' },
      { role: 'jumping-legs', x: 60, y: 68, label: 'Jumping legs' },
      { role: 'forewings', x: 45, y: 35, label: 'Forewings' },
    ],
    label_pool: ['Head', 'Pronotum', 'Abdomen', 'Antennae', 'Jumping legs', 'Forewings'],
  },
  {
    id: 'label-parts-grasshopper-y56',
    title: 'Parts of a Grasshopper',
    description: 'Label the parts of this grasshopper using the correct scientific terms.',
    template: 'label-parts',
    year_groups: ['y56'],
    subjects: [{ image_id: 'grasshopper-anatomy-01', role: 'subject' }],
    callouts: [
      { role: 'head', x: 12, y: 42, label: 'Head' },
      { role: 'pronotum', x: 28, y: 35, label: 'Pronotum' },
      { role: 'forewings', x: 45, y: 35, label: 'Forewings (tegmina)' },
      { role: 'hindwings', x: 50, y: 28, label: 'Hindwings' },
      { role: 'abdomen', x: 65, y: 45, label: 'Abdomen' },
      { role: 'antennae', x: 15, y: 22, label: 'Antennae' },
      { role: 'jumping-legs', x: 60, y: 68, label: 'Jumping legs (femur)' },
      { role: 'ovipositor', x: 82, y: 58, label: 'Ovipositor (female)' },
    ],
    label_pool: ['Head', 'Pronotum', 'Forewings (tegmina)', 'Hindwings', 'Abdomen', 'Antennae', 'Jumping legs (femur)', 'Ovipositor (female)'],
  },
```

- [ ] **Step 2: Type-check and verify**

```bash
cd projects/ecology && npx tsc --noEmit
```

---

## Task 14: Grasshoppers & Crickets — Navigation

- [ ] **Step 1: Add 5 nav entries**

```typescript
      { label: 'Grasshopper or Cricket?', href: '/activities/sort-grasshopper-cricket-y12' },
      { label: 'Name the Grasshopper', href: '/activities/name-grasshopper-y34' },
      { label: 'Name the Cricket', href: '/activities/name-cricket-y34' },
      { label: 'Grasshopper Life Cycle', href: '/activities/sequence-grasshopper-lifecycle-y34' },
      { label: 'Parts of a Grasshopper', href: '/activities/label-parts-grasshopper-y34' },
```

---

## Task 15: Centipedes & Millipedes — Image Metadata

**Files:**
- Modify: `data/activity-images.ts` (append before closing `]`)

- [ ] **Step 1: Add 9 image metadata entries**

```typescript
  // ── UK CENTIPEDES ─────────────────────────────────────────────────────────
  {
    id: 'common-centipede-01',
    filename: 'common-centipede.png',
    common_name: 'Common Centipede',
    latin_name: 'Lithobius forficatus',
    category: 'centipede',
    description: 'Top view, reddish-brown body with 15 pairs of legs clearly visible, large head with antennae, forcipules at front',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Common Centipede (Lithobius forficatus), viewed from above. Show the reddish-brown flattened body with 15 pairs of legs (one pair per segment), a distinct head with medium-length antennae, and prominent forcipules (poison claws) at the front. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'stone-centipede-01',
    filename: 'stone-centipede.png',
    common_name: 'Stone Centipede',
    latin_name: 'Lithobius variegatus',
    category: 'centipede',
    description: 'Top view, similar to common centipede but with mottled brown-yellow colouring, slightly smaller',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Stone Centipede (Lithobius variegatus), viewed from above. Show the flattened body with 15 pairs of legs, similar in form to Lithobius forficatus but with slightly more mottled brown and yellowish colouring. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'soil-centipede-01',
    filename: 'soil-centipede.png',
    common_name: 'Soil Centipede',
    latin_name: 'Geophilus carpophagus',
    category: 'centipede',
    description: 'Top view, very long and slender pale yellowish body with many leg pairs, worm-like in overall shape',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Soil Centipede (Geophilus carpophagus), viewed from above. Show the very long, slender, worm-like pale yellowish-brown body with numerous pairs of legs (30–90 pairs). The body is much more elongated and snake-like than Lithobius species. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'banded-centipede-01',
    filename: 'banded-centipede.png',
    common_name: 'Banded Centipede',
    latin_name: 'Haplophilus subterraneus',
    category: 'centipede',
    description: 'Top view, pale yellowish body with darker lateral banding along each segment, long and slender',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Banded Centipede (Haplophilus subterraneus), viewed from above. Show the long, slender pale yellowish body with a distinctive darker lateral stripe or banding pattern along the sides of each segment. Similar in overall form to Geophilus but with visible banding. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  // ── UK MILLIPEDES ─────────────────────────────────────────────────────────
  {
    id: 'white-legged-snake-millipede-01',
    filename: 'white-legged-snake-millipede.png',
    common_name: 'White-legged Snake Millipede',
    latin_name: 'Tachypodoiulus niger',
    category: 'millipede',
    description: 'Side view, glossy black cylindrical body with white legs, slightly coiled, two leg pairs per segment',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a White-legged Snake Millipede (Tachypodoiulus niger), viewed from slightly above and the side. Show the glossy black, cylindrical body with contrasting white or pale legs (two pairs per segment). The body is smooth and rounded in cross-section. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'flat-backed-millipede-01',
    filename: 'flat-backed-millipede.png',
    common_name: 'Flat-backed Millipede',
    latin_name: 'Polydesmus angustus',
    category: 'millipede',
    description: 'Top view, flat brown body with prominent lateral keels (side flanges) on each segment, two leg pairs per segment',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Flat-backed Millipede (Polydesmus angustus), viewed from above. Show the flat, broad, brown body with prominent lateral flanges (keels) projecting from the sides of each segment — giving it a distinctly flat appearance unlike the cylindrical snake millipede. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'pill-millipede-01',
    filename: 'pill-millipede.png',
    common_name: 'Pill Millipede',
    latin_name: 'Glomeris marginata',
    category: 'millipede',
    description: 'Rolled into a tight ball, glossy black-grey with pale margins on each segment, looks like a large woodlouse ball',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Pill Millipede (Glomeris marginata), rolled into a tight defensive ball. Show the glossy dark grey-black body with pale cream or white margins along the edges of each visible segment plate. Show both the rolled ball form and (smaller, inset) the unrolled millipede to show the many legs. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  {
    id: 'spotted-snake-millipede-01',
    filename: 'spotted-snake-millipede.png',
    common_name: 'Spotted Snake Millipede',
    latin_name: 'Blaniulus guttulatus',
    category: 'millipede',
    description: 'Top view, tiny pale cream body with a row of distinctive dark reddish-brown spots along each side',
    suitable_for: ['naming', 'describing', 'comparing', 'sorting'],
    prompt: 'Field guide illustration of a Spotted Snake Millipede (Blaniulus guttulatus), viewed from above. Show the tiny (10–18mm), pale cream or white cylindrical body with a row of distinctive reddish-brown or dark spots running along each side of the body. Clean white background, no text or labels, accurate natural history illustration style, suitable for primary school children.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
  // ── CENTIPEDE ANATOMY ─────────────────────────────────────────────────────
  {
    id: 'centipede-anatomy-01',
    filename: 'centipede-anatomy.png',
    common_name: 'Common Centipede (anatomy)',
    latin_name: 'Lithobius forficatus',
    category: 'centipede',
    description: 'Top view, all major anatomy parts clearly visible: head with antennae, forcipules (poison claws), body segments with one leg pair each, last pair of legs (longest)',
    suitable_for: ['labelling'],
    prompt: 'Scientific illustration of a Common Centipede (Lithobius forficatus), top view, clearly showing all major body parts for anatomical study. Show: the distinct head with medium-length antennae, prominent forcipules (modified front legs used as venom claws) clearly visible at the front, body segments each with exactly one pair of legs, and the last pair of legs which are the longest (used as sensory organs). Clean white background, no text or labels, detailed natural history illustration suitable for primary school anatomy labelling.',
    prompt_model: 'imagen-4.0-generate-001',
    prompt_date: '2026-04-27',
    prompt_version: 1,
  },
```

- [ ] **Step 2: Type-check**

```bash
cd projects/ecology && npx tsc --noEmit
```

---

## Task 16: Centipedes & Millipedes — Generate Images

- [ ] **Step 1: Run image generation**

```bash
cd projects/ecology && GEMINI_API_KEY=<your-key> npx tsx scripts/generate-activity-images.ts \
  common-centipede.png stone-centipede.png soil-centipede.png banded-centipede.png \
  white-legged-snake-millipede.png flat-backed-millipede.png pill-millipede.png spotted-snake-millipede.png \
  centipede-anatomy.png
```

- [ ] **Step 2: Visually inspect all 9 images**

Check:
- Centipedes clearly show ONE pair of legs per segment
- Millipedes clearly show TWO pairs of legs per segment (may be subtle in images — acceptable)
- `soil-centipede.png` and `banded-centipede.png` look distinctly worm-like and elongated compared to `common-centipede.png`
- `pill-millipede.png` shows the rolled ball form prominently
- `centipede-anatomy.png` shows the forcipules clearly at the front

---

## Task 17: Centipedes & Millipedes — Activities

**Files:**
- Modify: `data/activities.ts` (append before closing `]`)

- [ ] **Step 1: Add 9 Centipedes & Millipedes activity definitions**

```typescript
  // ── CENTIPEDE OR MILLIPEDE — SORT & CLASSIFY ──────────────────────────────

  {
    id: 'sort-centipede-millipede-y12',
    title: 'Centipede or Millipede?',
    description: 'Drag each creature into the correct group.',
    template: 'sort-classify',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'common-centipede-01', role: 'item-1' },
      { image_id: 'stone-centipede-01', role: 'item-2' },
      { image_id: 'white-legged-snake-millipede-01', role: 'item-3' },
      { image_id: 'pill-millipede-01', role: 'item-4' },
    ],
    categories: [
      { label: 'Centipede', image_ids: ['common-centipede-01', 'stone-centipede-01'] },
      { label: 'Millipede', image_ids: ['white-legged-snake-millipede-01', 'pill-millipede-01'] },
    ],
    label_pool: [],
  },
  {
    id: 'sort-centipede-millipede-y34',
    title: 'Centipede or Millipede?',
    description: 'Sort all eight creatures. Hint: count the leg pairs per body segment.',
    template: 'sort-classify',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'common-centipede-01', role: 'item-1' },
      { image_id: 'stone-centipede-01', role: 'item-2' },
      { image_id: 'soil-centipede-01', role: 'item-3' },
      { image_id: 'banded-centipede-01', role: 'item-4' },
      { image_id: 'white-legged-snake-millipede-01', role: 'item-5' },
      { image_id: 'flat-backed-millipede-01', role: 'item-6' },
      { image_id: 'pill-millipede-01', role: 'item-7' },
      { image_id: 'spotted-snake-millipede-01', role: 'item-8' },
    ],
    categories: [
      { label: 'Centipede (1 leg pair per segment)', image_ids: ['common-centipede-01', 'stone-centipede-01', 'soil-centipede-01', 'banded-centipede-01'] },
      { label: 'Millipede (2 leg pairs per segment)', image_ids: ['white-legged-snake-millipede-01', 'flat-backed-millipede-01', 'pill-millipede-01', 'spotted-snake-millipede-01'] },
    ],
    label_pool: [],
  },
  {
    id: 'sort-centipede-millipede-y56',
    title: 'Centipede or Millipede?',
    description: 'Sort all eight creatures. Centipedes (Chilopoda) are predators with one leg pair per segment; millipedes (Diplopoda) are detritivores with two pairs.',
    template: 'sort-classify',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'common-centipede-01', role: 'item-1' },
      { image_id: 'stone-centipede-01', role: 'item-2' },
      { image_id: 'soil-centipede-01', role: 'item-3' },
      { image_id: 'banded-centipede-01', role: 'item-4' },
      { image_id: 'white-legged-snake-millipede-01', role: 'item-5' },
      { image_id: 'flat-backed-millipede-01', role: 'item-6' },
      { image_id: 'pill-millipede-01', role: 'item-7' },
      { image_id: 'spotted-snake-millipede-01', role: 'item-8' },
    ],
    categories: [
      { label: 'Centipede (Chilopoda)', image_ids: ['common-centipede-01', 'stone-centipede-01', 'soil-centipede-01', 'banded-centipede-01'] },
      { label: 'Millipede (Diplopoda)', image_ids: ['white-legged-snake-millipede-01', 'flat-backed-millipede-01', 'pill-millipede-01', 'spotted-snake-millipede-01'] },
    ],
    label_pool: [],
  },

  // ── NAME THE CENTIPEDE — NAME & DESCRIBE ──────────────────────────────────

  {
    id: 'name-centipede-y34',
    title: 'Name the Centipede',
    description: 'Name each centipede and add two description labels.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'common-centipede-01', role: 'common' },
      { image_id: 'stone-centipede-01', role: 'stone' },
      { image_id: 'soil-centipede-01', role: 'soil' },
      { image_id: 'banded-centipede-01', role: 'banded' },
    ],
    name_labels: {
      'common': 'Common Centipede',
      'stone': 'Stone Centipede',
      'soil': 'Soil Centipede',
      'banded': 'Banded Centipede',
    },
    description_labels: {
      'common': ['Reddish-brown, 15 leg pairs', 'Found under logs and stones'],
      'stone': ['Similar to common centipede', 'Shorter and more robust body'],
      'soil': ['Very long and slender', 'Lives deep in soil'],
      'banded': ['Pale with darker banding', 'Prefers dry sandy soils'],
    },
    description_box_count: 2,
    label_pool: [
      'Common Centipede', 'Stone Centipede', 'Soil Centipede', 'Banded Centipede',
      'Reddish-brown, 15 leg pairs', 'Found under logs and stones',
      'Similar to common centipede', 'Shorter and more robust body',
      'Very long and slender', 'Lives deep in soil',
      'Pale with darker banding', 'Prefers dry sandy soils',
    ],
  },
  {
    id: 'name-centipede-y56',
    title: 'Name the Centipede',
    description: 'Name each centipede and add three description labels, including the scientific name.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'common-centipede-01', role: 'common' },
      { image_id: 'stone-centipede-01', role: 'stone' },
      { image_id: 'soil-centipede-01', role: 'soil' },
      { image_id: 'banded-centipede-01', role: 'banded' },
    ],
    name_labels: {
      'common': 'Common Centipede',
      'stone': 'Stone Centipede',
      'soil': 'Soil Centipede',
      'banded': 'Banded Centipede',
    },
    description_labels: {
      'common': ['Lithobius forficatus', 'Always has exactly 15 leg pairs as adult', 'Uses forcipules (venom claws) to catch prey'],
      'stone': ['Lithobius variegatus', 'Similar to L. forficatus but more mottled', 'Prefers damper microhabitats under stones'],
      'soil': ['Geophilus carpophagus', 'Up to 90 leg pairs — number varies by individual', 'Burrows through soil in pursuit of earthworms'],
      'banded': ['Haplophilus subterraneus', 'Long, pale body with lateral dark banding', 'Lives in dry subterranean tunnels'],
    },
    description_box_count: 3,
    label_pool: [
      'Common Centipede', 'Stone Centipede', 'Soil Centipede', 'Banded Centipede',
      'Lithobius forficatus', 'Always has exactly 15 leg pairs as adult', 'Uses forcipules (venom claws) to catch prey',
      'Lithobius variegatus', 'Similar to L. forficatus but more mottled', 'Prefers damper microhabitats under stones',
      'Geophilus carpophagus', 'Up to 90 leg pairs — number varies by individual', 'Burrows through soil in pursuit of earthworms',
      'Haplophilus subterraneus', 'Long, pale body with lateral dark banding', 'Lives in dry subterranean tunnels',
    ],
  },

  // ── NAME THE MILLIPEDE — NAME & DESCRIBE ──────────────────────────────────

  {
    id: 'name-millipede-y34',
    title: 'Name the Millipede',
    description: 'Name each millipede and add two description labels.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'white-legged-snake-millipede-01', role: 'snake' },
      { image_id: 'flat-backed-millipede-01', role: 'flat-backed' },
      { image_id: 'pill-millipede-01', role: 'pill' },
      { image_id: 'spotted-snake-millipede-01', role: 'spotted' },
    ],
    name_labels: {
      'snake': 'White-legged Snake Millipede',
      'flat-backed': 'Flat-backed Millipede',
      'pill': 'Pill Millipede',
      'spotted': 'Spotted Snake Millipede',
    },
    description_labels: {
      'snake': ['Black body with white legs', 'Coils into a loose spiral when disturbed'],
      'flat-backed': ['Flat body with side flanges', 'Lives under bark and in leaf litter'],
      'pill': ['Rolls into a tight ball', 'Looks similar to a woodlouse when rolled up'],
      'spotted': ['Pale with a row of dark spots', 'Can damage root crops and bulbs'],
    },
    description_box_count: 2,
    label_pool: [
      'White-legged Snake Millipede', 'Flat-backed Millipede', 'Pill Millipede', 'Spotted Snake Millipede',
      'Black body with white legs', 'Coils into a loose spiral when disturbed',
      'Flat body with side flanges', 'Lives under bark and in leaf litter',
      'Rolls into a tight ball', 'Looks similar to a woodlouse when rolled up',
      'Pale with a row of dark spots', 'Can damage root crops and bulbs',
    ],
  },
  {
    id: 'name-millipede-y56',
    title: 'Name the Millipede',
    description: 'Name each millipede and add three description labels, including the scientific name.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'white-legged-snake-millipede-01', role: 'snake' },
      { image_id: 'flat-backed-millipede-01', role: 'flat-backed' },
      { image_id: 'pill-millipede-01', role: 'pill' },
      { image_id: 'spotted-snake-millipede-01', role: 'spotted' },
    ],
    name_labels: {
      'snake': 'White-legged Snake Millipede',
      'flat-backed': 'Flat-backed Millipede',
      'pill': 'Pill Millipede',
      'spotted': 'Spotted Snake Millipede',
    },
    description_labels: {
      'snake': ['Tachypodoiulus niger', 'Up to 50mm long with up to 60 leg pairs', 'Feeds on decaying plant material'],
      'flat-backed': ['Polydesmus angustus', 'Lateral keels give the flat-backed appearance', 'Produces hydrogen cyanide as a defence'],
      'pill': ['Glomeris marginata', 'Rolls into a sphere — unlike woodlouse (7 plates)', 'Not closely related to woodlice despite similarity'],
      'spotted': ['Blaniulus guttulatus', 'Tiny — only 10–18mm long', 'Can be a minor pest of potato tubers and strawberries'],
    },
    description_box_count: 3,
    label_pool: [
      'White-legged Snake Millipede', 'Flat-backed Millipede', 'Pill Millipede', 'Spotted Snake Millipede',
      'Tachypodoiulus niger', 'Up to 50mm long with up to 60 leg pairs', 'Feeds on decaying plant material',
      'Polydesmus angustus', 'Lateral keels give the flat-backed appearance', 'Produces hydrogen cyanide as a defence',
      'Glomeris marginata', 'Rolls into a sphere — unlike woodlouse (7 plates)', 'Not closely related to woodlice despite similarity',
      'Blaniulus guttulatus', 'Tiny — only 10–18mm long', 'Can be a minor pest of potato tubers and strawberries',
    ],
  },

  // ── PARTS OF A CENTIPEDE — LABEL THE PARTS ────────────────────────────────

  {
    id: 'label-parts-centipede-y34',
    title: 'Parts of a Centipede',
    description: 'Drag the labels to the correct parts of this centipede.',
    template: 'label-parts',
    year_groups: ['y34'],
    subjects: [{ image_id: 'centipede-anatomy-01', role: 'subject' }],
    callouts: [
      { role: 'head', x: 8, y: 42, label: 'Head' },
      { role: 'antennae', x: 8, y: 28, label: 'Antennae' },
      { role: 'forcipules', x: 12, y: 58, label: 'Forcipules' },
      { role: 'body-segments', x: 50, y: 42, label: 'Body segments' },
      { role: 'legs', x: 35, y: 62, label: 'Legs' },
    ],
    label_pool: ['Head', 'Antennae', 'Forcipules', 'Body segments', 'Legs'],
  },
  {
    id: 'label-parts-centipede-y56',
    title: 'Parts of a Centipede',
    description: 'Label the parts of this centipede. The forcipules are modified legs — the centipede uses them to inject venom.',
    template: 'label-parts',
    year_groups: ['y56'],
    subjects: [{ image_id: 'centipede-anatomy-01', role: 'subject' }],
    callouts: [
      { role: 'head', x: 8, y: 42, label: 'Head' },
      { role: 'antennae', x: 8, y: 28, label: 'Antennae' },
      { role: 'forcipules', x: 12, y: 58, label: 'Forcipules (venom claws)' },
      { role: 'body-segments', x: 50, y: 42, label: 'Body segments' },
      { role: 'legs', x: 35, y: 62, label: 'Legs (one pair per segment)' },
      { role: 'last-legs', x: 88, y: 62, label: 'Last legs (longest)' },
    ],
    label_pool: ['Head', 'Antennae', 'Forcipules (venom claws)', 'Body segments', 'Legs (one pair per segment)', 'Last legs (longest)'],
  },
```

- [ ] **Step 2: Type-check and verify**

```bash
cd projects/ecology && npx tsc --noEmit
```

Then visit each new activity in the dev server.

---

## Task 18: Centipedes & Millipedes — Navigation

- [ ] **Step 1: Add 4 nav entries**

```typescript
      { label: 'Centipede or Millipede?', href: '/activities/sort-centipede-millipede-y12' },
      { label: 'Name the Centipede', href: '/activities/name-centipede-y34' },
      { label: 'Name the Millipede', href: '/activities/name-millipede-y34' },
      { label: 'Parts of a Centipede', href: '/activities/label-parts-centipede-y34' },
```

- [ ] **Step 2: Final nav verification**

Start the dev server and open the Interactive Activities dropdown. It should now contain 35 entries total (16 original + 19 new).

- [ ] **Step 3: Full activities index check**

Visit `/activities` and verify:
- All new activities appear in the index with thumbnails
- Each activity links to the correct year-group variant
- No broken image placeholders (all 44 images generated and in `public/activity-images/`)

---

## Summary

| Task | What | Activities | Images |
|------|------|-----------|--------|
| 1 | Gap fills + nav href fixes | 6 | 0 |
| 2 | Category type extension | — | — |
| 3–6 | Bees & Wasps | 13 | 12 |
| 7–10 | Dragonflies & Damselflies | 13 | 12 |
| 11–14 | Grasshoppers & Crickets | 11 | 11 |
| 15–18 | Centipedes & Millipedes | 9 | 9 |
| **Total** | | **52** | **44** |

Site total after completion: ~95 interactive activities.
