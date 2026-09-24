const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/habitats.json', 'utf-8'));

const newHabitats = [
  {
    id: "sandy-beach",
    title: "Sandy Beach",
    emoji: "🏖️",
    category: "UK Local",
    gcse_category: "Marine",
    description: "A dynamic environment of loose sand shaped by tides and wind, where life must survive constant movement and salt.",
    curriculum_links: [ { subject: "Science", key_stage: "KS2", year_groups: ["Y4"], topic: "Living things and their habitats" } ],
    climate: "Exposed to harsh winds, baking sun at low tide, and freezing waves in winter.",
    plants: "Marram grass anchors the dunes, while seaweeds wash ashore.",
    fun_facts: [
      "The sand is constantly moving, meaning animals have to be expert diggers to stay put.",
      "Beaches are huge natural water filters for the ocean."
    ],
    image_caption: "A typical sandy beach.",
    animals: [
      { name: "Lugworm", how_it_survives: "Digs deep U-shaped burrows to avoid the crashing waves and hungry birds." },
      { name: "Sandhopper", how_it_survives: "Hides under rotting seaweed during the day to stay damp, coming out at night to feed." }
    ]
  },
  {
    id: "estuary",
    title: "Estuary",
    emoji: "🌊",
    category: "UK Local",
    gcse_category: "Marine",
    description: "Where freshwater rivers meet the salty sea, creating nutrient-rich mudflats that support thousands of wading birds.",
    curriculum_links: [ { subject: "Science", key_stage: "KS2", year_groups: ["Y6"], topic: "Living things and their habitats" } ],
    climate: "Variable salinity (saltiness) that changes twice a day with the tides.",
    plants: "Saltmarsh grasses and samphire that can tolerate being flooded with saltwater.",
    fun_facts: [
      "Estuaries are sometimes called the 'nurseries of the sea' because many fish lay their eggs there.",
      "The mud can be so thick and sticky it acts like quicksand."
    ],
    image_caption: "An estuary mudflat at low tide.",
    animals: [
      { name: "Curlew", how_it_survives: "Uses its long, curved beak to probe deep into the mud for worms." },
      { name: "Flounder", how_it_survives: "A flatfish that buries itself in the mud to hide from predators." }
    ]
  },
  {
    id: "arable-field",
    title: "Arable Field",
    emoji: "🌾",
    category: "UK Local",
    gcse_category: "Farmland",
    description: "Large open fields used for growing crops like wheat and barley, providing food for humans and wildlife.",
    curriculum_links: [ { subject: "Science", key_stage: "KS2", year_groups: ["Y4"], topic: "Living things and their habitats" } ],
    climate: "Exposed to all weather conditions, completely dependent on the seasons for crop growth.",
    plants: "Wheat, barley, oats, and specialized 'arable weeds' like poppies and cornflowers.",
    fun_facts: [
      "Arable fields change completely every year when the farmer harvests the crops and ploughs the soil.",
      "Many ground-nesting birds rely on these fields for camouflage."
    ],
    image_caption: "A golden wheat field in summer.",
    animals: [
      { name: "Skylark", how_it_survives: "Nests on the ground hidden among the tall crop stems." },
      { name: "Brown Hare", how_it_survives: "Relies on its incredible speed to escape predators in the open field." }
    ]
  },
  {
    id: "pasture",
    title: "Pasture",
    emoji: "🐄",
    category: "UK Local",
    gcse_category: "Farmland",
    description: "Fields of grass used for grazing livestock like sheep and cows, often dotted with thistles and cow pats.",
    curriculum_links: [ { subject: "Science", key_stage: "KS1", year_groups: ["Y2"], topic: "Living things and their habitats" } ],
    climate: "Temperate, often damp, keeping the grass green for most of the year.",
    plants: "Perennial ryegrass, white clover, and nettles.",
    fun_facts: [
      "A single cow pat can support hundreds of different insects!",
      "The constant grazing keeps tree saplings from growing, maintaining the open grassland."
    ],
    image_caption: "Sheep grazing on green pasture.",
    animals: [
      { name: "Dung Beetle", how_it_survives: "Feeds on and buries animal dung, returning nutrients to the soil." },
      { name: "Field Vole", how_it_survives: "Creates a network of tunnels through the thick base of the grass." }
    ]
  },
  {
    id: "city-park",
    title: "City Park",
    emoji: "⛲",
    category: "UK Local",
    gcse_category: "Urban",
    description: "A managed green space in a town or city, providing a vital oasis for wildlife amongst roads and buildings.",
    curriculum_links: [ { subject: "Science", key_stage: "KS2", year_groups: ["Y4"], topic: "Living things and their habitats" } ],
    climate: "Often slightly warmer than the surrounding countryside due to the 'urban heat island' effect.",
    plants: "Mown grass, ornamental flower beds, and large mature trees.",
    fun_facts: [
      "Urban parks often have a higher density of foxes than the countryside.",
      "Many park lakes are artificial but still attract thousands of wild birds."
    ],
    image_caption: "A large city park with a pond.",
    animals: [
      { name: "Grey Squirrel", how_it_survives: "Highly adaptable and unafraid of humans, eating anything from acorns to discarded sandwiches." },
      { name: "Mallard Duck", how_it_survives: "Thrives on artificial park ponds, supplementing its natural diet with food given by humans." }
    ]
  },
  {
    id: "brownfield-site",
    title: "Brownfield Site",
    emoji: "🏗️",
    category: "UK Local",
    gcse_category: "Urban",
    description: "Abandoned industrial sites where nature has taken back over, creating unique and rare habitats on crushed concrete.",
    curriculum_links: [ { subject: "Science", key_stage: "KS2", year_groups: ["Y6"], topic: "Living things and their habitats" } ],
    climate: "Dry, hot, and exposed, resembling a desert microclimate in the summer.",
    plants: "Buddleia (butterfly bush), mosses, and tough pioneer plants that can grow in poor soil.",
    fun_facts: [
      "Brownfield sites can sometimes hold more rare species than 'natural' green spaces.",
      "The rubble heats up in the sun, creating perfect basking spots for reptiles."
    ],
    image_caption: "Nature reclaiming an old industrial site.",
    animals: [
      { name: "Common Lizard", how_it_survives: "Basks on warm concrete rubble to raise its body temperature." },
      { name: "Cinnabar Moth", how_it_survives: "Its caterpillars feed on ragwort, a toxic plant that thrives in the poor soil." }
    ]
  },
  {
    id: "chalk-downland",
    title: "Chalk Downland",
    emoji: "🦋",
    category: "UK Local",
    gcse_category: "Grassland",
    description: "Hilly, nutrient-poor grassland found over chalk rock, famous for its incredibly diverse wildflowers and butterflies.",
    curriculum_links: [ { subject: "Science", key_stage: "KS2", year_groups: ["Y6"], topic: "Living things and their habitats" } ],
    climate: "Well-drained soil means it can be very dry; exposed hillsides are often windy.",
    plants: "Rare wild orchids, wild thyme, and specialized grasses.",
    fun_facts: [
      "A single square meter of chalk downland can contain up to 40 different plant species!",
      "It is sometimes called 'Europe's tropical rainforest' because of its biodiversity."
    ],
    image_caption: "Rolling chalk hills covered in summer wildflowers.",
    animals: [
      { name: "Adonis Blue Butterfly", how_it_survives: "Its caterpillars feed exclusively on horseshoe vetch, a plant that only grows on chalky soil." },
      { name: "Skylark", how_it_survives: "Sings its famous complex song while hovering high above the open hills." }
    ]
  }
];

data.push(...newHabitats);

fs.writeFileSync('data/habitats.json', JSON.stringify(data, null, 2));
