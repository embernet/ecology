'use client';

import React, { useRef } from 'react';
import { SelectableResource } from '../SelectableResource';

interface HandoutProps {
    /** Unique resource ID (e.g. "h1", "h2"). Required for URL-based resource pack sharing. */
    id: string;
    title: string;
    imageSrc: string;
    altText?: string;
}

export const Handout: React.FC<HandoutProps> = ({ id, title, imageSrc, altText }) => {
    const captureRef = useRef<HTMLDivElement>(null);

    const filename = imageSrc.split('/').pop() || 'handout.png';

    return (
        <SelectableResource
            resourceId={id}
            type="Handout"
            title={title}
            data={{ imageSrc }}
            captureRef={captureRef}
        >
            <div className="my-8 rounded-xl overflow-hidden shadow-lg border border-amber-100 bg-white">
                <div ref={captureRef}>
                    <img
                        src={imageSrc}
                        alt={altText || title}
                        className="w-full h-auto block"
                        style={{ maxWidth: '100%' }}
                    />
                </div>
                <div className="handout-footer-bar bg-amber-50 px-6 py-4 border-t border-amber-100 flex items-center justify-end">
                    <a
                        href={imageSrc}
                        download={filename}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors no-underline"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download Image
                    </a>
                </div>
            </div>
        </SelectableResource>
    );
};
