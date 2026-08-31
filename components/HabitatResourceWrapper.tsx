'use client';

import React, { useRef } from 'react';
import { SelectableResource } from './SelectableResource';

interface HabitatResourceWrapperProps {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category?: string;
  children: React.ReactNode;
}

export function HabitatResourceWrapper({ id, title, description, emoji, category, children }: HabitatResourceWrapperProps) {
  const captureRef = useRef<HTMLDivElement>(null);

  return (
    <SelectableResource
      resourceId={`habitat-${id}`}
      type="Habitat"
      title={title}
      data={{ description, emoji }}
      captureRef={captureRef}
    >
      <article className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
        <div ref={captureRef} className="p-8 sm:p-12">
          {category && (
            <div className="text-sm font-bold text-green-700 uppercase tracking-widest mb-3">
              {category} Habitat
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 flex items-center gap-4">
            {title} <span className="text-5xl">{emoji}</span>
          </h1>
          <p className="text-xl text-slate-700 leading-relaxed mb-10">
            {description}
          </p>
          {children}
        </div>
      </article>
    </SelectableResource>
  );
}
