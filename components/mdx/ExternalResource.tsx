'use client';

import React from 'react';
import { SelectableResource } from '../SelectableResource';

interface ExternalResourceProps {
    id: string;
    title: string;
    url: string;
    description?: string;
}

export const ExternalResource: React.FC<ExternalResourceProps> = ({ id, title, url, description }) => {
    return (
        <SelectableResource
            resourceId={id}
            type="ExternalResource"
            title={title}
            data={{ text: description, url }}
        >
            <div className="my-8 rounded-xl overflow-hidden shadow-sm border border-fuchsia-200 bg-white hover:shadow-md transition-shadow">
                <div className="bg-fuchsia-50 p-6 border-b border-fuchsia-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-fuchsia-900 m-0 mb-2">{title}</h3>
                        {description && <p className="text-fuchsia-800 text-sm m-0">{description}</p>}
                    </div>
                    <a 
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 inline-flex items-center gap-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded-full transition-colors whitespace-nowrap"
                    >
                        Visit Website
                        <span className="text-xl leading-none">↗</span>
                    </a>
                </div>
            </div>
        </SelectableResource>
    );
};
