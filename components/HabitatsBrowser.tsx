'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HABITATS, habitatsYearGroups, habitatsCategories } from '@/lib/habitats';
import { CurriculumFilter } from '@/components/CurriculumFilter';

export function HabitatsBrowser() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const categories = habitatsCategories();
  const years = habitatsYearGroups();

  const filtered = HABITATS.filter((h) => {
    if (selectedCategory !== null && h.category !== selectedCategory) return false;
    if (selectedYear !== null && !h.curriculum_links.some((l) => l.year_groups.includes(selectedYear))) return false;
    return true;
  });

  return (
    <div>
      <CurriculumFilter
        subjects={categories}
        subject={selectedCategory}
        onSubject={setSelectedCategory}
        yearGroups={years}
        year={selectedYear}
        onYear={setSelectedYear}
        count={filtered.length}
        total={HABITATS.length}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((h) => (
          <Link
            key={h.id}
            href={`/habitats/${h.id}`}
            className="group flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-amber-50 flex items-center justify-center text-6xl">
              {h.emoji}
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
                {h.category}
              </div>
              <h3 className="font-bold text-slate-900 group-hover:text-amber-700 transition-colors mb-2">
                {h.title}
              </h3>
              <p className="text-sm text-slate-600 line-clamp-2">
                {h.description}
              </p>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No habitats found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
