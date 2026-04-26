# Activity Sheets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a new Activity Sheets section with 9 A4 printable worksheets (one per handout), linked from the sidebar, hamburger menu, and home page.

**Architecture:** Full parallel to the Handouts section — same component pattern (ActivitySheet / ActivitySheetCard / ActivitySheetHeader), same routing via `/wiki/[slug]`, same MDX content files. Images generated via `gemini-image-generation` skill and stored in `public/activity-sheets/`. Blue colour theme to distinguish from handouts' green.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS utility classes + custom CSS in globals.css, MDX (gray-matter + next-mdx-remote), gemini-image-generation skill.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `public/activity-sheets/` | 9 generated A4 PNG images |
| Create | `lib/activity-sheets-data.ts` | Metadata (title, imageSrc, description) for all 9 sheets |
| Modify | `lib/resource-pack-types.ts` | Add `'ActivitySheet'` to ResourceType union |
| Modify | `lib/resource-ids.ts` | Add `ActivitySheet: 's'` prefix |
| Create | `components/mdx/ActivitySheetHeader.tsx` | Description header on each sheet page |
| Create | `components/mdx/ActivitySheetCard.tsx` | Listing card on the landing page |
| Create | `components/mdx/ActivitySheet.tsx` | Full image + download button |
| Modify | `app/globals.css` | Activity sheet card CSS (blue theme) |
| Modify | `lib/mdx-components.tsx` | Import and export 3 new components |
| Create | `content/activity-sheets.md` | Landing page — lists all 9 cards |
| Create | `content/activity-sheet-bees-vs-wasps.md` | Individual page |
| Create | `content/activity-sheet-wax-castles-vs-paper-palaces.md` | Individual page |
| Create | `content/activity-sheet-butterflies-vs-moths.md` | Individual page |
| Create | `content/activity-sheet-butterfly-moth-life-cycle.md` | Individual page |
| Create | `content/activity-sheet-centipedes-vs-millipedes.md` | Individual page |
| Create | `content/activity-sheet-dragonflies-vs-damselflies.md` | Individual page |
| Create | `content/activity-sheet-frogs-and-toads.md` | Individual page |
| Create | `content/activity-sheet-grasshoppers-vs-crickets.md` | Individual page |
| Create | `content/activity-sheet-snails-vs-slugs.md` | Individual page |
| Modify | `lib/navigation.ts` | Add Activity Sheets section after Handouts |
| Modify | `components/HeaderNav.tsx` | Add Activity Sheets link after Handouts |
| Modify | `content/ecology-curriculum-home.md` | Add Activity Sheets bullet under Curriculum Resources |

---

## Task 1: Generate the 2 life-cycle activity sheet images

**Files:**
- Create: `public/activity-sheets/butterfly-moth-life-cycle.png`
- Create: `public/activity-sheets/frogs-and-toads.png`

- [ ] **Step 1: Create the output directory**

```bash
mkdir -p public/activity-sheets
```

- [ ] **Step 2: Generate the Butterfly & Moth Life-Cycle image**

Invoke the `gemini-image-generation` skill with this prompt:

> A clean A4 portrait worksheet (white background, no border). Bold black title "Butterfly & Moth Life-Cycle" centred at the top. Below the title, four high-quality photorealistic nature images arranged in a single horizontal row, equally spaced. Image 1: a cluster of tiny butterfly eggs on a green leaf. Image 2: a plump green caterpillar on a leaf. Image 3: a chrysalis hanging from a twig. Image 4: a colourful butterfly with open wings on a flower. Between each image, a black curved right-pointing arrow. Directly below each image, a black outlined rounded-rectangle (lozenge) approximately 6 cm wide and 1 cm tall — thick black outline, white interior, no fill — for a child to write the stage name in. Plenty of white space. Clean educational style.

Save the generated image to `public/activity-sheets/butterfly-moth-life-cycle.png`.

- [ ] **Step 3: Generate the Frogs & Toads Life-Cycle image**

Invoke the `gemini-image-generation` skill with this prompt:

