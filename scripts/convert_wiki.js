const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const crypto = require('crypto');

const XML_PATH = path.join(__dirname, '../../ecologycurriculumwiki_xml_6ffda4a62023b92ce9de.xml');
const OUTPUT_DIR = path.join(__dirname, '../content');

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

function transformGalleryToPlaceholder(text, placeholders) {
    return text.replace(/<gallery>([\s\S]*?)<\/gallery>/g, (match) => {
        const id = `__GALLERY_${crypto.randomBytes(4).toString('hex')}__`;
        placeholders[id] = match;
        return id;
    });
}

function restorePlaceholders(text, placeholders) {
    let result = text;
    let changed = true;
    while (changed) {
        changed = false;
        for (const [id, content] of Object.entries(placeholders)) {
            if (result.includes(id)) {
                result = result.replace(id, content);
                changed = true;
            }
        }
    }
    return result;
}

function parseTemplates(text) {
    let result = '';
    let i = 0;
    while (i < text.length) {
        if (text.substring(i, i + 2) === '{{') {
            let depth = 0;
            let start = i;
            let end = -1;
            for (let j = i; j < text.length; j++) {
                if (text.substring(j, j + 2) === '{{') { depth++; j++; }
                else if (text.substring(j, j + 2) === '}}') {
                    depth--; j++;
                    if (depth === 0) { end = j + 1; break; }
                }
            }
            if (end !== -1) {
                const rawContent = text.substring(start + 2, end - 2);
                const replacement = processTemplate(rawContent);
                result += replacement;
                i = end;
                continue;
            } else {
                result += text[i]; i++;
            }
        } else {
            result += text[i]; i++;
        }
    }
    return result;
}

