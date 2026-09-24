'use client';

import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import Image from 'next/image';
import { SelectableResource } from '../SelectableResource';
import { dictionaryMarkdownComponents } from '../DictionaryWrapper';
import { HABITATS } from '@/lib/habitats';
import { CitizenScienceCallout } from './CitizenScienceCallout';

interface HabitatProps {
    id: string;
    title: string;
    emoji?: string;
    facts?: string;
    hideProfileLink?: boolean;
    citizenScienceUrl?: string;
    citizenScienceProjectName?: string;
    children?: React.ReactNode;
}

export const Habitat: React.FC<HabitatProps> = ({ id, title, emoji, facts, hideProfileLink, citizenScienceUrl, citizenScienceProjectName, children }) => {
    const captureRef = useRef<HTMLDivElement>(null);

    // Attempt to match the title to a real habitat in our JSON database
    const cleanTitle = title.replace(/^The\s+/i, '');
    let matchingHabitat = HABITATS.find(h => h.title.toLowerCase() === cleanTitle.toLowerCase());
    
    // Hardcoded aliases for curriculum edge cases
    if (!matchingHabitat && cleanTitle.toLowerCase() === 'log') {
        matchingHabitat = HABITATS.find(h => h.id === 'dead-log');
    }
    if (!matchingHabitat && cleanTitle.toLowerCase() === 'tropical rainforest') {
        matchingHabitat = HABITATS.find(h => h.id === 'rainforest-floor');
    }

    return (
        <SelectableResource
            resourceId={id}
            type="Habitat"
            title={title}
            data={{ emoji, facts }}
            captureRef={captureRef}
        >
            <div ref={captureRef} className="my-8 rounded-xl overflow-hidden shadow-lg border border-teal-100 bg-white">
                {matchingHabitat && (
                    <div className="relative w-full h-48 md:h-64 border-b border-teal-100 bg-teal-50">
                        <Image
                            src={`/habitat-images/${matchingHabitat.id}.jpg`}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 border-b border-teal-100">
                    <div className="flex items-center gap-4 mb-4">
                        {emoji && (
                            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center text-4xl bg-white rounded-full shadow-sm border border-teal-100 relative z-10">
                                {emoji}
                            </div>
                        )}
                        <h3 className="text-2xl font-bold text-teal-900 m-0">{title}</h3>
                    </div>
                    <div className="prose prose-teal max-w-none relative z-10">
                        {children}
                    </div>
                </div>

                {citizenScienceUrl && citizenScienceProjectName && (
                    <div className="px-6 pb-2">
                        <CitizenScienceCallout url={citizenScienceUrl} projectName={citizenScienceProjectName} />
                    </div>
                )}

                {facts && (
                    <div className="bg-yellow-50 p-6 border-t border-yellow-100">
                        <h4 className="flex items-center gap-2 text-lg font-bold text-yellow-800 mb-3 uppercase tracking-wide">
                            <span className="text-xl">💡</span> Fun Facts
                        </h4>
                        <div className="prose prose-yellow max-w-none text-slate-700">
                            <ReactMarkdown components={dictionaryMarkdownComponents}>{facts}</ReactMarkdown>
                        </div>
                    </div>
                )}
                
                {!hideProfileLink && matchingHabitat && (
                    <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                        <Link href={`/habitats/${matchingHabitat.id}`} className="text-teal-700 hover:text-teal-800 font-semibold text-sm inline-flex items-center gap-1 transition-colors">
                            🌍 Explore the {matchingHabitat.title} habitat <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                )}
            </div>
        </SelectableResource>
    );
};
