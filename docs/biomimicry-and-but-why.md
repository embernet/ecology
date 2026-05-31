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

## Tests

`tests/run_all.sh` runs `tests/test_content.mjs` (data-contract checks). The
reader has its own behavioural suite under
`teams/ecology/apps/but-why-reader/tests/`.
