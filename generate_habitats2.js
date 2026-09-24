const fs = require('fs');
const habitats = [
  { id: 'habitat-urban', title: 'Urban Habitats (GCSE Core)', cat: 'Urban', desc: 'Cities, towns, and villages provide surprising sanctuaries for wildlife.' },
  { id: 'habitat-freshwater', title: 'Freshwater Habitats (GCSE Core)', cat: 'Freshwater', desc: 'Ponds, rivers, and streams teem with aquatic life.' },
  { id: 'habitat-woodland', title: 'Woodland Habitats (GCSE Core)', cat: 'Woodland', desc: 'Forests and woods offer layers of shelter from the canopy to the forest floor.' },
  { id: 'habitat-grassland', title: 'Grassland Habitats (GCSE Core)', cat: 'Grassland', desc: 'Meadows and grassy plains are vital for pollinators and small mammals.' },
  { id: 'habitat-farmland', title: 'Farmland Habitats (GCSE Core)', cat: 'Farmland', desc: 'Hedgerows and field margins are essential corridors for countryside wildlife.' },
  { id: 'habitat-marine', title: 'Marine Habitats (GCSE Core)', cat: 'Marine', desc: 'Rock pools, coastlines, and the shallow seas surrounding the UK.' },
];

habitats.forEach((h, i) => {
  const gId = `g110${i+1}`;
  const aId1 = `a110${i*2 + 1}`;
  const aId2 = `a110${i*2 + 2}`;
  const content = `---
title: "${h.title}"
slug: "${h.id}"
---

<Guidance id={\`${gId}\`} title={\`${h.cat} Habitats\`} text={\`${h.desc} This page is part of our GCSE Natural History preparation, focusing specifically on UK native species and environments.\`} />

## Key UK Species to Look For

Here are some common species you can find in ${h.cat} habitats across the UK:
- **Species 1** (Look up a relevant UK species in our dictionary!)
- **Species 2**

## Identification Activity

<Activity id={\`${aId1}\`} title={\`Spot the ${h.cat} Wildlife\`} emoji={\`🔍\`} description={\`Can you find three different types of plants or animals the next time you visit a ${h.cat} habitat? Record them in your Field Journal!\`} />

## Outdoor Observation

<Activity id={\`${aId2}\`} title={\`10-Minute ${h.cat} Survey\`} emoji={\`⏱️\`} description={\`Sit quietly in this habitat for 10 minutes. Write down everything you hear, see, and smell. What is the most abundant species?\`} />

*Explore our specific ${h.cat} habitat profiles in the [Habitats Directory](/habitats).*
`;
  fs.writeFileSync(`content/${h.id}.md`, content);
});
