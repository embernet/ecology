'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { imageId } from '@/lib/image-id';

// Module-level cache for fetched author names
const authorCache = new Map<string, string | null>();

async function fetchAuthorFromWikimedia(cleanFilename: string): Promise<string | null> {
    if (authorCache.has(cleanFilename)) {
        return authorCache.get(cleanFilename) || null;
    }

    try {
        const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(cleanFilename)}&prop=imageinfo&iiprop=extmetadata&format=json&origin=*`;
        const response = await fetch(apiUrl);
        if (!response.ok) {
            authorCache.set(cleanFilename, null);
            return null;
        }
        const data = await response.json();
        const pages = data.query?.pages;
        if (!pages) {
            authorCache.set(cleanFilename, null);
            return null;
        }
        const page = Object.values(pages)[0] as Record<string, unknown>;
        const imageInfo = page?.imageinfo as Array<{ extmetadata?: { Artist?: { value?: string } } }> | undefined;
        const artistHtml = imageInfo?.[0]?.extmetadata?.Artist?.value;
        if (artistHtml) {
            // The artist field often contains HTML tags, strip them to get plain text
            const div = document.createElement('div');
            div.innerHTML = artistHtml;
            const text = (div.textContent || div.innerText || '').trim();
            authorCache.set(cleanFilename, text);
            return text;
        }
        authorCache.set(cleanFilename, null);
        return null;
    } catch {
        authorCache.set(cleanFilename, null);
        return null;
    }
}

interface WikiImageProps {
    filename: string;
    alt: string;
    className?: string;
    caption?: string;
    credit?: string;
}

export const WikiImage: React.FC<WikiImageProps> = ({ filename, alt, className, caption, credit }) => {
    const cleanFilename = filename.trim().split(' ').join('_');
    const src = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(cleanFilename)}`;
    const licenseUrl = `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(cleanFilename)}`;

    const [error, setError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [fetchedAuthor, setFetchedAuthor] = useState<string | null>(null);

    // Use caption prop if available, otherwise fallback to alt if it's not just the filename
    const displayCaption = caption || (alt !== filename ? alt : '');

    // The credit to display: explicit prop > auto-fetched > nothing
    const displayCredit = credit || fetchedAuthor;

    // Auto-fetch author from Wikimedia API if no explicit credit prop
    useEffect(() => {
        if (!credit) {
            fetchAuthorFromWikimedia(cleanFilename).then(author => {
                if (author) setFetchedAuthor(author);
            });
        }
    }, [credit, cleanFilename]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (error) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg p-4 border border-gray-200 ${className || 'h-48'}`}>
                <div className="text-center">
                    <p className="text-xs mb-1">Image unavailable</p>
                    <p className="text-[10px] break-all opacity-50">{filename}</p>
                </div>
            </div>
        );
    }

    const creditLine = (
        <>
            Credit: {displayCredit ? `${displayCredit}, ` : ''}Wikimedia Commons.{' '}
            <a
                href={licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-600"
                onClick={(e) => e.stopPropagation()}
            >
                Click here for the license
            </a>
        </>
    );

    const modalCreditLine = (
        <>
            Credit: {displayCredit ? `${displayCredit}, ` : ''}Wikimedia Commons.{' '}
            <a
                href={licenseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/90"
                onClick={(e) => e.stopPropagation()}
            >
                Click here for the license
            </a>
        </>
    );

    return (
        <>
            <figure
                id={imageId(filename)}
                className={`bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-zoom-in group w-fit max-w-full ${className || ''}`}
                onClick={() => setIsOpen(true)}
                data-wiki-filename={filename}
                data-wiki-alt={alt}
                data-wiki-credit={displayCredit || ''}
            >
                <div className="w-full relative flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-auto object-contain max-h-[300px]"
                        loading="lazy"
                        onError={() => setError(true)}
                    />
                </div>
                {displayCaption && (
                    <figcaption className="mt-3 text-xs text-center text-gray-600 font-medium leading-tight">
                        {displayCaption}
                    </figcaption>
                )}
                <div className="mt-1 text-[10px] text-center text-gray-400 leading-tight">
                    {creditLine}
                </div>
            </figure>

            {isOpen && createPortal(
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                >
                    <div className="relative max-w-7xl max-h-screen w-full flex flex-col items-center justify-center">
                        <button
                            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 p-2 focus:outline-none"
                            aria-label="Close"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <img
                            src={src}
                            alt={alt}
                            className="max-w-full max-h-[85vh] object-contain rounded-md shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />

                        {displayCaption && (
                            <div className="mt-4 text-white/90 text-center font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
                                {displayCaption}
                            </div>
                        )}
                        <div className="mt-2 text-xs text-white/60 text-center">
                            {modalCreditLine}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
