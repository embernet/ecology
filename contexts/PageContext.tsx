'use client';

import { createContext, useContext } from 'react';

interface PageContextValue {
  slug: string;
  title: string;
}

const PageContext = createContext<PageContextValue>({ slug: '', title: '' });

export function usePageContext() {
  return useContext(PageContext);
}

export { PageContext };