> A clean A4 portrait worksheet (white background, no border). Bold black title "Frog & Toad Life-Cycle" centred at the top. Below the title, four high-quality photorealistic nature images arranged in a single horizontal row, equally spaced. Image 1: a mass of frog spawn (jelly eggs) in water. Image 2: a tadpole swimming in water. Image 3: a small froglet with a visible tail sitting on a stone. Image 4: an adult frog sitting on a lily pad. Between each image, a black curved right-pointing arrow. Directly below each image, a black outlined rounded-rectangle (lozenge) approximately 6 cm wide and 1 cm tall — thick black outline, white interior, no fill — for a child to write the stage name in. Plenty of white space. Clean educational style.

Save the generated image to `public/activity-sheets/frogs-and-toads.png`.

- [ ] **Step 4: Commit**

```bash
cd /Users/markburnett/GitHub/ra/teams/ecology/projects/ecology
git add public/activity-sheets/butterfly-moth-life-cycle.png public/activity-sheets/frogs-and-toads.png
git commit -m "feat: add life-cycle activity sheet images"
```

---

## Task 2: Generate the 7 comparison activity sheet images

**Files:**
- Create: `public/activity-sheets/bees-vs-wasps.png`
- Create: `public/activity-sheets/wax-castles-vs-paper-palaces.png`
- Create: `public/activity-sheets/butterflies-vs-moths.png`
- Create: `public/activity-sheets/centipedes-vs-millipedes.png`
- Create: `public/activity-sheets/dragonflies-vs-damselflies.png`
- Create: `public/activity-sheets/grasshoppers-vs-crickets.png`
- Create: `public/activity-sheets/snails-vs-slugs.png`

Generate each image by invoking the `gemini-image-generation` skill with the prompts below, then save to the path shown.

- [ ] **Step 1: Bees vs. Wasps** → save to `public/activity-sheets/bees-vs-wasps.png`

> A clean A4 portrait worksheet (white background, no border). Bold black title "Bees vs. Wasps" centred at the top. Two equal columns separated by a thin vertical line. Left column labelled "Bee", right column labelled "Wasp". Top of each column: a large photorealistic image of the creature (honey bee on a flower / wasp on a surface). Below the main image: a black outlined lozenge (thick outline, white fill, 6 cm wide, 1 cm tall) for writing the name. Then two rows of smaller photorealistic images: row 1 shows a honeycomb/beehive (left) and a papery wasp nest (right); row 2 shows pollen on a bee's legs (left) and a wasp catching an insect (right). Each small image has a lozenge below it. Plenty of white space. Clean educational style.

- [ ] **Step 2: Wax Castles vs. Paper Palaces** → save to `public/activity-sheets/wax-castles-vs-paper-palaces.png`

> A clean A4 portrait worksheet (white background, no border). Bold black title "Wax Castles vs. Paper Palaces" centred at the top. Two equal columns separated by a thin vertical line. Left column labelled "Bee Nest", right column labelled "Wasp Nest". Top of each column: a large photorealistic image (honeycomb wax cells / papery wasp nest). Below: a black outlined lozenge for writing the material name. Then two more rows of smaller images: row 1 shows the nest structure close-up (left: hexagonal cells / right: papery envelope); row 2 shows the nest location (left: inside a hive / right: hanging from a branch). Each small image has a lozenge below it. Plenty of white space. Clean educational style.

- [ ] **Step 3: Butterflies vs. Moths** → save to `public/activity-sheets/butterflies-vs-moths.png`

> A clean A4 portrait worksheet (white background, no border). Bold black title "Butterflies vs. Moths" centred at the top. Two equal columns separated by a thin vertical line. Left column labelled "Butterfly", right column labelled "Moth". Top of each column: a large photorealistic image (colourful butterfly with wings open / moth with wings flat). Below: a black outlined lozenge for the name. Then two rows of smaller images: row 1 shows the antennae close-up (left: clubbed tips / right: feathery); row 2 shows resting posture (left: wings folded upright / right: wings flat). Each small image has a lozenge below it. Plenty of white space. Clean educational style.

- [ ] **Step 4: Centipedes vs. Millipedes** → save to `public/activity-sheets/centipedes-vs-millipedes.png`

> A clean A4 portrait worksheet (white background, no border). Bold black title "Centipedes vs. Millipedes" centred at the top. Two equal columns separated by a thin vertical line. Left column labelled "Centipede", right column labelled "Millipede". Top of each column: a large photorealistic image (centipede / millipede). Below: a black outlined lozenge for the name. Then two rows of smaller images: row 1 shows a body segment close-up (left: one pair of legs per segment / right: two pairs per segment); row 2 shows the creature in its habitat (left: centipede hunting / right: millipede curled in defence). Each small image has a lozenge below it. Plenty of white space. Clean educational style.

