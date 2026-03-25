import { getPostBySlug, extractHeadings, makeHeadingIdCounter } from '@/lib/content';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { NatureExample } from '@/components/mdx/NatureExample';
import { Requirement } from '@/components/mdx/Requirement';
import { Activity, Reflection } from '@/components/mdx/Activities';
import { Note, Guidance } from '@/components/mdx/Micro';
import { Gallery } from '@/components/mdx/Gallery';
import { WikiImage } from '@/components/mdx/WikiImage';
import { MdxPageWrapper } from '@/components/MdxPageWrapper';

export default function Home() {
  const slug = 'ecology-curriculum-home';
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold mb-4">Welcome to Ecology Curriculum</h1>
        <p>Main page content not found. Please regenerate content.</p>
        <Link href="/wiki/science" className="text-green-600 hover:underline">Browse Science Curriculum</Link>
      </div>
    );
  }

  const headings = extractHeadings(post.content);

  const getId = makeHeadingIdCounter();
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
  };

  return (
    <article className="markdown-content">
      <MdxPageWrapper slug={slug} title={post.frontmatter.title as string || 'Ecology Curriculum'} headings={headings}>
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
