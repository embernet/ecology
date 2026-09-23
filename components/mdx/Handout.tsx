'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { SelectableResource } from '../SelectableResource';
import { SPECIES_HANDOUT_LINKS } from '@/lib/species-handouts';

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

    // Auto-detect if this handout is for a habitat profile, e.g. /handouts/handout-habitat-pond.jpg
    let habitatIdMatch = imageSrc.match(/\/handouts\/handout-habitat-(.*)\.jpg$/);
    let habitatId = habitatIdMatch ? habitatIdMatch[1] : null;

    // Detect if this is a species handout
    const speciesHandoutSlug = imageSrc.match(/\/handouts\/(.*)\.png$/)?.[1];
    const speciesLinkObj = SPECIES_HANDOUT_LINKS.find(s => s.handoutSlug === `handout-${speciesHandoutSlug}`);
    
    // In case the image is a .jpg instead of .png
    const speciesHandoutSlugJpg = imageSrc.match(/\/handouts\/(.*)\.jpg$/)?.[1];
    const speciesLinkObjFallback = SPECIES_HANDOUT_LINKS.find(s => s.handoutSlug === `handout-${speciesHandoutSlugJpg}`);
    
    const speciesLinks = speciesLinkObj || speciesLinkObjFallback;

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
                
                {speciesLinks && speciesLinks.creatures.length > 0 && (
                    <div className="bg-amber-100/50 px-6 py-4 border-t border-amber-100">
                        <h4 className="text-amber-900 font-semibold text-sm mb-2">Related Creatures in the Directory:</h4>
                        <div className="flex flex-wrap gap-2">
                            {speciesLinks.creatures.map(c => (
                                <Link key={c.id} href={`/creatures/${c.id}`} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-50 text-amber-800 text-xs font-medium rounded-full shadow-sm transition-colors">
                                    🐞 {c.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="handout-footer-bar bg-amber-50 px-6 py-4 border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {habitatId ? (
                        <Link href={`/habitats/${habitatId}`} className="text-amber-700 hover:text-amber-800 font-semibold text-sm inline-flex items-center gap-1 transition-colors">
                            🌍 Read the full {title.replace('Habitat Profile: ', '')} Habitat Profile <span aria-hidden="true">&rarr;</span>
                        </Link>
                    ) : (
                        <div /> // Spacer
                    )}
                    <a
                        href={imageSrc}
                        download={filename}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors no-underline whitespace-nowrap"
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