- [ ] **Step 5: Dragonflies vs. Damselflies** → save to `public/activity-sheets/dragonflies-vs-damselflies.png`

> A clean A4 portrait worksheet (white background, no border). Bold black title "Dragonflies vs. Damselflies" centred at the top. Two equal columns separated by a thin vertical line. Left column labelled "Dragonfly", right column labelled "Damselfly". Top of each column: a large photorealistic image (dragonfly / damselfly). Below: a black outlined lozenge for the name. Then two rows of smaller images: row 1 shows wings at rest (left: spread wide / right: folded along body); row 2 shows eyes close-up (left: large wrap-around compound eyes / right: eyes separated on sides of head). Each small image has a lozenge below it. Plenty of white space. Clean educational style.

- [ ] **Step 6: Grasshoppers vs. Crickets** → save to `public/activity-sheets/grasshoppers-vs-crickets.png`

> A clean A4 portrait worksheet (white background, no border). Bold black title "Grasshoppers vs. Crickets" centred at the top. Two equal columns separated by a thin vertical line. Left column labelled "Grasshopper", right column labelled "Cricket". Top of each column: a large photorealistic image (grasshopper / cricket). Below: a black outlined lozenge for the name. Then two rows of smaller images: row 1 shows the antennae (left: short antennae / right: long antennae); row 2 shows the insect in its active environment (left: on grass in daylight / right: at night near soil). Each small image has a lozenge below it. Plenty of white space. Clean educational style.

- [ ] **Step 7: Snails vs. Slugs** → save to `public/activity-sheets/snails-vs-slugs.png`

> A clean A4 portrait worksheet (white background, no border). Bold black title "Snails vs. Slugs" centred at the top. Two equal columns separated by a thin vertical line. Left column labelled "Snail", right column labelled "Slug". Top of each column: a large photorealistic image (snail with spiral shell / slug on a leaf). Below: a black outlined lozenge for the name. Then two rows of smaller images: row 1 shows the shell/no shell (left: close-up of spiral shell / right: smooth bare back of a slug); row 2 shows the creature moving (left: snail with slime trail / right: slug with slime trail). Each small image has a lozenge below it. Plenty of white space. Clean educational style.

- [ ] **Step 8: Commit**

```bash
cd /Users/markburnett/GitHub/ra/teams/ecology/projects/ecology
git add public/activity-sheets/
git commit -m "feat: add comparison activity sheet images"
```

---

## Task 3: Create lib/activity-sheets-data.ts

**Files:**
- Create: `lib/activity-sheets-data.ts`

- [ ] **Step 1: Create the file**

```typescript
export const ACTIVITY_SHEETS_DATA: Record<string, { title: string; imageSrc: string; description: string }> = {
  "activity-sheet-bees-vs-wasps": {
    title: "Buzzing Bugs! Bees vs. Wasps",
    imageSrc: "/activity-sheets/bees-vs-wasps.png",
    description: "Label the bee and the wasp, then identify their nests and what they eat."
  },
  "activity-sheet-wax-castles-vs-paper-palaces": {
    title: "Bees vs. Wasps Nests — Wax Castles vs. Paper Palaces",
    imageSrc: "/activity-sheets/wax-castles-vs-paper-palaces.png",
    description: "Label each type of nest, the material it is made from, and where it is built."
  },
  "activity-sheet-butterflies-vs-moths": {
    title: "Beautiful Bugs: Butterflies vs. Moths",
    imageSrc: "/activity-sheets/butterflies-vs-moths.png",
    description: "Label the butterfly and the moth, then identify their antennae and resting posture."
  },
  "activity-sheet-butterfly-moth-life-cycle": {
    title: "Butterfly & Moth Life-Cycle",
    imageSrc: "/activity-sheets/butterfly-moth-life-cycle.png",
    description: "Label each stage of the butterfly and moth life cycle in order."
  },
  "activity-sheet-centipedes-vs-millipedes": {
    title: "Leggy Crawlers: Centipedes vs. Millipedes",
    imageSrc: "/activity-sheets/centipedes-vs-millipedes.png",
    description: "Label the centipede and the millipede, then identify their legs and how they defend themselves."
  },
  "activity-sheet-dragonflies-vs-damselflies": {
    title: "Dragonflies vs. Damselflies",
    imageSrc: "/activity-sheets/dragonflies-vs-damselflies.png",
    description: "Label the dragonfly and the damselfly, then identify their wings at rest and their eyes."
  },
  "activity-sheet-frogs-and-toads": {
    title: "Frog & Toad Life-Cycle",
    imageSrc: "/activity-sheets/frogs-and-toads.png",
    description: "Label each stage of the frog and toad life cycle in order."
  },
  "activity-sheet-grasshoppers-vs-crickets": {
    title: "Garden Jumpers: Grasshoppers vs. Crickets",
    imageSrc: "/activity-sheets/grasshoppers-vs-crickets.png",
    description: "Label the grasshopper and the cricket, then identify their antennae and when they are active."
  },
  "activity-sheet-snails-vs-slugs": {
    title: "Slime Trails: Snails vs. Slugs",
    imageSrc: "/activity-sheets/snails-vs-slugs.png",
    description: "Label the snail and the slug, then identify the shell and how each one moves."
  },
};
```

