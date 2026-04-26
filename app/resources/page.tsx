import React from 'react';
import { getAllResourcesList } from '@/lib/resource-registry-api';
import { getActivitiesForResourceIndex } from '@/lib/activities-for-index';
import ResourceIndexClient from '@/components/ResourceIndexClient';

export default function ResourceIndexPage() {
    const registryResources = getAllResourcesList().filter(r => r.id && r.type);
    const activityResources = getActivitiesForResourceIndex();

    const resources = [...registryResources, ...activityResources];

    return (
        <div className="h-screen bg-slate-50 font-sans flex flex-col overflow-hidden">
            <ResourceIndexClient resources={resources} />
        </div>
    );
}
