import React from 'react';
import { getAllResourcesList } from '@/lib/resource-registry-api';
import ResourceIndexClient from '@/components/ResourceIndexClient';

export default function ResourceIndexPage() {
    const resources = getAllResourcesList();

    // Remove duplicates or invalid items if there are any parsing errors
    const validResources = resources.filter(r => r.id && r.type);

    return (
        <div className="h-screen bg-slate-50 font-sans flex flex-col overflow-hidden">
            <ResourceIndexClient resources={validResources} />
        </div>
    );
}
