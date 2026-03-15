'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useResourcePack } from '@/contexts/ResourcePackContext';
import { ResourcePackCard } from './ResourcePackCard';
import { exportAsHtml, exportAsHtmlWithUrls } from '@/lib/export-html';


export function ResourcePackPanel() {
  const { items, isPanelOpen, togglePanel, itemCount, clearAll, mounted, showPrintView, togglePrintView, packName, setPackName } = useResourcePack();
  const [exporting, setExporting] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [editingName]);

  const startEditingName = useCallback(() => {
    setNameInput(packName);
    setEditingName(true);
  }, [packName]);

  const commitName = useCallback(() => {
    setPackName(nameInput.trim() || packName);
    setEditingName(false);
  }, [nameInput, packName, setPackName]);

  const cancelEditingName = useCallback(() => {
    setEditingName(false);
  }, []);

  const buildPackUrl = useCallback(() => {
    const shortIds = items.map(item => item.shortId).join('-');
    const path = window.location.pathname;
    const params = new URLSearchParams();
    params.set('resources', shortIds);
    if (packName) {
      params.set('packName', packName);
    }
    return `${window.location.origin}${path}?${params.toString()}`;
  }, [items, packName]);

  const handleCopyLink = useCallback(async () => {
    const url = buildPackUrl();
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }, [buildPackUrl]);

  const handleBookmark = useCallback(() => {
    const url = buildPackUrl();
    const title = packName || `Resource Pack (${items.length} items)`;
    // Use the browser bookmark dialog prompt
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any;
    if (win.sidebar && (win.sidebar as { addPanel?: unknown }).addPanel) {
      // Firefox legacy
      (win.sidebar as { addPanel: (t: string, u: string, r: string) => void }).addPanel(title, url, '');
    } else {
      // Prompt user to bookmark manually (modern browsers block programmatic bookmarking)
      window.prompt(
        'Press Ctrl+D (Cmd+D on Mac) to bookmark this URL, or copy it:',
        url
      );
    }
  }, [buildPackUrl, items.length, packName]);

  if (!mounted) return null;

  return (
    <>
      {/* Desktop panel - always open on desktop, toggleable on mobile */}
      <aside className={`resource-pack-panel ${isPanelOpen ? 'resource-pack-panel-open' : ''}`}>
        <div className="resource-pack-header">
          <div className="flex items-center gap-2">
            <span className="text-lg">📦</span>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Resource Pack</h2>
            {itemCount > 0 && (
              <span className="bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
        </div>

        {packName && (
          <div className="px-3 pb-2">
            {editingName ? (
              <input
                ref={nameInputRef}
                type="text"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                onBlur={commitName}
                onKeyDown={e => {
                  if (e.key === 'Enter') commitName();
                  if (e.key === 'Escape') cancelEditingName();
                }}
                className="w-full text-sm font-semibold text-green-800 bg-green-50 border border-green-300 rounded px-2 py-1 outline-none focus:ring-2 focus:ring-green-400"
                maxLength={80}
              />
            ) : (
              <button
                onClick={startEditingName}
                className="w-full text-left text-sm font-semibold text-green-800 hover:bg-green-50 rounded px-2 py-1 transition-colors cursor-text truncate"
                title="Click to rename"
              >
                {packName}
              </button>
            )}
          </div>
        )}

        <div className="resource-pack-info">
          Click the
          {' '}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            padding: '1px 7px',
            backgroundColor: '#2E8B57',
            color: 'white',
            fontSize: '0.65rem',
            fontWeight: 600,
            borderRadius: '9999px',
            verticalAlign: 'middle',
            boxShadow: '0 1px 3px rgb(0 0 0 / 0.15)',
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" style={{ width: '10px', height: '10px', flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add
          </span>
          {' '}
          button on any resource to build a custom resource pack, then download it using the buttons that will appear below.
        </div>

        <div className="resource-pack-items">
          {items.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-xs">
              <p>Your resource pack is empty.</p>
            </div>
          ) : (
            items.map((item, index) => (
              <ResourcePackCard key={item.id} item={item} index={index} total={items.length} />
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="resource-pack-footer">
            <button
              onClick={handleCopyLink}
              className="resource-pack-btn resource-pack-btn-primary"
            >
              {linkCopied ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Link Copied!
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  Copy Link
                </>
              )}
            </button>
            <button
              onClick={handleBookmark}
              className="resource-pack-btn resource-pack-btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              Bookmark
            </button>
            <button
              onClick={togglePrintView}
              className="resource-pack-btn resource-pack-btn-primary"
            >
              {showPrintView ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Hide Print View
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-2.25 0h.008v.008H16.5V12z" />
                  </svg>
                  Print View
                </>
              )}
            </button>
            <button
              onClick={() => exportAsHtmlWithUrls(items, packName)}
              className="resource-pack-btn resource-pack-btn-secondary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Save HTML
            </button>
            <button
              onClick={async () => {
                setExporting(true);
                try {
                  await exportAsHtml(items, packName);
                } finally {
                  setExporting(false);
                }
              }}
              disabled={exporting}
              className="resource-pack-btn resource-pack-btn-secondary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {exporting ? 'Building...' : 'Save HTML with images (big file)'}
            </button>
            <button
              onClick={clearAll}
              className="resource-pack-btn resource-pack-btn-danger"
            >
              Clear All
            </button>
          </div>
        )}
      </aside>

      {/* Side-edge toggle tab (visible when panel is auto-hidden) */}
      <button
        onClick={togglePanel}
        className="resource-pack-toggle-tab"
        aria-label="Toggle resource pack"
      >
        <span className="text-base">📦</span>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ fontSize: '0.6rem' }}>
            {itemCount}
          </span>
        )}
      </button>

      {/* Mobile backdrop */}
      {isPanelOpen && (
        <div className="resource-pack-backdrop" onClick={togglePanel} />
      )}
    </>
  );
}
