import Link from 'next/link';
import type { NavItem } from '@/lib/navigation';

interface PrevNextNavProps {
  prev: NavItem | null;
  next: NavItem | null;
  sectionLabel: string | null;
  sectionHref: string | null;
  title?: string | null;
}

export function PrevNextNav({ prev, next, sectionLabel, sectionHref, title }: PrevNextNavProps) {
  if (!prev && !next && !sectionHref) return null;

  return (
    <nav className="prevnext-nav" aria-label="Page navigation">
      <div className="prevnext-inner">
        <div className="prevnext-slot-arrow">
          {prev && (
            <Link href={prev.href} className="prevnext-arrow" aria-label={`Previous: ${prev.label}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M 15 18 L 9 12 L 15 6" />
              </svg>
            </Link>
          )}
        </div>

        <div className="prevnext-slot-center">
          {sectionLabel && sectionHref && (
            <Link href={sectionHref} className="prevnext-section-btn" aria-label={`Back to ${sectionLabel}`}>
              {sectionLabel}
            </Link>
          )}
          {title && (
            <span className="prevnext-title">{title}</span>
          )}
        </div>

        <div className="prevnext-slot-arrow prevnext-slot-arrow-right">
          {next && (
            <Link href={next.href} className="prevnext-arrow" aria-label={`Next: ${next.label}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M 9 18 L 15 12 L 9 6" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
