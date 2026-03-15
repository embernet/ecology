'use client';

import ReactMarkdown from 'react-markdown';
import { SelectableResource } from '../SelectableResource';

interface CardProps {
    /** Unique resource ID (e.g. "a1", "r1"). Required for URL-based resource pack sharing. */
    id: string;
    title: string;
    description: string;
}

export const Activity: React.FC<CardProps> = ({ id, title, description }) => {
    return (
        <SelectableResource
            resourceId={id}
            type="Activity"
            title={title}
            data={{ description }}
        >
            <div className="my-6 p-6 bg-white border border-indigo-100 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 m-0">{title}</h3>
                </div>
                <div className="text-gray-600 prose prose-indigo max-w-none">
                    <ReactMarkdown>{description}</ReactMarkdown>
                </div>
            </div>
        </SelectableResource>
    );
};

export const Reflection: React.FC<CardProps> = ({ id, title, description }) => {
    return (
        <SelectableResource
            resourceId={id}
            type="Reflection"
            title={title}
            data={{ description }}
        >
            <div className="my-6 p-6 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-purple-900 m-0">{title}</h3>
                </div>
                <div className="text-purple-800 italic leading-relaxed prose prose-purple max-w-none">
                    <ReactMarkdown>{description}</ReactMarkdown>
                </div>
            </div>
        </SelectableResource>
    );
};
