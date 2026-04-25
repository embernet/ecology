'use client';

import Link from 'next/link';
import { useResourcePack } from '@/contexts/ResourcePackContext';
import type { ResourcePackItem } from '@/lib/resource-pack-types';
import { makeResourceLookupKey } from '@/lib/resource-pack-types';

const typeIcons: Record<string, string> = {
  NatureExample: '🌿',
  Activity: '🎯',
  Reflection: '💭',
  Requirement: '📋',
  Note: '📝',
  Guidance: '📖',
  Handout: '🖼️',
};

const typeColors: Record<string, string> = {
  NatureExample: 'bg-green-100 text-green-700',
  Activity: 'bg-indigo-100 text-indigo-700',
  Reflection: 'bg-purple-100 text-purple-700',
  Requirement: 'bg-blue-100 text-blue-700',
  Note: 'bg-yellow-100 text-yellow-700',
  Guidance: 'bg-gray-100 text-gray-700',
  Handout: 'bg-amber-100 text-amber-700',
};

interface ResourcePackCardProps {
  item: ResourcePackItem;
  index: number;
  total: number;
}

export function ResourcePackCard({ item, index, total }: ResourcePackCardProps) {
  const { removeItem, moveItem } = useResourcePack();
  const lookupKey = makeResourceLookupKey(item.type, item.title, item.sourcePage);

  return (
    <div className="resource-pack-card">
      <div className="flex items-start gap-2">
        <span className={`flex-shrink-0 text-xs px-1.5 py-0.5 rounded font-medium ${typeColors[item.type] || 'bg-gray-100'}`}>
          {typeIcons[item.type] || '📄'}
        </span>
        <Link href={`/wiki/${item.sourcePage}`} className="flex-grow min-w-0 group">
          <p className="text-xs font-semibold text-slate-700 truncate leading-tight group-hover:text-green-700">
            {item.data.emoji && `${item.data.emoji} `}{item.title}
          </p>
          <p className="text-[10px] text-slate-400 truncate mt-0.5 group-hover:text-green-600">
            {item.sourcePageTitle}
          </p>
        </Link>
      </div>
      <div className="flex items-center gap-0.5 mt-1.5">
        <button
          onClick={() => moveItem(index, index - 1)}
          disabled={index === 0}
          className="resource-pack-card-btn"
          aria-label="Move up"
          title="Move up"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
        <button
          onClick={() => moveItem(index, index + 1)}
          disabled={index === total - 1}
          className="resource-pack-card-btn"
          aria-label="Move down"
          title="Move down"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        <div className="flex-grow" />
        <button
          onClick={() => removeItem(lookupKey)}
          className="resource-pack-card-btn text-red-400 hover:text-red-600 hover:bg-red-50"
          aria-label="Remove from resource pack"
          title="Remove"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
