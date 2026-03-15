import type { ResourcePackItem } from './resource-pack-types';
import { exportCSS } from './export-styles';

function markdownToHtml(md: string): string {
  // Simple markdown to HTML conversion for facts/descriptions
  return md
    .split('\n')
    .map(line => {
      line = line.trim();
      if (line.startsWith('- ')) {
        return `<li>${line.slice(2)}</li>`;
      }
      if (line.startsWith('* ')) {
        return `<li>${line.slice(2)}</li>`;
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return `<p><strong>${line.slice(2, -2)}</strong></p>`;
      }
      // Inline bold
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      // Inline italic
      line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
      if (line) return `<p>${line}</p>`;
      return '';
    })
    .join('\n')
    // Wrap consecutive <li> in <ul>
    .replace(/((?:<li>.*?<\/li>\n?)+)/g, '<ul>$1</ul>');
}

async function fetchImageAsBase64(filename: string): Promise<string | null> {
  try {
    const cleanFilename = filename.trim().split(' ').join('_');

    // Use Wikimedia API with origin=* for CORS support to get the direct image URL
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(cleanFilename)}&prop=imageinfo&iiprop=url|mime&format=json&origin=*`;
    const apiResponse = await fetch(apiUrl);
    if (!apiResponse.ok) return null;
    const apiData = await apiResponse.json();
    const pages = apiData.query?.pages;
    if (!pages) return null;
    const page = Object.values(pages)[0] as Record<string, unknown>;
    const imageInfo = (page?.imageinfo as Array<{ url: string; mime: string }>)?.[0];
    if (!imageInfo?.url) return null;

    // Fetch the actual image from upload.wikimedia.org
    const response = await fetch(imageInfo.url);
    if (!response.ok) return null;
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function replaceImagesWithBase64(html: string, imageMap: Map<string, string>): string {
  // Replace wikimedia URLs with base64
  let result = html;
  for (const [filename, base64] of imageMap) {
    const cleanFilename = filename.trim().split(' ').join('_');
    const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(cleanFilename)}`;
    result = result.replaceAll(url, base64);
  }
  return result;
}

function renderItemToHtml(item: ResourcePackItem, imageMap: Map<string, string>): string {
  const { data } = item;
  const sourceTag = `<div class="source-tag">From: ${item.sourcePageTitle}</div>`;

  const processHtml = (html: string) => replaceImagesWithBase64(html, imageMap);

  switch (data.type) {
    case 'NatureExample': {
      const emojiHtml = data.emoji ? `<div class="nature-example-emoji">${data.emoji}</div>` : '';
      const childrenHtml = data.childrenHtml ? processHtml(data.childrenHtml) : '';
      const factsHtml = data.facts ? `
        <div class="nature-example-facts">
          <h4>Fun Facts</h4>
          ${markdownToHtml(data.facts)}
        </div>` : '';

      return `
        <div class="resource-item nature-example">
          <div class="nature-example-header">
            ${emojiHtml}
            <div>
              <div class="nature-example-title">${item.title}</div>
              <div class="nature-example-content">${childrenHtml}</div>
            </div>
          </div>
          ${factsHtml}
          ${sourceTag}
        </div>`;
    }

    case 'Activity':
      return `
        <div class="resource-item activity">
          <div class="activity-title">Activity: ${item.title}</div>
          <div class="activity-content">${markdownToHtml(data.description || '')}</div>
          ${sourceTag}
        </div>`;

    case 'Reflection':
      return `
        <div class="resource-item reflection">
          <div class="reflection-title">Reflection: ${item.title}</div>
          <div class="reflection-content">${markdownToHtml(data.description || '')}</div>
          ${sourceTag}
        </div>`;

    case 'Requirement':
      return `
        <div class="resource-item requirement">
          <div class="requirement-label">Curriculum Requirement</div>
          <div class="requirement-content">
            ${data.text ? markdownToHtml(data.text) : ''}
            ${data.childrenHtml ? processHtml(data.childrenHtml) : ''}
          </div>
          ${sourceTag}
        </div>`;

    case 'Note':
      return `
        <div class="resource-item note">
          <strong>Note:</strong>
          ${data.text ? markdownToHtml(data.text) : ''}
          ${data.childrenHtml ? processHtml(data.childrenHtml) : ''}
          ${sourceTag}
        </div>`;

    case 'Guidance':
      return `
        <div class="resource-item guidance">
          <strong>Guidance:</strong>
          ${data.text ? markdownToHtml(data.text) : ''}
          ${data.childrenHtml ? processHtml(data.childrenHtml) : ''}
          ${sourceTag}
        </div>`;

    default:
      return '';
  }
}

