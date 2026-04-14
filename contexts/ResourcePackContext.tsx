'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { ResourcePackItem, ResourcePackItemData, ResourceType } from '@/lib/resource-pack-types';
import { makeResourceLookupKey } from '@/lib/resource-pack-types';

const STORAGE_KEY = 'ecology-resource-pack';
const STORAGE_VERSION = 1;

function isSmallScreen() {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 1100px)').matches;
}

interface StoredData {
  version: number;
  items: ResourcePackItem[];
  packName?: string;
}

interface ResourcePackContextValue {
  items: ResourcePackItem[];
  packName: string;
  setPackName: (name: string) => void;
  addItem: (item: {
    type: ResourceType;
    sourcePage: string;
    sourcePageTitle: string;
    title: string;
    shortId: string;
    data: ResourcePackItemData;
  }) => void;
  removeItem: (lookupKey: string) => void;
  clearAll: () => void;
  isInPack: (lookupKey: string) => boolean;
  moveItem: (fromIndex: number, toIndex: number) => void;
  loadItems: (newItems: ResourcePackItem[], name?: string) => void;
  isPanelOpen: boolean;
  togglePanel: () => void;
  setResourcePanelOpen: (open: boolean) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isSidebarDesktopOpen: boolean;
  setSidebarDesktopOpen: (open: boolean) => void;
  isPanelDesktopOpen: boolean;
  setPanelDesktopOpen: (open: boolean) => void;
  showPrintView: boolean;
  togglePrintView: () => void;
  itemCount: number;
  /** True once localStorage has been read. Only use this for initialization ordering (e.g. URL loader), NOT for conditional rendering. */
  storageReady: boolean;
}

const ResourcePackContext = createContext<ResourcePackContextValue | null>(null);

export function useResourcePack() {
  const ctx = useContext(ResourcePackContext);
  if (!ctx) throw new Error('useResourcePack must be used within ResourcePackProvider');
  return ctx;
}

function loadFromStorage(): { items: ResourcePackItem[]; packName: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], packName: '' };
    const parsed: StoredData = JSON.parse(raw);
    if (parsed.version !== STORAGE_VERSION) return { items: [], packName: '' };
    // Filter out any items missing a shortId (from old hash-based format)
    return {
      items: (parsed.items || []).filter(item => item.shortId),
      packName: parsed.packName || '',
    };
  } catch {
    return { items: [], packName: '' };
  }
}

function saveToStorage(items: ResourcePackItem[], packName: string) {
  try {
    const data: StoredData = { version: STORAGE_VERSION, items, packName };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage quota exceeded - silently fail
  }
}

function generateDefaultPackName(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[now.getMonth()];
  const year = String(now.getFullYear()).slice(-2);
  return `Resource Pack ${day} ${month} ${year}`;
}

