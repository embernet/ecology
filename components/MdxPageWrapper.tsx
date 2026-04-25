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

  // On every slug change, scroll to any hash target and highlight it if it's a resource.
  // Uses [slug] not [] so it re-runs across slug navigations even when the component
  // is reconciled rather than remounted (Next.js App Router behaviour).
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1);

    const scrollToTarget = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (el.classList.contains('selectable-resource') || hash.startsWith('#img-')) {
          el.classList.add('image-scroll-highlight');
          setTimeout(() => el.classList.remove('image-scroll-highlight'), 2000);
        }
        return true;
      }
      return false;
    };

    if (!scrollToTarget()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (scrollToTarget() || attempts >= 15) {
          clearInterval(interval);
        }
      }, 400);
      return () => clearInterval(interval);
    }
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <PageContext.Provider value={{ slug, title, headings }}>
      {children}
    </PageContext.Provider>
  );
}
