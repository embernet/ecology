import fs from 'fs';
import path from 'path';
import { BIOMIMICRY } from '@/lib/biomimicry';

export interface BiomimicryIndexItem {
  id: string;
  type: 'Biomimicry';
  title: string;
  sourcePage: string;
  sourcePageTitle: string;
  exploreSlug: string;
  activityHref: string;
  data: {
    type: 'Biomimicry';
    title: string;
    description: string;
    childrenHtml: string;
    activityImages: string[];
  };
}

/**
 * Adapts the biomimicry examples into the shape the Resource Index expects, so
 * every example is a first-class, browsable resource. Cards link straight to
 * the example's own detail page (`/biomimicry/[id]`) via `activityHref`.
 */
export function getBiomimicryForResourceIndex(): BiomimicryIndexItem[] {
  const imgDir = path.join(process.cwd(), 'public', 'biomimicry-images');

  return BIOMIMICRY.map((e) => {
    const imgPath = `/biomimicry-images/${e.id}.png`;
    const hasImage = fs.existsSync(path.join(imgDir, `${e.id}.png`));

    return {
      id: e.id,
      type: 'Biomimicry' as const,
      title: e.title,
      sourcePage: 'biomimicry',
      sourcePageTitle: 'Biomimicry',
      exploreSlug: e.id,
      activityHref: `/biomimicry/${e.id}`,
      data: {
        type: 'Biomimicry' as const,
        title: e.title,
        description: `${e.creature} — ${e.natures_solution}`,
        childrenHtml: '',
        activityImages: hasImage ? [imgPath] : [],
      },
    };
  });
}
