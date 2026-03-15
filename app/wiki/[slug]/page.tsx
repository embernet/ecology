import { getPostBySlug, getPostSlugs } from '@/lib/content';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { NatureExample } from '@/components/mdx/NatureExample';
import { Requirement } from '@/components/mdx/Requirement';
import { Activity, Reflection } from '@/components/mdx/Activities';
import { Note, Guidance } from '@/components/mdx/Micro';
import { Gallery } from '@/components/mdx/Gallery';
import { WikiImage } from '@/components/mdx/WikiImage';
import { MdxPageWrapper } from '@/components/MdxPageWrapper';

const components = {
    NatureExample,
    Requirement,
    Activity,
    Reflection,
    Note,
    Guidance,
    Gallery,
    WikiImage,
    Ref: ({ children }: any) => (
        <p className="text-sm text-gray-500 italic">{children}</p>
    ),
    a: ({ href, children }: any) => {
        if (href && !href.startsWith('http')) {
            return <Link href={href}>{children}</Link>;
        }
        return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
    },
};

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const slugs = getPostSlugs();
    return slugs.map((slug) => ({
        slug: slug.replace(/\.md$/, ''),
    }));
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="markdown-content">
            <h1 className="mb-6">{post.frontmatter.title}</h1>
            <MdxPageWrapper slug={slug} title={post.frontmatter.title as string}>
                <div className="prose prose-lg max-w-none">
                    <MDXRemote
                        source={post.content}
                        components={components}
                    />
                </div>
            </MdxPageWrapper>
        </article>
    );
}
