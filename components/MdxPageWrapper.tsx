'use client';

import { useEffect } from 'react';
import { PageContext } from '@/contexts/PageContext';
import { usePageNavigation } from '@/contexts/PageNavigationContext';
import type { PageHeading } from '@/lib/content';

interface MdxPageWrapperProps {
  slug: string;
  title: string;
  headings: PageHeading[];
  children: React.ReactNode;
}

export function MdxPageWrapper({ slug, title, headings, children }: MdxPageWrapperProps) {
  const { setHeadings } = usePageNavigation();

  // Publish headings to root-level context so Sidebar can read them
  useEffect(() => {
    setHeadings(headings);
    return () => setHeadings([]);
  }, [slug, headings, setHeadings]);

  // When navigating from the media library, the URL contains a hash like #img-abc123.
  // The browser handles scrolling to the element with that id automatically.
  // We just add a brief highlight effect so the user can spot the image.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.startsWith('#img-')) return;

    const id = hash.slice(1); // remove the leading #

    const highlightElement = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('image-scroll-highlight');
        setTimeout(() => el.classList.remove('image-scroll-highlight'), 2000);
        return true;
      }
      return false;
    };

    // Try immediately, then retry for lazy-loaded content
    if (!highlightElement()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (highlightElement() || attempts >= 15) {
          clearInterval(interval);
        }
      }, 400);
    }
  }, []);

  return (
    <PageContext.Provider value={{ slug, title, headings }}>
      {children}
    </PageContext.Provider>
  );
}
