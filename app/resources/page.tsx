import React from 'react';
import { getAllResourcesList } from '@/lib/resource-registry-api';
import { getActivitiesForResourceIndex } from '@/lib/activities-for-index';
import { getBiomimicryForResourceIndex } from '@/lib/biomimicry-for-index';
import { getButWhyForResourceIndex } from '@/lib/but-why-for-index';
import ResourceIndexClient from '@/components/ResourceIndexClient';

export default function ResourceIndexPage() {
    const registryResources = getAllResourcesList().filter(r => r.id && r.type);
    const activityResources = getActivitiesForResourceIndex();
    const biomimicryResources = getBiomimicryForResourceIndex();
    const butWhyResources = getButWhyForResourceIndex();

    const resources = [
        ...registryResources,
        ...activityResources,
        ...biomimicryResources,
        ...butWhyResources,
    ];

    return (
        <div className="h-screen bg-slate-50 font-sans flex flex-col overflow-hidden">
            <ResourceIndexClient resources={resources} />
        </div>
    );
}
