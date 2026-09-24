'use client';

import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { SelectableResource } from '../SelectableResource';
import { dictionaryMarkdownComponents } from '../DictionaryWrapper';
import { CitizenScienceCallout } from './CitizenScienceCallout';

interface CreatureProps {
    /** Unique resource ID (e.g. "c1", "n2"). Required for URL-based resource pack sharing. */
    id: string;
    title: string;
    emoji?: string;
    facts?: string;
    hideProfileLink?: boolean;
    citizenScienceUrl?: string;
    citizenScienceProjectName?: string;
    children?: React.ReactNode;
}

export const Creature: React.FC<CreatureProps> = ({ id, title, emoji, facts, hideProfileLink, citizenScienceUrl, citizenScienceProjectName, children }) => {
    const captureRef = useRef<HTMLDivElement>(null);

    return (
        <SelectableResource
            resourceId={id}
            type="Creature"
            title={title}
            data={{ emoji, facts }}
            captureRef={captureRef}
        >
            <div ref={captureRef} className="my-8 rounded-xl overflow-hidden shadow-lg border border-amber-100 bg-white">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b border-amber-100">
                    <div className="flex items-center gap-4 mb-4">
                        {emoji && (
                            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center text-4xl bg-white rounded-full shadow-sm border border-amber-100">
                                {emoji}
                            </div>
                        )}
                        <h3 className="text-2xl font-bold text-amber-900 m-0">{title}</h3>
                    </div>
                    <div className="prose prose-amber max-w-none">
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
                
                {!hideProfileLink && (
                    <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                        <Link href={`/creatures/${id}`} className="text-amber-700 hover:text-amber-800 font-semibold text-sm inline-flex items-center gap-1 transition-colors">
                            📖 View full profile in the Creature Directory <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                )}
            </div>
        </SelectableResource>
    );
};
