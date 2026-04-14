'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';

interface ImageEntry {
    id: string;
    filename: string;
    alt: string;
    caption?: string;
    credit?: string;
    pages: { slug: string; title: string }[];
    src: string;
    thumbnailSrc: string;
}

type ViewTab = 'list' | 'grid';

const VIEW_STORAGE_KEY = 'image-library-view';

export function ImageLibrary({ images }: { images: ImageEntry[] }) {
    const [activeTab, setActiveTab] = useState<ViewTab>('list');

    // Restore saved view on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(VIEW_STORAGE_KEY);
            if (saved === 'list' || saved === 'grid') setActiveTab(saved);
        } catch { /* quota / private mode */ }
    }, []);

    function setTab(tab: ViewTab) {
        setActiveTab(tab);
        try { localStorage.setItem(VIEW_STORAGE_KEY, tab); } catch { /* ignore */ }
    }
    const [search, setSearch] = useState('');
    const [modalImage, setModalImage] = useState<ImageEntry | null>(null);
    const [hoverImage, setHoverImage] = useState<{ entry: ImageEntry; x: number; y: number } | null>(null);

    const filtered = useMemo(() => {
        if (!search.trim()) return images;
        const q = search.toLowerCase();
        return images.filter(img =>
            img.filename.toLowerCase().includes(q) ||
            img.alt.toLowerCase().includes(q) ||
            (img.caption && img.caption.toLowerCase().includes(q)) ||
            img.pages.some(p => p.title.toLowerCase().includes(q))
        );
    }, [images, search]);

    // Close modal on ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setModalImage(null);
        };
        if (modalImage) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [modalImage]);

    return (
        <div className="image-library">
            {/* Tab bar */}
            <div className="image-library-tabs">
                <button
                    className={`image-library-tab ${activeTab === 'list' ? 'image-library-tab-active' : ''}`}
                    onClick={() => setTab('list')}
                >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                    </svg>
                    List View
                </button>
                <button
                    className={`image-library-tab ${activeTab === 'grid' ? 'image-library-tab-active' : ''}`}
                    onClick={() => setTab('grid')}
                >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M4.25 2A2.25 2.25 0 002 4.25v2.5A2.25 2.25 0 004.25 9h2.5A2.25 2.25 0 009 6.75v-2.5A2.25 2.25 0 006.75 2h-2.5zm0 9A2.25 2.25 0 002 13.25v2.5A2.25 2.25 0 004.25 18h2.5A2.25 2.25 0 009 15.75v-2.5A2.25 2.25 0 006.75 11h-2.5zm9-9A2.25 2.25 0 0011 4.25v2.5A2.25 2.25 0 0013.25 9h2.5A2.25 2.25 0 0018 6.75v-2.5A2.25 2.25 0 0015.75 2h-2.5zm0 9A2.25 2.25 0 0011 13.25v2.5A2.25 2.25 0 0013.25 18h2.5A2.25 2.25 0 0018 15.75v-2.5A2.25 2.25 0 0015.75 11h-2.5z" clipRule="evenodd" />
                    </svg>
                    Grid View
                </button>
                <span className="image-library-count">{filtered.length} image{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Search bar - shared across tabs */}
            <div className="image-library-search">
                <svg viewBox="0 0 20 20" fill="currentColor" className="image-library-search-icon">
                    <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
                <input
                    type="text"
                    placeholder="Search images by name, description, or page..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="image-library-search-input"
                />
                {search && (
                    <button
                        onClick={() => setSearch('')}
                        className="image-library-search-clear"
                        aria-label="Clear search"
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                        </svg>
                    </button>
                )}
            </div>

            {/* List View */}
            {activeTab === 'list' && (
                <div className="image-library-list">
                    {filtered.map((img) => (
                        <div key={img.filename} className="image-library-list-item">
                            <div
                                className="image-library-list-thumb"
                                onClick={() => setModalImage(img)}
                            >
                                <img
                                    src={img.thumbnailSrc}
                                    alt={img.alt}
                                    loading="lazy"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                />
                            </div>
                            <div className="image-library-list-info">
                                <div
                                    className="image-library-list-name"
                                    onClick={() => setModalImage(img)}
                                >
                                    {img.alt || img.filename.replace(/_/g, ' ').replace(/\.[^.]+$/, '')}
                                </div>
                                {img.caption && img.caption !== img.alt && (
                                    <div className="image-library-list-caption">{img.caption}</div>
                                )}
                                <div className="image-library-list-filename">
                                    {img.filename}
                                </div>
                            </div>
                            <div className="image-library-list-pages">
                                <span className="image-library-list-pages-label">Used on:</span>
                                {img.pages.map((page) => (
                                    <Link
                                        key={page.slug}
                                        href={`/wiki/${page.slug}#${img.id}`}
                                        className="image-library-page-link"
                                    >
                                        {page.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="image-library-empty">
                            No images found matching &quot;{search}&quot;
                        </div>
                    )}
                </div>
            )}

            {/* Grid View */}
            {activeTab === 'grid' && (
                <div className="image-library-grid">
                    {filtered.map((img) => (
                        <div
                            key={img.filename}
                            className="image-library-grid-item"
                            onMouseEnter={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setHoverImage({
                                    entry: img,
                                    x: rect.left + rect.width / 2,
                                    y: rect.top,
                                });
                            }}
                            onMouseLeave={() => setHoverImage(null)}
                        >
                            <Link href={`/wiki/${img.pages[0]?.slug || ''}#${img.id}`} className="image-library-grid-link">
                                <div className="image-library-grid-thumb">
                                    <img
                                        src={img.thumbnailSrc}
                                        alt={img.alt}
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                                <div className="image-library-grid-label">
                                    {img.alt || img.filename.replace(/_/g, ' ').replace(/\.[^.]+$/, '')}
                                </div>
                            </Link>
                        </div>
                    ))}
                    {filtered.length === 0 && (
                        <div className="image-library-empty">
                            No images found matching &quot;{search}&quot;
                        </div>
                    )}
                </div>
            )}

            {/* Hover preview for grid */}
            {hoverImage && createPortal(
                <div
                    className="image-library-hover-preview"
                    style={{
                        left: Math.min(hoverImage.x, window.innerWidth - 340),
                        top: Math.max(hoverImage.y - 10, 10),
                    }}
                >
                    <img
                        src={hoverImage.entry.src}
                        alt={hoverImage.entry.alt}
                    />
                    <div className="image-library-hover-caption">
                        {hoverImage.entry.alt}
                    </div>
                </div>,
                document.body
            )}

            {/* Full-view modal */}
            {modalImage && createPortal(
                <div
                    className="fixed top-[7rem] left-0 right-0 bottom-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setModalImage(null)}
                >
                    <button
                        onClick={(e) => { e.stopPropagation(); setModalImage(null); }}
                        className="absolute top-4 right-4 z-[60] text-white hover:text-gray-300 bg-black/50 hover:bg-black/80 rounded-full p-2 focus:outline-none backdrop-blur-sm transition-colors"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="relative max-w-7xl h-full w-full flex flex-col items-center justify-center">
                        <img
                            src={modalImage.src}
                            alt={modalImage.alt}
                            className="max-w-full max-h-[calc(100vh-14rem)] object-contain rounded-md shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <div className="mt-4 text-white/90 text-center font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                            {modalImage.alt}
                        </div>
                        <div className="mt-2 text-xs text-white/60 text-center">
                            {modalImage.filename}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 justify-center" onClick={e => e.stopPropagation()}>
                            {modalImage.pages.map(page => (
                                <Link
                                    key={page.slug}
                                    href={`/wiki/${page.slug}#${modalImage.id}`}
                                    className="text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full transition-colors"
                                >
                                    {page.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
