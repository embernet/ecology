import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getResourceRegistry } from '@/lib/resource-registry-api';
import { ResourceComponents } from '@/lib/resource-components';
import { SPECIES_HANDOUT_LINKS } from '@/lib/species-handouts';
import { PrevNextNav } from '@/components/PrevNextNav';
import type { NavItem } from '@/lib/navigation';

export function generateStaticParams() {
  const registry = getResourceRegistry();
  const creatures = Object.keys(registry).filter(id => registry[id].type === 'Creature');
  
  return creatures.map((id) => ({
    id: id,
  }));
}

export default async function CreaturePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const registry = getResourceRegistry();
  const creature = registry[resolvedParams.id];

  if (!creature || creature.type !== 'Creature') {
    notFound();
  }

  const Component = ResourceComponents['Creature'];
  
  const relatedHandouts = SPECIES_HANDOUT_LINKS.filter(h => h.creatures.some(c => c.id === resolvedParams.id));

  
  const allCreatures = Object.entries(registry)
    .filter(([_, res]) => res.type === 'Creature')
    .sort((a, b) => a[1].title.localeCompare(b[1].title));
    
  const currentIndex = allCreatures.findIndex(([id]) => id === resolvedParams.id);
  const prevCreature = currentIndex > 0 ? allCreatures[currentIndex - 1] : null;
  const nextCreature = currentIndex < allCreatures.length - 1 ? allCreatures[currentIndex + 1] : null;
  
  const prev: NavItem | null = prevCreature ? { href: `/creatures/${prevCreature[0]}`, label: prevCreature[1].title } : null;
  const next: NavItem | null = nextCreature ? { href: `/creatures/${nextCreature[0]}`, label: nextCreature[1].title } : null;

  return (
    <div className="main-scroll-area bg-slate-50">
      
      <div className="flex-shrink-0 z-10 bg-white border-b border-slate-200" style={{ padding: '0.8rem 2rem' }}>
        <PrevNextNav prev={prev} next={next} sectionLabel="Creature Directory" sectionHref="/creatures" title={creature.title} />
      </div>

      <div className="py-10">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="mb-4">
            <p className="text-lg text-slate-600">
              Featured in: <Link href={`/explore/${creature.sourcePage}`} className="text-amber-600 hover:underline font-semibold">{creature.sourcePageTitle}</Link>
            </p>
          </div>

          <div className="mt-4">
            <Component 
                id={`creature-${resolvedParams.id}`} 
                title={creature.title} 
                hideProfileLink={true}
                {...creature.data}
            >
                {creature.data.childrenHtml && (
                    <div dangerouslySetInnerHTML={{ __html: creature.data.childrenHtml }} />
                )}
            </Component>
            
            {relatedHandouts.length > 0 && (
              <div className="mt-8 space-y-4">
                {relatedHandouts.map(h => (
                  <div key={h.handoutSlug} className="bg-amber-50 rounded-xl p-6 border border-amber-200 flex items-center justify-between shadow-sm">
                    <div>
                      <h3 className="font-bold text-amber-900 mb-1 flex items-center gap-2">
                        <span className="text-xl">📄</span> Educational Handout Available
                      </h3>
                      <p className="text-amber-800 text-sm">Download the printable infographic: {h.handoutTitle}</p>
                    </div>
                    <Link href={`/wiki/${h.handoutSlug}`} className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap">
                      View Handout
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
