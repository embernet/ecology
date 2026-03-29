import React from 'react';
import { getSortedDictionary } from '@/lib/dictionary';
import { getDictionaryUsageMap } from '@/lib/dictionary-usage';
import { DictionaryListClient } from './DictionaryListClient';

export const metadata = {
  title: 'Dictionary - Ecology Curriculum',
  description: 'Glossary of ecology terms.',
};

export default function DictionaryPage() {
  const dictionary = getSortedDictionary();
  const usageMap = getDictionaryUsageMap();

  const dictionaryWithUsage = dictionary.map(entry => ({
    ...entry,
    pages: usageMap.get(entry.word) || []
  }));

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] bg-slate-50 font-sans flex flex-col overflow-hidden">
      <DictionaryListClient items={dictionaryWithUsage} />
    </div>
  );
}