function processTemplate(rawContent) {
    const placeholders = {};
    let maskedContent = transformGalleryToPlaceholder(rawContent, placeholders);

    const parts = [];
    let currentPart = '';
    let depth = 0;
    for (let j = 0; j < maskedContent.length; j++) {
        const char = maskedContent[j];
        const next = maskedContent[j + 1] || '';
        if (char === '[' && next === '[') { depth++; j++; currentPart += '[['; }
        else if (char === ']' && next === ']') { depth--; j++; currentPart += ']]'; }
        else if (char === '{' && next === '{') { depth++; j++; currentPart += '{{'; }
        else if (char === '}' && next === '}') { depth--; j++; currentPart += '}}'; }
        else if (char === '|' && depth === 0) {
            parts.push(currentPart.trim());
            currentPart = '';
        } else {
            currentPart += char;
        }
    }
    parts.push(currentPart.trim());

    const templateName = parts[0];
    const args = {};

    for (let k = 1; k < parts.length; k++) {
        let part = restorePlaceholders(parts[k], placeholders);

        const eqIdx = part.indexOf('=');
        if (eqIdx !== -1) {
            const key = part.substring(0, eqIdx).trim();
            const val = part.substring(eqIdx + 1).trim();
            args[key] = val;
        } else {
            args[`arg${k}`] = part;
        }
    }

    const processValue = (val) => {
        let v = processGalleryTags(val);
        v = convertWikitextToMarkdown(v);
        return v.replace(/`/g, '\\`').replace(/\$/g, '\\$');
    };

    const processContent = (val) => {
        let v = processGalleryTags(val);
        v = convertWikitextToMarkdown(v);
        return v;
    }

    if (templateName === 'NatureExample') {
        const title = processValue(args.title || '');
        const emoji = processValue(args.emoji || '');
        const facts = processValue(args.facts || '');
        const description = processContent(args.description || '');

        return `
<NatureExample 
  title={\`${title}\`} 
  emoji={\`${emoji}\`} 
  facts={\`${facts}\`}
>
${description}
</NatureExample>
\n`;
    }

    if (templateName === 'Requirement') {
        const text = args.arg1 || args.text || '';
        return `<Requirement text={\`${processValue(text)}\`} />\n\n`;
    }
    if (templateName === 'Activity') {
        return `<Activity 
      title={\`${processValue(args.title || '')}\`} 
      description={\`${processValue(args.description || '')}\`} 
    />\n\n`;
    }
    if (templateName === 'Reflection') {
        return `<Reflection 
      title={\`${processValue(args.title || '')}\`} 
      description={\`${processValue(args.description || '')}\`} 
    />\n\n`;
    }
    if (templateName === 'Note') {
        const text = args.arg1 || args.text || '';
        return `<Note text={\`${processValue(text)}\`} />\n\n`;
    }
    if (templateName === 'Guidance') {
        const text = args.arg1 || args.text || '';
        return `<Guidance text={\`${processValue(text)}\`} />\n\n`;
    }
    if (templateName === 'SITENAME') {
        return 'Ecology Curriculum';
    }
    return ` `;
}

function processGalleryTags(text) {
    if (!text) return '';
    return text.replace(/<gallery>([\s\S]*?)<\/gallery>/g, (match, body) => {
        const lines = body.split('\n').map(l => l.trim()).filter(l => l);
        const images = [];
        lines.forEach(line => {
            const parts = line.split('|');
            if (parts.length > 0) {
                images.push({
                    src: parts[0],
                    caption: parts.slice(1).join('|') || ''
                });
            }
        });
        // Use object literal for props
        const jsonString = JSON.stringify(images); // standard JSON is valid JS object literal
        return `<Gallery images={${jsonString}} />`;
    });
}

function convertWikitextToMarkdown(text) {
    if (!text) return '';
    let md = text;

    md = md.replace(/__NOTOC__/g, '');
    md = md.replace(/<br>/g, '<br />');
    // Strip style attributes
    md = md.replace(/\sstyle="[^"]*"/gi, '');
    md = md.replace(/\sstyle='[^']*'/gi, '');

    md = md.replace(/^====\s*(.+?)\s*====$/gm, '#### $1');
    md = md.replace(/^===\s*(.+?)\s*===$/gm, '### $1');
    md = md.replace(/^==\s*(.+?)\s*==$/gm, '## $1');
    md = md.replace(/^=\s*(.+?)\s*=$/gm, '# $1');

    md = md.replace(/'''(.+?)'''/g, '**$1**');
    md = md.replace(/''(.+?)''/g, '*$1*');

    md = md.replace(/^\* /gm, '- ');
    md = md.replace(/^# /gm, '1. ');

    md = md.replace(/\[\[(File|Image):([^|\]]+)(\|[^\]]+)?\]\]/g, (match, ns, name, params) => {
        let caption = '';
        if (params) {
            const p = params.split('|');
            caption = p.pop();
            if (['thumb', 'left', 'right', 'center', 'border', 'frameless'].includes(caption)) {
                caption = '';
            }
        }
        return `<WikiImage filename="${name.trim()}" alt="${(caption || '').replace(/"/g, '\\"')}" />`;
    });

    md = md.replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (match, target, label) => {
        return `[${label}](/wiki/${slugify(target)})`;
    });
    md = md.replace(/\[\[([^|\]]+)\]\]/g, (match, target) => {
        return `[${target}](/wiki/${slugify(target)})`;
    });

    md = md.replace(/\[(https?:\/\/[^\s]+)\s+(.+?)\]/g, '[$2]($1)');

    return md.trim();
}

fs.readFile(XML_PATH, (err, data) => {
    if (err) return console.error(err);
    new xml2js.Parser().parseString(data, (err, result) => {
        if (err) return console.error(err);
        const pages = result.mediawiki.page || [];
        pages.forEach(page => {
            const title = page.title[0];
            if (title.startsWith('Template:') || title.startsWith('Module:') || title.startsWith('MediaWiki:')) return;
            const revisions = page.revision;
            const specificRevision = revisions[revisions.length - 1];
            let text = specificRevision.text[0]?._ || specificRevision.text[0];

            text = parseTemplates(text);
            text = processGalleryTags(text);
            text = convertWikitextToMarkdown(text);

            const slug = slugify(title);
            const fileContent = `---
title: "${title}"
slug: "${slug}"
---

${text}
`;
            fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.md`), fileContent);
            console.log(`Saved ${slug}`);
        });
    });
});
