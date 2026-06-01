# Biomimicry & "But Why?" sections

Two top-level sections on the Ecology Curriculum site, built by Forge for the
Ecology team (brief from Gaia, 2026-05-30).

## What they are

- **Biomimicry** (`/biomimicry`) — a browsable grid of example cards (emoji +
  title + creature). Each card opens a detail page laying out *where you might
  see it → nature's problem → nature's solution → what people made → a
  highlighted "Try this" activity → curriculum links*. A filter by curriculum
  **subject** and **year group** lets a teacher find the example for the exact
  topic they are teaching.
- **But Why?** (`/but-why`) — an index of short child↔grown-up conversations
  (Maya & Grandad), filterable by **year group**. Selecting one opens it in the
  embedded **But Why? reader**, which reveals the dialogue one turn at a time and
  keeps the teacher-only notes behind its own collapsed "For teachers" panel.

Both appear as their own top-level items in the sidebar and the header menu, and
are linked from the home page.

## Self-contained data (standing rule)

The site never live-reads from `teams/ecology/data/`. It ships its **own copy**
of all content:

| Site file | Source |
|-----------|--------|
| `data/biomimicry.json` | `teams/ecology/data/drafts/biomimicry-primary.json` |
| `data/but-why.json` (index, with site URLs) | `teams/ecology/data/conversations.json` |
| `public/but-why/conversations/<id>.json` | `teams/ecology/data/conversations/<id>.json` |
| `public/but-why/but-why-reader.{js,css}` | `teams/ecology/apps/but-why-reader/` |

### Refreshing the copy

When the source content changes, re-run the sync script and rebuild:

```bash
cd teams/ecology/projects/ecology
node scripts/sync-ecology-content.mjs
npm run build
```

The script copies/transforms everything above into the site. It is **not** wired
into the automatic build, so the committed copy is always the source of truth for
a build — the site is self-contained even if the team data directory is absent.

## Implementation

- **Pages:** `app/biomimicry/page.tsx` + `app/biomimicry/[id]/page.tsx`;
  `app/but-why/page.tsx` + `app/but-why/[id]/page.tsx`. All statically generated
  via `generateStaticParams` (the site is `output: 'export'`).
- **Components:** `BiomimicryBrowser`, `ButWhyBrowser` (filtered grids),
  `CurriculumFilter` (shared subject/year filter), `ButWhyReaderEmbed` (mounts
  the vanilla reader and tears it down on unmount).
- **Types/helpers:** `lib/biomimicry.ts`, `lib/but-why.ts`.
- **Nav:** entries added to `lib/navigation.ts` (sidebar) and
  `components/HeaderNav.tsx` (header menu). Home links in
  `content/ecology-curriculum-home.md`.
- **Note:** the `image_idea` field on biomimicry entries is an art-brief and is
  never rendered, matching the activity-image-prompt convention.

## Site-wide integration (search + resource index)

A content section is not "done" when its own pages render — it must also be
wired into the two cross-cutting systems, or it is silently missing from them:

1. **Site search** (`scripts/build-search-index.ts` → `public/search-index.json`,
   consumed by `components/SearchBar.tsx`). Add a loop that emits one entry per
   item, and teach `SearchBar` to score, render, and navigate the new entry
   `type`. Without this the section is invisible to search (this is the bug that
   left "whale" not finding the humpback-whale biomimicry example).
2. **Resource Index** (`app/resources/page.tsx` → `components/ResourceIndexClient.tsx`).
   Add a `lib/<section>-for-index.ts` adapter that maps items to the index shape
   and spread it into the `resources` array on the page. A `type` colour goes in
   `lib/type-colors.ts` (plus a `TYPE_LABEL_OVERRIDES` entry if the PascalCase
   name doesn't space-split cleanly, e.g. `ButWhy → "But Why?"`). Filter buttons
   appear automatically once items carry the new `type`.

Both `biomimicry` and `but-why` now follow this pattern; the section data
(`data/biomimicry.json`, `data/but-why.json`) is the single source of truth that
the search builder and the resource adapters both read.

### Cross-links to the curriculum

`lib/curriculum-links.ts` is the single source of truth for how biomimicry
examples and "But Why?" conversations connect to curriculum wiki pages. It maps
each item's `(subject, year_groups, topic)` onto existing pages (page availability
derived from `navigation.ts`) and exposes both directions:

- `targetsForBiomimicryLink(link)` — forward: the "Explore this on the site" links
  on `app/biomimicry/[id]`.
- `relatedForPage(slug)` — inverse: the "Explore this topic further" panel
  (`components/RelatedExplorations.tsx`) on `app/wiki/[slug]`.

It is deliberately conservative — only confident, year-matched matches become
links — so a missing link is possible but a wrong one is not. Targets are NOT
stored in `data/*.json` (which the sync overwrites); wiki slugs are site IA, not
domain content. `tests/test_links.ts` guards against dead links and forward/inverse
drift.

### Checklist — adding a new browsable section

- [ ] Data file under `data/` + `lib/<section>.ts` types/helpers
- [ ] Pages (`app/<section>/page.tsx` + detail route with `generateStaticParams`)
- [ ] Search: loop in `build-search-index.ts` + handling in `SearchBar.tsx`
- [ ] Resource Index: `lib/<section>-for-index.ts` adapter spread into
      `app/resources/page.tsx`, colours in `lib/type-colors.ts`
- [ ] Nav: `lib/navigation.ts` (sidebar) + `components/HeaderNav.tsx` + home links
- [ ] Cross-links (if curriculum-linked): extend `lib/curriculum-links.ts` so the
      section joins the bidirectional "Related" graph
- [ ] Coverage tests: `tests/test_content.mjs` (search + resource index) and, for
      curriculum-linked sections, `tests/test_links.ts`

## Tests

`tests/run_all.sh` rebuilds the search index, then runs `tests/test_content.mjs`,
which covers both data-contract checks **and** index coverage: every biomimicry
example and "But Why?" conversation must appear in the search index, and
`app/resources/page.tsx` must compose every section adapter. The reader has its
own behavioural suite under `teams/ecology/apps/but-why-reader/tests/`.
