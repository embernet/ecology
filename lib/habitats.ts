import data from '@/data/habitats.json';

export interface CurriculumLink {
  subject: string;
  key_stage: string;
  year_groups: string[];
  topic: string;
}

export interface HabitatEntry {
  id: string;
  title: string;
  emoji: string;
  category: string;
  gcse_category?: string;
  image_caption?: string;
  description: string;
  animals: { name: string; how_it_survives: string }[];
  climate?: string;
  plants?: string;
  fun_facts?: string[];
  curriculum_links: CurriculumLink[];
}

export const HABITATS: HabitatEntry[] = (data as HabitatEntry[]).sort((a, b) => a.title.localeCompare(b.title));

export function getHabitatEntry(id: string): HabitatEntry | null {
  return HABITATS.find((e) => e.id === id) ?? null;
}

export function habitatsCategories(): string[] {
  const seen = new Set<string>();
  for (const e of HABITATS) {
    seen.add(e.category);
  }
  return [...seen].sort();
}

export function habitatsYearGroups(): string[] {
  const seen = new Set<string>();
  for (const e of HABITATS) {
    for (const l of e.curriculum_links) {
      for (const y of l.year_groups) seen.add(y);
    }
  }
  return [...seen].sort();
}
