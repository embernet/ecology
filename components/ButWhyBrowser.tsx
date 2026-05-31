'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CONVERSATIONS, conversationYearGroups } from '@/lib/but-why';
import { CurriculumFilter } from '@/components/CurriculumFilter';

export function ButWhyBrowser() {
  const [year, setYear] = useState<string | null>(null);
  const years = useMemo(() => conversationYearGroups(), []);

  const filtered = useMemo(() => {
    return CONVERSATIONS.filter(
      (c) => year === null || c.curriculum.year_groups.includes(year)
    );
  }, [year]);

  return (
    <div>
      <CurriculumFilter
        subject={null}
        onSubject={() => {}}
        yearGroups={years}
        year={year}
        onYear={setYear}
        count={filtered.length}
        total={CONVERSATIONS.length}
      />

      {filtered.length === 0 ? (
        <p className="text-slate-500 py-8 text-center">
          No conversations for that year group yet — try clearing the filter.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/but-why/${c.id}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-green-300 hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-green-800 leading-snug group-hover:underline">
                {c.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{c.summary}</p>
              <div className="mt-auto pt-4 flex flex-wrap gap-1.5">
                {c.curriculum.year_groups.map((y) => (
                  <span
                    key={y}
                    className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800"
                  >
                    {y}
                  </span>
                ))}
                {c.curriculum.topics.slice(0, 2).map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
