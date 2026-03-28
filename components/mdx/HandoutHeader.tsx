import React from 'react';
import { HANDOUTS_DATA } from '@/lib/handouts-data';

interface HandoutHeaderProps {
  slug: string;
}

export function HandoutHeader({ slug }: HandoutHeaderProps) {
  const data = HANDOUTS_DATA[slug];
  if (!data) return null;
  
  return (
    <div className="mb-8 mt-2">
      <p className="text-xl text-slate-700 leading-relaxed">{data.description}</p>
    </div>
  );
}
