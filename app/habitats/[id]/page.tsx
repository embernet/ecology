import fs from 'fs';
import path from 'path';
import { HABITATS, getHabitatEntry } from '@/lib/habitats';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { HabitatResourceWrapper } from '@/components/HabitatResourceWrapper';

import { PrevNextNav } from '@/components/PrevNextNav';
import type { NavItem } from '@/lib/navigation';

import { resolvePageSlugs } from '@/lib/curriculum-links';
import { getPostBySlug } from '@/lib/content';
import { getResourceRegistry } from '@/lib/resource-registry-api';

export function generateStaticParams() {
  return HABITATS.map((h) => ({ id: h.id }));
}

function titleFor(slug: string): string {
  const post = getPostBySlug(slug);
  return (post?.frontmatter.title as string) || slug;
}

export default async function HabitatDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const h = getHabitatEntry(resolvedParams.id);
  if (!h) notFound();

  const registry = getResourceRegistry();

  const currentIndex = HABITATS.findIndex(x => x.id === resolvedParams.id);
  const prevHabitat = currentIndex > 0 ? HABITATS[currentIndex - 1] : null;
  const nextHabitat = currentIndex < HABITATS.length - 1 ? HABITATS[currentIndex + 1] : null;
  const prev: NavItem | null = prevHabitat ? { href: `/habitats/${prevHabitat.id}`, label: prevHabitat.title } : null;
  const next: NavItem | null = nextHabitat ? { href: `/habitats/${nextHabitat.id}`, label: nextHabitat.title } : null;

  const hasImage = fs.existsSync(
    path.join(process.cwd(), 'public', 'habitat-images', `${resolvedParams.id}.jpg`)
  );


  return (
    <article className="flex flex-col h-full w-full bg-slate-50">
      <div className="flex-shrink-0 z-10 bg-white border-b border-slate-200" style={{ padding: '0.8rem 2rem' }}>
        <PrevNextNav prev={prev} next={next} sectionLabel="Habitats" sectionHref="/habitats" title={h.title} />
      </div>
      <div className="main-scroll-area bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <HabitatResourceWrapper id={h.id} title={h.title} description={h.description} emoji={h.emoji} category={h.category}>
            {hasImage && (
              <figure className="mb-8">
                <img
                  src={`/habitat-images/${resolvedParams.id}.jpg`}
                  alt={h.title}
                  className="w-full rounded-2xl border border-slate-200 object-cover aspect-video"
                />
                <figcaption className="mt-3 text-center">
                  {h.image_caption && (
                    <div className="text-sm font-medium text-slate-700 mb-1">{h.image_caption}</div>
                  )}
                  <div className="text-[10px] text-slate-500 leading-tight">
                    Credit: Mark Burnett, created with AI.{' '}
                  <Link href="/wiki/ai-image-license" className="underline hover:text-slate-700">
                    Click here for the license
                  </Link>
                  </div>
                </figcaption>
              </figure>
            )}

            
            <div className="space-y-10">

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b-2 border-slate-100 pb-2">
                  Climate & Environment
                </h2>
                <p className="text-slate-700 leading-relaxed">{h.climate}</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b-2 border-slate-100 pb-2">
                  Key Plants
                </h2>
                <p className="text-slate-700 leading-relaxed">{h.plants}</p>
              </section>

              {h.fun_facts && h.fun_facts.length > 0 && (
                <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-100">
                  <h3 className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
                    <span className="text-xl">💡</span> Fun Facts
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {h.fun_facts.map((fact, i) => (
                      <li key={i} className="text-slate-700 leading-relaxed">{fact}</li>
                    ))}
                  </ul>
                </div>
              )}

              <section>
                <h2 className="text-2xl font-bold text-slate-900 mb-4 border-b-2 border-slate-100 pb-2">
                  Key Creatures
                </h2>
                <div className="space-y-4">
                  {h.animals.map((animal, idx) => {
                    const animalSlug = animal.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const animalImagePath = `/habitat-images/animals/${resolvedParams.id}-${animalSlug}.jpg`;
                    const hasAnimalImage = fs.existsSync(path.join(process.cwd(), 'public', animalImagePath));
                    
                    const cleanName = animal.name.split('(')[0].trim();
                    const creatureId = Object.keys(registry).find(k => registry[k].type === 'Creature' && registry[k].title === cleanName);

                    const card = (
                      <div className={`bg-green-50 rounded-xl p-6 h-full border ${creatureId ? 'border-green-100 hover:border-green-300 hover:shadow-md transition-all' : 'border-transparent'}`}>
                        <h3 className="text-lg font-bold text-green-900 mb-2">{animal.name}</h3>
                        {hasAnimalImage && (
                          <img 
                            src={animalImagePath} 
                            alt={animal.name} 
                            className="w-full object-cover rounded-lg mb-4 border border-green-200" 
                          />
                        )}
                        <h4 className="font-semibold text-green-800 mb-1 text-sm">How it survives here:</h4>
                        <p className="text-slate-700 leading-relaxed">{animal.how_it_survives}</p>
                        {creatureId && (
                           <div className="mt-4 text-green-700 font-semibold text-sm flex items-center gap-1 group-hover:text-green-800">
                             📖 View in Creature Directory <span aria-hidden="true">&rarr;</span>
                           </div>
                        )}
                      </div>
                    );

                    return (
                      <div key={idx} className="block group">
                        {creatureId ? <Link href={`/creatures/${creatureId}`}>{card}</Link> : card}
                      </div>
                    );
                  })}
                </div>
              </section>

              {h.curriculum_links && h.curriculum_links.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2">
                    Curriculum Links
                  </h2>
                  <div className="grid gap-4">
                    {h.curriculum_links.map((link, idx) => {
                        const slugs = resolvePageSlugs(link.subject, link.key_stage, link.year_groups, link.topic);
                        const targetPages = slugs.map(slug => ({ href: '/wiki/' + slug, title: titleFor(slug) }));
                        return (
                          <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="px-2 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded">
                                {link.key_stage} / {link.subject}
                              </span>
                              {link.year_groups.map((y) => (
                                <span key={y} className="px-2 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded">
                                  {y}
                                </span>
                              ))}
                            </div>
                            <div className="text-sm font-semibold text-slate-800 mb-1">{link.topic}</div>
                            {targetPages && targetPages.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-slate-200">
                                <span className="text-sm text-slate-500 mr-2">Explore this on the site:</span>
                                {targetPages.map((p) => (
                                    <Link key={p.href} href={p.href} className="inline-block text-sm text-green-700 font-medium hover:underline mr-4">
                                    {p.title}
                                    </Link>
                                ))}
                                </div>
                            )}
                          </div>
                        );
                    })}
                  </div>
                </section>
              )}
            </div>
        </HabitatResourceWrapper>
      </div>
      </div>
    </article>
  );
}