- [ ] **Step 2: Commit**

```bash
cd /Users/markburnett/GitHub/ra/teams/ecology/projects/ecology
git add lib/activity-sheets-data.ts
git commit -m "feat: add activity-sheets-data metadata"
```

---

## Task 4: Update resource types and IDs

**Files:**
- Modify: `lib/resource-pack-types.ts`
- Modify: `lib/resource-ids.ts`

- [ ] **Step 1: Add ActivitySheet to ResourceType in resource-pack-types.ts**

Current content (lines 1–8):
```typescript
export type ResourceType =
  | 'NatureExample'
  | 'Activity'
  | 'Reflection'
  | 'Requirement'
  | 'Note'
  | 'Guidance'
  | 'Handout';
```

Replace with:
```typescript
export type ResourceType =
  | 'NatureExample'
  | 'Activity'
  | 'Reflection'
  | 'Requirement'
  | 'Note'
  | 'Guidance'
  | 'Handout'
  | 'ActivitySheet';
```

- [ ] **Step 2: Add ActivitySheet prefix to resource-ids.ts**

Current `RESOURCE_TYPE_PREFIXES` object ends with `Guidance: 'g'`. Add the new entry:
```typescript
export const RESOURCE_TYPE_PREFIXES: Record<string, string> = {
  NatureExample: 'n',
  Activity: 'a',
  Reflection: 'r',
  Requirement: 'q',
  Note: 't',
  Guidance: 'g',
  ActivitySheet: 's',
};
```

Also update the comment block at the top of the file to add:
```
 * s = ActivitySheet  (e.g. s1, s2, s3)
```

- [ ] **Step 3: Commit**

```bash
cd /Users/markburnett/GitHub/ra/teams/ecology/projects/ecology
git add lib/resource-pack-types.ts lib/resource-ids.ts
git commit -m "feat: add ActivitySheet resource type and prefix"
```

---

## Task 5: Create ActivitySheetHeader component

**Files:**
- Create: `components/mdx/ActivitySheetHeader.tsx`

- [ ] **Step 1: Create the file**

```typescript
import React from 'react';
import { ACTIVITY_SHEETS_DATA } from '@/lib/activity-sheets-data';

interface ActivitySheetHeaderProps {
  slug: string;
}

export function ActivitySheetHeader({ slug }: ActivitySheetHeaderProps) {
  const data = ACTIVITY_SHEETS_DATA[slug];
  if (!data) return null;

  return (
    <div className="mb-8 mt-2">
      <p className="text-xl text-slate-700 leading-relaxed">{data.description}</p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/markburnett/GitHub/ra/teams/ecology/projects/ecology
git add components/mdx/ActivitySheetHeader.tsx
git commit -m "feat: add ActivitySheetHeader component"
```

---

## Task 6: Create ActivitySheetCard component and CSS

**Files:**
- Create: `components/mdx/ActivitySheetCard.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Create ActivitySheetCard.tsx**

```typescript
import Link from 'next/link';
import Image from 'next/image';
import { ACTIVITY_SHEETS_DATA } from '@/lib/activity-sheets-data';

interface ActivitySheetCardProps {
  slug: string;
}

