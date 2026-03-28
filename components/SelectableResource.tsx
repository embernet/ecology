'use client';

import { useRef, useCallback } from 'react';
import { useResourcePack } from '@/contexts/ResourcePackContext';
import { usePageContext } from '@/contexts/PageContext';
import type { ResourceType, ResourcePackItemData, WikiImageData } from '@/lib/resource-pack-types';
import { makeResourceLookupKey } from '@/lib/resource-pack-types';

interface SelectableResourceProps {
  /** Explicit short ID for URL sharing (e.g. "n1", "a5", "r12") */
  resourceId: string;
  type: ResourceType;
  title: string;
  /** Pre-built data for types with simple string props (Activity, Reflection) */
  data?: Partial<ResourcePackItemData>;
  /** For types with children: the wrapper captures innerHTML from this ref */
  captureRef?: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}

function extractWikiImages(element: HTMLElement): WikiImageData[] {
  const images: WikiImageData[] = [];
  const imgElements = element.querySelectorAll('figure img, [data-wiki-filename]');
  imgElements.forEach(el => {
    const figure = el.closest('figure');
    const filename = figure?.getAttribute('data-wiki-filename') || '';
    const alt = el.getAttribute('alt') || '';
    const credit = figure?.getAttribute('data-wiki-credit') || undefined;
    if (filename) {
      images.push({ filename, alt, credit });
    } else {
      // Try to extract filename from src URL
      const src = el.getAttribute('src') || '';
      const match = src.match(/Special:FilePath\/(.+)/);
      if (match) {
        images.push({ filename: decodeURIComponent(match[1]), alt, credit });
      }
    }
  });
  return images;
}

export function SelectableResource({ resourceId, type, title, data, captureRef, children }: SelectableResourceProps) {
  const { addItem, removeItem, isInPack, mounted } = useResourcePack();
  const { slug, title: pageTitle } = usePageContext();
  const lookupKey = makeResourceLookupKey(type, title, slug);
  const added = mounted && isInPack(lookupKey);

  const handleToggle = useCallback(() => {
    if (added) {
      removeItem(lookupKey);
    } else {
      let childrenHtml = '';
      let wikiImages: WikiImageData[] = [];

      if (captureRef?.current) {
        childrenHtml = captureRef.current.innerHTML;
        wikiImages = extractWikiImages(captureRef.current);
      }

      const itemData: ResourcePackItemData = {
        type,
        childrenHtml,
        wikiImages,
        ...data,
      };

      addItem({
        type,
        sourcePage: slug,
        sourcePageTitle: pageTitle,
        title,
        shortId: resourceId,
        data: itemData,
      });
    }
  }, [added, addItem, removeItem, lookupKey, type, title, slug, pageTitle, data, captureRef]);

  return (
    <div className={`selectable-resource ${added ? 'selectable-resource-added' : ''}`}>
      {children}
      <button
        onClick={handleToggle}
        className={`group/tooltip relative selectable-resource-btn ${added ? 'selectable-resource-btn-added' : ''}`}
        aria-label={added ? `Remove ${title} from resource pack` : `Add ${title} to resource pack`}
      >
        <span className="pointer-events-none absolute left-1/2 top-full z-[100] mt-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-700 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity delay-500 duration-200 group-hover/tooltip:opacity-100 group-focus-visible/tooltip:opacity-100 shadow-md">
          {added ? 'Remove from resource pack' : 'Add to resource pack'}
          <span className="absolute bottom-full left-1/2 -ml-1 border-4 border-transparent border-b-slate-700" />
        </span>
        {added ? (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>Added</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>Add</span>
          </>
        )}
      </button>
    </div>
  );
}
