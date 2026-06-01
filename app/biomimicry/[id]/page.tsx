import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BIOMIMICRY, getBiomimicryEntry } from '@/lib/biomimicry';
import { targetsForBiomimicryLink } from '@/lib/curriculum-links';

export function generateStaticParams() {
  return BIOMIMICRY.map((e) => ({ id: e.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = getBiomimicryEntry(id);
  return {
    title: entry ? `${entry.title} — Biomimicry` : 'Biomimicry',
  };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-green-700 mb-1.5">
        {title}
      </h2>
      <p className="text-lg text-slate-700 leading-relaxed">{children}</p>
    </section>
  );
}

export default async function BiomimicryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = getBiomimicryEntry(id);
  if (!entry) notFound();

  const hasImage = fs.existsSync(
    path.join(process.cwd(), 'public', 'biomimicry-images', `${id}.png`),
  );

  return (
    <div className="main-scroll-area">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/biomimicry"
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          All biomimicry examples
        </Link>

        <header className="mb-8">
          <div className="text-6xl mb-3" aria-hidden="true">
            {entry.emoji}
          </div>
          <h1 className="text-3xl font-bold text-green-800 leading-tight">
            {entry.title}
          </h1>
          <p className="mt-2 text-lg italic text-slate-500">{entry.creature}</p>
        </header>

        {hasImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/biomimicry-images/${id}.png`}
            alt={entry.creature}
            className="mb-8 w-full rounded-2xl border border-slate-200 bg-white"
          />
        )}

        <Section title="Where you might see it">{entry.where_you_might_see_it}</Section>
        <Section title="Nature's problem">{entry.natures_problem}</Section>
        <Section title="Nature's solution">{entry.natures_solution}</Section>
        <Section title="What people made">{entry.what_people_made}</Section>

        <div className="my-8 rounded-2xl border-2 border-amber-300 bg-amber-50 p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-amber-900 mb-2">
            <span aria-hidden="true">🔍</span> Try this
          </h2>
          <p className="text-lg text-amber-950 leading-relaxed">{entry.try_this}</p>
        </div>

        <section>
          <h2 className="text-xl font-bold text-green-800 mb-4">Curriculum links</h2>
          <div className="space-y-4">
            {entry.curriculum_links.map((l, i) => {
              const targets = targetsForBiomimicryLink(l);
              return (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                      {l.subject}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      {l.key_stage}
                    </span>
                    {l.year_groups.map((y) => (
                      <span
                        key={y}
                        className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800"
                      >
                        {y}
                      </span>
                    ))}
                  </div>
                  <p className="font-semibold text-slate-800">{l.topic}</p>
                  <p className="mt-1 text-slate-600 leading-relaxed">{l.how}</p>
                  {targets.length > 0 && (
                    <p className="mt-3 text-sm text-slate-600">
                      <span className="font-semibold text-green-700">
                        Explore this on the site:{' '}
                      </span>
                      {targets.map((t, j) => (
                        <span key={t.slug}>
                          {j > 0 && ', '}
                          <Link
                            href={`/wiki/${t.slug}`}
                            className="font-medium text-green-700 underline decoration-green-300 underline-offset-2 hover:text-green-900 hover:decoration-green-500"
                          >
                            {t.title}
                          </Link>
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