export function ActivitySheetCard({ slug }: ActivitySheetCardProps) {
  const data = ACTIVITY_SHEETS_DATA[slug];
  if (!data) return null;

  return (
    <Link href={`/wiki/${slug}`} className="activity-sheet-card-link" style={{ textDecoration: 'none' }}>
      <div className="activity-sheet-card">
        <div className="activity-sheet-card-image relative">
          <Image
            src={data.imageSrc}
            alt={data.title}
            fill
            className="object-contain p-1"
            sizes="90px"
          />
        </div>
        <div className="activity-sheet-card-body">
          <h3 className="activity-sheet-card-title">{data.title}</h3>
          <p className="activity-sheet-card-desc">{data.description}</p>
        </div>
        <div className="activity-sheet-card-arrow">
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Add CSS to app/globals.css**

After the existing handout-card CSS block (after line 124 — the `.handout-card:hover .handout-card-arrow` rule), add:

```css
/* ── Activity Sheet card (used on the Activity Sheets landing page) ── */
.activity-sheet-card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.activity-sheet-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  background: white;
  margin-bottom: 0.75rem;
  transition: box-shadow 0.15s, border-color 0.15s, transform 0.15s;
  cursor: pointer;
}

.activity-sheet-card:hover {
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.08);
  border-color: #bae6fd;
  transform: translateY(-1px);
}

.activity-sheet-card-image {
  flex-shrink: 0;
  width: 90px;
  height: 90px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
}

.activity-sheet-card-body {
  flex: 1;
  min-width: 0;
}

.activity-sheet-card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #0369a1;
  margin: 0 0 0.25rem;
}

.activity-sheet-card-desc {
  font-size: 0.85rem;
  color: #475569;
  margin: 0;
  line-height: 1.5;
}

.activity-sheet-card-arrow {
  flex-shrink: 0;
  color: #94a3b8;
  transition: color 0.15s;
}

.activity-sheet-card:hover .activity-sheet-card-arrow {
  color: #0284c7;
}
```

- [ ] **Step 3: Commit**

```bash
cd /Users/markburnett/GitHub/ra/teams/ecology/projects/ecology
git add components/mdx/ActivitySheetCard.tsx app/globals.css
git commit -m "feat: add ActivitySheetCard component and blue card CSS"
```

---

## Task 7: Create ActivitySheet component

**Files:**
- Create: `components/mdx/ActivitySheet.tsx`

- [ ] **Step 1: Create the file**

```typescript
'use client';

import React, { useRef } from 'react';
import { SelectableResource } from '../SelectableResource';

interface ActivitySheetProps {
  id: string;
  title: string;
  imageSrc: string;
  altText?: string;
}

export const ActivitySheet: React.FC<ActivitySheetProps> = ({ id, title, imageSrc, altText }) => {
  const captureRef = useRef<HTMLDivElement>(null);

  const filename = imageSrc.split('/').pop() || 'activity-sheet.png';

  return (
    <SelectableResource
      resourceId={id}
      type="ActivitySheet"
      title={title}
      data={{ imageSrc }}
      captureRef={captureRef}
    >
      <div className="my-8 rounded-xl overflow-hidden shadow-lg border border-sky-100 bg-white">
        <div ref={captureRef}>
          <img
            src={imageSrc}
            alt={altText || title}
            className="w-full h-auto block"
            style={{ maxWidth: '100%' }}
          />
        </div>
        <div className="bg-sky-50 px-6 py-4 border-t border-sky-100 flex items-center justify-end">
          <a
            href={imageSrc}
            download={filename}
            className="inline-flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors no-underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download Activity Sheet
          </a>
        </div>
      </div>
    </SelectableResource>
  );
};
```

- [ ] **Step 2: Commit**

```bash
cd /Users/markburnett/GitHub/ra/teams/ecology/projects/ecology
git add components/mdx/ActivitySheet.tsx
git commit -m "feat: add ActivitySheet component"
```

---

## Task 8: Register components in lib/mdx-components.tsx

**Files:**
- Modify: `lib/mdx-components.tsx`

- [ ] **Step 1: Add the three imports after the existing Handout imports (lines 6–8)**

Current lines 6–8:
```typescript
import { Handout } from '@/components/mdx/Handout';
import { HandoutCard } from '@/components/mdx/HandoutCard';
import { HandoutHeader } from '@/components/mdx/HandoutHeader';
```

Replace with:
```typescript
import { Handout } from '@/components/mdx/Handout';
import { HandoutCard } from '@/components/mdx/HandoutCard';
import { HandoutHeader } from '@/components/mdx/HandoutHeader';
import { ActivitySheet } from '@/components/mdx/ActivitySheet';
import { ActivitySheetCard } from '@/components/mdx/ActivitySheetCard';
import { ActivitySheetHeader } from '@/components/mdx/ActivitySheetHeader';
```

- [ ] **Step 2: Add to the return object in getMdxComponents (after HandoutHeader on line 28)**

Current:
```typescript
    Handout,
    HandoutCard,
    HandoutHeader,
```

Replace with:
```typescript
    Handout,
    HandoutCard,
    HandoutHeader,
    ActivitySheet,
    ActivitySheetCard,
    ActivitySheetHeader,
```

- [ ] **Step 3: Run TypeScript check**

```bash
cd /Users/markburnett/GitHub/ra/teams/ecology/projects/ecology
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
cd /Users/markburnett/GitHub/ra/teams/ecology/projects/ecology
git add lib/mdx-components.tsx
git commit -m "feat: register ActivitySheet components in MDX"
```

---

## Task 9: Create content files

**Files:**
- Create: `content/activity-sheets.md`
- Create: `content/activity-sheet-bees-vs-wasps.md`
- Create: `content/activity-sheet-wax-castles-vs-paper-palaces.md`
- Create: `content/activity-sheet-butterflies-vs-moths.md`
- Create: `content/activity-sheet-butterfly-moth-life-cycle.md`
- Create: `content/activity-sheet-centipedes-vs-millipedes.md`
- Create: `content/activity-sheet-dragonflies-vs-damselflies.md`
- Create: `content/activity-sheet-frogs-and-toads.md`
- Create: `content/activity-sheet-grasshoppers-vs-crickets.md`
- Create: `content/activity-sheet-snails-vs-slugs.md`

- [ ] **Step 1: Create content/activity-sheets.md (landing page)**

```markdown
---
title: "Activity Sheets"
slug: "activity-sheets"
---

Printable activity sheets designed for classroom use. Each sheet pairs with its corresponding handout — simpler and image-led, with spaces for students to label the main ideas.

<ActivitySheetCard slug="activity-sheet-bees-vs-wasps" />

<ActivitySheetCard slug="activity-sheet-wax-castles-vs-paper-palaces" />

<ActivitySheetCard slug="activity-sheet-butterflies-vs-moths" />

<ActivitySheetCard slug="activity-sheet-butterfly-moth-life-cycle" />

<ActivitySheetCard slug="activity-sheet-centipedes-vs-millipedes" />

<ActivitySheetCard slug="activity-sheet-dragonflies-vs-damselflies" />

<ActivitySheetCard slug="activity-sheet-frogs-and-toads" />

<ActivitySheetCard slug="activity-sheet-grasshoppers-vs-crickets" />

<ActivitySheetCard slug="activity-sheet-snails-vs-slugs" />

----

Back to: [Home Page](/)
```

- [ ] **Step 2: Create content/activity-sheet-bees-vs-wasps.md**

```markdown
---
title: "Buzzing Bugs! Bees vs. Wasps — Activity Sheet"
---

<ActivitySheetHeader slug="activity-sheet-bees-vs-wasps" />

<ActivitySheet id={`s1`} title={`Buzzing Bugs! Bees vs. Wasps — Activity Sheet`} imageSrc={`/activity-sheets/bees-vs-wasps.png`} altText={`Activity sheet: label the bee and wasp, their nests, and what they eat.`} />
```

- [ ] **Step 3: Create content/activity-sheet-wax-castles-vs-paper-palaces.md**

```markdown
---
title: "Bees vs. Wasps Nests — Activity Sheet"
---

<ActivitySheetHeader slug="activity-sheet-wax-castles-vs-paper-palaces" />

<ActivitySheet id={`s2`} title={`Bees vs. Wasps Nests — Activity Sheet`} imageSrc={`/activity-sheets/wax-castles-vs-paper-palaces.png`} altText={`Activity sheet: label the bee and wasp nests, their materials, and where they are built.`} />
```

- [ ] **Step 4: Create content/activity-sheet-butterflies-vs-moths.md**

```markdown
---
title: "Beautiful Bugs: Butterflies vs. Moths — Activity Sheet"
---

<ActivitySheetHeader slug="activity-sheet-butterflies-vs-moths" />

<ActivitySheet id={`s3`} title={`Beautiful Bugs: Butterflies vs. Moths — Activity Sheet`} imageSrc={`/activity-sheets/butterflies-vs-moths.png`} altText={`Activity sheet: label the butterfly and moth, their antennae, and resting posture.`} />
```

- [ ] **Step 5: Create content/activity-sheet-butterfly-moth-life-cycle.md**

```markdown
---
title: "Butterfly & Moth Life-Cycle — Activity Sheet"
---

<ActivitySheetHeader slug="activity-sheet-butterfly-moth-life-cycle" />

<ActivitySheet id={`s4`} title={`Butterfly & Moth Life-Cycle — Activity Sheet`} imageSrc={`/activity-sheets/butterfly-moth-life-cycle.png`} altText={`Activity sheet: label each stage of the butterfly and moth life cycle.`} />
```

- [ ] **Step 6: Create content/activity-sheet-centipedes-vs-millipedes.md**

```markdown
---
title: "Leggy Crawlers: Centipedes vs. Millipedes — Activity Sheet"
---

<ActivitySheetHeader slug="activity-sheet-centipedes-vs-millipedes" />

<ActivitySheet id={`s5`} title={`Leggy Crawlers: Centipedes vs. Millipedes — Activity Sheet`} imageSrc={`/activity-sheets/centipedes-vs-millipedes.png`} altText={`Activity sheet: label the centipede and millipede, their legs, and how they defend themselves.`} />
```

- [ ] **Step 7: Create content/activity-sheet-dragonflies-vs-damselflies.md**

```markdown
---
title: "Dragonflies vs. Damselflies — Activity Sheet"
---

<ActivitySheetHeader slug="activity-sheet-dragonflies-vs-damselflies" />

<ActivitySheet id={`s6`} title={`Dragonflies vs. Damselflies — Activity Sheet`} imageSrc={`/activity-sheets/dragonflies-vs-damselflies.png`} altText={`Activity sheet: label the dragonfly and damselfly, their wings at rest, and their eyes.`} />
```

- [ ] **Step 8: Create content/activity-sheet-frogs-and-toads.md**

```markdown
---
title: "Frog & Toad Life-Cycle — Activity Sheet"
---

<ActivitySheetHeader slug="activity-sheet-frogs-and-toads" />

<ActivitySheet id={`s7`} title={`Frog & Toad Life-Cycle — Activity Sheet`} imageSrc={`/activity-sheets/frogs-and-toads.png`} altText={`Activity sheet: label each stage of the frog and toad life cycle.`} />
```

- [ ] **Step 9: Create content/activity-sheet-grasshoppers-vs-crickets.md**

```markdown
---
title: "Garden Jumpers: Grasshoppers vs. Crickets — Activity Sheet"
---

<ActivitySheetHeader slug="activity-sheet-grasshoppers-vs-crickets" />

<ActivitySheet id={`s8`} title={`Garden Jumpers: Grasshoppers vs. Crickets — Activity Sheet`} imageSrc={`/activity-sheets/grasshoppers-vs-crickets.png`} altText={`Activity sheet: label the grasshopper and cricket, their antennae, and when they are active.`} />
```

- [ ] **Step 10: Create content/activity-sheet-snails-vs-slugs.md**

```markdown
---
title: "Slime Trails: Snails vs. Slugs — Activity Sheet"
---

<ActivitySheetHeader slug="activity-sheet-snails-vs-slugs" />

<ActivitySheet id={`s9`} title={`Slime Trails: Snails vs. Slugs — Activity Sheet`} imageSrc={`/activity-sheets/snails-vs-slugs.png`} altText={`Activity sheet: label the snail and slug, the shell, and how each one moves.`} />
```

- [ ] **Step 11: Commit**

```bash
cd /Users/markburnett/GitHub/ra/teams/ecology/projects/ecology
git add content/activity-sheets.md content/activity-sheet-*.md
git commit -m "feat: add activity sheet content files (landing page + 9 individual pages)"
```

---

## Task 10: Wire navigation

**Files:**
- Modify: `lib/navigation.ts`
- Modify: `components/HeaderNav.tsx`
- Modify: `content/ecology-curriculum-home.md`

- [ ] **Step 1: Add Activity Sheets section to lib/navigation.ts**

After the Handouts section (currently ends with the closing `},` at line 112), add before the Media Library entry (line 113):

```typescript
  {
    label: 'Activity Sheets',
    href: '/wiki/activity-sheets',
    children: [
      { label: 'Bees vs. Wasps', href: '/wiki/activity-sheet-bees-vs-wasps' },
      { label: 'Bees vs. Wasps Nests', href: '/wiki/activity-sheet-wax-castles-vs-paper-palaces' },
      { label: 'Butterflies vs. Moths', href: '/wiki/activity-sheet-butterflies-vs-moths' },
      { label: 'Butterfly & Moth Life-Cycle', href: '/wiki/activity-sheet-butterfly-moth-life-cycle' },
      { label: 'Centipedes vs. Millipedes', href: '/wiki/activity-sheet-centipedes-vs-millipedes' },
      { label: 'Dragonflies vs. Damselflies', href: '/wiki/activity-sheet-dragonflies-vs-damselflies' },
      { label: 'Frogs and Toads', href: '/wiki/activity-sheet-frogs-and-toads' },
      { label: 'Grasshoppers vs. Crickets', href: '/wiki/activity-sheet-grasshoppers-vs-crickets' },
      { label: 'Snails vs. Slugs', href: '/wiki/activity-sheet-snails-vs-slugs' },
    ],
  },
```

- [ ] **Step 2: Add Activity Sheets link to components/HeaderNav.tsx**

After the Handouts link (line 76–78):
```tsx
<Link href="/wiki/handouts" className="header-dropdown-link" onClick={() => setIsOpen(false)}>
  Handouts
</Link>
```

Add immediately after:
```tsx
<Link href="/wiki/activity-sheets" className="header-dropdown-link" onClick={() => setIsOpen(false)}>
  Activity Sheets
</Link>
```

- [ ] **Step 3: Add Activity Sheets to content/ecology-curriculum-home.md**

In the Curriculum Resources bullet list, the current Handouts bullet is:
```markdown
- [Handouts](/wiki/handouts) — Printable classroom sheets comparing species and illustrating life cycles
```

Add a new bullet immediately after it:
```markdown
- [Activity Sheets](/wiki/activity-sheets) — Printable A4 worksheets for students to label, one for each handout
```

- [ ] **Step 4: Commit**

```bash
cd /Users/markburnett/GitHub/ra/teams/ecology/projects/ecology
git add lib/navigation.ts components/HeaderNav.tsx content/ecology-curriculum-home.md
git commit -m "feat: wire Activity Sheets into sidebar, hamburger menu, and home page"
```

---

## Task 11: Verify in dev server

- [ ] **Step 1: Start the dev server**

```bash
cd /Users/markburnett/GitHub/ra/teams/ecology/projects/ecology
npm run dev
```

Expected: server starts on http://localhost:3000 (or whichever port is configured) with no errors.

- [ ] **Step 2: Verify the Activity Sheets landing page**

Open http://localhost:3000/wiki/activity-sheets. Confirm:
- Page title "Activity Sheets" renders
- All 9 ActivitySheetCard components display with thumbnail image, blue-titled heading, description, and arrow
- Cards have blue hover border (#bae6fd)

- [ ] **Step 3: Verify an individual sheet page**

Open http://localhost:3000/wiki/activity-sheet-bees-vs-wasps. Confirm:
- Description paragraph renders from ActivitySheetHeader
- Activity sheet image renders full-width
- Download button (sky blue, labelled "Download Activity Sheet") is visible and clicking it downloads the PNG

- [ ] **Step 4: Verify sidebar navigation**

Confirm "Activity Sheets" appears in the sidebar as a collapsible section after "Handouts", with all 9 child links visible when expanded.

- [ ] **Step 5: Verify hamburger menu**

On mobile viewport (or narrow browser), open the hamburger menu. Confirm "Activity Sheets" link appears after "Handouts".

- [ ] **Step 6: Verify home page**

Open http://localhost:3000. Confirm the Activity Sheets bullet appears in the Curriculum Resources list.

- [ ] **Step 7: Verify prev/next navigation**

Open a handout page (e.g. /wiki/handout-snails-vs-slugs). Confirm "Activity Sheets" appears as the next section when navigating from the last handout.

- [ ] **Step 8: Final commit if any fixes were needed**

```bash
cd /Users/markburnett/GitHub/ra/teams/ecology/projects/ecology
git add -p
git commit -m "fix: activity sheets dev server corrections"
```
