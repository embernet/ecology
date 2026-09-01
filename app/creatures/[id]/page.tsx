import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getResourceRegistry } from '@/lib/resource-registry-api';
import { ResourceComponents } from '@/lib/resource-components';

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

  // Hydrate wiki images if necessary, though Creature usually has plain childrenHtml.
  // Actually, wait, we can just pass dangerouslySetInnerHTML as children if it's from JSON.
  // We'll wrap childrenHtml in a div just like we do in /explore.
  
  return (
    <div className="main-scroll-area bg-slate-50">
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center text-sm text-slate-500">
          <Link href="/creatures" className="hover:text-amber-600 transition-colors">Creature Directory</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 font-medium">{creature.title}</span>
        </div>
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
          </div>

        </div>
      </div>
    </div>
  );
}
