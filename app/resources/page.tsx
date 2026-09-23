import React, { Suspense } from 'react';
import { getAllResourcesList } from '@/lib/resource-registry-api';
import { getActivitiesForResourceIndex } from '@/lib/activities-for-index';
import { getBiomimicryForResourceIndex } from '@/lib/biomimicry-for-index';
import { getButWhyForResourceIndex } from '@/lib/but-why-for-index';
import { getHabitatsForResourceIndex } from '@/lib/habitats-for-index';
import ResourceIndexClient from '@/components/ResourceIndexClient';

export default function ResourceIndexPage() {
    const registryResources = getAllResourcesList().filter(r => r.id && r.type && r.type !== 'Habitat');
    const activityResources = getActivitiesForResourceIndex();
    const biomimicryResources = getBiomimicryForResourceIndex();
    const butWhyResources = getButWhyForResourceIndex();
    const habitatResources = getHabitatsForResourceIndex();

    const resources = [
        ...registryResources,
        ...activityResources,
        ...biomimicryResources,
        ...butWhyResources,
        ...habitatResources,
    ].sort((a, b) => (a.title || '').localeCompare(b.title || ''));

    return (
        <div className="h-screen bg-slate-50 font-sans flex flex-col overflow-hidden">
            <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading resources...</div>}>
                <ResourceIndexClient resources={resources} />
            </Suspense>
        </div>
    );
}
