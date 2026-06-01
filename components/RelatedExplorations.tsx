import Link from 'next/link';
import type { RelatedExplorations as Related } from '@/lib/curriculum-links';

/**
 * "Related" panel shown at the foot of a curriculum wiki page: the biomimicry
 * examples and "But Why?" conversations that connect to this topic. Computed by
 * inverting the cross-link resolver (lib/curriculum-links.ts), so it stays in
 * sync with the forward links on the detail pages from a single source of truth.
 */
export function RelatedExplorations({ related }: { related: Related }) {
  const { biomimicry, butWhy } = related;
  if (biomimicry.length === 0 && butWhy.length === 0) return null;

  return (
    <aside className="not-prose mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
      <h2 className="mb-1 text-lg font-bold text-slate-900">Explore this topic further</h2>
      <p className="mb-5 text-sm text-slate-600">
        Examples and conversations from around the site that connect to this topic.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {biomimicry.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-lime-800">
              How nature solved it — Biomimicry
            </h3>
            <ul className="space-y-1.5">
              {biomimicry.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/biomimicry/${b.id}`}
                    className="group flex items-start gap-2 text-slate-700 hover:text-lime-800"
                  >
                    <span aria-hidden="true" className="mt-0.5">
                      {b.emoji}
                    </span>
                    <span className="font-medium underline decoration-lime-300 underline-offset-2 group-hover:decoration-lime-500">
                      {b.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {butWhy.length > 0 && (
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-rose-800">
              Talk about it — But Why?
            </h3>
            <ul className="space-y-1.5">
              {butWhy.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/but-why/${c.id}`}
                    className="group flex items-start gap-2 text-slate-700 hover:text-rose-800"
                  >
                    <span aria-hidden="true" className="mt-0.5">
                      💬
                    </span>
                    <span className="font-medium underline decoration-rose-300 underline-offset-2 group-hover:decoration-rose-500">
                      {c.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
