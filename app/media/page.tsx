import Link from 'next/link';

const sections = [
  {
    href: '/media/images',
    label: 'Images',
    description: 'Browse all images used across the curriculum — searchable by name and description.',
  },
  {
    href: '/media/live-streams',
    label: 'Live Streams',
    description: 'Live wildlife camera feeds and interactive live lessons for classroom use.',
  },
];

export default function MediaLibraryPage() {
  return (
    <article className="markdown-content main-scroll-area">
      <h1>Media Library</h1>
      <p>Visual and live resources to support nature and ecology teaching.</p>
      <ul className="not-prose mt-6 space-y-3">
        {sections.map((s) => (
          <li key={s.href}>
            <Link href={s.href} className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-green-400 hover:bg-green-50 transition-colors">
              <div className="font-semibold text-green-800">{s.label}</div>
              <div className="mt-1 text-sm text-slate-600">{s.description}</div>
            </Link>
          </li>
        ))}
      </ul>
    </article>
  );
}
