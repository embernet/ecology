import data from '@/data/biomimicry.json';

export interface CurriculumLink {
  subject: string;
  key_stage: string;
  year_groups: string[];
  topic: string;
  how: string;
}

export interface BiomimicryEntry {
  id: string;
  title: string;
  emoji: string;
  /** Common + Latin name, e.g. "Common kingfisher (Alcedo atthis)" */
  creature: string;
  where_you_might_see_it: string;
  natures_problem: string;
  natures_solution: string;
  what_people_made: string;
  try_this: string;
  curriculum_links: CurriculumLink[];
  /** Art-brief note for illustrators — never rendered on the site. */
  image_idea?: string;
}

export const BIOMIMICRY: BiomimicryEntry[] = data as BiomimicryEntry[];

export function getBiomimicryEntry(id: string): BiomimicryEntry | null {
  return BIOMIMICRY.find((e) => e.id === id) ?? null;
}

/** Distinct curriculum subjects across all entries, in a stable order. */
export function biomimicrySubjects(): string[] {
  const order = ['Science', 'Geography', 'Design & Technology', 'Art & Design', 'Maths', 'History'];
  const seen = new Set<string>();
  for (const e of BIOMIMICRY) {
    for (const l of e.curriculum_links) seen.add(l.subject);
  }
  return [...seen].sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });
}

/** Distinct year groups (Y1…Y6) across all entries, sorted. */
export function biomimicryYearGroups(): string[] {
  const seen = new Set<string>();
  for (const e of BIOMIMICRY) {
    for (const l of e.curriculum_links) {
      for (const y of l.year_groups) seen.add(y);
    }
  }
  return sortYearGroups([...seen]);
}

export function entrySubjects(e: BiomimicryEntry): string[] {
  return [...new Set(e.curriculum_links.map((l) => l.subject))];
}

export function entryYearGroups(e: BiomimicryEntry): string[] {
  const seen = new Set<string>();
  for (const l of e.curriculum_links) for (const y of l.year_groups) seen.add(y);
  return sortYearGroups([...seen]);
}

export function sortYearGroups(years: string[]): string[] {
  return [...years].sort((a, b) => {
    const na = parseInt(a.replace(/\D/g, ''), 10);
    const nb = parseInt(b.replace(/\D/g, ''), 10);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return a.localeCompare(b);
  });
}
