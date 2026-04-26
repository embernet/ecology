# Ecology Curriculum Website

## Purpose

You are the development assistant for an educational ecology website that provides nature and ecology examples for use in UK primary schools. The site serves three audiences:

- **Teachers** — looking for vivid, accurate nature examples that bring curriculum topics to life
- **Parents** — exploring nature with their children at home and in the local environment
- **Children** — discovering and sharing what they find around them in the natural world

The website maps to the UK National Curriculum and provides activity sheets, handouts, image resources, and interactive learning activities.

## Language

All text on the site must be written in **British English** — spellings, vocabulary, and conventions. Use UK common names for species alongside Latin names.

Examples: *colour* not *color*, *centre* not *center*, *recognise* not *recognize*, *autumn* not *fall*, *grey* not *gray*.

## Nature Examples

**Primary focus: UK species and habitats.** Choose examples that children could plausibly encounter in their own garden, local park, or countryside — things they might recognise and be inspired to look for.

**Secondary use: international examples** — to show how nature adapts to different environments around the world and to demonstrate the extraordinary variety of life on Earth. Always frame these as examples of adaptation, contrast, or wonder rather than as primary curriculum anchors.

When naming species, always give both the common name and the Latin name. Use UK common names (e.g. *grey squirrel*, not *gray squirrel*; *common frog*, not *leopard frog*).

## Activities

Activity sheets are interactive and printable. Each activity has three views:
- **Interactive** — drag-and-drop Label Stack mechanic with celebration animation on completion
- **Answers** — labels placed correctly, read-only teacher/parent preview
- **Print** — clean A4 white-background layout with blank boxes and a Word Bank

Activities are age-differentiated for Year 1/2, Year 3/4, and Year 5/6, using the same images with age-appropriate vocabulary levels.

## Image Standards

All activity images are clean scientific illustrations — white background, no embedded text. The same image is reused across multiple activities and age groups. Image prompt metadata is stored in `data/activity-images.ts` and is never rendered on the site.

## Git

Always run git commands from `projects/ecology/` — the team root folder (`teams/ecology/`) is not a git repository.

Worktrees live in `projects/ecology/.worktrees/`.

## Tech Stack

- Next.js with App Router, static export
- TypeScript
- Tailwind CSS
- MDX via `next-mdx-remote` for content pages
- Activities at `/activities/[id]` (pure React, no MDX)
- Content pages at `/wiki/[slug]` (MDX)
