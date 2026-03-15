'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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
        <Link
          href={entry.href}
          className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          style={{ paddingLeft: `${0.75 + depth * 0.75}rem` }}
        >
          {entry.label}
        </Link>
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

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Side-edge toggle tab (visible when sidebar is auto-hidden) */}
      <button
        className="sidebar-toggle-tab"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar nav */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <span className="font-semibold text-green-800">Navigation</span>
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
