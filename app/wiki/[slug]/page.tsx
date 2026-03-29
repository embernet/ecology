import { getPostBySlug, getPostSlugs, extractHeadings, makeHeadingIdCounter } from '@/lib/content';
import { getSiblingPages } from '@/lib/navigation';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { NatureExample } from '@/components/mdx/NatureExample';
import { Requirement } from '@/components/mdx/Requirement';
import { Activity, Reflection } from '@/components/mdx/Activities';
import { Note, Guidance } from '@/components/mdx/Micro';
import { Handout } from '@/components/mdx/Handout';
import { HandoutCard } from '@/components/mdx/HandoutCard';
import { HandoutHeader } from '@/components/mdx/HandoutHeader';
import { Gallery } from '@/components/mdx/Gallery';
import { WikiImage } from '@/components/mdx/WikiImage';
import { MdxPageWrapper } from '@/components/MdxPageWrapper';
import { PrevNextNav } from '@/components/PrevNextNav';
import { DictionaryParserProvider } from '@/components/DictionaryWrapper';


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
    const components = {
        NatureExample,
        Requirement,
        Activity,
        Reflection,
        Note,
        Guidance,
        Handout,
        HandoutCard,
        HandoutHeader,
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
        h2: ({ children }: any) => {
            const text = typeof children === 'string' ? children : '';
            const id = getId(text);
            return <h2 id={id}>{children}</h2>;
        },
        h3: ({ children }: any) => {
            const text = typeof children === 'string' ? children : '';
            const id = getId(text);
            return <h3 id={id}>{children}</h3>;
        },
        p: ({ children }: any) => <p><DictionaryParserProvider>{children}</DictionaryParserProvider></p>,
        li: ({ children }: any) => <li><DictionaryParserProvider>{children}</DictionaryParserProvider></li>,
    };

    return (
        <article className="flex flex-col h-full w-full">
            <div className="flex-shrink-0 z-10 bg-white border-b border-slate-200" style={{ padding: '0.8rem 2rem' }}>
                <PrevNextNav prev={prev} next={next} sectionLabel={sectionLabel} sectionHref={sectionHref} />
            </div>
            <div className="main-scroll-area" id="wiki-scroll-container">
                <div className="markdown-content">
                    <h1 className="mb-6">{post.frontmatter.title}</h1>
                    <MdxPageWrapper slug={slug} title={post.frontmatter.title as string} headings={headings}>
                        <div className="prose prose-lg max-w-none">
                            <MDXRemote
                                source={post.content}
                                components={components}
                            />
                        </div>
                    </MdxPageWrapper>
                </div>
            </div>
        </article>
    );
}
