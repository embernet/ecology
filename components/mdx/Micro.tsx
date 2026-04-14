'use client';

import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { SelectableResource } from '../SelectableResource';
import { dictionaryMarkdownComponents } from '../DictionaryWrapper';

interface NoteProps {
    /** Unique resource ID (e.g. "t1", "g1"). Required for URL-based resource pack sharing. */
    id: string;
    title?: string;
    text?: string;
    children?: React.ReactNode;
}

export const Note: React.FC<NoteProps> = ({ id, title, text, children }) => {
    const captureRef = useRef<HTMLDivElement>(null);
    const displayTitle = title || 'Note';

    return (
        <SelectableResource
            resourceId={id}
            type="Note"
            title={displayTitle}
            data={{ text }}
            captureRef={captureRef}
        >
            <div className="bg-slate-50 border-l-4 border-slate-400 p-4 my-4 text-slate-900 prose prose-slate max-w-none">
                <strong>{title ? `${title}` : 'Note:'}</strong>
                <div ref={captureRef}>
                    {text && <div className={title ? 'mt-2' : 'inline-block ml-1 align-top'}><ReactMarkdown components={dictionaryMarkdownComponents}>{text}</ReactMarkdown></div>}
                    {children}
                </div>
            </div>
        </SelectableResource>
    );
};

export const Guidance: React.FC<NoteProps> = ({ id, text, children }) => {
    const captureRef = useRef<HTMLDivElement>(null);
    const displayTitle = 'Guidance';

    return (
        <SelectableResource
            resourceId={id}
            type="Guidance"
            title={displayTitle}
            data={{ text }}
            captureRef={captureRef}
        >
            <div className="bg-sky-50 border-l-4 border-sky-400 p-4 my-4 text-sky-900 text-sm prose prose-sky max-w-none">
                <strong>Guidance:</strong>
                <div ref={captureRef}>
                    {text && <div className="mt-2 text-sky-800 font-normal"><ReactMarkdown components={dictionaryMarkdownComponents}>{text}</ReactMarkdown></div>}
                    {children}
                </div>
            </div>
        </SelectableResource>
    );
};
