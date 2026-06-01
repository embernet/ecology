# Cross-linking & cohesiveness assessment

_Assessment requested 2026-06-01, alongside wiring Biomimicry and "But Why?" into
site search and the Resource Index._

> **Status (2026-06-01):** opportunities **#1 and #2 are implemented** — see
> `lib/curriculum-links.ts` (the routing layer), the "Explore this on the site"
> links on biomimicry detail pages, and the "Explore this topic further" panel on
> curriculum wiki pages. Items #3–#5 remain as recommendations below.

## Where the site stands today

The site has rich content in several silos, but the **connective tissue between
silos is thin**. Each section is internally well-linked (nav, prev/next, resource
index) yet rarely points sideways into a different section.

| Link that exists | Link that is missing |
|---|---|
| Curriculum pages embed `NatureExample` / `Activity` / `Reflection` by id | Curriculum pages never mention the **biomimicry** example or **But Why?** conversation that teaches the same topic |
| Biomimicry detail pages list `curriculum_links` (subject + year + topic) | …as **plain text badges, not links** — a dead end back to the curriculum |
| "But Why?" conversations carry `curriculum` data | …used **only for the year-group filter**; never shown as links on the page, and no curriculum page links back |
| Activities are in nav, search, resource index | Activities don't link to the matching **handout** or **But Why?** conversation, and vice-versa |
| Every section sits in the Resource Index (now incl. the two new ones) | Detail pages show **no "related" items** — no lateral discovery |

The root pattern: linking is **author-driven and one-directional** (a page pulls
in a component by id). There is no **data-driven, bidirectional** layer that says
"these things are about the same creature / topic / year, so connect them."

## Opportunities, ranked by value ÷ effort

### 1. Make biomimicry `curriculum_links` clickable ✅ DONE
Biomimicry detail pages now render an **"Explore this on the site"** line under each
curriculum-link card, linking to the matching wiki page(s).

Implementation note (changed from the original proposal): rather than storing
`page`/`anchor` in `data/biomimicry.json` — which `sync-ecology-content.mjs`
overwrites, and which would wrongly put site URLs into domain data — the routing
lives in a **site-local resolver**, `lib/curriculum-links.ts`. It derives page
availability from `navigation.ts` and maps a link's `(subject, year_groups, topic)`
onto existing pages **conservatively**: only confident, year-matched matches become
links, so topics with no page (Forces, D&T, Maths, English) simply stay as text and
a wrong link is never produced.

### 2. Bidirectional "Related" panel on curriculum pages ✅ DONE
Curriculum wiki pages now render an **"Explore this topic further"** panel
(`components/RelatedExplorations.tsx`) listing the biomimicry examples and But Why?
conversations that connect to the topic, computed by **inverting the same resolver**
(`relatedForPage(slug)`). One source of truth drives both directions, and
`tests/test_links.ts` guards it: no dead links, and every forward link round-trips
through the inverse index. The panel is omitted on pages with no matches.

### 3. Add a "Curriculum links" panel to But Why? pages + back-links
"But Why?" conversations currently show no curriculum context to the reader. Mirror
the biomimicry treatment: show the year/subject/topic, linked where a page exists.
Natural high-value pairings already present in the data:
- `peppered-moth-bark` ↔ `year-6-evolution-and-inheritance`
- `tadpoles-not-baby-frogs` ↔ frog life-cycle activities + `handout-frogs-and-toads`
- `caterpillar-to-butterfly` ↔ butterfly life-cycle activity + handouts
- `deciduous-evergreen-winter` ↔ Y1 plants / seasonal changes
- **Effort:** small–medium, mostly authoring the pairings.

### 4. "Related resources" strip on every detail page (cheap lateral discovery)
On biomimicry / But Why? / activity / explore pages, show 2–3 related items computed
from **shared year group or shared subject** (data already present). Pure data, no
authoring.
- **Effort:** small. One resolver + a strip component reused across detail pages.

### 5. Shared tag layer (deepest, biggest)
The most cohesive end-state is a lightweight shared vocabulary — **Latin species
names + curriculum-topic ids** — tagged onto NatureExamples, biomimicry, But Why?,
activities and handouts. Then a single resolver connects anything sharing a tag
(e.g. every piece about _Tyto alba_, or every "life cycles" resource). Partial tag
data already exists: biomimicry `creature` and But Why? `subjects` both carry Latin
names.
- **Effort:** large (a tagging pass across all content). Best treated as a roadmap
  item; items 1–4 deliver most of the perceived cohesion first and can later be
  re-expressed on top of the tag layer.

## Process note (sustainability)

Free-text `topic` / `how` strings can't be linked reliably and rot silently. The
linking layer should hang off **structured target fields validated at build** (a
test that every referenced slug/anchor exists), exactly as the new search/resource
coverage tests now guard section membership. Bake the "Related panel" expectation
into the new-section checklist in `biomimicry-and-but-why.md` so future sections
join the cross-link graph by default.

## Suggested sequence

1 → 2 → 3 → 4 as discrete, shippable steps (each independently valuable), with 5
as a roadmap item once the structured target fields from 1–3 are in place.
