'use client';

import React, { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { SelectableResource } from '../SelectableResource';
import { dictionaryMarkdownComponents } from '../DictionaryWrapper';

interface NatureExampleProps {
    /** Unique resource ID (e.g. "n1", "n2"). Required for URL-based resource pack sharing. */
    id: string;
    title: string;
    emoji?: string;
    facts?: string;
    children?: React.ReactNode;
}

export const NatureExample: React.FC<NatureExampleProps> = ({ id, title, emoji, facts, children }) => {
    const captureRef = useRef<HTMLDivElement>(null);

    return (
        <SelectableResource
            resourceId={id}
            type="NatureExample"
            title={title}
            data={{ emoji, facts }}
            captureRef={captureRef}
        >
            <div className="my-8 rounded-xl overflow-hidden shadow-lg border border-green-100 bg-white">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-100">
                    <div className="flex items-center gap-4 mb-4">
                        {emoji && (
                            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center text-4xl bg-white rounded-full shadow-sm border border-green-100">
                                {emoji}
                            </div>
                        )}
                        <h3 className="text-2xl font-bold text-green-800 m-0">{title}</h3>
                    </div>
                    <div ref={captureRef} className="prose prose-green max-w-none">
                        {children}
                    </div>
                </div>

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
            </div>
        </SelectableResource>
    );
};
