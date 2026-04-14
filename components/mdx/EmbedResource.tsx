import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getMdxComponents } from '@/lib/mdx-components';

export async function EmbedResource({ id }: { id: string }) {
    // Attempt to load the resource from content/resources/
    const dir = path.join(process.cwd(), 'content', 'resources');
    
    if (!fs.existsSync(dir)) {
        return <div className="p-4 border border-red-200 text-red-600">Resource directory not found</div>;
    }

    // Find the file that either is named exactly id.md or starts with id-
    const files = fs.readdirSync(dir);
    const resourceFile = files.find(f => f === `${id}.md` || f.startsWith(`${id}-`));

    if (!resourceFile) {
        return <div className="p-4 border border-red-200 text-red-600">Resource {id} not found</div>;
    }

    const fullPath = path.join(dir, resourceFile);
    const content = fs.readFileSync(fullPath, 'utf8');

    const components = getMdxComponents();

    return (
        <MDXRemote 
            source={content} 
            components={components} 
        />
    );
}
