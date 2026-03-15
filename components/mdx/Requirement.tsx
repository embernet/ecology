'use client';

import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { SelectableResource } from '../SelectableResource';

interface RequirementProps {
    /** Unique resource ID (e.g. "q1", "q2"). Required for URL-based resource pack sharing. */
    id: string;
    children?: React.ReactNode;
    text?: string;
}

export const Requirement: React.FC<RequirementProps> = ({ id, children, text }) => {
    const captureRef = useRef<HTMLDivElement>(null);
    const displayTitle = 'Requirements';

    return (
        <SelectableResource
            resourceId={id}
            type="Requirement"
            title={displayTitle}
            data={{ text }}
            captureRef={captureRef}
        >
            <div className="my-6 p-5 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg shadow-sm">
                <h4 className="text-blue-800 font-bold mb-2 uppercase text-xs tracking-wider">Curriculum Requirement</h4>
                <div ref={captureRef} className="text-blue-900 font-medium text-sm leading-relaxed prose prose-blue max-w-none">
                    {text && <ReactMarkdown>{text}</ReactMarkdown>}
                    {children}
                </div>
            </div>
        </SelectableResource>
    );
};
