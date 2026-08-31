import Link from 'next/link';
import { getResourceRegistry } from '@/lib/resource-registry-api';

export const metadata = {
  title: 'Creature Directory - Ecology Curriculum',
  description: 'Explore the amazing creatures in our ecology curriculum.',
};

export default async function CreaturesPage() {
  const registry = getResourceRegistry();
  
  // Get all creatures
  const creatures = Object.values(registry)
    .filter((res: any) => res.type === 'Creature')
    .sort((a: any, b: any) => a.title.localeCompare(b.title));

  return (
    <div className="main-scroll-area">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-amber-800 border-b-4 border-yellow-400 inline-block pb-2 mb-4">
            Creature Directory
          </h1>
          <p className="max-w-3xl text-lg text-slate-700 leading-relaxed">
            Explore all the amazing animals and creatures featured in our lessons and habitats.
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
          {creatures.map((c: any) => {
            const shortId = Object.keys(registry).find(k => registry[k] === c);
            return (
              <Link key={shortId} href={`/creatures/${shortId}`} className="group block h-full">
                <article className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 flex-grow border-b border-amber-100 flex flex-col items-center text-center justify-center gap-2">
                    {c.data?.emoji ? (
                      <div className="w-12 h-12 flex items-center justify-center text-2xl bg-white rounded-full shadow-sm border border-amber-100 group-hover:scale-110 transition-transform">
                        {c.data.emoji}
                      </div>
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center text-2xl bg-white rounded-full shadow-sm border border-amber-100 group-hover:scale-110 transition-transform">
                        🐾
                      </div>
                    )}
                    <h3 className="text-md font-bold text-amber-900 leading-tight">
                      {c.title}
                    </h3>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
