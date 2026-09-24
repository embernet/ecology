const fs = require('fs');

const creatures = {
  n360: { emoji: '🦦', img: 'river-eurasian-otter.jpg', desc: 'A playful and elusive fish-hunter found in clean rivers.' },
  n361: { emoji: '🐦', img: 'river-kingfisher.jpg', desc: 'A brilliant blue-and-orange bird that dives for small fish.' },
  n362: { emoji: '🐟', img: 'river-atlantic-salmon.jpg', desc: 'A remarkable fish that migrates between rivers and the ocean.' },
  n363: { emoji: '🦀', img: 'rock-pool-shore-crab.jpg', desc: 'A tough-shelled crustacean hiding in rocky crevices.' },
  n364: { emoji: '🐌', img: 'rock-pool-common-limpet.jpg', desc: 'A sea snail that clamps onto rocks with incredible force.' },
  n365: { emoji: '🪸', img: 'rock-pool-beadlet-anemone.jpg', desc: 'A jelly-like predator that survives low tide by pulling its tentacles inside.' },
  n366: { emoji: '🐻', img: 'taiga-forest-brown-bear.jpg', desc: 'A massive omnivore that hibernates through the harsh winter.' },
  n367: { emoji: '🦌', img: 'taiga-forest-moose-elk.jpg', desc: 'The largest species of deer, perfectly adapted to deep snow.' },
  n368: { emoji: '🦡', img: 'taiga-forest-pine-marten.jpg', desc: 'An agile tree-climbing predator with semi-retractable claws.' },
  n369: { emoji: '🦊', img: 'urban-garden-urban-fox.jpg', desc: 'A highly adaptable scavenger that thrives in towns and cities.' },
  n370: { emoji: '🦔', img: 'urban-garden-hedgehog.jpg', desc: 'A prickly nocturnal mammal that visits gardens to eat slugs.' },
  n371: { emoji: '🕷️', img: 'urban-garden-garden-spider.jpg', desc: 'A master web-weaver found in almost every backyard.' },
  n372: { emoji: '🐝', img: 'wildflower-meadow-buff-tailed-bumblebee.jpg', desc: 'An essential pollinator for meadow flowers.' },
  n373: { emoji: '🦋', img: 'wildflower-meadow-meadow-brown-butterfly.jpg', desc: 'A camouflaged butterfly whose caterpillars eat fine grasses.' },
  n374: { emoji: '🐭', img: 'wildflower-meadow-field-vole.jpg', desc: 'A small mammal that weaves tunnels through the tall grass.' },
  n375: { emoji: '🐜', img: 'rainforest-floor-leaf-cutter-ant.jpg', desc: 'A strong insect that farms fungus underground.' },
  n376: { emoji: '🐆', img: 'rainforest-floor-jaguar.jpg', desc: 'A powerful apex predator perfectly camouflaged for the shadows.' },
  n377: { emoji: '🐸', img: 'rainforest-floor-poison-dart-frog.jpg', desc: 'A tiny, brightly coloured amphibian with highly toxic skin.' }
};

let text = fs.readFileSync('content/resources/habitat-creatures.md', 'utf8');

for (const [id, data] of Object.entries(creatures)) {
  const regex = new RegExp(`<Creature id={\`${id}\`} title={\`(.*?)\`} emoji=".*?">\\s*(.*?)\\s*<\\/Creature>`, 's');
  text = text.replace(regex, (match, title, originalFact) => {
    return `<Creature id={\`${id}\`} 
  title={\`${title}\`} 
  emoji={\`${data.emoji}\`} 
  facts={\`- ${originalFact.replace(/\\n/g, '\\n- ')}\`}>
<figure data-wiki-filename="${data.img}">
  <img src="/habitat-images/animals/${data.img}" alt="${title}" style={{maxWidth:"100%",height:"auto"}} loading="lazy" />
  <figcaption>${title}</figcaption>
</figure>
<p>${data.desc}</p>
</Creature>`;
  });
}

fs.writeFileSync('content/resources/habitat-creatures.md', text);
