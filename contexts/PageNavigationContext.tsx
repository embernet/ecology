'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { PageHeading } from '@/lib/content';

interface PageNavigationContextValue {
  headings: PageHeading[];
  setHeadings: (headings: PageHeading[]) => void;
}

const PageNavigationContext = createContext<PageNavigationContextValue>({
  headings: [],
  setHeadings: () => {},
});

export function usePageNavigation() {
  return useContext(PageNavigationContext);
}

export function PageNavigationProvider({ children }: { children: React.ReactNode }) {
  const [headings, setHeadingsRaw] = useState<PageHeading[]>([]);
  const setHeadings = useCallback((h: PageHeading[]) => setHeadingsRaw(h), []);
  return (
    <PageNavigationContext.Provider value={{ headings, setHeadings }}>
      {children}
    </PageNavigationContext.Provider>
  );
}
