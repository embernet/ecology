const fs = require('fs');

const contents = {
  'habitat-urban': {
    species: [
      "- **[Urban Fox](/creatures/urban-garden-urban-fox)**: Highly adaptable scavengers that thrive in cities.",
      "- **[Hedgehog](/creatures/urban-garden-hedgehog)**: Prickly nocturnal mammals that visit gardens to eat slugs.",
      "- **[Garden Spider](/creatures/urban-garden-garden-spider)**: Master web-weavers found in almost every backyard."
    ]
  },
  'habitat-freshwater': {
    species: [
      "- **[Common Frog](/creatures/pond-common-frog)**: Amphibians that begin their life as tadpoles in ponds.",
      "- **[Eurasian Otter](/creatures/river-eurasian-otter)**: Playful and elusive fish-hunters found in clean rivers.",
      "- **[Kingfisher](/creatures/river-kingfisher)**: Brilliant blue-and-orange birds that dive for small fish."
    ]
  },
  'habitat-woodland': {
    species: [
      "- **[Badger](/creatures/woodland-badger)**: Nocturnal mammals living in underground family sets.",
      "- **[Tawny Owl](/creatures/woodland-tawny-owl)**: The classic 'twit-twoo' calling owl of the deep woods.",
      "- **[Stag Beetle](/creatures/dead-log-stag-beetle)**: The UK's largest insect, relying on rotting wood."
    ]
  },
  'habitat-grassland': {
    species: [
      "- **[Buff-tailed Bumblebee](/creatures/wildflower-meadow-buff-tailed-bumblebee)**: Essential pollinators for meadow flowers.",
      "- **[Meadow Brown Butterfly](/creatures/wildflower-meadow-meadow-brown-butterfly)**: Camouflaged butterflies whose caterpillars eat fine grasses.",
      "- **[Field Vole](/creatures/wildflower-meadow-field-vole)**: Small mammals that weave tunnels through the tall grass."
    ]
  },
  'habitat-farmland': {
    species: [
      "- **[Hazel Dormouse](/creatures/hedgerow-dormouse)**: Rare, nocturnal climbers that rely on connected hedgerows.",
      "- **[Yellowhammer](/creatures/hedgerow-yellowhammer)**: Farmland birds famous for their 'little bit of bread and no cheese' song.",
      "- **[Bank Vole](/creatures/hedgerow-bank-vole)**: Agile climbers that forage along the bushy edges of fields."
    ]
  },
  'habitat-marine': {
    species: [
      "- **[Shore Crab](/creatures/rock-pool-shore-crab)**: Tough-shelled crustaceans hiding in rocky crevices.",
      "- **[Common Limpet](/creatures/rock-pool-common-limpet)**: Sea snails that clamp onto rocks with incredible force.",
      "- **[Beadlet Anemone](/creatures/rock-pool-beadlet-anemone)**: Jelly-like predators that survive the low tide by pulling their tentacles inside."
    ]
  }
};

for (const [id, data] of Object.entries(contents)) {
  const filePath = `content/${id}.md`;
  let text = fs.readFileSync(filePath, 'utf8');
  
  // Replace the placeholder list
  const regex = /- \*\*Species 1\*\*(?:.|\n)*- \*\*Species 2\*\*/;
  text = text.replace(regex, data.species.join('\n'));
  
  fs.writeFileSync(filePath, text);
}
