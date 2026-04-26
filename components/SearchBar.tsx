'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface PageEntry {
  type: 'page';
  slug: string;
  title: string;
  preview: string;
}

interface SectionEntry {
  type: 'section';
  slug: string;
  pageTitle: string;
  sectionTitle: string;
  sectionId: string;
  level: number;
  preview: string;
  body?: string;
}

interface ActivityEntry {
  type: 'activity';
  id: string;
  title: string;
  yearGroups: string;
  template: string;
  preview: string;
  body?: string;
}

type SearchEntry = PageEntry | SectionEntry | ActivityEntry;

// Module-level cache — fetched once per session
let indexCache: SearchEntry[] | null = null;
let fetchPromise: Promise<SearchEntry[]> | null = null;

function getSearchIndex(): Promise<SearchEntry[]> {
  if (indexCache) return Promise.resolve(indexCache);
  if (!fetchPromise) {
    fetchPromise = fetch('/search-index.json')
      .then(r => r.json())
      .then((data: SearchEntry[]) => {
        indexCache = data;
        return data;
      })
      .catch(() => []);
  }
  return fetchPromise;
}

function scoreEntry(entry: SearchEntry, q: string): number {
  if (entry.type === 'activity') {
    const title = entry.title.toLowerCase();
    const body = (entry.body ?? '').toLowerCase();
    const preview = entry.preview.toLowerCase();
    if (title === q) return 100;
    if (title.startsWith(q)) return 60;
    if (title.includes(q)) return 40;
    if (body.includes(q)) return 10;
    if (preview.includes(q)) return 5;
    return 0;
  }
  const title = (entry.type === 'page' ? entry.title : entry.sectionTitle).toLowerCase();
  const pageTitle = entry.type === 'section' ? entry.pageTitle.toLowerCase() : '';
  const preview = entry.preview.toLowerCase();
  const body = entry.type === 'section' && entry.body ? entry.body.toLowerCase() : '';
  if (title === q) return 100;
  if (title.startsWith(q)) return 60;
  if (title.includes(q)) return 40;
  if (pageTitle.includes(q)) return 15;
  if (preview.includes(q)) return 5;
  if (body.includes(q)) return 5;
  return 0;
}

function searchEntries(index: SearchEntry[], query: string): SearchEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const scored: Array<{ entry: SearchEntry; score: number }> = [];
  for (const entry of index) {
    const score = scoreEntry(entry, q);
    if (score > 0) scored.push({ entry, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(s => s.entry);
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Reset on navigation
  useEffect(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
  }, [pathname]);

  // Warm up the index on mount (non-blocking)
  useEffect(() => {
    getSearchIndex();
  }, []);

  // Search as the query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    getSearchIndex().then(index => {
      const found = searchEntries(index, query);
      setResults(found);
      setIsOpen(found.length > 0);
      setActiveIndex(-1);
    });
  }, [query]);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }, []);

  function navigate(entry: SearchEntry) {
    if (entry.type === 'activity') {
      router.push(`/activities/${entry.id}`);
      return;
    }
    const href =
      entry.type === 'page'
        ? `/wiki/${entry.slug}`
        : `/wiki/${entry.slug}#${entry.sectionId}`;
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setIsOpen(false);
      return;
    }
    if (!isOpen || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      navigate(results[activeIndex]);
    }
  }

  const resultKey = (entry: SearchEntry) => {
    if (entry.type === 'activity') return `activity-${entry.id}`;
    if (entry.type === 'page') return `page-${entry.slug}`;
    return `section-${entry.slug}-${entry.sectionId}`;
  };

  return (
    <div className="search-bar-container" ref={containerRef}>
      <div className="search-input-wrapper">
        {/* Magnifying glass */}
        <svg
          className="search-icon"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>

        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search pages and content…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Search site content"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
        />

        {query && (
          <button
            className="search-clear-btn"
            onClick={clear}
            aria-label="Clear search"
            tabIndex={-1}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="search-results-dropdown" role="listbox" aria-label="Search results">
          {results.map((entry, i) => (
            <li key={resultKey(entry)} role="none">
              <button
                className={`search-result-item${i === activeIndex ? ' search-result-item-active' : ''}`}
                role="option"
                aria-selected={i === activeIndex}
                // Use mousedown so the blur on the input doesn't close the dropdown first
                onMouseDown={e => {
                  e.preventDefault();
                  navigate(entry);
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                {entry.type === 'activity' ? (
                  <>
                    <span className="search-result-icon" aria-hidden="true">
                      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                        <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm5.854-2.646a.5.5 0 0 0-.708.708L7.293 8l-2.147 1.938a.5.5 0 0 0 .708.708L8 8.707l2.146 1.939a.5.5 0 0 0 .708-.708L8.707 8l2.147-1.938a.5.5 0 0 0-.708-.708L8 7.293 5.854 5.354z"/>
                      </svg>
                    </span>
                    <span className="search-result-text">
                      <span className="search-result-title">{entry.title}</span>
                      <span className="search-result-page">{entry.yearGroups} — {entry.template}</span>
                    </span>
                  </>
                ) : entry.type === 'page' ? (
                  <>
                    <span className="search-result-icon" aria-hidden="true">
                      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                        <path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0H4zm5 1v3.5H12L9 1zM4.5 7h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1zm0 2h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1zm0 2h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1 0-1z"/>
                      </svg>
                    </span>
                    <span className="search-result-text">
                      <span className="search-result-title">{entry.title}</span>
                      {entry.preview && (
                        <span className="search-result-preview">{entry.preview}</span>
                      )}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="search-result-icon search-result-icon-section" aria-hidden="true">
                      <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14">
                        <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z"/>
                      </svg>
                    </span>
                    <span className="search-result-text">
                      <span className="search-result-title">{entry.sectionTitle}</span>
                      <span className="search-result-page">{entry.pageTitle}</span>
                      {entry.preview && (
                        <span className="search-result-preview">{entry.preview}</span>
                      )}
                    </span>
                  </>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
