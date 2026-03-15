import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { imageId } from '@/lib/image-id';

export { imageId };

export interface ImageEntry {
    id: string;
    filename: string;
    alt: string;
    caption?: string;
    credit?: string;
    pages: { slug: string; title: string }[];
    src: string;
    thumbnailSrc: string;
}

const contentDirectory = path.join(process.cwd(), 'content');

function extractWikiImages(content: string): { filename: string; alt: string; caption?: string; credit?: string }[] {
    const images: { filename: string; alt: string; caption?: string; credit?: string }[] = [];

    // Match <WikiImage ... /> tags
    const wikiImageRegex = /<WikiImage\s+([^/>]*)\/?>/g;
    let match;
    while ((match = wikiImageRegex.exec(content)) !== null) {
        const attrs = match[1];
        const filename = attrs.match(/filename="([^"]*)"/)?.[1];
        const alt = attrs.match(/alt="([^"]*)"/)?.[1];
        const caption = attrs.match(/caption="([^"]*)"/)?.[1];
        const credit = attrs.match(/credit="([^"]*)"/)?.[1];
        if (filename) {
            images.push({ filename, alt: alt || filename, caption, credit });
        }
    }

    // Match Gallery images - parse the JSON arrays
    const galleryRegex = /<Gallery\s+images=\{(\[[\s\S]*?\])}\s*\/>/g;
    while ((match = galleryRegex.exec(content)) !== null) {
        try {
            const parsed = JSON.parse(match[1]);
            for (const img of parsed) {
                const filename = (img.src || '').replace(/^(File:|Image:)/i, '');
                if (filename) {
                    images.push({
                        filename,
                        alt: img.caption || filename,
                        caption: img.caption,
                        credit: img.credit,
                    });
                }
            }
        } catch {
            // Skip malformed gallery JSON
        }
    }

    return images;
}

export function getAllImages(): ImageEntry[] {
    if (!fs.existsSync(contentDirectory)) return [];

    const files = fs.readdirSync(contentDirectory).filter(f => f.endsWith('.md'));
    const imageMap = new Map<string, ImageEntry>();

    for (const file of files) {
        const fullPath = path.join(contentDirectory, file);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const slug = file.replace(/\.md$/, '');
        const title = (data.title as string) || slug;

        const images = extractWikiImages(content);
        for (const img of images) {
            const cleanFilename = img.filename.trim().split(' ').join('_');
            const key = cleanFilename.toLowerCase();

            if (imageMap.has(key)) {
                const existing = imageMap.get(key)!;
                // Add page reference if not already there
                if (!existing.pages.some(p => p.slug === slug)) {
                    existing.pages.push({ slug, title });
                }
            } else {
                imageMap.set(key, {
                    id: imageId(img.filename),
                    filename: img.filename,
                    alt: img.alt,
                    caption: img.caption,
                    credit: img.credit,
                    pages: [{ slug, title }],
                    src: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(cleanFilename)}`,
                    thumbnailSrc: `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(cleanFilename)}?width=200`,
                });
            }
        }
    }

    // Sort alphabetically by filename
    return Array.from(imageMap.values()).sort((a, b) =>
        a.filename.toLowerCase().localeCompare(b.filename.toLowerCase())
    );
}
