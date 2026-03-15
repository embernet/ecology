#!/usr/bin/env node
/**
 * One-time script: assigns sequential explicit IDs to all resource components
 * in MDX content files.
 *
 * Type prefixes:
 *   n = NatureExample   (n1, n2, n3, ...)
 *   a = Activity        (a1, a2, a3, ...)
 *   r = Reflection      (r1, r2, r3, ...)
 *   q = Requirement     (q1, q2, q3, ...)
 *   t = Note            (t1, t2, t3, ...)
 *   g = Guidance        (g1, g2, g3, ...)
 *
 * Run: node scripts/assign-resource-ids.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '..', 'content');

const TYPE_PREFIXES = {
  NatureExample: 'n',
  Activity: 'a',
  Reflection: 'r',
  Requirement: 'q',
  Note: 't',
  Guidance: 'g',
};

// Global counters per type
const counters = {};
for (const prefix of Object.values(TYPE_PREFIXES)) {
  counters[prefix] = 0;
}

function nextId(prefix) {
  counters[prefix]++;
  return `${prefix}${counters[prefix]}`;
}

function addIdsToContent(content) {
  let modified = content;

  for (const [compName, prefix] of Object.entries(TYPE_PREFIXES)) {
    // Match opening tags that do NOT already have an id prop
    // Handles both self-closing and opening tags
    const regex = new RegExp(`(<${compName}\\s)(?!.*?\\bid=)`, 'g');
    modified = modified.replace(regex, (match) => {
      const id = nextId(prefix);
      return `${match}id={\`${id}\`} `;
    });
  }

  return modified;
}

function main() {
  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md')).sort();
  let totalAssigned = 0;

  for (const file of files) {
    const filePath = join(CONTENT_DIR, file);
    const content = readFileSync(filePath, 'utf-8');
    const modified = addIdsToContent(content);

    if (modified !== content) {
      writeFileSync(filePath, modified);
      // Count how many IDs were added
      const addedCount = (modified.match(/\bid=\{`[a-z]\d+`\}/g) || []).length;
      console.log(`${file}: ${addedCount} IDs assigned`);
      totalAssigned += addedCount;
    }
  }

  console.log(`\nTotal: ${totalAssigned} resource IDs assigned`);
  console.log('Counters:', Object.entries(TYPE_PREFIXES).map(([type, prefix]) => `${type}=${prefix}${counters[prefix]}`).join(', '));
}

main();
