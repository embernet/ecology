/**
 * Generates activity images using Gemini Imagen 4.
 * Prompts are read from data/activity-images.ts — that file is the single
 * source of truth. Update prompts there, then re-run this script.
 *
 * Run all:        npx tsx scripts/generate-activity-images.ts
 * Force specific: npx tsx scripts/generate-activity-images.ts foxglove.png large-white.png
 *
 * The --force flag (or listing filenames) bypasses the "skip if exists" check.
 * After generation, always visually inspect new images — the API may silently
 * return an unrelated placeholder if a prompt triggers content filtering.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ACTIVITY_IMAGES } from '../data/activity-images.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', 'public', 'activity-images')
const API_KEY = process.env.GEMINI_API_KEY
const MODEL = 'imagen-4.0-generate-001'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${API_KEY}`

if (!API_KEY) {
  console.error('GEMINI_API_KEY not set')
  process.exit(1)
}

fs.mkdirSync(OUT_DIR, { recursive: true })

// Any filename args force-regenerate those files even if they exist
const args = process.argv.slice(2)
const forceFiles = new Set(args.filter(a => a.endsWith('.png')))
const forceAll = args.includes('--force')

async function generateImage(filename: string, prompt: string): Promise<boolean> {
  const outPath = path.join(OUT_DIR, filename)

  if (fs.existsSync(outPath) && !forceAll && !forceFiles.has(filename)) {
    console.log(`  ✓ ${filename} (already exists, skipping)`)
    return true
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      instances: [{ prompt }],
      parameters: { sampleCount: 1 },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error(`  ✗ ${filename}: HTTP ${response.status} — ${err.substring(0, 200)}`)
    return false
  }

  const data = await response.json() as { predictions?: { bytesBase64Encoded?: string }[] }
  const b64 = data.predictions?.[0]?.bytesBase64Encoded

  if (!b64) {
    console.error(`  ✗ ${filename}: no image in response — ${JSON.stringify(data).substring(0, 300)}`)
    return false
  }

  const buf = Buffer.from(b64, 'base64')
  fs.writeFileSync(outPath, buf)
  console.log(`  ✓ ${filename} (${Math.round(buf.length / 1024)} KB)`)
  return true
}

async function main() {
  const images = ACTIVITY_IMAGES.map(img => ({ filename: img.filename, prompt: img.prompt }))
  const target = forceFiles.size > 0
    ? images.filter(img => forceFiles.has(img.filename))
    : images

  if (forceFiles.size > 0 && target.length === 0) {
    console.error('No matching images found for:', [...forceFiles].join(', '))
    process.exit(1)
  }

  console.log(`Generating ${target.length} image(s) → ${OUT_DIR}\n`)
  if (forceFiles.size > 0) console.log(`Force-regenerating: ${[...forceFiles].join(', ')}\n`)
  console.log('⚠ Visually inspect all new images after generation.\n')

  let ok = 0, fail = 0
  for (const img of target) {
    process.stdout.write(`Generating ${img.filename}… `)
    try {
      const success = await generateImage(img.filename, img.prompt)
      if (success) ok++; else fail++
    } catch (e) {
      console.error(`  ✗ ${img.filename}: ${(e as Error).message}`)
      fail++
    }
    await new Promise(r => setTimeout(r, 500))
  }

  console.log(`\nDone: ${ok} generated/skipped, ${fail} failed`)
  if (fail > 0) process.exit(1)
}

main()
