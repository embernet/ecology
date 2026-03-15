#!/usr/bin/env node
/**
 * Build script: extracts all resources from MDX content files and generates
 * a static JSON registry mapping explicit short IDs to resource data.
 *
 * VALIDATION:
 * - Every resource component MUST have an explicit `id` prop
 * - IDs must follow the format: [type-prefix][number] (e.g. n1, a5, r12)
 * - IDs must be globally unique across all content files
 * - Type prefixes: n=NatureExample, a=Activity, r=Reflection, q=Requirement, t=Note, g=Guidance
 *
 * Run: node scripts/build-resource-registry.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '..', 'content');
const OUTPUT_FILE = join(__dirname, '..', 'public', 'resource-registry.json');

const TYPE_PREFIXES = {
  NatureExample: 'n',
  Activity: 'a',
  Reflection: 'r',
  Requirement: 'q',
  Note: 't',
  Guidance: 'g',
};

// Parse frontmatter from a markdown file
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*"?(.+?)"?\s*$/);
    if (m) fm[m[1]] = m[2];
  }
  return fm;
}

// Extract a backtick-delimited prop value: propName={`...`}
// Returns [value, endIndex] or null
function extractBacktickProp(text, startFrom) {
  const marker = '{`';
  const idx = text.indexOf(marker, startFrom);
  if (idx === -1) return null;
  let i = idx + 2; // skip {`
  while (i < text.length) {
    if (text[i] === '`' && text[i + 1] === '}') {
      return [text.slice(idx + 2, i), i + 2];
    }
    i++;
  }
  return null;
}

// Extract all props from a JSX tag string
function extractProps(tagStr) {
  const props = {};
  const propRegex = /(\w+)=\{`/g;
  let match;
  while ((match = propRegex.exec(tagStr)) !== null) {
    const propName = match[1];
    const result = extractBacktickProp(tagStr, match.index + propName.length + 1);
    if (result) {
      props[propName] = result[0];
    }
  }
  return props;
}

// Convert a WikiImage JSX tag to HTML
function wikiImageToHtml(filename, alt, credit) {
  const cleanFilename = filename.trim().split(' ').join('_');
  const src = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(cleanFilename)}`;
  return `<figure data-wiki-filename="${filename}" data-wiki-credit="${credit || ''}"><img src="${src}" alt="${alt || ''}" style="max-width:100%;height:auto;" loading="lazy" />${alt ? `<figcaption>${alt}</figcaption>` : ''}</figure>`;
}

// Convert a Gallery JSX tag to HTML
function galleryToHtml(imagesJson) {
  try {
    const images = JSON.parse(imagesJson);
    const items = images.map(img => {
      const filename = img.src.replace(/^(File:|Image:)/i, '');
      return wikiImageToHtml(filename, img.caption || filename, img.credit);
    });
    return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:0.5rem;">${items.join('')}</div>`;
  } catch {
    return '';
  }
}

// Convert children MDX content to simple HTML
function childrenToHtml(children) {
  if (!children || !children.trim()) return '';

  let html = children;

  // Replace <WikiImage filename="X" alt="Y" /> and variants
  html = html.replace(/<WikiImage\s+filename="([^"]+)"\s+alt="([^"]*)"(?:\s+credit="([^"]*)")?\s*\/?>/g,
    (_, filename, alt, credit) => wikiImageToHtml(filename, alt, credit));

  // Replace <Gallery images={[...]} /> - need to handle the JSON inside
  html = html.replace(/<Gallery\s+images=\{(\[[\s\S]*?\])}\s*\/?>/g,
    (_, json) => galleryToHtml(json));

  // Convert markdown-ish text to HTML
  const lines = html.split('\n');
  const processed = [];
  let inList = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inList) { processed.push('</ul>'); inList = false; }
      continue;
    }
    // Skip if it's already HTML (starts with <)
    if (trimmed.startsWith('<')) {
      if (inList) { processed.push('</ul>'); inList = false; }
      processed.push(trimmed);
      continue;
    }
    // List items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (!inList) { processed.push('<ul>'); inList = true; }
      let itemText = trimmed.slice(2);
      itemText = itemText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      itemText = itemText.replace(/\*(.+?)\*/g, '<em>$1</em>');
      processed.push(`<li>${itemText}</li>`);
      continue;
    }
    if (inList) { processed.push('</ul>'); inList = false; }
    // Regular text
    let text = trimmed;
    text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
    text = text.replace(/<br\s*\/?>/g, '<br>');
    processed.push(`<p>${text}</p>`);
  }
  if (inList) processed.push('</ul>');

  return processed.join('\n');
}

