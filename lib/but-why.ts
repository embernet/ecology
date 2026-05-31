import data from '@/data/but-why.json';
import { sortYearGroups } from '@/lib/biomimicry';

export interface ConversationCurriculum {
  key_stage: string;
  year_groups: string[];
  topics: string[];
}

export interface ConversationSummary {
  id: string;
  title: string;
  type: string;
  summary: string;
  subjects: string[];
  curriculum: ConversationCurriculum;
  added_date?: string;
  /** Public URL of the full conversation JSON, fetched by the reader at runtime. */
  url: string;
}

export const CONVERSATIONS: ConversationSummary[] = data as ConversationSummary[];

export function getConversation(id: string): ConversationSummary | null {
  return CONVERSATIONS.find((c) => c.id === id) ?? null;
}

/** Distinct year groups (Y1…Y6) across all conversations, sorted. */
export function conversationYearGroups(): string[] {
  const seen = new Set<string>();
  for (const c of CONVERSATIONS) {
    for (const y of c.curriculum.year_groups) seen.add(y);
  }
  return sortYearGroups([...seen]);
}
