'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useResourcePack } from '@/contexts/ResourcePackContext';
import { usePageNavigation } from '@/contexts/PageNavigationContext';
import { navigation, isSection } from '@/lib/navigation';
import type { NavEntry, NavItem, NavSection } from '@/lib/navigation';

const CollapseContext = createContext(0);

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
          <a
            href={`#${h.id}`}
            className="sidebar-section-heading"
            style={{ paddingLeft: `${0.75 + (depth + 1) * 0.75}rem`, paddingRight: '0.75rem' }}
            data-level={h.level}
            onClick={() => {
              if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1100px)').matches) {
                setSidebarOpen(false);
              }
            }}
          >
            {h.text}
          </a>
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
  const collapseVersion = useContext(CollapseContext);

  // Auto-expand when navigating to a child page (sections) or to this page (leaf entries)
  useEffect(() => {
    if (containsActive || isActive) {
      setExpanded(true);
    }
  }, [containsActive, isActive]);

  // Collapse when "close all" is triggered
  useEffect(() => {
    if (collapseVersion > 0) {
      setExpanded(false);
    }
  }, [collapseVersion]);

  if (!isSection(entry)) {
    return (
      <li>
        <div className="sidebar-section-header" style={{ paddingLeft: `${0.75 + depth * 0.75}rem` }}>
          <Link
            href={entry.href}
            onClick={(e) => {
              if (isActive) {
                e.preventDefault();
                setExpanded(!expanded);
              }
            }}
            className={`sidebar-toggle${isActive ? ' font-semibold text-green-800' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            <svg
              className={`sidebar-chevron ${isActive && expanded ? 'sidebar-chevron-open' : ''}`}
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
        {isActive && expanded && <PageSectionLinks depth={depth} />}
      </li>
    );
  }

  return (
    <li>
      <div className="sidebar-section-header" style={{ paddingLeft: `${0.75 + depth * 0.75}rem` }}>
        {/* Chevron button: toggles expand/collapse only */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="sidebar-chevron-btn"
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
        </button>
        {/* Label: navigates (if href) and also toggles expand/collapse */}
        {entry.href ? (
          <Link
            href={entry.href}
            onClick={() => setExpanded(!expanded)}
            className={`sidebar-section-label${containsActive ? ' font-semibold text-green-800' : ''}`}
          >
            {entry.label}
          </Link>
        ) : (
          <button
            onClick={() => setExpanded(!expanded)}
            className={`sidebar-section-label${containsActive ? ' font-semibold text-green-800' : ''}`}
          >
            {entry.label}
          </button>
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
  const { isSidebarOpen, setSidebarOpen, isSidebarDesktopOpen, setSidebarDesktopOpen } = useResourcePack();

  const handleClick = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1100px)').matches) {
      setSidebarOpen(!isSidebarOpen);
    } else {
      setSidebarDesktopOpen(!isSidebarDesktopOpen);
    }
  }, [isSidebarOpen, isSidebarDesktopOpen, setSidebarOpen, setSidebarDesktopOpen]);

  // On desktop: active = sidebar is visible. On mobile: active = overlay is shown.
  // Server renders as inactive (window unavailable); client corrects during hydration.
  const isActive = typeof window !== 'undefined' && !window.matchMedia('(max-width: 1100px)').matches
    ? isSidebarDesktopOpen
    : isSidebarOpen;

  return (
    <button
      suppressHydrationWarning
      className={`sidebar-header-toggle${isActive ? ' header-toggle-active' : ''}`}
      onClick={handleClick}
      aria-label="Toggle navigation"
      aria-expanded={isActive}
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
  const { isSidebarOpen, setSidebarOpen, isSidebarDesktopOpen } = useResourcePack();
  const [collapseVersion, setCollapseVersion] = useState(0);
  const collapseAll = useCallback(() => setCollapseVersion((v) => v + 1), []);

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
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''} ${!isSidebarDesktopOpen ? 'sidebar-desktop-hidden' : ''}`}>
        <div className="sidebar-header">
          <span className="sidebar-header-title">Navigation</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <button
              onClick={collapseAll}
              className="sidebar-collapse-btn"
              title="Collapse all sections"
              aria-label="Collapse all sections"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
            </button>
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
        </div>
        <Link
          href="/"
          className={`sidebar-home-link${pathname === '/' ? ' sidebar-home-link-active' : ''}`}
          onClick={() => {
            if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1100px)').matches) {
              setSidebarOpen(false);
            }
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true" style={{ flexShrink: 0 }}>
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
            <polyline points="9 21 9 12 15 12 15 21" />
          </svg>
          Home
        </Link>
        <CollapseContext.Provider value={collapseVersion}>
          <nav className="sidebar-nav-wrapper">
            <ul className="sidebar-nav">
              {navigation.map((entry) => (
                <SidebarSection
                  key={isSection(entry) ? entry.label : entry.href}
                  entry={entry}
                />
              ))}
            </ul>
          </nav>
        </CollapseContext.Provider>
      </aside>
    </>
  );
}
