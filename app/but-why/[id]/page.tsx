import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CONVERSATIONS, getConversation } from '@/lib/but-why';
import { ButWhyReaderEmbed } from '@/components/ButWhyReaderEmbed';

export function generateStaticParams() {
  return CONVERSATIONS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conv = getConversation(id);
  return {
    title: conv ? `${conv.title} — But Why?` : 'But Why?',
  };
}

export default async function ButWhyConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conv = getConversation(id);
  if (!conv) notFound();

  return (
    <div className="main-scroll-area">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/but-why"
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-800 font-medium mb-6"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          All conversations
        </Link>

        <ButWhyReaderEmbed url={conv.url} />
      </div>
    </div>
  );
}
