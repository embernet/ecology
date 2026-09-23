# Specification: Bridging to the Natural History GCSE

## 1. Context and Vision
England is introducing a new Natural History GCSE (first teaching expected Sept 2028), heavily emphasising local fieldwork, biological recording, species identification, and nature connectedness. 

While our Ecology Curriculum Website targets KS1 and KS2 (ages 5–11), we are perfectly positioned to act as the "on-ramp" for this GCSE. Rather than duplicating statutory primary content (which is well covered by national providers), our focus will be on the practical gap: **building the habits of a field naturalist early.**

### 🚨 Architectural & Tone Alignment (Important Correction from External Brief)
The external brief suggested clearly separating resources into "teacher paths" and "parent paths". **This violates our core site guideline: "Writing for everyone".** 
To comply with our site's tone:
- We will *not* silo content by audience.
- Instead of "Parent activities", we will frame them as "Local & Garden Projects" open to anyone.
- Instead of "Teacher mappings", we will frame them as "Curriculum & GCSE Progression Links" open to anyone.
- Every page remains accessible and neutrally addressed to all users.

---

## 2. Feature Specifications (What to Build)

### 2.1. The Fieldwork & Recording Toolkit
This is our most distinctive addition, directly mirroring GCSE assessment skills. 
**Implementation:**
- Create a new hub at `/wiki/fieldwork-toolkit`.
- **Printables:** Add high-quality PDF templates to `public/resource-pack/` and expose them via our Resource Index. 
  - *Wildlife Journal Template* (Who, What, Where, When).
  - *Simple Survey Protocols* (e.g., Mini Butterfly Count, Pond Dip, Minibeast Hunt).
  - *Taxonomic Key Handouts* (Child-friendly printable versions for outdoor use).
- **Interactive Taxonomic Keys:** Build a new interactive React/MDX component `<TaxonomicKey />` to complement the printables, allowing users to click through simple branching visual keys on-screen to identify UK invertebrates and leaves.

### 2.2. The Six GCSE Habitat Macro-Categories
The GCSE focuses on six core habitats: **Urban, Freshwater, Woodland, Grassland, Farmland, Marine**. We already have a rich `/habitats` architecture with 26 habitats.
**Implementation:**
- Add a new `gcse_category` field to `data/habitats.json` (e.g., tagging "Pond" and "River" as `Freshwater`; "Rock Pool" as `Marine`).
- **Scope Note:** The GCSE specifically targets British habitats. We will strictly filter the GCSE macro-categories to only include UK habitats. International habitats (e.g., African Savanna, Rainforest) will remain fully accessible in the general primary curriculum view where students learn about the wider world, but will be excluded from the GCSE-specific grouping.
- Update `app/habitats/page.tsx` to optionally group or filter by these 6 macro-categories.
- Create 6 new macro-overview MDX pages (e.g., `/wiki/habitat-freshwater`) that serve as entry points, featuring local UK species, an identification activity, and an outdoor observation task.

### 2.3. The "Road to Natural History GCSE" Hub
A dedicated mapping page showing how the foundational skills built on our site progress into the GCSE requirements.
**Implementation:**
- Create an MDX page at `/wiki/road-to-gcse-natural-history`.
- Use our `<Carousel>` or standard MDX tables to map KS1/KS2 statutory goals -> Fieldwork Toolkit Activities -> GCSE Natural History outcomes.
- Note: This page must include the disclaimer: *"Based on the June 2026 proposed GCSE content, subject to final specification."*

### 2.4. Citizen Science & Nature Connectedness On-Ramp
The GCSE values data sharing and verification. We need to encourage real-world data collection.
**Implementation:**
- Update the `<Creature>` and `<Habitat>` MDX components to conditionally render a `<CitizenScienceCallout>` block.
- This block will link to verified external recording schemes (e.g., iNaturalist, Big Garden Birdwatch, 30 Days Wild) when viewing relevant species (e.g., linking to butterfly counts on the Meadow Brown page).
- Create MDX guides for "Local & Garden Projects" (e.g., building bug hotels, reduced mowing) tagged in the Resource Registry as `Guidance` or `Activity`.

### 2.5. Curated Links (Quality-Marked Resources)
Instead of reinventing the wheel, we will link out to established providers for broad statutory topics.
**Implementation:**
- Expand `public/resource-registry.json` to support an `ExternalResource` type.
- Add curated links to the Oak National Academy, National Education Nature Park, and RSPB Wild Challenge into the Resource Index `/resources`, styled distinctly as external links.

---

## 3. Implementation Phases (Suggested Build Order)

1. **Phase 1: Fieldwork & Recording Toolkit** 
   - *Why:* Highly distinct, immediately useful, doesn't rely on the final GCSE spec.
   - *Tasks:* Build journal templates, "how to record" MDX guides, printable taxonomic keys, and the interactive `<TaxonomicKey />` component.
2. **Phase 2: GCSE Habitat Integration** 
   - *Why:* Leverages our recent massive improvements to the Habitat directory.
   - *Tasks:* Update `habitats.json` (UK only for GCSE tags), adapt the habitat index page, create the 6 macro-category intro pages.
3. **Phase 3: Citizen Science Callouts**
   - *Why:* Drives outdoor engagement.
   - *Tasks:* Build the `<CitizenScienceCallout>` component and inject it into specific creature profiles.
4. **Phase 4: The "Road to GCSE" Hub & Curated Links**
   - *Why:* Ties the strategy together visually and technically.
   - *Tasks:* Write the master MDX document and update the Resource Index to accept external links.
