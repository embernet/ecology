import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export function getPostSlugs() {
    if (!fs.existsSync(contentDirectory)) return [];
    return fs.readdirSync(contentDirectory);
}

export function getPostBySlug(slug: string) {
    const realSlug = slug.replace(/\.md$/, '');
    const fullPath = path.join(contentDirectory, `${realSlug}.md`);

    if (!fs.existsSync(fullPath)) {
        return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug: realSlug,
        frontmatter: data,
        content,
    };
}

export function slugifyHeading(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export interface PageHeading {
    id: string;
    text: string;
    level: number;
}

export function makeHeadingIdCounter() {
    const counts: Record<string, number> = {};
    return (text: string): string => {
        const baseId = slugifyHeading(text);
        counts[baseId] = (counts[baseId] || 0) + 1;
        return counts[baseId] === 1 ? baseId : `${baseId}-${counts[baseId]}`;
    };
}

export function extractHeadings(content: string): PageHeading[] {
    const headings: PageHeading[] = [];
    const getId = makeHeadingIdCounter();
    for (const line of content.split('\n')) {
        const match = line.match(/^(#{2,3})\s+(.+)$/);
        if (match) {
            const text = match[2].trim();
            headings.push({ id: getId(text), text, level: match[1].length });
        }
    }
    return headings;
}

export function getAllPosts() {
    const slugs = getPostSlugs();
    const posts = slugs
        .map((slug) => getPostBySlug(slug))
        // sort posts by date in descending order if needed, or by title
        .sort((post1, post2) => (post1?.frontmatter.title > post2?.frontmatter.title ? 1 : -1));
    return posts;
}
