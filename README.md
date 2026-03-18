# Ecology Curriculum

A Next.js web application serving free ecology and nature curriculum resources for UK primary school teachers, parents, and anyone wanting to teach or learn about ecology and nature.

## Why I Created This

Knowledge of the natural world – its creatures, the ecosystems and habitats they live in, and the ecology connecting all living things – is important foundational knowledge for everyone on Earth. I work with local schools in my spare time and saw there was a gap in terms of resources easily available to teachers for connecting examples from nature to topics in the educational curriculum. I applied the innovation methods I have learnt in industry to map examples from nature to the curriculum and how biomimicry led to some of our greatest inventions. The youth of today will be the innovators of tomorrow. Nature may well be their best innovation toolbox. Let's share it.

## What This Project Does

- Presents ecology-focused curriculum content aligned to the UK National Curriculum for Science and Geography
- Covers Years 1–6, including topics like plants, animals, habitats, seasonal changes, evolution, and Earth & space
- Provides teaching activities, reflections, curriculum requirements, and nature examples with fun facts
- Loads images from Wikimedia Commons with a lightbox viewer
- Renders Markdown/MDX content with custom React components

## Licence

This project is licensed under the [MIT Licence](LICENSE). You are free to use it directly or copy it and use it as the basis for your own ecology site.

## Project Structure

```
ecology-curriculum/
├── app/
│   ├── layout.tsx            # Root layout with header/nav/footer
│   ├── page.tsx              # Home page (renders ecology-curriculum-home.md)
│   ├── globals.css           # Tailwind CSS + custom markdown styles
│   └── wiki/[slug]/page.tsx  # Dynamic page for all wiki content
├── components/mdx/
│   ├── NatureExample.tsx     # Nature example card with emoji, description, fun facts
│   ├── Requirement.tsx       # Curriculum requirement callout (blue)
│   ├── Activities.tsx        # Activity and Reflection cards
│   ├── Micro.tsx             # Note and Guidance callout blocks
│   ├── Gallery.tsx           # Image gallery grid
│   └── WikiImage.tsx         # Wikimedia Commons image with lightbox modal
├── content/                  # 31 Markdown files with frontmatter
│   ├── ecology-curriculum-home.md
│   ├── science.md
│   ├── geography.md
│   ├── year-1-plants.md
│   ├── year-1-animals-including-humans.md
│   ├── year-1-seasonal-changes.md
│   ├── year-1-everyday-materials.md
│   ├── year-2-plants.md
│   ├── year-2-animals-including-humans.md
│   ├── year-2-living-things-and-their-habitats.md
│   ├── year-2-everyday-materials.md
│   ├── year-3-plants.md
│   ├── year-3-light.md
│   ├── year-4-living-things-and-their-habitats.md
│   ├── year-4-animals-including-humans.md
│   ├── year-4-states-of-matter.md
│   ├── year-4-sound.md
│   ├── year-4-electricity.md
│   ├── year-5-living-things-and-their-habitats.md
│   ├── year-5-earth-and-space.md
│   ├── year-6-living-things-and-their-habitats.md
│   ├── year-6-evolution-and-inheritance.md
│   ├── key-stage-1-geography.md
│   ├── key-stage-2-geography.md
│   ├── teaching-approach.md
│   ├── teaching-principles-used-to-create-the-learning-resources.md
│   ├── other-websites-with-useful-ecology-resources.md
│   └── ...
├── lib/
│   └── content.ts            # File-based content loading (gray-matter + fs)
└── package.json
```

## How It Was Built

### Next.js App

- **Framework**: Next.js 16 with the App Router
- **Styling**: Tailwind CSS v4 with the Typography plugin for prose styling
- **Content rendering**: `next-mdx-remote` renders Markdown files as MDX with custom components at runtime
- **Routing**: Dynamic `[slug]` route under `/wiki/` serves all content pages; `generateStaticParams` enables static generation
- **Content loading**: `lib/content.ts` reads `.md` files from the `content/` directory, parses frontmatter with `gray-matter`

### Custom MDX Components

| Component | Purpose |
|-----------|---------|
| `NatureExample` | Highlighted card with emoji, description, and expandable "Fun Facts" |
| `Requirement` | Blue callout for National Curriculum requirements |
| `Activity` | Indigo card for classroom activities |
| `Reflection` | Purple card for discussion/reflection prompts |
| `Note` | Yellow callout for additional notes |
| `Guidance` | Gray callout for teacher guidance |
| `Gallery` | Responsive image grid using WikiImage |
| `WikiImage` | Loads images from Wikimedia Commons with error fallback and click-to-zoom lightbox |

### Design

- Green/nature color theme (`--color-primary: #2E8B57`)
- Responsive layout with Tailwind utility classes
- Custom heading styles for markdown content
- Internal links use Next.js `<Link>`, external links open in new tabs

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Resource Pack & Resource IDs

The site includes a **Resource Pack** feature that lets teachers build custom collections of resources and share them via URL.

### How Resource IDs Work

Every resource component in the content files (`content/*.md`) must have a unique `id` prop. These IDs are used to construct shareable URLs like `/?resources=n1,a5,r12`.

**ID format**: `[type-prefix][number]`

| Prefix | Component | Example |
|--------|-----------|---------|
| `n` | NatureExample | `n1`, `n42`, `n233` |
| `a` | Activity | `a1`, `a5`, `a100` |
| `r` | Reflection | `r1`, `r12`, `r113` |
| `q` | Requirement | `q1`, `q3`, `q30` |
| `t` | Note | `t1`, `t10`, `t51` |
| `g` | Guidance | `g1`, `g5`, `g17` |

### Adding New Resources

When adding a new resource component to a content file, you **must** include an `id` prop:

```mdx
<NatureExample id={`n234`} title={`My New Example`} emoji={`🌿`} facts={`Some fun facts`}>
  Content here...
</NatureExample>

<Activity id={`a101`} title={`My Activity`} description={`Description here`} />

<Requirement id={`q31`} text={`Requirement text`} />
```

To find the next available number for a type prefix, search the content files for the highest existing number of that prefix.

### Build Validation

The build script (`scripts/build-resource-registry.mjs`) validates all resource IDs at build time:
- Every resource **must** have an `id` prop
- IDs must match the format `[prefix][number]`
- Each resource type must use the correct prefix
- IDs must be **globally unique** across all content files

If validation fails, the build will exit with clear error messages indicating the file, line number, and what needs to be fixed.

### Resource Registry

Running `npm run build:registry` (or automatically via `prebuild`) generates `public/resource-registry.json`, which maps each short ID to its full resource data. This registry is used to reconstruct resource packs from URL parameters.

## Tech Stack

- **Next.js 16** (App Router, React 19)
- **TypeScript**
- **Tailwind CSS v4** with Typography plugin
- **next-mdx-remote** for MDX rendering
- **gray-matter** for frontmatter parsing
- **react-markdown** for inline markdown in components
