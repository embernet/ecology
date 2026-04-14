import { getPostBySlug, getPostSlugs, extractHeadings, makeHeadingIdCounter, resolveEmbedResources } from '@/lib/content';
import { getSiblingPages } from '@/lib/navigation';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { MdxPageWrapper } from '@/components/MdxPageWrapper';
import { PrevNextNav } from '@/components/PrevNextNav';
import { getMdxComponents } from '@/lib/mdx-components';

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

    const headings = extractHeadings(post.content);
    const { prev, next, sectionLabel, sectionHref } = getSiblingPages(slug);

    const getId = makeHeadingIdCounter();
    const components = getMdxComponents(getId);
    const content = resolveEmbedResources(post.content);

    return (
        <article className="flex flex-col h-full w-full">
            <div className="flex-shrink-0 z-10 bg-white border-b border-slate-200" style={{ padding: '0.8rem 2rem' }}>
                <PrevNextNav prev={prev} next={next} sectionLabel={sectionLabel} sectionHref={sectionHref} title={post.frontmatter.title as string} />
            </div>
            <div className="main-scroll-area" id="wiki-scroll-container">
                <div className="markdown-content">
                    <MdxPageWrapper slug={slug} title={post.frontmatter.title as string} headings={headings}>
                        <div className="prose prose-lg max-w-none">
                            <MDXRemote
                                source={content}
                                components={components}
                            />
                        </div>
                    </MdxPageWrapper>
                </div>
            </div>
        </article>
    );
}
