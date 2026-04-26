import Link from 'next/link';
import Image from 'next/image';
import { ACTIVITY_SHEETS_DATA } from '@/lib/activity-sheets-data';

interface ActivitySheetCardProps {
  slug: string;
}

export function ActivitySheetCard({ slug }: ActivitySheetCardProps) {
  const data = ACTIVITY_SHEETS_DATA[slug];
  if (!data) return null;

  return (
    <Link href={`/wiki/${slug}`} className="activity-sheet-card-link" style={{ textDecoration: 'none' }}>
      <div className="activity-sheet-card">
        <div className="activity-sheet-card-image relative">
          <Image
            src={data.imageSrc}
            alt={data.title}
            fill
            className="object-contain p-1"
            sizes="90px"
          />
        </div>
        <div className="activity-sheet-card-body">
          <h3 className="activity-sheet-card-title">{data.title}</h3>
          <p className="activity-sheet-card-desc">{data.description}</p>
        </div>
        <div className="activity-sheet-card-arrow">
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
