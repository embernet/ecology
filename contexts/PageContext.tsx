'use client';

import { createContext, useContext } from 'react';
import type { PageHeading } from '@/lib/content';

interface PageContextValue {
  slug: string;
  title: string;
  headings: PageHeading[];
}

const PageContext = createContext<PageContextValue>({ slug: '', title: '', headings: [] });

export function usePageContext() {
  return useContext(PageContext);
}

export { PageContext };
