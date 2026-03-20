'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useResourcePack } from '@/contexts/ResourcePackContext';
import { usePageNavigation } from '@/contexts/PageNavigationContext';

interface NavItem {
  label: string;
  href: string;
}

interface NavSection {
  label: string;
  href?: string;
  children: (NavItem | NavSection)[];
}

type NavEntry = NavItem | NavSection;

function isSection(entry: NavEntry): entry is NavSection {
  return 'children' in entry;
}

const navigation: NavEntry[] = [
  { label: 'Home', href: '/' },
  { label: 'About This Site', href: '/wiki/about' },
  {
    label: 'Science',
    href: '/wiki/science',
    children: [
      { label: 'Working Scientifically (Years 1-2)', href: '/wiki/years-1-and-2-working-scientifically' },
      {
        label: 'Year 1',
        children: [
          { label: 'Plants', href: '/wiki/year-1-plants' },
          { label: 'Animals, including humans', href: '/wiki/year-1-animals-including-humans' },
          { label: 'Seasonal changes', href: '/wiki/year-1-seasonal-changes' },
          { label: 'Everyday materials', href: '/wiki/year-1-everyday-materials' },
        ],
      },
      {
        label: 'Year 2',
        children: [
          { label: 'Plants', href: '/wiki/year-2-plants' },
          { label: 'Animals, including humans', href: '/wiki/year-2-animals-including-humans' },
          { label: 'Living things and their habitats', href: '/wiki/year-2-living-things-and-their-habitats' },
          { label: 'Everyday materials', href: '/wiki/year-2-everyday-materials' },
        ],
      },
      {
        label: 'Year 3',
        children: [
          { label: 'Plants', href: '/wiki/year-3-plants' },
          { label: 'Light', href: '/wiki/year-3-light' },
        ],
      },
      {
        label: 'Year 4',
        children: [
          { label: 'Animals, including humans', href: '/wiki/year-4-animals-including-humans' },
          { label: 'Electricity', href: '/wiki/year-4-electricity' },
          { label: 'Living things and their habitats', href: '/wiki/year-4-living-things-and-their-habitats' },
          { label: 'Sound', href: '/wiki/year-4-sound' },
          { label: 'States of matter', href: '/wiki/year-4-states-of-matter' },
        ],
      },
      {
        label: 'Year 5',
        children: [
          { label: 'Earth and space', href: '/wiki/year-5-earth-and-space' },
          { label: 'Living things and their habitats', href: '/wiki/year-5-living-things-and-their-habitats' },
        ],
      },
      {
        label: 'Year 6',
        children: [
          { label: 'Evolution and inheritance', href: '/wiki/year-6-evolution-and-inheritance' },
          { label: 'Living things and their habitats', href: '/wiki/year-6-living-things-and-their-habitats' },
        ],
      },
    ],
  },
  {
    label: 'Geography',
    href: '/wiki/geography',
    children: [
      { label: 'Key Stage 1', href: '/wiki/key-stage-1-geography' },
      { label: 'Key Stage 2', href: '/wiki/key-stage-2-geography' },
    ],
  },
  {
    label: 'Teaching Resources',
    children: [
      { label: 'Teaching Principles', href: '/wiki/teaching-principles-used-to-create-the-learning-resources' },
      { label: 'Useful External Resources', href: '/wiki/other-websites-with-useful-ecology-resources' },
    ],
  },
  {
    label: 'Media Library',
    children: [
      { label: 'Images', href: '/media/images' },
    ],
  },
];

function pathMatchesEntry(pathname: string, entry: NavEntry): boolean {
  if (!isSection(entry)) {
    return pathname === entry.href;
  }
  if (entry.href && pathname === entry.href) return true;
  return entry.children.some((child) => pathMatchesEntry(pathname, child));
}

