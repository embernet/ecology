'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useResourcePack } from '@/contexts/ResourcePackContext';
import { ResourceRenderer } from './ResourceRenderer';

export function MainContent({ children }: { children: React.ReactNode }) {
  const { items, showPrintView, togglePrintView, packName } = useResourcePack();
  const pathname = usePathname();

  // Always-current ref so the effect below never reads a stale value
  const showPrintViewRef = useRef(showPrintView);
  showPrintViewRef.current = showPrintView;

  // Track the last pathname the effect actually ran for, so we can
  // distinguish a genuine navigation from Next.js re-emitting the same
  // pathname after replaceState (which would otherwise close the print view
  // that was just opened by the URL loader)
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    const prev = prevPathnameRef.current;
    prevPathnameRef.current = pathname;

    // Only close print view when navigating to a genuinely different page
    if (showPrintViewRef.current && prev !== pathname) {
      togglePrintView();
    }

    const resetScroll = () => {
      const scrollArea = document.querySelector('.main-scroll-area');
      if (scrollArea) {
        scrollArea.scrollTop = 0;
      }
    };

    resetScroll();
    requestAnimationFrame(() => {
      resetScroll();
      setTimeout(resetScroll, 50);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!showPrintView) {
    return <>{children}</>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-slate-700 mb-4">Your Resource Pack is Empty</h1>
        <p className="text-slate-500 mb-6">
          Browse the curriculum and click <strong>+ Add</strong> on resources to build your pack.
        </p>
        <button
          onClick={togglePrintView}
          className="text-green-600 hover:underline font-medium"
        >
          Back to Curriculum
        </button>
      </div>
    );
  }

  const sourcePages = new Set(items.map(i => i.sourcePage));
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="print-layout flex flex-col" style={{ height: 'calc(100vh - 6rem)' }}>
      {/* Fixed header with print button (hidden when printing) */}
      <div className="no-print flex-shrink-0 flex items-center justify-between bg-green-50 p-4 rounded-t-lg border border-green-200">
        <div>
          <h1 className="text-xl font-bold text-green-800">{packName || 'Resource Pack'} - Print View</h1>
          <p className="text-sm text-green-600">
            {items.length} resource{items.length !== 1 ? 's' : ''} from {sourcePages.size} page{sourcePages.size !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-2.25 0h.008v.008H16.5V12z" />
            </svg>
            Print / Save as PDF
          </button>
          <button
            onClick={togglePrintView}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close print view"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto rounded-b-lg border border-t-0 border-green-200 p-4">
        {/* Print-only header */}
        <div className="print-only text-center mb-8 pb-6 border-b-2 border-green-600">
          <h1 className="text-3xl font-bold text-green-800 mb-2">{packName || 'Ecology Resource Pack'}</h1>
          <p className="text-slate-500 text-sm">Created on {date}</p>
          <p className="text-slate-500 text-sm">
            {items.length} resource{items.length !== 1 ? 's' : ''} from {sourcePages.size} page{sourcePages.size !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Resources */}
        {items.map(item => (
          <div key={item.id} className="print-resource-item">
            <ResourceRenderer item={item} />
          </div>
        ))}

        {/* Print-only footer */}
        <div className="print-only text-center mt-8 pt-4 border-t border-slate-200 text-slate-400 text-xs">
          <p>Generated by Ecology Curriculum - Open Educational Resource</p>
        </div>
      </div>
    </div>
  );
}
