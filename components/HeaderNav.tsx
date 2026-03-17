'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="header-nav" ref={menuRef}>
      <button
        className="header-hamburger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>
      {isOpen && (
        <nav className="header-dropdown">
          <Link href="/" className="header-dropdown-link" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="/wiki/science" className="header-dropdown-link" onClick={() => setIsOpen(false)}>
            Science
          </Link>
          <Link href="/wiki/geography" className="header-dropdown-link" onClick={() => setIsOpen(false)}>
            Geography
          </Link>
          <Link href="/wiki/teaching-principles-used-to-create-the-learning-resources" className="header-dropdown-link" onClick={() => setIsOpen(false)}>
            About
          </Link>
        </nav>
      )}
    </div>
  );
}
