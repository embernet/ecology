'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BIOMIMICRY,
  biomimicrySubjects,
  biomimicryYearGroups,
  entrySubjects,
  entryYearGroups,
} from '@/lib/biomimicry';
import { CurriculumFilter } from '@/components/CurriculumFilter';

export function BiomimicryBrowser({
  availableImages = [],
}: {
  availableImages?: string[];
}) {
  const [subject, setSubject] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);

  const subjects = useMemo(() => biomimicrySubjects(), []);
  const years = useMemo(() => biomimicryYearGroups(), []);
  const imageSet = useMemo(() => new Set(availableImages), [availableImages]);

  const filtered = useMemo(() => {
    return BIOMIMICRY.filter((e) => {
      const subjectMatch =
        subject === null || e.curriculum_links.some((l) => l.subject === subject);
      const yearMatch =
        year === null ||
        e.curriculum_links.some((l) => l.year_groups.includes(year));
      return subjectMatch && yearMatch;
    });
  }, [subject, year]);

  return (
    <div>
      <CurriculumFilter
        subjects={subjects}
        subject={subject}
        onSubject={setSubject}
        yearGroups={years}
        year={year}
        onYear={setYear}
        count={filtered.length}
        total={BIOMIMICRY.length}
      />

      {filtered.length === 0 ? (
        <p className="text-slate-500 py-8 text-center">
          No examples match that combination yet — try clearing a filter.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => {
            const ys = entryYearGroups(e);
            const subs = entrySubjects(e);
            return (
              <Link
                key={e.id}
                href={`/biomimicry/${e.id}`}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
              >
                {imageSet.has(e.id) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`/biomimicry-images/${e.id}.png`}
                    alt=""
                    aria-hidden="true"
                    className="mb-3 aspect-[4/3] w-full rounded-xl border border-slate-100 object-cover"
                  />
                ) : (
                  <span className="text-4xl mb-3" aria-hidden="true">
                    {e.emoji}
                  </span>
                )}
                <h3 className="text-lg font-bold text-green-800 leading-snug group-hover:underline">
                  {e.title}
                </h3>
                <p className="mt-1 text-sm italic text-slate-500">{e.creature}</p>
                <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
                  {subs.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800"
                    >
                      {s}
                    </span>
                  ))}
                  {ys.map((y) => (
                    <span
                      key={y}
                      className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800"
                    >
                      {y}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
