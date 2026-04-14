import Link from 'next/link';

const sections = [
  {
    href: '/dictionary',
    label: 'Dictionary',
    description: 'Definitions of ecology and nature terms used across the curriculum.',
  },
  {
    href: '/resources',
    label: 'Resource Index',
    description: 'A curated index of books, websites, image libraries, and organisations.',
  },
];

export default function ReferencePage() {
  return (
    <article className="markdown-content main-scroll-area">
      <h1>Reference</h1>
      <p>Look-up tools and curated resources to support research and teaching.</p>
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
