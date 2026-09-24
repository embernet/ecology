const fs = require('fs');

const habitats = JSON.parse(fs.readFileSync('data/habitats.json', 'utf8'));

const mappings = {
  'pond': 'Freshwater',
  'woodland': 'Woodland',
  'hedgerow': 'Farmland',
  'dead-log': 'Woodland',
  'oak-tree': 'Woodland',
  'river': 'Freshwater',
  'rock-pool': 'Marine',
  'urban-garden': 'Urban',
  'wildflower-meadow': 'Grassland'
};

habitats.forEach(h => {
  if (mappings[h.id]) {
    h.gcse_category = mappings[h.id];
  }
});

fs.writeFileSync('data/habitats.json', JSON.stringify(habitats, null, 2));
