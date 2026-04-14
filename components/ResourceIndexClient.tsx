'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RegistryResource } from '@/lib/resource-registry-api';

import { useResourcePack } from '@/contexts/ResourcePackContext';
import { makeResourceLookupKey } from '@/lib/resource-pack-types';

interface Props {
  resources: (RegistryResource & { id: string, exploreSlug: string })[];
}

export default function ResourceIndexClient({ resources }: Props) {
  const [search, setSearchState] = useState('');
  const [filterType, setFilterTypeState] = useState('All');
  const [showInfo, setShowInfo] = useState(false);

  // Load saved state on component mount
  useEffect(() => {
    const savedSearch = sessionStorage.getItem('resource-search');
    const savedFilter = sessionStorage.getItem('resource-filter');
    if (savedSearch) setSearchState(savedSearch);
    if (savedFilter) setFilterTypeState(savedFilter);
  }, []);

  const setSearch = (val: string) => {
    setSearchState(val);
    sessionStorage.setItem('resource-search', val);
  };

  const setFilterType = (type: string) => {
    setFilterTypeState(type);
    sessionStorage.setItem('resource-filter', type);
  };

  const uniqueTypes = Array.from(new Set(resources.map(r => r.type))).sort();
  const types = ['All', 'Has Image', ...uniqueTypes];

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      if (filterType !== 'All') {
        if (filterType === 'Has Image') {
          if (!r.data.wikiImages || r.data.wikiImages.length === 0) return false;
        } else if (r.type !== filterType) {
          return false;
        }
      }
      
      const searchLower = search.toLowerCase();
      if (!searchLower) return true;
      
      const title = (r.data.title || r.title || '').toLowerCase();
      const text = (r.data.text || r.data.facts || r.data.description || '').toLowerCase();
      
      return title.includes(searchLower) || text.includes(searchLower);
    });
  }, [resources, search, filterType]);

  return (
    <>
      {/* Fixed Top Section */}
      <div className="flex-shrink-0 z-20 bg-slate-50 border-b border-slate-200 pt-8 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight m-0">
              Resource Index
            </h1>
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors border ${
                showInfo ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
              }`}
              title="Toggle Information"
            >
              <span className="font-serif font-bold italic">i</span>
            </button>
          </div>

          <div
             className={`overflow-hidden transition-all duration-300 ease-in-out ${
               showInfo ? 'max-h-40 opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'
             }`}
          >
            <p className="text-md text-slate-700 max-w-2xl bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              A complete, searchable directory of every individual learning component. Find activities, guidance, reflections, and nature examples to add to resource packs or share via permalinks.
            </p>
          </div>

          <div className="flex flex-col gap-4 bg-white p-3 rounded-xl shadow-sm border border-slate-200">
            <div className="w-full flex items-center gap-3">
              <div className="relative flex-grow flex items-center">
                <svg className="absolute left-3 text-slate-400 w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Search resources..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-slate-100 bg-slate-50 hover:bg-white focus:bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/30 transition-all text-slate-800"
                />
                {search.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 transition-colors bg-slate-200/50 hover:bg-slate-200 rounded-full p-1"
                    aria-label="Clear search"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex-shrink-0" title={`${filteredResources.length} resources match your filters`}>
                <span className="flex items-center justify-center min-w-[3rem] h-10 px-3 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 font-bold text-sm tracking-tight transition-all shadow-sm">
                  {filteredResources.length}
                </span>
              </div>
            </div>
            
            <div className="flex w-full overflow-x-auto gap-2 scrollbar-hide pb-1">
              {types.map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    filterType === type 
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {type === 'All' ? type : type.replace(/([A-Z])/g, ' $1').trim()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
        
        {filteredResources.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-300 mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900">No resources found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>
    </>
  );
}

function ResourceCard({ resource }: { resource: RegistryResource & { id: string, exploreSlug: string } }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = useMemo(() => {
    if (!resource.data.wikiImages) return [];
    return resource.data.wikiImages.map(img => {
      const cleanFilename = img.filename.trim().split(' ').join('_');
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(cleanFilename)}`;
    });
  }, [resource.data.wikiImages]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (images.length <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    const index = Math.min(
      Math.floor(percentage * images.length),
      images.length - 1
    );
    setActiveImageIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveImageIndex(0);
  };

  const { addItem, removeItem, isInPack } = useResourcePack();
  const typeLabel = resource.type.replace(/([A-Z])/g, ' $1').trim();
  const title = resource.data.title || resource.title;
  const previewText = resource.data.text || resource.data.facts || resource.data.description || 'View resource to see content details.';

  const lookupKey = makeResourceLookupKey(resource.type as any, title, resource.sourcePage);
  const added = isInPack(lookupKey);

  const handleTogglePack = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to explore page
    if (added) {
      removeItem(lookupKey);
    } else {
      addItem({
        type: resource.type as any,
        sourcePage: resource.sourcePage,
        sourcePageTitle: resource.sourcePageTitle,
        title: title,
        shortId: resource.id,
        data: {
          type: resource.type as any,
          childrenHtml: resource.data.childrenHtml || '',
          wikiImages: resource.data.wikiImages || [],
          text: resource.data.text,
          facts: resource.data.facts,
          description: resource.data.description,
          emoji: resource.data.emoji,
        },
      });
    }
  };

  const currentImageSrc = images.length > 0 ? images[activeImageIndex] : null;

  return (
    <Link 
      href={`/explore/${resource.exploreSlug}`} 
      className="group flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-200 overflow-hidden transition-all duration-300 hover:-translate-y-1"
    >
      {/* Full-width Type Bar */}
      <div className="w-full bg-emerald-100 border-b border-emerald-200 px-5 py-2 flex-shrink-0">
        <span className="block text-[10px] font-bold tracking-widest text-emerald-900 uppercase truncate">
          {typeLabel}
        </span>
      </div>

      {/* Image Thumbnail Header with Scrubbing */}
      {currentImageSrc && (
        <div 
          className="h-40 w-full bg-slate-100 relative overflow-hidden flex-shrink-0 border-b border-slate-100"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img 
            src={currentImageSrc} 
            alt={title} 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
              {images.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1 rounded-full transition-all duration-300 ${i === activeImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="p-5 flex-grow pb-4">
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors line-clamp-2">
          {title}
        </h3>
        
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
          {previewText}
        </p>
      </div>
      
      <div className="bg-slate-50 p-4 border-t border-slate-100 flex flex-col gap-3 mt-auto relative z-20">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="truncate max-w-[150px] font-medium" title={resource.sourcePageTitle}>
            {resource.sourcePageTitle}
          </span>
          <span className="font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors inline-flex items-center gap-1 group">
            Explore <span className="group-hover:translate-x-1 transition-transform inline-block">&rarr;</span>
          </span>
        </div>
        
        <div className="flex justify-between items-center pt-3 border-t border-slate-200/60">
          <button
            onClick={handleTogglePack}
            className={`group/tooltip relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              added 
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200' 
                : 'bg-white border border-slate-200 text-slate-600 hover:text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 shadow-sm'
            }`}
            aria-label={added ? `Remove ${title} from pack` : `Add ${title} to pack`}
          >
            <span className="pointer-events-none absolute left-1/2 top-full z-[100] mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity delay-500 duration-200 group-hover/tooltip:opacity-100 group-focus-visible/tooltip:opacity-100 shadow-md">
              {added ? 'Remove from resource pack' : 'Add to resource pack'}
              <span className="absolute bottom-full left-1/2 -ml-1 border-4 border-transparent border-b-slate-700" />
            </span>
            {added ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span>Added</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
