import React from 'react';
import { ACTIVITY_SHEETS_DATA } from '@/lib/activity-sheets-data';

interface ActivitySheetHeaderProps {
  slug: string;
}

export function ActivitySheetHeader({ slug }: ActivitySheetHeaderProps) {
  const data = ACTIVITY_SHEETS_DATA[slug];
  if (!data) return null;

  return (
    <div className="mb-8 mt-2">
      <p className="text-xl text-slate-700 leading-relaxed">{data.description}</p>
    </div>
  );
}