export function ResourcePackProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ResourcePackItem[]>([]);
  const [packName, setPackName] = useState('');
  const [isPanelOpen, setIsPanelOpenRaw] = useState(false);
  const [isSidebarOpen, setIsSidebarOpenRaw] = useState(false);
  const [isSidebarDesktopOpen, setIsSidebarDesktopOpenRaw] = useState(true);
  const [isPanelDesktopOpen, setIsPanelDesktopOpenRaw] = useState(true);
  const [showPrintView, setShowPrintView] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  // Prevents overwriting localStorage with the empty initial state before the load effect applies.
  const storageLoaded = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = loadFromStorage();
    setItems(stored.items);
    setPackName(stored.packName);
    setStorageReady(true);
  }, []);

  // Persist to localStorage on change — skip the first run (before load has been applied)
  useEffect(() => {
    if (!storageLoaded.current) {
      storageLoaded.current = true;
      return;
    }
    saveToStorage(items, packName);
  }, [items, packName]);

  const setSidebarOpen = useCallback((open: boolean) => {
    setIsSidebarOpenRaw(open);
    if (open && isSmallScreen()) {
      setIsPanelOpenRaw(false);
    }
  }, []);

  const setSidebarDesktopOpen = useCallback((open: boolean) => {
    setIsSidebarDesktopOpenRaw(open);
  }, []);

  const setPanelDesktopOpen = useCallback((open: boolean) => {
    setIsPanelDesktopOpenRaw(open);
  }, []);

  const setResourcePanelOpen = useCallback((open: boolean) => {
    setIsPanelOpenRaw(open);
    if (open && isSmallScreen()) {
      setIsSidebarOpenRaw(false);
    }
  }, []);

  const addItem = useCallback((item: {
    type: ResourceType;
    sourcePage: string;
    sourcePageTitle: string;
    title: string;
    shortId: string;
    data: ResourcePackItemData;
  }) => {
    const lookupKey = makeResourceLookupKey(item.type, item.title, item.sourcePage);
    setItems(prev => {
      // Don't add duplicates
      if (prev.some(existing => makeResourceLookupKey(existing.type, existing.title, existing.sourcePage) === lookupKey)) {
        return prev;
      }
      // Auto-name when first resource is added to empty pack
      if (prev.length === 0) {
        setPackName(generateDefaultPackName());
      }
      const newItem: ResourcePackItem = {
        ...item,
        id: lookupKey,
        addedAt: Date.now(),
        order: prev.length,
      };
      return [...prev, newItem];
    });
    // Auto-open panel when first item is added
    setIsPanelOpenRaw(true);
    if (isSmallScreen()) {
      setIsSidebarOpenRaw(false);
    }
  }, []);

  const loadItems = useCallback((newItems: ResourcePackItem[], name?: string) => {
    setItems(prev => {
      const existingKeys = new Set(
        prev.map(item => makeResourceLookupKey(item.type, item.title, item.sourcePage))
      );
      const toAdd = newItems.filter(item => {
        const key = makeResourceLookupKey(item.type, item.title, item.sourcePage);
        return !existingKeys.has(key);
      });
      if (toAdd.length === 0) return prev;
      const merged = [...prev, ...toAdd.map((item, i) => ({
        ...item,
        order: prev.length + i,
      }))];
      return merged;
    });
    if (newItems.length > 0) {
      setIsPanelOpenRaw(true);
      if (isSmallScreen()) {
        setIsSidebarOpenRaw(false);
      }
      if (name) {
        setPackName(name);
      }
    }
  }, []);

  const removeItem = useCallback((lookupKey: string) => {
    setItems(prev => {
      const filtered = prev.filter(item =>
        makeResourceLookupKey(item.type, item.title, item.sourcePage) !== lookupKey
      );
      // Re-index order
      return filtered.map((item, i) => ({ ...item, order: i }));
    });
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    setPackName('');
  }, []);

  const isInPack = useCallback((lookupKey: string) => {
    return items.some(item =>
      makeResourceLookupKey(item.type, item.title, item.sourcePage) === lookupKey
    );
  }, [items]);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    setItems(prev => {
      if (fromIndex < 0 || fromIndex >= prev.length || toIndex < 0 || toIndex >= prev.length) {
        return prev;
      }
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated.map((item, i) => ({ ...item, order: i }));
    });
  }, []);

  const togglePanel = useCallback(() => {
    setIsPanelOpenRaw(prev => {
      const next = !prev;
      if (next && isSmallScreen()) {
        setIsSidebarOpenRaw(false);
      }
      return next;
    });
  }, []);

  const togglePrintView = useCallback(() => {
    setShowPrintView(prev => !prev);
  }, []);

  return (
    <ResourcePackContext.Provider value={{
      items,
      packName,
      setPackName,
      addItem,
      removeItem,
      clearAll,
      isInPack,
      moveItem,
      loadItems,
      isPanelOpen,
      togglePanel,
      setResourcePanelOpen,
      isSidebarOpen,
      setSidebarOpen,
      isSidebarDesktopOpen,
      setSidebarDesktopOpen,
      isPanelDesktopOpen,
      setPanelDesktopOpen,
      showPrintView,
      togglePrintView,
      itemCount: items.length,
      storageReady,
    }}>
      {children}
    </ResourcePackContext.Provider>
  );
}
