/**
 * Generates one clean natural-history illustration per biomimicry example,
 * using Gemini Imagen 4 — the same model and house style as the activity images.
 * Each image is a friendly field-guide illustration of the ORGANISM (the nature
 * side of the story); the page text explains the human invention it inspired.
 *
 * Output: public/biomimicry-images/<id>.png  (referenced by /biomimicry/[id]).
 * The <id> matches the biomimicry entry id, so no data field is needed.
 *
 * Run all:        npx tsx scripts/generate-biomimicry-images.ts
 * Force regen:    npx tsx scripts/generate-biomimicry-images.ts --force
 * Force one:      npx tsx scripts/generate-biomimicry-images.ts kingfisher-bullet-train.png
 *
 * After generation, visually inspect — the API may silently return a placeholder
 * if a prompt trips content filtering.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'biomimicry-images')
const API_KEY = process.env.GEMINI_API_KEY
const MODEL = 'imagen-4.0-generate-001'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`

if (!API_KEY) {
  console.error('GEMINI_API_KEY not set')
  process.exit(1)
}
fs.mkdirSync(OUT_DIR, { recursive: true })

const STYLE =
  'Clean plain white background, no text, no labels, no captions. Natural history field-guide illustration style, accurate colours, soft and friendly, suitable for primary school children.'

const IMAGES: { id: string; prompt: string }[] = [
  { id: 'kingfisher-bullet-train', prompt: `A common kingfisher (Alcedo atthis) in a downward dive, body fully streamlined with its long pointed beak leading the way, wings tucked. Brilliant electric-blue back and orange underside. ${STYLE}` },
  { id: 'lotus-self-cleaning-surfaces', prompt: `A single round green sacred lotus (Nelumbo nucifera) leaf seen from above, with three or four perfect silvery spherical water droplets beading on its surface. ${STYLE}` },
  { id: 'gecko-dry-adhesive', prompt: `A tokay gecko (Gekko gecko) clinging to a smooth clear vertical surface, viewed from the front so its spread toes and toe-pads are visible, blue-grey skin with orange spots. ${STYLE}` },
  { id: 'humpback-whale-tubercles-turbine', prompt: `A humpback whale (Megaptera novaeangliae) seen from the side, gliding, with one long pectoral fin clearly showing the row of rounded bumps (tubercles) along its leading edge. Dark grey back, pale underside. ${STYLE}` },
  { id: 'termite-mound-eastgate-ventilation', prompt: `A single tall African termite mound, a sculpted reddish-brown earthen tower with vertical ridges and chimney-like spires, narrowing towards the top. ${STYLE}` },
  { id: 'shark-skin-sharklet-antibacterial', prompt: `A shortfin mako shark (Isurus oxyrinchus) seen from the side, swimming, streamlined torpedo-shaped body, deep metallic blue back fading to a white belly, pointed snout. ${STYLE}` },
  { id: 'namib-beetle-fog-harvesting', prompt: `A Namib desert beetle (Stenocara gracilipes), a black beetle, standing on a small pale sand mound with its back tilted upward, several tiny clear water droplets clinging to its bumpy wing-cases. ${STYLE}` },
  { id: 'mussel-adhesive-wet-glue', prompt: `A small cluster of common mussels (Mytilus edulis) with dark blue-black shells, attached to a grey rock by fine golden-brown thread-like fibres (byssal threads). ${STYLE}` },
  { id: 'mantis-shrimp-impact-composites', prompt: `A peacock mantis shrimp (Odontodactylus scyllarus) seen from the side, vivid emerald-green body with orange and electric-blue markings, large folded clubbed front limbs, stalked eyes. ${STYLE}` },
  { id: 'owl-wing-silent-turbine-blades', prompt: `A barn owl (Tyto alba) in flight with wings fully spread, white heart-shaped face, golden-buff and white softly fringed feathers, viewed from the front. ${STYLE}` },
  { id: 'velcro-burdock-burr', prompt: `A burdock (Arctium) seed head: a single round bur densely covered in many tiny hooked spines, on a short green stem with one or two leaves. ${STYLE}` },
  { id: 'boxfish-mercedes-bionic', prompt: `A yellow boxfish (Ostracion cubicus), a small bright-yellow almost cube-shaped fish covered in evenly spaced black spots, seen from the side, small fins. ${STYLE}` },
  { id: 'spider-silk-synthetic-fibres', prompt: `A garden cross spider (Araneus diadematus) sitting at the centre of its round orb web, brown abdomen marked with a pale cross, fine radiating and spiral web threads visible. ${STYLE}` },
  { id: 'bee-static-electrostatic-spraying', prompt: `A honeybee (Apis mellifera) covered in golden pollen, hovering just above a purple foxglove flower, the fine hairs on its body clearly visible, with a few tiny grains of pollen lifting up from the flower towards the bee. ${STYLE}` },
  { id: 'reflex-arc-automatic-safety', prompt: `A child's hand pulling quickly back from the small orange flame of a candle, with a few gentle curved motion lines showing the fast movement away. Warm and friendly, not frightening. ${STYLE}` },
  { id: 'firefly-cold-light-glow-sticks', prompt: `A female glow-worm (Lampyris noctiluca), a small soft-brown beetle-like insect with a pale segmented body, resting on a single green blade of grass, the tip of her tail glowing with a soft green light. ${STYLE}` },
  { id: 'electric-eel-battery', prompt: `An electric eel (Electrophorus electricus), a long dark olive-green and grey eel-shaped fish with a yellow-orange underside, a rounded blunt head with small eyes, and a long continuous fin running along its underside, curving gracefully through dark water. Bright blue-white sparks and crackling electric arcs glow and ripple along the length of its body, lighting up the water around it. ${STYLE}` },
  { id: 'glasswing-anti-reflective-glass', prompt: `A glasswing butterfly (Greta oto) resting on a green leaf, wings spread, the wing panels clear and see-through like glass, edged with a dark brown border tinged with orange-red. ${STYLE}` },
  { id: 'bombardier-beetle-spray', prompt: `A bombardier beetle (Brachinus crepitans) standing on a small grey stone, with glossy blue-black wing cases and an orange-red head, legs and thorax, a tiny faint puff of vapour shown coming from its tail end. ${STYLE}` },
]

const args = process.argv.slice(2)
const forceFiles = new Set(args.filter((a) => a.endsWith('.png')))
const forceAll = args.includes('--force')

async function generate(id: string, prompt: string): Promise<boolean> {
  const filename = `${id}.png`
  const outPath = path.join(OUT_DIR, filename)
  if (fs.existsSync(outPath) && !forceAll && !forceFiles.has(filename)) {
    console.log(`  ✓ ${filename} (already exists, skipping)`)
    return true
  }
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio: '4:3' } }),
  })
  if (!response.ok) {
    console.error(`  ✗ ${filename}: HTTP ${response.status} — ${(await response.text()).substring(0, 200)}`)
    return false
  }
  const data = (await response.json()) as { predictions?: { bytesBase64Encoded?: string }[] }
  const b64 = data.predictions?.[0]?.bytesBase64Encoded
  if (!b64) {
    console.error(`  ✗ ${filename}: response had no image bytes`)
    return false
  }
  fs.writeFileSync(outPath, Buffer.from(b64, 'base64'))
  console.log(`  ✓ ${filename} (${Math.round(fs.statSync(outPath).size / 1024)} KB)`)
  return true
}

async function main() {
  let ok = 0
  let fail = 0
  for (const { id, prompt } of IMAGES) {
    // eslint-disable-next-line no-await-in-loop
    ;(await generate(id, prompt)) ? ok++ : fail++
  }
  console.log(`\nDone: ${ok} ok, ${fail} failed (of ${IMAGES.length})`)
  process.exit(fail ? 1 : 0)
}

main()
