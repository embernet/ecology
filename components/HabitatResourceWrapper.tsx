'use client';

import React, { useRef } from 'react';
import { SelectableResource } from './SelectableResource';

interface HabitatResourceWrapperProps {
  id: string;
  title: string;
  description: string;
  emoji: string;
  children: React.ReactNode;
}

export function HabitatResourceWrapper({ id, title, description, emoji, children }: HabitatResourceWrapperProps) {
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
          {children}
        </div>
      </article>
    </SelectableResource>
  );
}
