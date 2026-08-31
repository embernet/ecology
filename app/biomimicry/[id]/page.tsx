import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BIOMIMICRY, getBiomimicryEntry, provenanceLabel } from '@/lib/biomimicry';
import { PrevNextNav } from '@/components/PrevNextNav';
import type { NavItem } from '@/lib/navigation';

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

  const currentIndex = BIOMIMICRY.findIndex(x => x.id === id);
  const prevEntry = currentIndex > 0 ? BIOMIMICRY[currentIndex - 1] : null;
  const nextEntry = currentIndex < BIOMIMICRY.length - 1 ? BIOMIMICRY[currentIndex + 1] : null;
  const prev: NavItem | null = prevEntry ? { href: `/biomimicry/${prevEntry.id}`, label: prevEntry.title } : null;
  const next: NavItem | null = nextEntry ? { href: `/biomimicry/${nextEntry.id}`, label: nextEntry.title } : null;

  const hasImage = fs.existsSync(
    path.join(process.cwd(), 'public', 'biomimicry-images', `${id}.png`),
  );

  const prov = provenanceLabel(entry.provenance);
  const isCopied = (entry.provenance ?? 'copied') === 'copied';

  return (
    <article className="flex flex-col h-full w-full bg-slate-50">
      <div className="flex-shrink-0 z-10 bg-white border-b border-slate-200" style={{ padding: '0.8rem 2rem' }}>
        <PrevNextNav prev={prev} next={next} sectionLabel="Biomimicry" sectionHref="/biomimicry" title={entry.title} />
      </div>
      <div className="main-scroll-area">
        <div className="max-w-3xl mx-auto px-4 py-8">

        <header className="mb-8">
          <div className="text-6xl mb-3" aria-hidden="true">
            {entry.emoji}
          </div>
          <h1 className="text-3xl font-bold text-green-800 leading-tight">
            {entry.title}
          </h1>
          <p className="mt-2 text-lg italic text-slate-500">{entry.creature}</p>

          <div
            className={`mt-4 flex items-start gap-3 rounded-xl border p-3 ${
              isCopied
                ? 'border-sky-200 bg-sky-50'
                : 'border-teal-200 bg-teal-50'
            }`}
          >
            <span className="text-2xl leading-none" aria-hidden="true">
              {prov.emoji}
            </span>
            <span>
              <span
                className={`block text-sm font-bold ${
                  isCopied ? 'text-sky-900' : 'text-teal-900'
                }`}
              >
                {prov.label}
              </span>
              <span
                className={`block text-sm leading-snug ${
                  isCopied ? 'text-sky-800' : 'text-teal-800'
                }`}
              >
                {prov.blurb}
              </span>
            </span>
          </div>
        </header>

        {hasImage && (
          <figure className="mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/biomimicry-images/${id}.png`}
              alt={entry.creature}
              className="w-full rounded-2xl border border-slate-200 bg-white"
            />
            <figcaption className="mt-2 text-[10px] text-center text-slate-500 leading-tight">
              Credit: Mark Burnett, created with AI.{' '}
              <Link href="/wiki/ai-image-license" className="underline hover:text-slate-700">
                Click here for the license
              </Link>
            </figcaption>
          </figure>
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
    </article>
  );
}