function PageSectionLinks({ depth }: { depth: number }) {
  const { headings } = usePageNavigation();
  const { setSidebarOpen } = useResourcePack();
  if (headings.length === 0) return null;

  return (
    <ul className="sidebar-children">
      {headings.map((h) => (
        <li key={h.id}>
          <button
            onClick={() => {
              const el = document.getElementById(h.id);
              if (el) {
                const headerHeight = (document.querySelector('header') as HTMLElement | null)?.offsetHeight ?? 0;
                const y = el.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
              if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1100px)').matches) {
                setSidebarOpen(false);
              }
            }}
            className="sidebar-section-heading"
            style={{ paddingLeft: `${0.75 + (depth + 1) * 0.75}rem`, paddingRight: '0.75rem' }}
            data-level={h.level}
          >
            {h.text}
          </button>
        </li>
      ))}
    </ul>
  );
}

function SidebarSection({ entry, depth = 0 }: { entry: NavEntry; depth?: number }) {
  const pathname = usePathname();
  const isActive = !isSection(entry) && pathname === entry.href;
  const containsActive = isSection(entry) && pathMatchesEntry(pathname, entry);
  const [expanded, setExpanded] = useState(containsActive);

  // Auto-expand when navigating to a child page
  useEffect(() => {
    if (containsActive) {
      setExpanded(true);
    }
  }, [containsActive]);

  if (!isSection(entry)) {
    return (
      <li>
        <div className="sidebar-section-header" style={{ paddingLeft: `${0.75 + depth * 0.75}rem` }}>
          <Link
            href={entry.href}
            className={`sidebar-toggle${isActive ? ' font-semibold text-green-800' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <svg
              className="sidebar-chevron"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clipRule="evenodd"
              />
            </svg>
            <span>{entry.label}</span>
          </Link>
        </div>
        {isActive && <PageSectionLinks depth={depth} />}
      </li>
    );
  }

  return (
    <li>
      <div className="sidebar-section-header" style={{ paddingLeft: `${0.75 + depth * 0.75}rem` }}>
        <button
          onClick={() => setExpanded(!expanded)}
          className="sidebar-toggle"
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${entry.label}`}
        >
          <svg
            className={`sidebar-chevron ${expanded ? 'sidebar-chevron-open' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clipRule="evenodd"
            />
          </svg>
          <span className={containsActive ? 'font-semibold text-green-800' : ''}>{entry.label}</span>
        </button>
        {entry.href && (
          <Link
            href={entry.href}
            className={`sidebar-section-link ${pathname === entry.href ? 'sidebar-section-link-active' : ''}`}
            title={`Go to ${entry.label}`}
          >
            →
          </Link>
        )}
      </div>
      {expanded && (
        <ul className="sidebar-children">
          {entry.children.map((child) => (
            <SidebarSection
              key={isSection(child) ? child.label : child.href}
              entry={child}
              depth={depth + 1}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function SidebarToggleButton() {
  const { isSidebarOpen, setSidebarOpen } = useResourcePack();
  return (
    <button
      className={`sidebar-header-toggle${isSidebarOpen ? ' header-toggle-active' : ''}`}
      onClick={() => setSidebarOpen(!isSidebarOpen)}
      aria-label={isSidebarOpen ? 'Close navigation' : 'Open navigation'}
      aria-expanded={isSidebarOpen}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        {/* Vertical trunk */}
        <line x1="4" y1="3" x2="4" y2="21" />
        {/* Top branch + node */}
        <line x1="4" y1="7" x2="15" y2="7" />
        <circle cx="17" cy="7" r="2" fill="currentColor" stroke="none" />
        {/* Middle branch + node */}
        <line x1="4" y1="13" x2="13" y2="13" />
        <circle cx="15" cy="13" r="2" fill="currentColor" stroke="none" />
        {/* Bottom branch + node */}
        <line x1="4" y1="19" x2="10" y2="19" />
        <circle cx="12" cy="19" r="2" fill="currentColor" stroke="none" />
      </svg>
    </button>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useResourcePack();

  // Close sidebar on navigation (mobile only)
  useEffect(() => {
    if (isSidebarOpen && typeof window !== 'undefined' && window.matchMedia('(max-width: 1100px)').matches) {
      setSidebarOpen(false);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar nav */}
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-header-title">Navigation</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="panel-close-btn"
            aria-label="Close navigation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav>
          <ul className="sidebar-nav">
            {navigation.map((entry) => (
              <SidebarSection
                key={isSection(entry) ? entry.label : entry.href}
                entry={entry}
              />
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
