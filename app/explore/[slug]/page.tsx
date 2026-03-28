import { getResourceBySlug, getAllResourceSlugs } from '@/lib/resource-registry-api';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Import the actual MDX components
import { NatureExample } from '@/components/mdx/NatureExample';
import { Requirement } from '@/components/mdx/Requirement';
import { Activity, Reflection } from '@/components/mdx/Activities';
import { Note, Guidance } from '@/components/mdx/Micro';
import { WikiImage } from '@/components/mdx/WikiImage';

export async function generateStaticParams() {
   const slugs = getAllResourceSlugs();
   return slugs.map(slug => ({ slug }));
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

function RenderHtmlWithWikiImages({ html }: { html: string }) {
    if (!html) return null;
    
    const chunks = [];
    const wikiRe = /<figure\s+data-wiki-filename="([^"]+)"(?:\s+data-wiki-credit="([^"]*)")?>([\s\S]*?)<\/figure>/g;
    
    let lastIndex = 0;
    let match;
    while ((match = wikiRe.exec(html)) !== null) {
        if (match.index > lastIndex) {
            chunks.push(<div key={`html-${lastIndex}`} className="markdown-content" dangerouslySetInnerHTML={{ __html: html.slice(lastIndex, match.index) }} />);
        }
        
        const innerHtml = match[3] || match[0];
        const altMatch = innerHtml.match(/alt="([^"]*)"/);
        const alt = altMatch ? altMatch[1] : '';
        
        chunks.push(
            <div key={`img-${match.index}`} className="my-6">
                <WikiImage 
                    filename={match[1]} 
                    alt={alt} 
                    credit={match[2] || undefined} 
                />
            </div>
        );
        
        lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < html.length) {
        chunks.push(<div key={`html-${lastIndex}`} className="markdown-content" dangerouslySetInnerHTML={{ __html: html.slice(lastIndex) }} />);
    }
    
    return <>{chunks.length > 0 ? chunks : <div className="markdown-content" dangerouslySetInnerHTML={{ __html: html }} />}</>;
}

export default async function ExplorePermalinkPage({ params }: PageProps) {
    const { slug } = await params;
    const resource = getResourceBySlug(slug);
    
    if (!resource) {
        notFound();
    }
    
    const renderComponent = () => {
        // Hydrate WikiImages from the static HTML generated during build
        const childrenNode = resource.data.childrenHtml ? (
            <RenderHtmlWithWikiImages html={resource.data.childrenHtml} />
        ) : null;
        
        switch (resource.type) {
            case 'NatureExample':
                return (
                    <NatureExample 
                        id={resource.id} 
                        title={resource.data.title || resource.title} 
                        emoji={resource.data.emoji} 
                        facts={resource.data.facts}
                    >
                        {childrenNode}
                    </NatureExample>
                );
            case 'Requirement':
                return (
                    <Requirement 
                        id={resource.id} 
                        text={resource.data.text || ''}
                    >
                        {childrenNode}
                    </Requirement>
                );
            case 'Activity':
                return (
                    <Activity 
                        id={resource.id} 
                        title={resource.data.title || resource.title} 
                        description={resource.data.description || ''}
                    />
                );
            case 'Reflection':
                return (
                    <Reflection 
                        id={resource.id} 
                        title={resource.data.title || resource.title} 
                        description={resource.data.description || ''}
                    />
                );
            case 'Note':
                return (
                    <Note 
                        id={resource.id} 
                        title={resource.data.title || resource.title} 
                        text={resource.data.text || ''}
                    >
                        {childrenNode}
                    </Note>
                );
            case 'Guidance':
                return (
                    <Guidance 
                        id={resource.id} 
                        text={resource.data.text || ''}
                    >
                        {childrenNode}
                    </Guidance>
                );
            default:
                return <div className="p-4 bg-red-50 text-red-800 rounded">Unknown resource type: {resource.type}</div>;
        }
    };

    const typeLabel = resource.type.replace(/([A-Z])/g, ' $1').trim();

    return (
        <div className="h-screen bg-slate-50 font-sans flex flex-col overflow-hidden">
            {/* Top Navigation Bar - Fixed */}
            <div className="flex-shrink-0 bg-white border-b border-slate-200 py-3 px-6 md:px-8 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Link href="/resources" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Explorer
                    </Link>
                    <div className="text-sm text-slate-500 text-right hidden sm:block">
                        Referenced from:{' '}
                        <Link href={`/wiki/${resource.sourcePage}#${resource.id}`} className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
                            {resource.sourcePageTitle || resource.sourcePage}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Title & Metadata Bar - Fixed */}
            <div className="flex-shrink-0 bg-slate-100/90 backdrop-blur shadow-sm border-b border-slate-200 px-6 py-3 md:px-8 z-10">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="inline-block px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-800 uppercase bg-emerald-200/50 rounded-full border border-emerald-300/50">
                            {typeLabel}
                        </span>
                        <span className="text-slate-400 text-xs font-mono tracking-tight">#{resource.id}</span>
                    </div>
                    {/* Mobile only source link */}
                    <div className="text-sm text-slate-500 sm:hidden">
                        <Link href={`/wiki/${resource.sourcePage}#${resource.id}`} className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
                            View Source &rarr;
                        </Link>
                    </div>
                </div>
            </div>
            
            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-6 md:p-10 pb-20">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="p-6 sm:p-8 md:p-10">
                            {renderComponent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