export async function exportAsHtml(items: ResourcePackItem[], packName?: string): Promise<void> {
  // Collect all unique wiki images that need base64 conversion
  const allImages = new Set<string>();
  for (const item of items) {
    for (const img of item.data.wikiImages) {
      allImages.add(img.filename);
    }
    // Also scan childrenHtml for wikimedia URLs
    if (item.data.childrenHtml) {
      const matches = item.data.childrenHtml.matchAll(/Special:FilePath\/([^"'&]+)/g);
      for (const match of matches) {
        allImages.add(decodeURIComponent(match[1]));
      }
    }
  }

  // Fetch all images as base64 (parallel with concurrency limit)
  const imageMap = new Map<string, string>();
  const imageArray = Array.from(allImages);

  // Process in batches of 4
  for (let i = 0; i < imageArray.length; i += 4) {
    const batch = imageArray.slice(i, i + 4);
    const results = await Promise.all(batch.map(async (filename) => {
      const base64 = await fetchImageAsBase64(filename);
      return { filename, base64 };
    }));
    for (const { filename, base64 } of results) {
      if (base64) {
        imageMap.set(filename, base64);
      }
    }
  }

  // Count unique source pages
  const sourcePages = new Set(items.map(i => i.sourcePage));
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const title = packName || 'Ecology Resource Pack';

  // Build the HTML document
  const itemsHtml = items.map(item => renderItemToHtml(item, imageMap)).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${exportCSS}</style>
</head>
<body>
  <div class="export-header">
    <h1>${title}</h1>
    <p>Created from Ecology Curriculum on ${date}</p>
    <p>${items.length} resource${items.length !== 1 ? 's' : ''} from ${sourcePages.size} page${sourcePages.size !== 1 ? 's' : ''}</p>
  </div>

  ${itemsHtml}

  <div style="text-align: center; padding: 2rem; color: #94a3b8; font-size: 0.8rem; border-top: 1px solid #e2e8f0; margin-top: 2rem;">
    <p>Generated by Ecology Curriculum - Open Educational Resource</p>
  </div>
</body>
</html>`;

  // Trigger download
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ecology-resource-pack-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportAsHtmlWithUrls(items: ResourcePackItem[], packName?: string): void {
  // Build HTML with original Wikimedia image URLs (no base64 conversion)
  const imageMap = new Map<string, string>();

  // Count unique source pages
  const sourcePages = new Set(items.map(i => i.sourcePage));
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const title = packName || 'Ecology Resource Pack';

  // Build the HTML document
  const itemsHtml = items.map(item => renderItemToHtml(item, imageMap)).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${exportCSS}</style>
</head>
<body>
  <div class="export-header">
    <h1>${title}</h1>
    <p>Created from Ecology Curriculum on ${date}</p>
    <p>${items.length} resource${items.length !== 1 ? 's' : ''} from ${sourcePages.size} page${sourcePages.size !== 1 ? 's' : ''}</p>
  </div>

  ${itemsHtml}

  <div style="text-align: center; padding: 2rem; color: #94a3b8; font-size: 0.8rem; border-top: 1px solid #e2e8f0; margin-top: 2rem;">
    <p>Generated by Ecology Curriculum - Open Educational Resource</p>
  </div>
</body>
</html>`;

  // Trigger download
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ecology-resource-pack-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