// Extract WikiImage data from children content
function extractWikiImages(children) {
  if (!children) return [];
  const images = [];

  // WikiImage components
  const wikiRe = /<WikiImage\s+filename="([^"]+)"\s+alt="([^"]*)"(?:\s+credit="([^"]*)")?\s*\/?>/g;
  let m;
  while ((m = wikiRe.exec(children)) !== null) {
    images.push({ filename: m[1], alt: m[2], credit: m[3] || undefined });
  }

  // Gallery components
  const galleryRe = /<Gallery\s+images=\{(\[[\s\S]*?\])}\s*\/?>/g;
  while ((m = galleryRe.exec(children)) !== null) {
    try {
      const galleryImages = JSON.parse(m[1]);
      for (const img of galleryImages) {
        const filename = img.src.replace(/^(File:|Image:)/i, '');
        images.push({ filename, alt: img.caption || filename, credit: img.credit || undefined });
      }
    } catch { /* skip */ }
  }

  return images;
}

// Count which line number a character index falls on (1-based)
function getLineNumber(content, charIndex) {
  let line = 1;
  for (let i = 0; i < charIndex && i < content.length; i++) {
    if (content[i] === '\n') line++;
  }
  return line;
}

// Extract all resources from a single MDX content string
function extractResources(content, slug, pageTitle, fileName) {
  const resources = [];
  const errors = [];
  const componentTypes = {
    NatureExample: { hasChildren: true, titleProp: 'title' },
    Activity: { hasChildren: false, titleProp: 'title' },
    Reflection: { hasChildren: false, titleProp: 'title' },
    Note: { hasChildren: false, titleProp: 'title', defaultTitle: 'Note' },
    Guidance: { hasChildren: false, titleProp: null, defaultTitle: 'Guidance' },
    Requirement: { hasChildren: false, titleProp: null, defaultTitle: 'Requirements' },
  };

  for (const [compName, config] of Object.entries(componentTypes)) {
    const expectedPrefix = TYPE_PREFIXES[compName];

    // Match opening tags for this component
    const tagRegex = new RegExp(`<${compName}\\s`, 'g');
    let tagMatch;

    while ((tagMatch = tagRegex.exec(content)) !== null) {
      const startIdx = tagMatch.index;
      const lineNum = getLineNumber(content, startIdx);
      let children = '';

      if (config.hasChildren) {
        const closingTag = `</${compName}>`;
        const closingIdx = content.indexOf(closingTag, startIdx);
        if (closingIdx === -1) continue;

        // Find where the opening tag ends (the > before children)
        let openTagEnd = -1;
        let i = startIdx;
        let inBacktick = false;
        while (i < closingIdx) {
          if (content[i] === '`' && content[i - 1] === '{') inBacktick = true;
          if (content[i] === '`' && content[i + 1] === '}') inBacktick = false;
          if (!inBacktick && content[i] === '>' && content[i - 1] !== '/') {
            openTagEnd = i;
            break;
          }
          i++;
        }
        if (openTagEnd === -1) continue;

        const tagStr = content.slice(startIdx, openTagEnd + 1);
        children = content.slice(openTagEnd + 1, closingIdx).trim();

        const props = extractProps(tagStr);
        const resourceId = props.id;

        // Validate id prop exists
        if (!resourceId) {
          errors.push(`${fileName}:${lineNum} - <${compName}> is missing required "id" prop. ` +
            `Every resource must have a unique id like id={\`${expectedPrefix}N\`} where N is a number.`);
          continue;
        }

        // Validate id format
        const idMatch = resourceId.match(/^([a-z])(\d+)$/);
        if (!idMatch) {
          errors.push(`${fileName}:${lineNum} - <${compName} id="${resourceId}"> has invalid id format. ` +
            `Expected format: ${expectedPrefix}N (e.g. ${expectedPrefix}1, ${expectedPrefix}42)`);
          continue;
        }
        if (idMatch[1] !== expectedPrefix) {
          errors.push(`${fileName}:${lineNum} - <${compName} id="${resourceId}"> has wrong prefix "${idMatch[1]}". ` +
            `${compName} resources must use prefix "${expectedPrefix}" (e.g. ${expectedPrefix}${idMatch[2]})`);
          continue;
        }

        const title = props[config.titleProp] || config.defaultTitle || compName;
        const wikiImages = extractWikiImages(children);
        const childrenHtml = childrenToHtml(children);

        resources.push({
          shortId: resourceId,
          type: compName,
          title,
          sourcePage: slug,
          sourcePageTitle: pageTitle,
          fileName,
          lineNum,
          data: {
            type: compName,
            emoji: props.emoji || undefined,
            facts: props.facts || undefined,
            text: props.text || undefined,
            description: props.description || undefined,
            childrenHtml: childrenHtml || '',
            wikiImages,
          },
        });
      } else {
        // Self-closing tag: find />
        const selfCloseIdx = content.indexOf('/>', startIdx);
        if (selfCloseIdx === -1) continue;

        const tagStr = content.slice(startIdx, selfCloseIdx + 2);
        const props = extractProps(tagStr);
        const resourceId = props.id;

        // Validate id prop exists
        if (!resourceId) {
          errors.push(`${fileName}:${lineNum} - <${compName}> is missing required "id" prop. ` +
            `Every resource must have a unique id like id={\`${expectedPrefix}N\`} where N is a number.`);
          continue;
        }

        // Validate id format
        const idMatch = resourceId.match(/^([a-z])(\d+)$/);
        if (!idMatch) {
          errors.push(`${fileName}:${lineNum} - <${compName} id="${resourceId}"> has invalid id format. ` +
            `Expected format: ${expectedPrefix}N (e.g. ${expectedPrefix}1, ${expectedPrefix}42)`);
          continue;
        }
        if (idMatch[1] !== expectedPrefix) {
          errors.push(`${fileName}:${lineNum} - <${compName} id="${resourceId}"> has wrong prefix "${idMatch[1]}". ` +
            `${compName} resources must use prefix "${expectedPrefix}" (e.g. ${expectedPrefix}${idMatch[2]})`);
          continue;
        }

        const title = props[config.titleProp] || config.defaultTitle || compName;

        resources.push({
          shortId: resourceId,
          type: compName,
          title,
          sourcePage: slug,
          sourcePageTitle: pageTitle,
          fileName,
          lineNum,
          data: {
            type: compName,
            emoji: props.emoji || undefined,
            facts: props.facts || undefined,
            text: props.text || undefined,
            description: props.description || undefined,
            childrenHtml: '',
            wikiImages: [],
          },
        });
      }
    }
  }

  return { resources, errors };
}

