import fs from 'fs';
import path from 'path';

const habitatsPath = path.resolve('data/habitats.json');
const data = JSON.parse(fs.readFileSync(habitatsPath, 'utf8'));

const newHabitats = [
  {
    "id": "river",
    "title": "River",
    "emoji": "🦦",
    "category": "UK Local",
    "description": "A flowing body of freshwater that journeys from high ground all the way to the sea.",
    "curriculum_links": [
      {
        "subject": "Geography",
        "key_stage": "KS2",
        "year_groups": ["Y3", "Y4"],
        "topic": "Rivers"
      },
      {
        "subject": "Science",
        "key_stage": "KS2",
        "year_groups": ["Y4"],
        "topic": "Living things and their habitats"
      }
    ],
    "climate": "Temperate, with water temperatures changing with the seasons and water levels rising rapidly after heavy rain.",
    "plants": "Water crowfoot, trailing willow branches on the banks, and tall reeds that provide shelter.",
    "fun_facts": [
      "Rivers act as wildlife highways, allowing animals to travel safely and unseen across the country.",
      "The faster the water flows, the more oxygen it traps, which is why some fish like salmon only live in fast rapids!"
    ],
    "image_caption": "An Otter (Lutra lutra) in its natural habitat: River.",
    "animals": [
      {
        "name": "Eurasian Otter",
        "how_it_survives": "Has webbed feet for powerful swimming, dense waterproof fur, and can close its ears and nose underwater while hunting for fish."
      },
      {
        "name": "Kingfisher",
        "how_it_survives": "A bird with a streamlined, bullet-shaped body that lets it dive into the water without making a splash to catch small fish."
      },
      {
        "name": "Atlantic Salmon",
        "how_it_survives": "Born in the river, swims out to the ocean to grow, and then uses a magnetic sense to find its exact birth river to lay its own eggs!"
      }
    ]
  },
  {
    "id": "rock-pool",
    "title": "Rock Pool",
    "emoji": "🦀",
    "category": "UK Local",
    "description": "Small pools of seawater left behind in the rocks on the beach when the tide goes out.",
    "curriculum_links": [
      {
        "subject": "Science",
        "key_stage": "KS1",
        "year_groups": ["Y2"],
        "topic": "Living things and their habitats"
      }
    ],
    "climate": "Extreme microclimate! It can get very hot and salty in the summer sun, or freezing cold in the winter wind before the tide returns.",
    "plants": "Tough seaweeds like kelp, bladderwrack, and encrusting pink algae that cling tightly to the rocks.",
    "fun_facts": [
      "Animals in a rock pool must survive being baked by the sun, battered by crashing waves, and hunted by seagulls all in one day!",
      "Limpets have teeth made of the strongest biological material ever tested—stronger than spider silk!"
    ],
    "image_caption": "A Shore Crab (Carcinus maenas) in its natural habitat: Rock Pool.",
    "animals": [
      {
        "name": "Shore Crab",
        "how_it_survives": "Has a tough exoskeleton to protect it from waves and predators, and hides deep in the rocky crevices when the tide is out."
      },
      {
        "name": "Common Limpet",
        "how_it_survives": "Clamps down onto the rock with incredible force, sealing water inside its shell to stop itself from drying out in the sun."
      },
      {
        "name": "Beadlet Anemone",
        "how_it_survives": "Pulls its stinging tentacles inside its body when the tide goes out, looking like a harmless blob of red jelly to conserve moisture."
      }
    ]
  },
  {
    "id": "taiga-forest",
    "title": "Taiga Forest",
    "emoji": "🌲",
    "category": "Forest",
    "description": "The largest land habitat on Earth, made up of endless evergreen coniferous trees stretching across the cold north.",
    "curriculum_links": [
      {
        "subject": "Geography",
        "key_stage": "KS2",
        "year_groups": ["Y3", "Y4"],
        "topic": "Climate zones and biomes"
      }
    ],
    "climate": "Subarctic. Long, freezing winters with heavy snow, and very short, mild summers.",
    "plants": "Conifer trees like pine, spruce, and fir, which keep their needle-like leaves all year round to catch the weak winter sun.",
    "fun_facts": [
      "The Taiga is so massive that it stretches all the way across North America, Europe, and Asia, holding nearly a third of all the trees in the world!",
      "Conifer needles have a thick waxy coating to stop them from freezing and drying out in the bitter winter wind."
    ],
    "image_caption": "A Brown Bear (Ursus arctos) in its natural habitat: Taiga Forest.",
    "animals": [
      {
        "name": "Brown Bear",
        "how_it_survives": "Eats heavily during the short summer to build up fat, then hibernates in a den through the freezing winter when food is scarce."
      },
      {
        "name": "Moose (Elk)",
        "how_it_survives": "Has incredibly long legs to wade through deep winter snow and reach the high branches of pine trees."
      },
      {
        "name": "Pine Marten",
        "how_it_survives": "An agile tree-climber with semi-retractable claws, allowing it to leap between snow-covered branches to hunt red squirrels."
      }
    ]
  },
  {
    "id": "urban-garden",
    "title": "Urban Garden",
    "emoji": "🏡",
    "category": "UK Local",
    "description": "A man-made habitat full of fences, lawns, and flowerbeds that provides a surprising haven for wildlife in the middle of a city.",
    "curriculum_links": [
      {
        "subject": "Science",
        "key_stage": "KS1",
        "year_groups": ["Y1", "Y2"],
        "topic": "Living things and their habitats"
      }
    ],
    "climate": "Temperate, but often slightly warmer than the surrounding countryside because city buildings trap the sun's heat (the 'urban heat island' effect).",
    "plants": "A mix of native weeds (like dandelions), planted ornamental flowers, lawn grass, and climbing ivy on fences.",
    "fun_facts": [
      "There are over 20 million gardens in the UK. If you put them all together, they would be a bigger habitat than all of the UK's nature reserves combined!",
      "Many animals have learned that human gardens are great places to find food, from bird feeders to compost bins."
    ],
    "image_caption": "An Urban Fox (Vulpes vulpes) in its natural habitat: Urban Garden.",
    "animals": [
      {
        "name": "Urban Fox",
        "how_it_survives": "Highly adaptable and not a fussy eater; it will hunt mice, eat fallen fruit, or scavenge leftover takeaways from bins."
      },
      {
        "name": "Hedgehog",
        "how_it_survives": "Travels through small holes in fences at night, eating slugs and snails from the flowerbeds to help the gardeners."
      },
      {
        "name": "Garden Spider",
        "how_it_survives": "Spins large orb webs across gaps in fences or bushes to catch flying insects, rebuilding the web every single morning."
      }
    ]
  },
  {
    "id": "wildflower-meadow",
    "title": "Wildflower Meadow",
    "emoji": "🌼",
    "category": "Grassland",
    "description": "An open, grassy habitat bursting with colourful flowers that relies on traditional farming or grazing to survive.",
    "curriculum_links": [
      {
        "subject": "Science",
        "key_stage": "KS2",
        "year_groups": ["Y3"],
        "topic": "Plants"
      }
    ],
    "climate": "Temperate, requiring plenty of spring and summer sunshine for the massive variety of flowers to bloom.",
    "plants": "A huge variety of native flowers like ox-eye daisies, buttercups, yellow rattle, and red clover, mixed with fine grasses.",
    "fun_facts": [
      "A healthy meadow can be home to over 100 different types of flowers, attracting thousands of buzzing pollinators.",
      "Since the 1930s, the UK has lost 97% of its wildflower meadows, making them one of our most threatened and precious habitats."
    ],
    "image_caption": "A Buff-tailed Bumblebee (Bombus terrestris) in its natural habitat: Wildflower Meadow.",
    "animals": [
      {
        "name": "Buff-tailed Bumblebee",
        "how_it_survives": "Covered in thick hair to stay warm while flying from flower to flower, collecting nectar and accidentally pollinating the plants."
      },
      {
        "name": "Meadow Brown Butterfly",
        "how_it_survives": "The caterpillars feed exclusively on the fine meadow grasses, perfectly camouflaged in the green stems."
      },
      {
        "name": "Field Vole",
        "how_it_survives": "Weaves intricate tunnel networks through the tall grass to safely hunt for seeds without being spotted by birds of prey above."
      }
    ]
  },
  {
    "id": "rainforest-floor",
    "title": "Rainforest Floor",
    "emoji": "🍄",
    "category": "Tropical",
    "description": "The dark, damp bottom layer of the rainforest where giant tree roots spread out and fallen leaves are quickly recycled.",
    "curriculum_links": [
      {
        "subject": "Geography",
        "key_stage": "KS2",
        "year_groups": ["Y3", "Y4"],
        "topic": "Climate zones and biomes"
      }
    ],
    "climate": "Hot, incredibly humid, and very dark. Less than 2% of the sunlight from the canopy reaches the floor!",
    "plants": "Giant buttress roots of canopy trees, shade-loving ferns, and weird fungi that glow in the dark.",
    "fun_facts": [
      "Because it is so dark, many plants on the forest floor have giant leaves to catch as much of the tiny amount of sunlight as possible.",
      "If a leaf falls to the rainforest floor, it breaks down and disappears in just 6 weeks because the fungi and bugs work so fast!"
    ],
    "image_caption": "Leaf-cutter Ants (Atta) in their natural habitat: Rainforest Floor.",
    "animals": [
      {
        "name": "Leaf-cutter Ant",
        "how_it_survives": "Cuts pieces of leaves and carries them underground, using them to farm a special fungus which they then eat."
      },
      {
        "name": "Jaguar",
        "how_it_survives": "Has a beautiful spotted coat (rosettes) that provides perfect camouflage in the dappled shadows of the forest floor while stalking prey."
      },
      {
        "name": "Poison Dart Frog",
        "how_it_survives": "Uses incredibly bright colours to warn predators on the dark forest floor that its skin is highly toxic."
      }
    ]
  }
];

data.push(...newHabitats);

fs.writeFileSync(habitatsPath, JSON.stringify(data, null, 2));
console.log('Successfully added 6 new habitats.');
