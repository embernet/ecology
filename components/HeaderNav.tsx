'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function HeaderNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showLicence, setShowLicence] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showAbout) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showAbout]);

  return (
    <>
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
            <Link href="/wiki/handouts" className="header-dropdown-link" onClick={() => setIsOpen(false)}>
              Handouts
            </Link>
            <Link href="/wiki/teaching-principles-used-to-create-the-learning-resources" className="header-dropdown-link" onClick={() => setIsOpen(false)}>
              Teaching Resources
            </Link>
            <Link href="/media/images" className="header-dropdown-link" onClick={() => setIsOpen(false)}>
              Media Library
            </Link>
            <Link href="/resources" className="header-dropdown-link" onClick={() => setIsOpen(false)}>
              Resource Index
            </Link>
            <Link href="/dictionary" className="header-dropdown-link" onClick={() => setIsOpen(false)}>
              Dictionary
            </Link>
            <button
              className="header-dropdown-link"
              onClick={() => { setIsOpen(false); setShowAbout(true); }}
            >
              About
            </button>
          </nav>
        )}
      </div>

      {showAbout && (
        <div className="about-modal-backdrop" onClick={() => setShowAbout(false)}>
          <div className="about-modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="About">
            <button className="about-modal-close" onClick={() => setShowAbout(false)} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </svg>
            </button>

            <div className="about-modal-app-header">
              <span className="about-modal-app-icon">🌱</span>
              <div className="about-modal-app-title-group">
                <div className="about-modal-app-name">Ecology Curriculum</div>
                <div className="about-modal-app-url">ecology.tapestrylab.net</div>
              </div>
            </div>

            <div className="about-modal-creator-box">
              <h2 className="about-modal-title">Created by Mark Burnett</h2>

              <div className="about-modal-links">
                <a
                  href="https://linkedin.com/in/markburnett"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-modal-linkedin"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#0A66C2" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>Connect on LinkedIn</span>
                </a>

                <a
                  href="https://github.com/embernet/ecology"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="about-modal-github"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  <span>View on GitHub</span>
                </a>
              </div>

              <p className="about-modal-message">
                Feel free to connect with me if you have ideas about how to improve this website, which is free to use under the{' '}
                <button
                  className="about-modal-licence-btn"
                  onClick={() => setShowLicence(l => !l)}
                  aria-expanded={showLicence}
                >
                  MIT open source licence
                </button>
                .
              </p>
              {showLicence && (
                <div className="about-modal-licence-text">
                  <p>MIT License</p>
                  <p>Copyright (c) 2026 Mark Burnett</p>
                  <p>Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:</p>
                  <p>The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.</p>
                  <p>THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
                </div>
              )}
            </div>

            <div className="about-modal-why">
              <h3 className="about-modal-why-title">Why I created this</h3>
              <p>
                The natural world, its creatures, habitats, and the delicate ecology connecting them, is key to life on Earth. Whilst working with local schools in my spare time, I noticed a lack of easily accessible resources linking nature with the curriculum. I applied innovation methods I learnt in industry to map natural phenomena to educational topics, highlighting how biomimicry has sparked some of our greatest inventions. The youth of today will be the innovators of tomorrow. Nature may well be their best innovation toolbox. Let's share it.
              </p>
            </div>

            <div className="about-modal-teaching">
              <p>
                To read more about the ideas behind how this website was put together, take a look at the{' '}
                <button
                  className="about-modal-teaching-link"
                  onClick={() => {
                    setShowAbout(false);
                    router.push('/wiki/teaching-principles-used-to-create-the-learning-resources');
                  }}
                >
                  Teaching Principles
                </button>{' '}
                section.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
