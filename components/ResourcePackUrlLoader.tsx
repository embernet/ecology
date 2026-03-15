'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useResourcePack } from '@/contexts/ResourcePackContext';
import type { ResourcePackItem, ResourcePackItemData, ResourceType } from '@/lib/resource-pack-types';
import { makeResourceLookupKey } from '@/lib/resource-pack-types';

interface RegistryEntry {
  type: ResourceType;
  title: string;
  sourcePage: string;
  sourcePageTitle: string;
  data: ResourcePackItemData;
}

type ResourceRegistry = Record<string, RegistryEntry>;

export function ResourcePackUrlLoader() {
  const searchParams = useSearchParams();
  const { loadItems, mounted, showPrintView, togglePrintView } = useResourcePack();
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!mounted || loadedRef.current) return;

    const resourcesParam = searchParams.get('resources');
    if (!resourcesParam) return;

    loadedRef.current = true;
    const shortIds = resourcesParam.split(/[-,]/).filter(Boolean);
    if (shortIds.length === 0) return;

    const packNameParam = searchParams.get('packName') || '';

    fetch('/resource-registry.json')
      .then(res => res.json())
      .then((registry: ResourceRegistry) => {
        const items: ResourcePackItem[] = [];
        for (const shortId of shortIds) {
          const entry = registry[shortId];
          if (!entry) continue;
          const lookupKey = makeResourceLookupKey(entry.type, entry.title, entry.sourcePage);
          items.push({
            id: lookupKey,
            shortId,
            type: entry.type,
            sourcePage: entry.sourcePage,
            sourcePageTitle: entry.sourcePageTitle,
            title: entry.title,
            addedAt: Date.now(),
            order: items.length,
            data: entry.data,
          });
        }
        if (items.length > 0) {
          loadItems(items, packNameParam || undefined);
          // Auto-open print view when loading from a shared link
          if (!showPrintView) {
            togglePrintView();
          }
        }

        // Clean the URL parameters without triggering a page reload
        const url = new URL(window.location.href);
        url.searchParams.delete('resources');
        url.searchParams.delete('packName');
        window.history.replaceState({}, '', url.pathname + url.search + url.hash);
      })
      .catch(() => {
        // Silently fail if registry can't be loaded
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, searchParams, loadItems]);

  return null;
}
