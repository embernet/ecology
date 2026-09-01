import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getResourceRegistry } from '@/lib/resource-registry-api';
import { ResourceRenderer } from '@/components/ResourceRenderer';

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

  const renderItem = {
    id: `creature-${resolvedParams.id}`,
    shortId: resolvedParams.id,
    type: 'Creature' as const,
    title: creature.title,
    sourcePage: creature.sourcePage,
    sourcePageTitle: creature.sourcePageTitle || 'Unknown Page',
    data: creature.data,
    addedAt: Date.now(),
    order: 0
  };

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
          
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-amber-900 flex items-center gap-4">
              {creature.title} {creature.data?.emoji && <span className="text-5xl">{creature.data.emoji}</span>}
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              Featured in: <Link href={`/explore/${creature.sourcePage}`} className="text-amber-600 hover:underline font-semibold">{creature.sourcePageTitle}</Link>
            </p>
          </div>

          <div className="mt-8">
            <ResourceRenderer item={renderItem as any} />
          </div>

        </div>
      </div>
    </div>
  );
}