// Main
function main() {
  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  const registry = {};
  let totalResources = 0;
  const allErrors = [];
  const idMap = new Map(); // id → { fileName, lineNum, type, title }

  for (const file of files) {
    const content = readFileSync(join(CONTENT_DIR, file), 'utf-8');
    const fm = parseFrontmatter(content);
    if (!fm.slug) continue;

    const { resources, errors } = extractResources(content, fm.slug, fm.title || fm.slug, file);
    allErrors.push(...errors);

    for (const res of resources) {
      // Check for duplicate IDs
      if (idMap.has(res.shortId)) {
        const existing = idMap.get(res.shortId);
        allErrors.push(
          `DUPLICATE ID "${res.shortId}" found:\n` +
          `  First:  ${existing.fileName}:${existing.lineNum} <${existing.type}> "${existing.title}"\n` +
          `  Second: ${res.fileName}:${res.lineNum} <${res.type}> "${res.title}"\n` +
          `  Each resource must have a globally unique id. Please assign a new id to one of these.`
        );
        continue;
      }

      idMap.set(res.shortId, {
        fileName: res.fileName,
        lineNum: res.lineNum,
        type: res.type,
        title: res.title,
      });

      registry[res.shortId] = {
        type: res.type,
        title: res.title,
        sourcePage: res.sourcePage,
        sourcePageTitle: res.sourcePageTitle,
        data: res.data,
      };
      totalResources++;
    }
  }

  // Report errors and exit if any
  if (allErrors.length > 0) {
    console.error('\n========================================');
    console.error('RESOURCE REGISTRY BUILD FAILED');
    console.error('========================================\n');
    console.error(`Found ${allErrors.length} error(s):\n`);
    for (const err of allErrors) {
      console.error(`  ERROR: ${err}\n`);
    }
    console.error('----------------------------------------');
    console.error('RESOURCE ID REQUIREMENTS:');
    console.error('  - Every resource component must have an id prop: id={`XX`}');
    console.error('  - IDs must be globally unique across all content files');
    console.error('  - ID format: [type-prefix][number]');
    console.error('  - Type prefixes:');
    console.error('      n = NatureExample  (e.g. n1, n2, n3)');
    console.error('      a = Activity       (e.g. a1, a2, a3)');
    console.error('      r = Reflection     (e.g. r1, r2, r3)');
    console.error('      q = Requirement    (e.g. q1, q2, q3)');
    console.error('      t = Note           (e.g. t1, t2, t3)');
    console.error('      g = Guidance       (e.g. g1, g2, g3)');
    console.error('  - To find the next available number, check the registry or');
    console.error('    search existing content files for the highest number used.');
    console.error('========================================\n');
    process.exit(1);
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(registry, null, 2));

  // Summary by type
  const typeCounts = {};
  for (const [id, entry] of Object.entries(registry)) {
    typeCounts[entry.type] = (typeCounts[entry.type] || 0) + 1;
  }
  console.log(`Built resource registry: ${totalResources} resources from ${files.length} files`);
  for (const [type, count] of Object.entries(typeCounts).sort()) {
    console.log(`  ${TYPE_PREFIXES[type]} = ${type}: ${count}`);
  }
  console.log(`Output: ${OUTPUT_FILE}`);
}

main();
