export type TemplateType = 'name-describe' | 'sequence' | 'sort-classify' | 'label-parts' | 'lifecycle'

export type YearGroup = 'y12' | 'y34' | 'y56'

export interface ActivitySubject {
  image_id: string
  role: string
}

export interface ActivityCallout {
  role: string       // matches a label key
  x: number          // % from left of image
  y: number          // % from top of image
  label: string      // correct answer text
}

export interface ActivityDefinition {
  id: string
  title: string
  description: string
  template: TemplateType
  year_groups: YearGroup[]
  subjects: ActivitySubject[]
  // name-describe fields
  name_labels?: Record<string, string>
  description_labels?: Record<string, string[]>
  description_box_count?: number
  label_pool?: string[]
  // sequence fields
  correct_order?: string[]
  stage_labels?: Record<string, string>
  // sort-classify fields
  categories?: { label: string; image_ids: string[] }[]
  // label-parts fields
  callouts?: ActivityCallout[]
}

export const ACTIVITIES: ActivityDefinition[] = [
  // ── BUTTERFLY OR MOTH — NAME & DESCRIBE ──────────────────────────────────

  {
    id: 'name-describe-butterfly-moth-y12',
    title: 'Butterfly or Moth?',
    description: 'Drag the labels into the boxes to name each creature and describe it.',
    template: 'name-describe',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'red-admiral-01', role: 'butterfly' },
      { image_id: 'large-yellow-underwing-01', role: 'moth' },
    ],
    name_labels: {
      butterfly: 'Butterfly',
      moth: 'Moth',
    },
    description_labels: {
      butterfly: ['Flies by day'],
      moth: ['Flies at night'],
    },
    description_box_count: 1,
    label_pool: ['Butterfly', 'Moth', 'Flies by day', 'Flies at night'],
  },
  {
    id: 'name-describe-butterfly-moth-y34',
    title: 'Butterfly or Moth?',
    description: 'Name each creature and add two description labels to each one.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'red-admiral-01', role: 'butterfly' },
      { image_id: 'large-yellow-underwing-01', role: 'moth' },
    ],
    name_labels: {
      butterfly: 'Butterfly',
      moth: 'Moth',
    },
    description_labels: {
      butterfly: ['Flies by day', 'Thin clubbed antennae'],
      moth: ['Flies at night', 'Thick feathery antennae'],
    },
    description_box_count: 2,
    label_pool: [
      'Butterfly', 'Moth',
      'Flies by day', 'Flies at night',
      'Thin clubbed antennae', 'Thick feathery antennae',
    ],
  },
  {
    id: 'name-describe-butterfly-moth-y56',
    title: 'Butterfly or Moth?',
    description: 'Name each creature and add three description labels to each one.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'red-admiral-01', role: 'butterfly' },
      { image_id: 'large-yellow-underwing-01', role: 'moth' },
    ],
    name_labels: {
      butterfly: 'Butterfly',
      moth: 'Moth',
    },
    description_labels: {
      butterfly: ['Active by day', 'Thin clubbed antennae', 'Rests with wings upright'],
      moth: ['Active at night', 'Broad feathery antennae', 'Rests with wings flat'],
    },
    description_box_count: 3,
    label_pool: [
      'Butterfly', 'Moth',
      'Active by day', 'Active at night',
      'Thin clubbed antennae', 'Broad feathery antennae',
      'Rests with wings upright', 'Rests with wings flat',
    ],
  },

  // ── NAME THE BUTTERFLY — NAME & DESCRIBE ─────────────────────────────────

  {
    id: 'name-butterfly-y12',
    title: 'Name the Butterfly',
    description: 'Drag the name label to match each butterfly.',
    template: 'name-describe',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'red-admiral-01', role: 'red-admiral' },
      { image_id: 'peacock-butterfly-01', role: 'peacock' },
      { image_id: 'large-white-01', role: 'large-white' },
      { image_id: 'brimstone-01', role: 'brimstone' },
    ],
    name_labels: {
      'red-admiral': 'Red Admiral',
      peacock: 'Peacock',
      'large-white': 'Large White',
      brimstone: 'Brimstone',
    },
    description_labels: {
      'red-admiral': ['Red and black wings'],
      peacock: ['Has eye-spots'],
      'large-white': ['White wings'],
      brimstone: ['Yellow wings'],
    },
    description_box_count: 1,
    label_pool: [
      'Red Admiral', 'Peacock', 'Large White', 'Brimstone',
      'Red and black wings', 'Has eye-spots', 'White wings', 'Yellow wings',
    ],
  },
  {
    id: 'name-butterfly-y34',
    title: 'Name the Butterfly',
    description: 'Name each butterfly and add two description labels.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'red-admiral-01', role: 'red-admiral' },
      { image_id: 'peacock-butterfly-01', role: 'peacock' },
      { image_id: 'large-white-01', role: 'large-white' },
      { image_id: 'brimstone-01', role: 'brimstone' },
    ],
    name_labels: {
      'red-admiral': 'Red Admiral',
      peacock: 'Peacock',
      'large-white': 'Large White',
      brimstone: 'Brimstone',
    },
    description_labels: {
      'red-admiral': ['Red bands on black wings', 'Visits buddleia'],
      peacock: ['Has four eye-spots', 'Hibernates in winter'],
      'large-white': ['White wings, black tips', 'Lays eggs on cabbages'],
      brimstone: ['Sulphur-yellow wings', 'First butterfly of spring'],
    },
    description_box_count: 2,
    label_pool: [
      'Red Admiral', 'Peacock', 'Large White', 'Brimstone',
      'Red bands on black wings', 'Visits buddleia',
      'Has four eye-spots', 'Hibernates in winter',
      'White wings, black tips', 'Lays eggs on cabbages',
      'Sulphur-yellow wings', 'First butterfly of spring',
    ],
  },
  {
    id: 'name-butterfly-y56',
    title: 'Name the Butterfly',
    description: 'Name each butterfly and add three description labels, including its scientific name.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'red-admiral-01', role: 'red-admiral' },
      { image_id: 'peacock-butterfly-01', role: 'peacock' },
      { image_id: 'large-white-01', role: 'large-white' },
      { image_id: 'brimstone-01', role: 'brimstone' },
    ],
    name_labels: {
      'red-admiral': 'Red Admiral',
      peacock: 'Peacock',
      'large-white': 'Large White',
      brimstone: 'Brimstone',
    },
    description_labels: {
      'red-admiral': ['Vanessa atalanta', 'Migrates from Europe', 'Nectars on ivy flowers'],
      peacock: ['Aglais io', 'Hisses to deter predators', 'Overwinters as an adult'],
      'large-white': ['Pieris brassicae', 'A pest of brassica crops', 'Caterpillar is yellow and black'],
      brimstone: ['Gonepteryx rhamni', 'Feeds on buckthorn', 'Can live up to 13 months'],
    },
    description_box_count: 3,
    label_pool: [
      'Red Admiral', 'Peacock', 'Large White', 'Brimstone',
      'Vanessa atalanta', 'Migrates from Europe', 'Nectars on ivy flowers',
      'Aglais io', 'Hisses to deter predators', 'Overwinters as an adult',
      'Pieris brassicae', 'A pest of brassica crops', 'Caterpillar is yellow and black',
      'Gonepteryx rhamni', 'Feeds on buckthorn', 'Can live up to 13 months',
    ],
  },

  // ── NAME THE MOTH — NAME & DESCRIBE ───────────────────────────────────────

  {
    id: 'name-moth-y12',
    title: 'Name the Moth',
    description: 'Drag the name label to match each moth.',
    template: 'name-describe',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'garden-tiger-01', role: 'garden-tiger' },
      { image_id: 'cinnabar-01', role: 'cinnabar' },
      { image_id: 'elephant-hawk-moth-01', role: 'elephant-hawk' },
      { image_id: 'six-spot-burnet-01', role: 'six-spot-burnet' },
    ],
    name_labels: {
      'garden-tiger': 'Garden Tiger',
      cinnabar: 'Cinnabar',
      'elephant-hawk': 'Elephant Hawk-moth',
      'six-spot-burnet': 'Six-spot Burnet',
    },
    description_labels: {
      'garden-tiger': ['White and brown wings'],
      cinnabar: ['Red and black wings'],
      'elephant-hawk': ['Pink and green wings'],
      'six-spot-burnet': ['Has six red spots'],
    },
    description_box_count: 1,
    label_pool: [
      'Garden Tiger', 'Cinnabar', 'Elephant Hawk-moth', 'Six-spot Burnet',
      'White and brown wings', 'Red and black wings', 'Pink and green wings', 'Has six red spots',
    ],
  },
  {
    id: 'name-moth-y34',
    title: 'Name the Moth',
    description: 'Name each moth and add two description labels.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'garden-tiger-01', role: 'garden-tiger' },
      { image_id: 'cinnabar-01', role: 'cinnabar' },
      { image_id: 'elephant-hawk-moth-01', role: 'elephant-hawk' },
      { image_id: 'six-spot-burnet-01', role: 'six-spot-burnet' },
    ],
    name_labels: {
      'garden-tiger': 'Garden Tiger',
      cinnabar: 'Cinnabar',
      'elephant-hawk': 'Elephant Hawk-moth',
      'six-spot-burnet': 'Six-spot Burnet',
    },
    description_labels: {
      'garden-tiger': ['White and brown patterned wings', 'Orange hindwings with black spots'],
      cinnabar: ['Red and black wings', 'Caterpillar is orange and black'],
      'elephant-hawk': ['Pink and olive-green wings', 'Named after its caterpillar'],
      'six-spot-burnet': ['Six red spots on dark wings', 'Flies in the daytime'],
    },
    description_box_count: 2,
    label_pool: [
      'Garden Tiger', 'Cinnabar', 'Elephant Hawk-moth', 'Six-spot Burnet',
      'White and brown patterned wings', 'Orange hindwings with black spots',
      'Red and black wings', 'Caterpillar is orange and black',
      'Pink and olive-green wings', 'Named after its caterpillar',
      'Six red spots on dark wings', 'Flies in the daytime',
    ],
  },
  {
    id: 'name-moth-y56',
    title: 'Name the Moth',
    description: 'Name each moth and add three description labels, including its scientific name.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'garden-tiger-01', role: 'garden-tiger' },
      { image_id: 'cinnabar-01', role: 'cinnabar' },
      { image_id: 'elephant-hawk-moth-01', role: 'elephant-hawk' },
      { image_id: 'six-spot-burnet-01', role: 'six-spot-burnet' },
    ],
    name_labels: {
      'garden-tiger': 'Garden Tiger',
      cinnabar: 'Cinnabar',
      'elephant-hawk': 'Elephant Hawk-moth',
      'six-spot-burnet': 'Six-spot Burnet',
    },
    description_labels: {
      'garden-tiger': ['Arctia caja', 'Bright colours warn predators', 'Caterpillar is the woolly bear'],
      cinnabar: ['Tyria jacobaeae', 'Lays eggs on ragwort', 'Aposematic colouration'],
      'elephant-hawk': ['Deilephila elpenor', 'Caterpillar has false eyespots', 'Hovers to feed on flowers'],
      'six-spot-burnet': ['Zygaena filipendulae', 'Active during the day', 'Contains hydrogen cyanide'],
    },
    description_box_count: 3,
    label_pool: [
      'Garden Tiger', 'Cinnabar', 'Elephant Hawk-moth', 'Six-spot Burnet',
      'Arctia caja', 'Bright colours warn predators', 'Caterpillar is the woolly bear',
      'Tyria jacobaeae', 'Lays eggs on ragwort', 'Aposematic colouration',
      'Deilephila elpenor', 'Caterpillar has false eyespots', 'Hovers to feed on flowers',
      'Zygaena filipendulae', 'Active during the day', 'Contains hydrogen cyanide',
    ],
  },

  // ── NAME THE WILDFLOWER — NAME & DESCRIBE ─────────────────────────────────

  {
    id: 'name-wildflower-y12',
    title: 'Name the Wildflower',
    description: 'Drag the name label to match each flower.',
    template: 'name-describe',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'bluebell-01', role: 'bluebell' },
      { image_id: 'common-poppy-01', role: 'poppy' },
      { image_id: 'common-daisy-01', role: 'daisy' },
      { image_id: 'dandelion-01', role: 'dandelion' },
    ],
    name_labels: {
      bluebell: 'Bluebell',
      poppy: 'Poppy',
      daisy: 'Daisy',
      dandelion: 'Dandelion',
    },
    description_labels: {
      bluebell: ['Blue bell-shaped flowers'],
      poppy: ['Bright red petals'],
      daisy: ['White petals, yellow centre'],
      dandelion: ['Yellow and fluffy'],
    },
    description_box_count: 1,
    label_pool: [
      'Bluebell', 'Poppy', 'Daisy', 'Dandelion',
      'Blue bell-shaped flowers', 'Bright red petals', 'White petals, yellow centre', 'Yellow and fluffy',
    ],
  },
  {
    id: 'name-wildflower-y34',
    title: 'Name the Wildflower',
    description: 'Name each wildflower and add two description labels.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'bluebell-01', role: 'bluebell' },
      { image_id: 'common-poppy-01', role: 'poppy' },
      { image_id: 'foxglove-01', role: 'foxglove' },
      { image_id: 'common-daisy-01', role: 'daisy' },
    ],
    name_labels: {
      bluebell: 'Bluebell',
      poppy: 'Common Poppy',
      foxglove: 'Foxglove',
      daisy: 'Common Daisy',
    },
    description_labels: {
      bluebell: ['Found in woodland', 'Nodding bell-shaped flowers'],
      poppy: ['Grows in fields and verges', 'Four crinkled red petals'],
      foxglove: ['Tall purple flower spike', 'Poisonous to eat'],
      daisy: ['Grows on lawns and meadows', 'Closes at night'],
    },
    description_box_count: 2,
    label_pool: [
      'Bluebell', 'Common Poppy', 'Foxglove', 'Common Daisy',
      'Found in woodland', 'Nodding bell-shaped flowers',
      'Grows in fields and verges', 'Four crinkled red petals',
      'Tall purple flower spike', 'Poisonous to eat',
      'Grows on lawns and meadows', 'Closes at night',
    ],
  },
  {
    id: 'name-wildflower-y56',
    title: 'Name the Wildflower',
    description: 'Name each wildflower and add three description labels, including its scientific name.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'bluebell-01', role: 'bluebell' },
      { image_id: 'common-poppy-01', role: 'poppy' },
      { image_id: 'foxglove-01', role: 'foxglove' },
      { image_id: 'cowslip-01', role: 'cowslip' },
    ],
    name_labels: {
      bluebell: 'Bluebell',
      poppy: 'Common Poppy',
      foxglove: 'Foxglove',
      cowslip: 'Cowslip',
    },
    description_labels: {
      bluebell: ['Hyacinthoides non-scripta', 'UK native, not Spanish bluebell', 'Flowers April to May'],
      poppy: ['Papaver rhoeas', 'Annual meadow flower', 'Symbol of remembrance'],
      foxglove: ['Digitalis purpurea', 'Source of the heart drug digitalis', 'Biennial plant'],
      cowslip: ['Primula veris', 'Indicator of ancient meadow', 'Flowers in spring'],
    },
    description_box_count: 3,
    label_pool: [
      'Bluebell', 'Common Poppy', 'Foxglove', 'Cowslip',
      'Hyacinthoides non-scripta', 'UK native, not Spanish bluebell', 'Flowers April to May',
      'Papaver rhoeas', 'Annual meadow flower', 'Symbol of remembrance',
      'Digitalis purpurea', 'Source of the heart drug digitalis', 'Biennial plant',
      'Primula veris', 'Indicator of ancient meadow', 'Flowers in spring',
    ],
  },

  // ── FROG OR TOAD — NAME & DESCRIBE ────────────────────────────────────────

  {
    id: 'name-describe-frog-toad-y12',
    title: 'Frog or Toad?',
    description: 'Name each creature and add two description labels.',
    template: 'name-describe',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'adult-common-frog-01', role: 'frog' },
      { image_id: 'adult-common-toad-01', role: 'toad' },
    ],
    name_labels: { frog: 'Frog', toad: 'Toad' },
    description_labels: {
      frog: ['Smooth skin', 'Likes to jump'],
      toad: ['Bumpy skin', 'Likes to walk'],
    },
    description_box_count: 2,
    label_pool: ['Frog', 'Toad', 'Smooth skin', 'Bumpy skin', 'Likes to jump', 'Likes to walk'],
  },
  {
    id: 'name-describe-frog-toad-y34',
    title: 'Frog or Toad?',
    description: 'Name each creature and add three description labels.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'adult-common-frog-01', role: 'frog' },
      { image_id: 'adult-common-toad-01', role: 'toad' },
    ],
    name_labels: { frog: 'Common Frog', toad: 'Common Toad' },
    description_labels: {
      frog: ['Smooth moist skin', 'Leaps to escape danger', 'Lays spawn in clumps'],
      toad: ['Dry warty skin', 'Walks rather than jumps', 'Lays spawn in strings'],
    },
    description_box_count: 3,
    label_pool: [
      'Common Frog', 'Common Toad',
      'Smooth moist skin', 'Leaps to escape danger', 'Lays spawn in clumps',
      'Dry warty skin', 'Walks rather than jumps', 'Lays spawn in strings',
    ],
  },
  {
    id: 'name-describe-frog-toad-y56',
    title: 'Frog or Toad?',
    description: 'Name each creature and add three description labels, including its scientific name.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'adult-common-frog-01', role: 'frog' },
      { image_id: 'adult-common-toad-01', role: 'toad' },
    ],
    name_labels: { frog: 'Common Frog', toad: 'Common Toad' },
    description_labels: {
      frog: ['Rana temporaria', 'Smooth moist skin', 'Lays spawn in clumps'],
      toad: ['Bufo bufo', 'Dry warty skin', 'Lays spawn in strings'],
    },
    description_box_count: 3,
    label_pool: [
      'Common Frog', 'Common Toad',
      'Rana temporaria', 'Smooth moist skin', 'Lays spawn in clumps', 'Leaps to escape danger',
      'Bufo bufo', 'Dry warty skin', 'Lays spawn in strings', 'Walks rather than jumps',
    ],
  },

  // ── SLUG OR SNAIL — NAME & DESCRIBE ───────────────────────────────────────

  {
    id: 'name-describe-slug-snail-y12',
    title: 'Slug or Snail?',
    description: 'Drag the labels to name each creature and describe it.',
    template: 'name-describe',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'garden-slug-01', role: 'slug' },
      { image_id: 'common-garden-snail-01', role: 'snail' },
    ],
    name_labels: { slug: 'Slug', snail: 'Snail' },
    description_labels: {
      slug: ['No shell'],
      snail: ['Has a shell'],
    },
    description_box_count: 1,
    label_pool: ['Slug', 'Snail', 'No shell', 'Has a shell'],
  },
  {
    id: 'name-describe-slug-snail-y34',
    title: 'Slug or Snail?',
    description: 'Name each creature and add two description labels.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'leopard-slug-01', role: 'slug' },
      { image_id: 'common-garden-snail-01', role: 'snail' },
    ],
    name_labels: { slug: 'Slug', snail: 'Snail' },
    description_labels: {
      slug: ['No shell', 'Leaves a slime trail'],
      snail: ['Has a coiled shell', 'Can retreat inside its shell'],
    },
    description_box_count: 2,
    label_pool: [
      'Slug', 'Snail',
      'No shell', 'Leaves a slime trail',
      'Has a coiled shell', 'Can retreat inside its shell',
    ],
  },
  {
    id: 'name-describe-slug-snail-y56',
    title: 'Slug or Snail?',
    description: 'Name each creature and add three description labels, including scientific name.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'leopard-slug-01', role: 'slug' },
      { image_id: 'common-garden-snail-01', role: 'snail' },
    ],
    name_labels: { slug: 'Leopard Slug', snail: 'Common Garden Snail' },
    description_labels: {
      slug: ['Limax maximus', 'Spotted pattern for camouflage', 'Breathes through a pneumostome'],
      snail: ['Cornu aspersum', 'Shell provides protection', 'Breathes through a pneumostome'],
    },
    description_box_count: 3,
    label_pool: [
      'Leopard Slug', 'Common Garden Snail',
      'Limax maximus', 'Spotted pattern for camouflage', 'Breathes through a pneumostome',
      'Cornu aspersum', 'Shell provides protection', 'Breathes through a pneumostome',
    ],
  },

  // ── NAME THE SNAIL — NAME & DESCRIBE ──────────────────────────────────────

  {
    id: 'name-snail-y34',
    title: 'Name the Snail',
    description: 'Name each snail and add two description labels.',
    template: 'name-describe',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'common-garden-snail-01', role: 'garden-snail' },
      { image_id: 'white-lipped-snail-01', role: 'white-lipped' },
      { image_id: 'brown-lipped-snail-01', role: 'brown-lipped' },
    ],
    name_labels: {
      'garden-snail': 'Common Garden Snail',
      'white-lipped': 'White-lipped Snail',
      'brown-lipped': 'Brown-lipped Snail',
    },
    description_labels: {
      'garden-snail': ['Large brown banded shell', 'Common in gardens'],
      'white-lipped': ['White rim around the opening', 'Small and colourful shell'],
      'brown-lipped': ['Dark brown rim around the opening', 'Small and colourful shell'],
    },
    description_box_count: 2,
    label_pool: [
      'Common Garden Snail', 'White-lipped Snail', 'Brown-lipped Snail',
      'Large brown banded shell', 'Common in gardens',
      'White rim around the opening', 'Small and colourful shell',
      'Dark brown rim around the opening',
    ],
  },
  {
    id: 'name-snail-y56',
    title: 'Name the Snail',
    description: 'Name each snail and add three description labels, including scientific name.',
    template: 'name-describe',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'common-garden-snail-01', role: 'garden-snail' },
      { image_id: 'white-lipped-snail-01', role: 'white-lipped' },
      { image_id: 'brown-lipped-snail-01', role: 'brown-lipped' },
    ],
    name_labels: {
      'garden-snail': 'Common Garden Snail',
      'white-lipped': 'White-lipped Snail',
      'brown-lipped': 'Brown-lipped Snail',
    },
    description_labels: {
      'garden-snail': ['Cornu aspersum', 'Shell up to 40mm wide', 'Can live for up to 5 years'],
      'white-lipped': ['Cepaea hortensis', 'White peristome (lip)', 'Highly variable shell colour'],
      'brown-lipped': ['Cepaea nemoralis', 'Dark brown peristome (lip)', 'Shell colour varies with habitat'],
    },
    description_box_count: 3,
    label_pool: [
      'Common Garden Snail', 'White-lipped Snail', 'Brown-lipped Snail',
      'Cornu aspersum', 'Shell up to 40mm wide', 'Can live for up to 5 years',
      'Cepaea hortensis', 'White peristome (lip)', 'Highly variable shell colour',
      'Cepaea nemoralis', 'Dark brown peristome (lip)', 'Shell colour varies with habitat',
    ],
  },

  // ── FROG LIFE CYCLE — SEQUENCE ────────────────────────────────────────────

  {
    id: 'sequence-frog-lifecycle-y12',
    title: 'Frog Life Cycle',
    description: 'Put the pictures in the correct order to show how a frog grows.',
    template: 'lifecycle',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'frogspawn-01', role: 'stage-1' },
      { image_id: 'frog-tadpole-young-01', role: 'stage-2' },
      { image_id: 'frog-tadpole-four-legs-01', role: 'stage-3' },
      { image_id: 'adult-common-frog-01', role: 'stage-4' },
    ],
    correct_order: ['frogspawn-01', 'frog-tadpole-young-01', 'frog-tadpole-four-legs-01', 'adult-common-frog-01'],
    stage_labels: {
      'frogspawn-01': 'Frogspawn',
      'frog-tadpole-young-01': 'Tadpole',
      'frog-tadpole-four-legs-01': 'Froglet',
      'adult-common-frog-01': 'Frog',
    },
    label_pool: [],
  },
  {
    id: 'sequence-frog-lifecycle-y34',
    title: 'Frog Life Cycle',
    description: 'Put the five stages in the correct order to show how a frog develops.',
    template: 'lifecycle',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'frogspawn-01', role: 'stage-1' },
      { image_id: 'frog-tadpole-young-01', role: 'stage-2' },
      { image_id: 'frog-tadpole-back-legs-01', role: 'stage-3' },
      { image_id: 'frog-tadpole-four-legs-01', role: 'stage-4' },
      { image_id: 'adult-common-frog-01', role: 'stage-5' },
    ],
    correct_order: [
      'frogspawn-01', 'frog-tadpole-young-01', 'frog-tadpole-back-legs-01',
      'frog-tadpole-four-legs-01', 'adult-common-frog-01',
    ],
    stage_labels: {
      'frogspawn-01': 'Frogspawn',
      'frog-tadpole-young-01': 'Young tadpole',
      'frog-tadpole-back-legs-01': 'Tadpole with back legs',
      'frog-tadpole-four-legs-01': 'Froglet',
      'adult-common-frog-01': 'Adult frog',
    },
    label_pool: [],
  },
  {
    id: 'sequence-frog-lifecycle-y56',
    title: 'Frog Life Cycle',
    description: "Arrange all six stages of the common frog's life cycle in the correct order.",
    template: 'lifecycle',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'frogspawn-01', role: 'stage-1' },
      { image_id: 'frog-tadpole-young-01', role: 'stage-2' },
      { image_id: 'frog-tadpole-back-legs-01', role: 'stage-3' },
      { image_id: 'frog-tadpole-four-legs-01', role: 'stage-4' },
      { image_id: 'froglet-01', role: 'stage-5' },
      { image_id: 'adult-common-frog-01', role: 'stage-6' },
    ],
    correct_order: [
      'frogspawn-01', 'frog-tadpole-young-01', 'frog-tadpole-back-legs-01',
      'frog-tadpole-four-legs-01', 'froglet-01', 'adult-common-frog-01',
    ],
    stage_labels: {
      'frogspawn-01': 'Frogspawn',
      'frog-tadpole-young-01': 'Young tadpole',
      'frog-tadpole-back-legs-01': 'Tadpole with back legs',
      'frog-tadpole-four-legs-01': 'Tadpole with four legs',
      'froglet-01': 'Froglet',
      'adult-common-frog-01': 'Adult common frog (Rana temporaria)',
    },
    label_pool: [],
  },

  // ── TOAD LIFE CYCLE — SEQUENCE ────────────────────────────────────────────

  {
    id: 'sequence-toad-lifecycle-y12',
    title: 'Toad Life Cycle',
    description: 'Put the pictures in the correct order to show how a toad grows.',
    template: 'lifecycle',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'toadspawn-01', role: 'stage-1' },
      { image_id: 'toad-tadpole-01', role: 'stage-2' },
      { image_id: 'toadlet-01', role: 'stage-3' },
      { image_id: 'adult-common-toad-01', role: 'stage-4' },
    ],
    correct_order: ['toadspawn-01', 'toad-tadpole-01', 'toadlet-01', 'adult-common-toad-01'],
    stage_labels: {
      'toadspawn-01': 'Toadspawn',
      'toad-tadpole-01': 'Tadpole',
      'toadlet-01': 'Toadlet',
      'adult-common-toad-01': 'Toad',
    },
    label_pool: [],
  },
  {
    id: 'sequence-toad-lifecycle-y34',
    title: 'Toad Life Cycle',
    description: 'Put the five stages in order to show how a common toad develops.',
    template: 'lifecycle',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'toadspawn-01', role: 'stage-1' },
      { image_id: 'toad-tadpole-01', role: 'stage-2' },
      { image_id: 'toad-tadpole-legs-01', role: 'stage-3' },
      { image_id: 'toadlet-01', role: 'stage-4' },
      { image_id: 'adult-common-toad-01', role: 'stage-5' },
    ],
    correct_order: ['toadspawn-01', 'toad-tadpole-01', 'toad-tadpole-legs-01', 'toadlet-01', 'adult-common-toad-01'],
    stage_labels: {
      'toadspawn-01': 'Toadspawn',
      'toad-tadpole-01': 'Toad tadpole',
      'toad-tadpole-legs-01': 'Metamorphosed tadpole',
      'toadlet-01': 'Toadlet',
      'adult-common-toad-01': 'Adult toad',
    },
    label_pool: [],
  },
  {
    id: 'sequence-toad-lifecycle-y56',
    title: 'Toad Life Cycle',
    description: "Arrange all five stages of the common toad's life cycle in the correct order.",
    template: 'lifecycle',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'toadspawn-01', role: 'stage-1' },
      { image_id: 'toad-tadpole-01', role: 'stage-2' },
      { image_id: 'toad-tadpole-legs-01', role: 'stage-3' },
      { image_id: 'toadlet-01', role: 'stage-4' },
      { image_id: 'adult-common-toad-01', role: 'stage-5' },
    ],
    correct_order: ['toadspawn-01', 'toad-tadpole-01', 'toad-tadpole-legs-01', 'toadlet-01', 'adult-common-toad-01'],
    stage_labels: {
      'toadspawn-01': 'Toadspawn — laid in double strings',
      'toad-tadpole-01': 'Toad tadpole — darker and stockier than frog tadpole',
      'toad-tadpole-legs-01': 'Metamorphosed tadpole — legs developing, tail shortening',
      'toadlet-01': 'Toadlet — recently left the water',
      'adult-common-toad-01': 'Adult Common Toad (Bufo bufo)',
    },
    label_pool: [],
  },

  // ── BUTTERFLY LIFE CYCLE — SEQUENCE ──────────────────────────────────────

  {
    id: 'sequence-butterfly-lifecycle-y12',
    title: 'Butterfly Life Cycle',
    description: 'Put the four stages in the correct order.',
    template: 'lifecycle',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'butterfly-egg-01', role: 'stage-1' },
      { image_id: 'caterpillar-01', role: 'stage-2' },
      { image_id: 'chrysalis-01', role: 'stage-3' },
      { image_id: 'butterfly-adult-cycle-01', role: 'stage-4' },
    ],
    correct_order: ['butterfly-egg-01', 'caterpillar-01', 'chrysalis-01', 'butterfly-adult-cycle-01'],
    stage_labels: {
      'butterfly-egg-01': 'Egg',
      'caterpillar-01': 'Caterpillar',
      'chrysalis-01': 'Chrysalis',
      'butterfly-adult-cycle-01': 'Butterfly',
    },
    label_pool: [],
  },
  {
    id: 'sequence-butterfly-lifecycle-y34',
    title: 'Butterfly Life Cycle',
    description: "Arrange the four stages of a butterfly's life cycle in the correct order.",
    template: 'lifecycle',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'butterfly-egg-01', role: 'stage-1' },
      { image_id: 'caterpillar-01', role: 'stage-2' },
      { image_id: 'chrysalis-01', role: 'stage-3' },
      { image_id: 'butterfly-adult-cycle-01', role: 'stage-4' },
    ],
    correct_order: ['butterfly-egg-01', 'caterpillar-01', 'chrysalis-01', 'butterfly-adult-cycle-01'],
    stage_labels: {
      'butterfly-egg-01': 'Egg — laid on a leaf',
      'caterpillar-01': 'Caterpillar (larva)',
      'chrysalis-01': 'Chrysalis (pupa)',
      'butterfly-adult-cycle-01': 'Adult butterfly',
    },
    label_pool: [],
  },
  {
    id: 'sequence-butterfly-lifecycle-y56',
    title: 'Butterfly Life Cycle',
    description: "Arrange the four stages of a butterfly's life cycle and explain what happens at each stage.",
    template: 'lifecycle',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'butterfly-egg-01', role: 'stage-1' },
      { image_id: 'caterpillar-01', role: 'stage-2' },
      { image_id: 'chrysalis-01', role: 'stage-3' },
      { image_id: 'butterfly-adult-cycle-01', role: 'stage-4' },
    ],
    correct_order: ['butterfly-egg-01', 'caterpillar-01', 'chrysalis-01', 'butterfly-adult-cycle-01'],
    stage_labels: {
      'butterfly-egg-01': 'Egg — female lays eggs on the correct host plant',
      'caterpillar-01': 'Larva — caterpillar feeds and grows, shedding its skin',
      'chrysalis-01': 'Pupa — metamorphosis occurs inside the chrysalis',
      'butterfly-adult-cycle-01': 'Imago — adult butterfly emerges, mates and lays eggs',
    },
    label_pool: [],
  },

  // ── SORT: BUTTERFLIES & MOTHS ─────────────────────────────────────────────

  {
    id: 'sort-butterfly-moth-y12',
    title: 'Sort: Butterflies and Moths',
    description: 'Drag each creature into the correct group.',
    template: 'sort-classify',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'red-admiral-01', role: 'item-1' },
      { image_id: 'peacock-butterfly-01', role: 'item-2' },
      { image_id: 'large-white-01', role: 'item-3' },
      { image_id: 'garden-tiger-01', role: 'item-4' },
      { image_id: 'cinnabar-01', role: 'item-5' },
      { image_id: 'elephant-hawk-moth-01', role: 'item-6' },
    ],
    categories: [
      { label: 'Butterfly', image_ids: ['red-admiral-01', 'peacock-butterfly-01', 'large-white-01'] },
      { label: 'Moth', image_ids: ['garden-tiger-01', 'cinnabar-01', 'elephant-hawk-moth-01'] },
    ],
    label_pool: [],
  },
  {
    id: 'sort-butterfly-moth-y34',
    title: 'Sort: Butterflies and Moths',
    description: 'Drag each creature into the correct group. Can you spot the clues in how they look?',
    template: 'sort-classify',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'red-admiral-01', role: 'item-1' },
      { image_id: 'brimstone-01', role: 'item-2' },
      { image_id: 'common-blue-01', role: 'item-3' },
      { image_id: 'orange-tip-01', role: 'item-4' },
      { image_id: 'garden-tiger-01', role: 'item-5' },
      { image_id: 'peppered-moth-01', role: 'item-6' },
      { image_id: 'six-spot-burnet-01', role: 'item-7' },
      { image_id: 'buff-tip-01', role: 'item-8' },
    ],
    categories: [
      { label: 'Butterfly', image_ids: ['red-admiral-01', 'brimstone-01', 'common-blue-01', 'orange-tip-01'] },
      { label: 'Moth', image_ids: ['garden-tiger-01', 'peppered-moth-01', 'six-spot-burnet-01', 'buff-tip-01'] },
    ],
    label_pool: [],
  },
  {
    id: 'sort-butterfly-moth-y56',
    title: 'Sort: Butterflies and Moths',
    description: 'Sort all eight species into the correct group. Think carefully — some moths are active by day!',
    template: 'sort-classify',
    year_groups: ['y56'],
    subjects: [
      { image_id: 'red-admiral-01', role: 'item-1' },
      { image_id: 'speckled-wood-01', role: 'item-2' },
      { image_id: 'small-tortoiseshell-01', role: 'item-3' },
      { image_id: 'orange-tip-01', role: 'item-4' },
      { image_id: 'cinnabar-01', role: 'item-5' },
      { image_id: 'six-spot-burnet-01', role: 'item-6' },
      { image_id: 'elephant-hawk-moth-01', role: 'item-7' },
      { image_id: 'buff-tip-01', role: 'item-8' },
    ],
    categories: [
      { label: 'Butterfly', image_ids: ['red-admiral-01', 'speckled-wood-01', 'small-tortoiseshell-01', 'orange-tip-01'] },
      { label: 'Moth', image_ids: ['cinnabar-01', 'six-spot-burnet-01', 'elephant-hawk-moth-01', 'buff-tip-01'] },
    ],
    label_pool: [],
  },

  // ── SORT: FROGS & TOADS ───────────────────────────────────────────────────

  {
    id: 'sort-frog-toad-y12',
    title: 'Sort: Frogs and Toads',
    description: 'Drag each picture into the correct group.',
    template: 'sort-classify',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'frogspawn-01', role: 'item-1' },
      { image_id: 'frog-tadpole-young-01', role: 'item-2' },
      { image_id: 'adult-common-frog-01', role: 'item-3' },
      { image_id: 'toadspawn-01', role: 'item-4' },
      { image_id: 'toad-tadpole-01', role: 'item-5' },
      { image_id: 'adult-common-toad-01', role: 'item-6' },
    ],
    categories: [
      { label: 'Frog', image_ids: ['frogspawn-01', 'frog-tadpole-young-01', 'adult-common-frog-01'] },
      { label: 'Toad', image_ids: ['toadspawn-01', 'toad-tadpole-01', 'adult-common-toad-01'] },
    ],
    label_pool: [],
  },
  {
    id: 'sort-frog-toad-y34',
    title: 'Sort: Frogs and Toads',
    description: 'Sort each life stage into the correct group. Look carefully at the differences.',
    template: 'sort-classify',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'frogspawn-01', role: 'item-1' },
      { image_id: 'frog-tadpole-back-legs-01', role: 'item-2' },
      { image_id: 'froglet-01', role: 'item-3' },
      { image_id: 'adult-common-frog-01', role: 'item-4' },
      { image_id: 'toadspawn-01', role: 'item-5' },
      { image_id: 'toad-tadpole-01', role: 'item-6' },
      { image_id: 'toadlet-01', role: 'item-7' },
      { image_id: 'adult-common-toad-01', role: 'item-8' },
    ],
    categories: [
      { label: 'Common Frog', image_ids: ['frogspawn-01', 'frog-tadpole-back-legs-01', 'froglet-01', 'adult-common-frog-01'] },
      { label: 'Common Toad', image_ids: ['toadspawn-01', 'toad-tadpole-01', 'toadlet-01', 'adult-common-toad-01'] },
    ],
    label_pool: [],
  },

  // ── SORT: SLUGS & SNAILS ──────────────────────────────────────────────────

  {
    id: 'sort-slug-snail-y12',
    title: 'Sort: Slugs and Snails',
    description: 'Drag each creature into the correct group.',
    template: 'sort-classify',
    year_groups: ['y12'],
    subjects: [
      { image_id: 'garden-slug-01', role: 'item-1' },
      { image_id: 'great-black-slug-01', role: 'item-2' },
      { image_id: 'leopard-slug-01', role: 'item-3' },
      { image_id: 'common-garden-snail-01', role: 'item-4' },
      { image_id: 'white-lipped-snail-01', role: 'item-5' },
      { image_id: 'brown-lipped-snail-01', role: 'item-6' },
    ],
    categories: [
      { label: 'Slug', image_ids: ['garden-slug-01', 'great-black-slug-01', 'leopard-slug-01'] },
      { label: 'Snail', image_ids: ['common-garden-snail-01', 'white-lipped-snail-01', 'brown-lipped-snail-01'] },
    ],
    label_pool: [],
  },
  {
    id: 'sort-slug-snail-y34',
    title: 'Sort: Slugs and Snails',
    description: 'Sort all seven creatures into the correct group. Look for the key difference between them.',
    template: 'sort-classify',
    year_groups: ['y34'],
    subjects: [
      { image_id: 'garden-slug-01', role: 'item-1' },
      { image_id: 'great-black-slug-01', role: 'item-2' },
      { image_id: 'leopard-slug-01', role: 'item-3' },
      { image_id: 'netted-field-slug-01', role: 'item-4' },
      { image_id: 'common-garden-snail-01', role: 'item-5' },
      { image_id: 'white-lipped-snail-01', role: 'item-6' },
      { image_id: 'brown-lipped-snail-01', role: 'item-7' },
    ],
    categories: [
      { label: 'Slug', image_ids: ['garden-slug-01', 'great-black-slug-01', 'leopard-slug-01', 'netted-field-slug-01'] },
      { label: 'Snail', image_ids: ['common-garden-snail-01', 'white-lipped-snail-01', 'brown-lipped-snail-01'] },
    ],
    label_pool: [],
  },

  // ── LABEL THE PARTS: BUTTERFLY ────────────────────────────────────────────

  {
    id: 'label-parts-butterfly-y34',
    title: 'Parts of a Butterfly',
    description: 'Drag the labels to the correct parts of the butterfly.',
    template: 'label-parts',
    year_groups: ['y34'],
    subjects: [{ image_id: 'red-admiral-01', role: 'subject' }],
    callouts: [
      { role: 'forewing', x: 23, y: 35, label: 'Forewing' },
      { role: 'hindwing', x: 35, y: 65, label: 'Hindwing' },
      { role: 'body', x: 50, y: 50, label: 'Body' },
      { role: 'antennae', x: 52, y: 22, label: 'Antennae' },
    ],
    label_pool: ['Forewing', 'Hindwing', 'Body', 'Antennae'],
  },
  {
    id: 'label-parts-butterfly-y56',
    title: 'Parts of a Butterfly',
    description: 'Label the parts of this Red Admiral butterfly using the correct scientific terms.',
    template: 'label-parts',
    year_groups: ['y56'],
    subjects: [{ image_id: 'red-admiral-01', role: 'subject' }],
    callouts: [
      { role: 'forewing', x: 23, y: 35, label: 'Forewing' },
      { role: 'hindwing', x: 35, y: 65, label: 'Hindwing' },
      { role: 'thorax', x: 50, y: 42, label: 'Thorax' },
      { role: 'abdomen', x: 50, y: 60, label: 'Abdomen' },
      { role: 'antennae', x: 52, y: 22, label: 'Antennae' },
      { role: 'compound-eye', x: 57, y: 28, label: 'Compound eye' },
    ],
    label_pool: ['Forewing', 'Hindwing', 'Thorax', 'Abdomen', 'Antennae', 'Compound eye'],
  },

  // ── LABEL THE PARTS: FLOWER ───────────────────────────────────────────────

  {
    id: 'label-parts-flower-y34',
    title: 'Parts of a Flower',
    description: 'Drag the labels to the correct parts of this flower.',
    template: 'label-parts',
    year_groups: ['y34'],
    subjects: [{ image_id: 'common-poppy-01', role: 'subject' }],
    callouts: [
      { role: 'petal', x: 25, y: 20, label: 'Petal' },
      { role: 'stem', x: 50, y: 80, label: 'Stem' },
      { role: 'leaf', x: 72, y: 70, label: 'Leaf' },
      { role: 'centre', x: 50, y: 45, label: 'Centre' },
    ],
    label_pool: ['Petal', 'Stem', 'Leaf', 'Centre'],
  },
  {
    id: 'label-parts-flower-y56',
    title: 'Parts of a Flower',
    description: 'Label the parts of this poppy using the correct scientific terms.',
    template: 'label-parts',
    year_groups: ['y56'],
    subjects: [{ image_id: 'common-poppy-01', role: 'subject' }],
    callouts: [
      { role: 'petal', x: 25, y: 20, label: 'Petal' },
      { role: 'stamen', x: 42, y: 50, label: 'Stamen' },
      { role: 'pistil', x: 52, y: 48, label: 'Pistil' },
      { role: 'stem', x: 50, y: 80, label: 'Stem' },
      { role: 'leaf', x: 72, y: 70, label: 'Leaf' },
      { role: 'sepal', x: 50, y: 60, label: 'Sepal' },
    ],
    label_pool: ['Petal', 'Stamen', 'Pistil', 'Stem', 'Leaf', 'Sepal'],
  },

  // ── LABEL THE PARTS: SNAIL ────────────────────────────────────────────────

  {
    id: 'label-parts-snail-y34',
    title: 'Parts of a Snail',
    description: 'Drag the labels to the correct parts of this garden snail.',
    template: 'label-parts',
    year_groups: ['y34'],
    subjects: [{ image_id: 'common-garden-snail-01', role: 'subject' }],
    callouts: [
      { role: 'shell', x: 60, y: 25, label: 'Shell' },
      { role: 'foot', x: 35, y: 75, label: 'Foot' },
      { role: 'eye-stalks', x: 22, y: 25, label: 'Eye stalks' },
      { role: 'tentacles', x: 15, y: 40, label: 'Tentacles' },
    ],
    label_pool: ['Shell', 'Foot', 'Eye stalks', 'Tentacles'],
  },
  {
    id: 'label-parts-snail-y56',
    title: 'Parts of a Snail',
    description: 'Label the parts of this common garden snail using the correct scientific terms.',
    template: 'label-parts',
    year_groups: ['y56'],
    subjects: [{ image_id: 'common-garden-snail-01', role: 'subject' }],
    callouts: [
      { role: 'shell', x: 60, y: 25, label: 'Shell' },
      { role: 'mantle', x: 55, y: 55, label: 'Mantle' },
      { role: 'foot', x: 35, y: 75, label: 'Foot' },
      { role: 'upper-tentacles', x: 22, y: 25, label: 'Upper tentacles (eyes)' },
      { role: 'lower-tentacles', x: 15, y: 40, label: 'Lower tentacles (smell)' },
      { role: 'pneumostome', x: 48, y: 60, label: 'Pneumostome' },
    ],
    label_pool: ['Shell', 'Mantle', 'Foot', 'Upper tentacles (eyes)', 'Lower tentacles (smell)', 'Pneumostome'],
  },
]

export function getActivityById(id: string): ActivityDefinition | undefined {
  return ACTIVITIES.find((a) => a.id === id)
}

export function getActivitiesByTemplate(template: TemplateType): ActivityDefinition[] {
  return ACTIVITIES.filter((a) => a.template === template)
}

export function getActivitiesByYearGroup(yearGroup: YearGroup): ActivityDefinition[] {
  return ACTIVITIES.filter((a) => a.year_groups.includes(yearGroup))
}
