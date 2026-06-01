import { CONVERSATIONS } from '@/lib/but-why';

export interface ButWhyIndexItem {
  id: string;
  type: 'ButWhy';
  title: string;
  sourcePage: string;
  sourcePageTitle: string;
  exploreSlug: string;
  activityHref: string;
  data: {
    type: 'ButWhy';
    title: string;
    description: string;
    childrenHtml: string;
    activityImages: string[];
  };
}

/**
 * Adapts the "But Why?" conversations into the shape the Resource Index expects,
 * so every conversation is a first-class, browsable resource. Cards link
 * straight to the conversation's own reader page (`/but-why/[id]`).
 */
export function getButWhyForResourceIndex(): ButWhyIndexItem[] {
  return CONVERSATIONS.map((c) => ({
    id: c.id,
    type: 'ButWhy' as const,
    title: c.title,
    sourcePage: 'but-why',
    sourcePageTitle: 'But Why?',
    exploreSlug: c.id,
    activityHref: `/but-why/${c.id}`,
    data: {
      type: 'ButWhy' as const,
      title: c.title,
      description: c.summary,
      childrenHtml: '',
      activityImages: [],
    },
  }));
}
