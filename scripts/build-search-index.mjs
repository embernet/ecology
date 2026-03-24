#!/usr/bin/env node
/**
 * Build script: generates a client-side search index from all content markdown files.
 * Output: /public/search-index.json
 *
 * Each entry is one of:
 *   { type: 'page', slug, title, preview }
 *   { type: 'section', slug, pageTitle, sectionTitle, sectionId, level, preview }
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = join(__dirname, '..', 'content');
const PUBLIC_DIR = join(__dirname, '..', 'public');
const OUTPUT_FILE = join(PUBLIC_DIR, 'search-index.json');

// Mirrors lib/content.ts slugifyHeading exactly
function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { title: '', body: raw };
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*"?(.+?)"?\s*$/);
    if (m) fm[m[1]] = m[2];
  }
  const body = raw.slice(match[0].length).trim();
  return { title: fm.title || '', body };
}

// Walk the body line-by-line with a state machine to:
//   - skip JSX tag lines and multi-line attribute blocks
//   - extract searchable text from title/facts/text/description template props
//   - keep all prose body text (even inside component bodies)
function removeJSXComponents(body) {
  const lines = body.split('\n');
  const out = [];
  let inOpenTag = false;      // collecting multi-line opening-tag attributes
  let inTemplateProp = false; // inside a multi-line template literal prop value

  for (const line of lines) {
    const t = line.trim();

    // ── Inside a multi-line template literal prop value ──
    if (inTemplateProp) {
      if (/`\}/.test(t)) {
        // This line ends the template literal; extract content before `}
        const content = t.replace(/`\}.*$/, '').trim();
        if (content) out.push(content);
        inTemplateProp = false;
        if (/>/.test(t)) inOpenTag = false; // tag also closed on this line
      } else {
        if (t) out.push(line); // keep template literal content lines
      }
      continue;
    }

    // ── Inside a multi-line opening tag (collecting attributes) ──
    if (inOpenTag) {
      // Single-line template literal prop: title={`value`}
      const slMatch = t.match(/^(?:title|facts|text|description|altText)=\{`([^`]*)`\}/);
      if (slMatch) {
        if (slMatch[1].trim()) out.push(slMatch[1]);
        // fall through to check end-of-tag below
      } else {
        // Multi-line template literal prop start: facts={`first line...
        const mlMatch = t.match(/^(?:title|facts|text|description|altText)=\{`(.*)/);
        if (mlMatch) {
          if (mlMatch[1].trim()) out.push(mlMatch[1]);
          inTemplateProp = true;
          continue;
        }
      }
      // Quoted string props on their own attribute line: alt="...", caption="..."
      for (const attr of ['alt', 'caption']) {
        const m = t.match(new RegExp('\\b' + attr + '="([^"]*)"'));
        if (m && m[1].trim()) out.push(m[1]);
      }
      // End of opening tag?
      if (/\/>$/.test(t) || t === '/>') {
        inOpenTag = false;
      } else if (/>$/.test(t) || t === '>') {
        inOpenTag = false;
      }
      continue;
    }

    // ── Opening component tag ──
    if (/^<[A-Z]/.test(t)) {
      // Extract searchable props from single-line components (self-closing etc.)
      for (const attr of ['title', 'facts', 'text', 'description', 'altText']) {
        const m = t.match(new RegExp('\\b' + attr + '=\\{`([^`]*)`\\}'));
        if (m && m[1].trim()) out.push(m[1]);
      }
      // Extract quoted string props: alt="...", caption="..."
      for (const attr of ['alt', 'caption']) {
        const m = t.match(new RegExp('\\b' + attr + '="([^"]*)"'));
        if (m && m[1].trim()) out.push(m[1]);
      }
      if (/\/>$/.test(t)) {
        // Self-closing: done
      } else if (/<\/[A-Z]/.test(t)) {
        // Complete open+close on one line: <Tag>content</Tag>
      } else if (!/>/.test(t)) {
        // Multi-line opening tag (no > on this line yet)
        inOpenTag = true;
      }
      // else: opening tag ends with > on this line; body follows on next lines
      continue;
    }

    // ── Closing component tag ──
    if (/^<\/[A-Z]/.test(t)) {
      continue;
    }

    // ── All other lines — keep (prose, headings, markdown) ──
    out.push(line);
  }

  return out.join('\n');
}

// Strip markdown and JSX/HTML tags, returning plain searchable text
function stripForSearch(text) {
  return text
    // Remove fenced code blocks
    .replace(/```[\s\S]*?```/g, ' ')
    // Remove inline code
    .replace(/`[^`]+`/g, ' ')
    // Remove JSX/HTML tags (keep inner text)
    .replace(/<\/?[A-Za-z][^>]*>/g, ' ')
    // Remove markdown images
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    // Remove markdown links — keep link text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    // Remove bold/italic markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove markdown heading markers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, '')
    // Collapse whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

// Split body into sections based on h2/h3 headings
function extractSections(body) {
  const lines = body.split('\n');
  const sections = [];
  let currentHeading = null;
  let currentLines = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{2,3})\s+(.+)$/);
    if (headingMatch) {
      if (currentHeading) {
        sections.push({ ...currentHeading, bodyLines: currentLines });
      }
      const text = headingMatch[2].trim();
      currentHeading = {
        level: headingMatch[1].length,
        text,
        id: slugifyHeading(text),
      };
      currentLines = [];
    } else if (currentHeading) {
      const stripped = stripForSearch(line);
      if (stripped) currentLines.push(stripped);
    }
  }
  if (currentHeading) {
    sections.push({ ...currentHeading, bodyLines: currentLines });
  }
  return sections;
}

function buildIndex() {
  if (!existsSync(PUBLIC_DIR)) {
    mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  const entries = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = readFileSync(join(CONTENT_DIR, file), 'utf8');
    const { title, body } = parseFrontmatter(raw);

    if (!title || !body) continue;

    // Pre-strip JSX tag lines once; reuse for both page preview and sections
    const cleanBody = removeJSXComponents(body);

    // Page-level entry — preview is first ~200 chars of stripped body text
    const pagePreview = stripForSearch(cleanBody).slice(0, 200);
    entries.push({ type: 'page', slug, title, preview: pagePreview });

    // Section entries
    const sections = extractSections(cleanBody);
    for (const section of sections) {
      const fullText = section.bodyLines.join(' ');
      const preview = fullText.slice(0, 200);
      entries.push({
        type: 'section',
        slug,
        pageTitle: title,
        sectionTitle: section.text,
        sectionId: section.id,
        level: section.level,
        preview,
        body: fullText,
      });
    }
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(entries));
  console.log(`Search index: ${entries.length} entries → ${OUTPUT_FILE}`);
}

buildIndex();
