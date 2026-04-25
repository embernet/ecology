'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useResourcePack } from '@/contexts/ResourcePackContext';
import { ResourcePackCard } from './ResourcePackCard';
import { exportAsHtml, exportAsHtmlWithUrls } from '@/lib/export-html';


export function ResourcePackPanel() {
  const { items, isPanelOpen, togglePanel, setResourcePanelOpen, itemCount, clearAll, showPrintView, togglePrintView, packName, setPackName, isPanelDesktopOpen } = useResourcePack();
  const pathname = usePathname();
  const [exporting, setExporting] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [editingName]);

  // Close panel on navigation (mobile overlay only)
  useEffect(() => {
    if (isPanelOpen && typeof window !== 'undefined' && window.matchMedia('(max-width: 1100px)').matches) {
      setResourcePanelOpen(false);
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

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
    setShowBookmarkModal(true);
  }, []);

  return (
    <>
      {/* Desktop panel - always open on desktop, toggleable on mobile */}
      <aside className={`resource-pack-panel ${isPanelOpen ? 'resource-pack-panel-open' : ''} ${!isPanelDesktopOpen ? 'resource-pack-panel-desktop-hidden' : ''}`}>
        <div className="resource-pack-header">
          <div className="flex items-center gap-2">
            <span className="text-lg">📦</span>
            <h2 className="resource-pack-header-title">Resource Pack</h2>
            {itemCount > 0 && (
              <span className="resource-pack-badge">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setResourcePanelOpen(false)}
            className="panel-close-btn"
            aria-label="Close resource pack"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
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

        {items.length > 0 && (
          <div style={{ padding: '0.5rem 0.75rem', backgroundColor: '#eff6ff', borderBottom: '1px solid #e2e8f0', fontSize: '0.7rem', lineHeight: 1.8, color: '#475569', flexShrink: 0 }}>
            Click on any resource to view it
          </div>
        )}

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

      {/* Mobile backdrop */}
      {isPanelOpen && (
        <div className="resource-pack-backdrop" onClick={() => setResourcePanelOpen(false)} />
      )}

      {/* Bookmark modal */}
      {showBookmarkModal && (
        <BookmarkModal
          baseUrl={buildPackUrl()}
          title={packName || `Resource Pack (${items.length} items)`}
          onClose={() => setShowBookmarkModal(false)}
          onRename={setPackName}
        />
      )}
    </>
  );
}

function BookmarkModal({ baseUrl, title, onClose, onRename }: { baseUrl: string; title: string; onClose: () => void; onRename: (name: string) => void }) {
  const [name, setName] = useState(title);
  const urlInputRef = useRef<HTMLInputElement>(null);

  // Rebuild URL with current name
  const url = (() => {
    try {
      const u = new URL(baseUrl);
      if (name) u.searchParams.set('packName', name);
      return u.toString();
    } catch {
      return baseUrl;
    }
  })();

  const handleClose = () => {
    if (name !== title) onRename(name);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '420px',
          width: '90%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>Bookmark Resource Pack</h3>
          <button
            onClick={handleClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#94a3b8' }}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '20px', height: '20px' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <label style={{ display: 'block', margin: '0 0 4px', fontSize: '0.75rem', color: '#94a3b8' }}>
          Bookmark name:
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: '100%',
            fontSize: '0.85rem',
            padding: '8px 10px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            color: '#1e293b',
            fontWeight: 600,
            marginBottom: '12px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          maxLength={80}
          autoFocus
        />

        <p style={{ margin: '0 0 12px', fontSize: '0.8rem', color: '#64748b' }}>
          Drag this link to your bookmarks bar to save this resource pack:
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '16px',
          backgroundColor: '#f0fdf4',
          borderRadius: '8px',
          border: '2px dashed #86efac',
          marginBottom: '16px',
        }}>
          <a
            href={url}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              backgroundColor: '#16a34a',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'grab',
              boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
              userSelect: 'none',
            }}
            onClick={e => e.preventDefault()}
            title={name}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '16px', height: '16px', flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            {name || 'Resource Pack'}
          </a>
        </div>

        <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#94a3b8' }}>
          You can also copy and paste the URL below to share the pack:
        </p>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            ref={urlInputRef}
            type="text"
            readOnly
            value={url}
            style={{
              flex: 1,
              fontSize: '0.7rem',
              padding: '6px 8px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              color: '#64748b',
              backgroundColor: '#f8fafc',
              minWidth: 0,
            }}
            onClick={() => urlInputRef.current?.select()}
          />
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
              } catch {
                urlInputRef.current?.select();
                document.execCommand('copy');
              }
            }}
            style={{
              padding: '6px 12px',
              fontSize: '0.7rem',
              fontWeight: 500,
              backgroundColor: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#475569',
              whiteSpace: 'nowrap',
            }}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

export function ResourcePackToggleButton() {
  const { isPanelOpen, togglePanel, setResourcePanelOpen, itemCount, isPanelDesktopOpen, setPanelDesktopOpen } = useResourcePack();

  const handleClick = useCallback(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1100px)').matches) {
      togglePanel();
    } else {
      setPanelDesktopOpen(!isPanelDesktopOpen);
    }
  }, [isPanelOpen, isPanelDesktopOpen, togglePanel, setResourcePanelOpen, setPanelDesktopOpen]);

  // On desktop: active = panel is visible. On mobile: active = overlay is shown.
  // Server renders as inactive (window unavailable); client corrects during hydration.
  const isActive = typeof window !== 'undefined' && !window.matchMedia('(max-width: 1100px)').matches
    ? isPanelDesktopOpen
    : isPanelOpen;

  return (
    <button
      suppressHydrationWarning
      onClick={handleClick}
      className={`resource-pack-header-toggle${isActive ? ' header-toggle-active' : ''}`}
      aria-label="Toggle resource pack"
      aria-expanded={isActive}
    >
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <span className="text-base">📦</span>
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ fontSize: '0.6rem' }}>
            {itemCount}
          </span>
        )}
      </span>
    </button>
  );
}
