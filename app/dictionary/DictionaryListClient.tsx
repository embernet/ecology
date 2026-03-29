'use client';

import React, { useState, useMemo } from 'react';
import type { DictionaryEntry } from '@/lib/dictionary';

export function DictionaryListClient({ items }: { items: DictionaryEntry[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<DictionaryEntry | null>(null);

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const lower = searchTerm.toLowerCase();
    return items.filter(
      (item) => item.word.toLowerCase().includes(lower) || item.definition.toLowerCase().includes(lower)
    );
  }, [items, searchTerm]);

  return (
    <>
      <div className="flex-shrink-0 z-20 bg-slate-50 border-b border-slate-200 pt-8 pb-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
            Dictionary
          </h1>
          <p className="text-gray-600 mb-6 max-w-2xl text-md">
            Explore and learn new words used throughout our ecology materials.
          </p>
          <div className="w-full flex items-center gap-3">
            <div className="relative flex-grow flex items-center">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-shadow shadow-xs text-lg"
                placeholder="Search for a word..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex-shrink-0" title={`${filteredItems.length} words match your search`}>
              <span className="flex items-center justify-center min-w-[3rem] h-12 px-3 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 font-bold text-sm tracking-tight transition-all shadow-sm">
                {filteredItems.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 sm:px-6 lg:px-8 py-8" id="dictionary-scroll-container">
        <div className="max-w-4xl mx-auto grid grid-cols-1 gap-3 relative z-10">
        {filteredItems.map((item) => (
          <button
            key={item.word}
            onClick={() => setSelectedItem(item)}
            className="flex flex-col items-start p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-green-300 transition-all text-left group"
          >
            <span className="text-lg font-bold text-green-800 capitalize group-hover:text-green-600 transition-colors">
              {item.word}
            </span>
            <span className="text-sm text-gray-600 line-clamp-2 mt-1">
              {item.definition}
            </span>
          </button>
        ))}
        {filteredItems.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No words found matching "{searchTerm}"
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              onClick={() => setSelectedItem(null)}
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-3xl font-extrabold text-green-800 capitalize mb-4 pr-10 border-b border-green-100 pb-3">{selectedItem.word}</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              {selectedItem.definition}
            </p>
            {selectedItem.aliases && selectedItem.aliases.length > 0 && (
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <strong className="font-semibold text-gray-600">Also known as:</strong> {selectedItem.aliases.join(', ')}
              </div>
            )}
            {selectedItem.pages && selectedItem.pages.length > 0 && (
              <div className="mt-6 border-t border-gray-100 pt-4">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Mentioned In</h3>
                <ul className="flex flex-col gap-2">
                  {selectedItem.pages.map((page, idx) => (
                    <li key={idx}>
                      <a 
                        href={page.href} 
                        className="flex items-center text-green-700 hover:text-green-800 hover:underline hover:bg-green-50 px-2 py-1 -mx-2 rounded transition-colors group"
                      >
                        <svg className="w-4 h-4 mr-2 text-green-400 group-hover:text-green-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        {page.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-8 text-right">
              <button
                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow transition-colors"
                onClick={() => setSelectedItem(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
