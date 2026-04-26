# Activity Sheets — Design Spec

**Date:** 2026-04-26  
**Status:** Approved

## Overview

Add a new Activity Sheets section to the ecology curriculum website, positioned after the existing Handouts section. For each of the 9 handouts, create a corresponding A4 printable activity sheet — simpler than the handout, image-based, with black outlined lozenge answer boxes for students to fill in. Link the section from the sidebar, hamburger menu, and home page.

---

## Architecture

Fully parallel to the existing Handouts section. No changes to handout files or components.

### New Files

| File | Purpose |
|---|---|
| `lib/activity-sheets-data.ts` | Metadata for all 9 sheets: `title`, `imageSrc`, `description` |
| `components/mdx/ActivitySheet.tsx` | Displays A4 PNG + download button (mirrors `Handout.tsx`) |
| `components/mdx/ActivitySheetCard.tsx` | Card on landing page (mirrors `HandoutCard.tsx`) |
| `components/mdx/ActivitySheetHeader.tsx` | Description header on each page (mirrors `HandoutHeader.tsx`) |
| `content/activity-sheets.md` | Landing page listing all 9 cards |
| `content/activity-sheet-bees-vs-wasps.md` | Individual page |
| `content/activity-sheet-butterflies-vs-moths.md` | Individual page |
| `content/activity-sheet-butterfly-moth-life-cycle.md` | Individual page |
| `content/activity-sheet-centipedes-vs-millipedes.md` | Individual page |
| `content/activity-sheet-dragonflies-vs-damselflies.md` | Individual page |
| `content/activity-sheet-frogs-toads-life-cycle.md` | Individual page |
| `content/activity-sheet-grasshoppers-vs-crickets.md` | Individual page |
| `content/activity-sheet-snails-vs-slugs.md` | Individual page |
| `content/activity-sheet-wax-castles-paper-palaces.md` | Individual page |
| `public/activity-sheets/*.png` | 9 generated A4 images |

### Modified Files

| File | Change |
|---|---|
| `lib/resource-pack-types.ts` | Add `'ActivitySheet'` to `ResourceType` union |
| `lib/resource-ids.ts` | Add prefix `s` → `ActivitySheet` |
| `lib/mdx-components.tsx` | Import and export `ActivitySheet`, `ActivitySheetCard`, `ActivitySheetHeader` |
| `lib/navigation.ts` | Add Activity Sheets section after Handouts |
| `components/HeaderNav.tsx` | Add Activity Sheets link after Handouts link |
| `content/ecology-curriculum-home.md` | Add Activity Sheets paragraph and link |

---

## Image Design

Images generated using the `gemini-image-generation` skill. All images are A4 portrait, white background, no colour other than the nature photographs within them.

### Two Templates

**Life-cycle sheets** (2 sheets: Butterfly & Moth Life-Cycle, Frogs & Toads Life-Cycle)

- Title at top
- Horizontal row of nature photographs, one per life-cycle stage
- Curved arrows between stages
- Black rounded-rectangle lozenge below each image — sized for a child to write the stage name in
- Stages for Frog/Toad: spawn → tadpole → froglet → adult frog
- Stages for Butterfly/Moth: egg → caterpillar → chrysalis/cocoon → adult

**Comparison sheets** (7 sheets: all others)

- Title at top
- Two columns, one per creature
- Large nature photograph of the creature at the top of each column
- Black name lozenge below the main image
- 2–3 smaller feature photographs below (e.g. nest, food source, body markings)
- Black lozenge below each feature photograph for the student to label it

### Lozenge Style

Black filled rounded rectangles (border-radius ~50% of height). Sized to fit a single line of handwritten text for primary-age children — approximately 6cm wide × 1cm tall on A4.

---

## Component Design

### `ActivitySheet.tsx`

Props: `id` (resource ID, e.g. `s1`), `title`, `imageSrc`, `altText`

- Wraps with `SelectableResource` (type `'ActivitySheet'`, resourceId `id`)
- Displays full-width PNG image in a bordered container
- Footer bar with download button (distinct colour from handouts — use sky blue `#0284c7` to differentiate)

### `ActivitySheetCard.tsx`

Props: `slug`

- Reads metadata from `ACTIVITY_SHEETS_DATA[slug]`
- Thumbnail image (90×90px), title, description, arrow icon
- Link to `/wiki/${slug}`
- Styled with blue theme to differentiate from handouts' green

### `ActivitySheetHeader.tsx`

Props: `slug`

- Renders `ACTIVITY_SHEETS_DATA[slug].description` as descriptive text
- Same style as `HandoutHeader`

### `lib/activity-sheets-data.ts`

```typescript
export const ACTIVITY_SHEETS_DATA: Record<string, {
  title: string;
  imageSrc: string;
  description: string;
}> = { ... }
```

---

## Navigation Wiring

### Sidebar (`lib/navigation.ts`)

New section immediately after `Handouts`:

```typescript
{
  label: 'Activity Sheets',
  href: '/wiki/activity-sheets',
  children: [
    { label: 'Bees vs. Wasps', href: '/wiki/activity-sheet-bees-vs-wasps' },
    { label: 'Wax Castles vs. Paper Palaces', href: '/wiki/activity-sheet-wax-castles-paper-palaces' },
    { label: 'Butterflies vs. Moths', href: '/wiki/activity-sheet-butterflies-vs-moths' },
    { label: 'Butterfly & Moth Life-Cycle', href: '/wiki/activity-sheet-butterfly-moth-life-cycle' },
    { label: 'Centipedes vs. Millipedes', href: '/wiki/activity-sheet-centipedes-vs-millipedes' },
    { label: 'Dragonflies vs. Damselflies', href: '/wiki/activity-sheet-dragonflies-vs-damselflies' },
    { label: 'Frogs & Toads Life-Cycle', href: '/wiki/activity-sheet-frogs-toads-life-cycle' },
    { label: 'Grasshoppers vs. Crickets', href: '/wiki/activity-sheet-grasshoppers-vs-crickets' },
    { label: 'Snails vs. Slugs', href: '/wiki/activity-sheet-snails-vs-slugs' },
  ],
}
```

### Hamburger Menu (`components/HeaderNav.tsx`)

Add `Activity Sheets` link after the existing `Handouts` link, pointing to `/wiki/activity-sheets`.

### Home Page (`content/ecology-curriculum-home.md`)

Add a short paragraph introducing Activity Sheets, linking to `/wiki/activity-sheets`. Position: after the Handouts section mention.

---

## Image Generation Process

For each of the 9 sheets:

1. Invoke `gemini-image-generation` skill with a detailed prompt describing:
   - A4 portrait format, white background
   - Layout template (life-cycle row or comparison two-column)
   - The specific creature(s) and stages/features
   - Black lozenge positions and sizes
2. Save output PNG to `public/activity-sheets/<slug>.png`
3. Record `imageSrc` as `/activity-sheets/<slug>.png` in `activity-sheets-data.ts`

---

## Ordering

Build in this sequence:
1. Generate all 9 images
2. Create `lib/activity-sheets-data.ts` with metadata
3. Create components (ActivitySheet, ActivitySheetCard, ActivitySheetHeader)
4. Register components in `lib/mdx-components.tsx`
5. Update resource types and IDs
6. Create content files (landing page + 9 individual pages)
7. Wire navigation (sidebar, hamburger, home page)
8. Test: start dev server, verify all 9 pages render, download buttons work, nav links correct
