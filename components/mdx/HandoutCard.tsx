import Link from 'next/link';
import Image from 'next/image';
import { HANDOUTS_DATA } from '@/lib/handouts-data';

interface HandoutCardProps {
  slug: string;
}

export function HandoutCard({ slug }: HandoutCardProps) {
  const data = HANDOUTS_DATA[slug];
  if (!data) return null;

  return (
    <Link href={`/wiki/${slug}`} className="handout-card-link" style={{ textDecoration: 'none' }}>
      <div className="handout-card">
        <div className="handout-card-image relative">
          <Image
            src={data.imageSrc}
            alt={data.title}
            fill
            className="object-contain p-1"
            sizes="90px"
          />
        </div>
        <div className="handout-card-body">
          <h3 className="handout-card-title">{data.title}</h3>
          <p className="handout-card-desc">{data.description}</p>
        </div>
        <div className="handout-card-arrow">
          <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

