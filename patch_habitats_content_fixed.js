const fs = require('fs');

const contents = {
  'habitat-urban': {
    species: [
      "- **[Urban Fox](/creatures/n369)**: Highly adaptable scavengers that thrive in cities.",
      "- **[Hedgehog](/creatures/n370)**: Prickly nocturnal mammals that visit gardens to eat slugs.",
      "- **[Garden Spider](/creatures/n371)**: Master web-weavers found in almost every backyard."
    ]
  },
  'habitat-freshwater': {
    species: [
      "- **[Common Frog](/creatures/n35)**: Amphibians that begin their life as tadpoles in ponds.",
      "- **[Eurasian Otter](/creatures/n360)**: Playful and elusive fish-hunters found in clean rivers.",
      "- **[Kingfisher](/creatures/n361)**: Brilliant blue-and-orange birds that dive for small fish."
    ]
  },
  'habitat-woodland': {
    species: [
      "- **[Eurasian Badger](/creatures/n304)**: Nocturnal mammals living in underground family setts.",
      "- **[Tawny Owl](/creatures/n305)**: The classic 'twit-twoo' calling owl of the deep woods.",
      "- **[Stag Beetle](/creatures/n309)**: The UK's largest insect, relying on rotting wood."
    ]
  },
  'habitat-grassland': {
    species: [
      "- **[Buff-tailed Bumblebee](/creatures/n372)**: Essential pollinators for meadow flowers.",
      "- **[Meadow Brown Butterfly](/creatures/n373)**: Camouflaged butterflies whose caterpillars eat fine grasses.",
      "- **[Field Vole](/creatures/n374)**: Small mammals that weave tunnels through the tall grass."
    ]
  },
  'habitat-farmland': {
    species: [
      "- **[Hazel Dormouse](/creatures/n306)**: Rare, nocturnal climbers that rely on connected hedgerows.",
      "- **[Yellowhammer](/creatures/n308)**: Farmland birds famous for their 'little bit of bread and no cheese' song.",
      "- **[Vole](/creatures/n49)**: Agile climbers and runners that forage along the bushy edges of fields."
    ]
  },
  'habitat-marine': {
    species: [
      "- **[Shore Crab](/creatures/n363)**: Tough-shelled crustaceans hiding in rocky crevices.",
      "- **[Common Limpet](/creatures/n364)**: Sea snails that clamp onto rocks with incredible force.",
      "- **[Beadlet Anemone](/creatures/n365)**: Jelly-like predators that survive the low tide by pulling their tentacles inside."
    ]
  }
};

for (const [id, data] of Object.entries(contents)) {
  const filePath = `content/${id}.md`;
  let text = fs.readFileSync(filePath, 'utf8');
  
  // Replace the placeholder list by matching the previous incorrect links
  const regex = /- \*\*\[.*?\]\(\/creatures\/.*?\)\*\*: .*?\n- \*\*\[.*?\]\(\/creatures\/.*?\)\*\*: .*?\n- \*\*\[.*?\]\(\/creatures\/.*?\)\*\*: .*?(?=\n)/;
  text = text.replace(regex, data.species.join('\n'));
  
  fs.writeFileSync(filePath, text);
}
