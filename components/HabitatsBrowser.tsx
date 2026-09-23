'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HABITATS, habitatsYearGroups, habitatsCategories } from '@/lib/habitats';
import { CurriculumFilter } from '@/components/CurriculumFilter';

export function HabitatsBrowser() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'gcse'>('all');

  const categories = habitatsCategories();
  const years = habitatsYearGroups();

  const filtered = HABITATS.filter((h) => {
    if (viewMode === 'gcse') {
      if (!h.gcse_category) return false;
      if (selectedCategory !== null && h.gcse_category !== selectedCategory) return false;
    } else {
      if (selectedCategory !== null && h.category !== selectedCategory) return false;
      if (selectedYear !== null && !h.curriculum_links.some((l) => l.year_groups.includes(selectedYear))) return false;
    }
    return true;
  });

  const displayCategories = viewMode === 'gcse' 
    ? ['Urban', 'Freshwater', 'Woodland', 'Grassland', 'Farmland', 'Marine']
    : categories;

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button onClick={() => { setViewMode('all'); setSelectedCategory(null); }} className={`px-4 py-2 rounded-full font-bold shadow-sm transition-colors ${viewMode === 'all' ? 'bg-green-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>All Habitats</button>
        <button onClick={() => { setViewMode('gcse'); setSelectedCategory(null); }} className={`px-4 py-2 rounded-full font-bold shadow-sm transition-colors flex items-center gap-2 ${viewMode === 'gcse' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}>
          GCSE Core Habitats (UK)
        </button>
      </div>
      
      {viewMode === 'gcse' ? (
        <div className="bg-amber-50 rounded-xl p-4 mb-8 border border-amber-200">
          <p className="text-amber-800 text-sm font-medium mb-3">Filter by GCSE Macro-Category:</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedCategory(null)} className={`px-3 py-1 text-sm rounded-full font-medium ${selectedCategory === null ? 'bg-amber-800 text-white' : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-100'}`}>All Types</button>
            {displayCategories.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)} className={`px-3 py-1 text-sm rounded-full font-medium ${selectedCategory === c ? 'bg-amber-800 text-white' : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-100'}`}>{c}</button>
            ))}
          </div>
        </div>
      ) : (
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
      )}
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
                {viewMode === 'gcse' ? h.gcse_category : h.category}
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
