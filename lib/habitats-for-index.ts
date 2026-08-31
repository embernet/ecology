import fs from 'fs';
import path from 'path';
import { HABITATS } from '@/lib/habitats';

export interface HabitatsIndexItem {
  id: string;
  type: 'Habitat';
  title: string;
  sourcePage: string;
  sourcePageTitle: string;
  exploreSlug: string;
  activityHref: string;
  data: {
    type: 'Habitat';
    title: string;
    description: string;
    childrenHtml: string;
    activityImages: string[];
  };
}

export function getHabitatsForResourceIndex(): HabitatsIndexItem[] {
  const imgDir = path.join(process.cwd(), 'public', 'habitat-images');
  return HABITATS.map((h) => {
    const imgPath = `/habitat-images/${h.id}.jpg`;
    const hasImage = fs.existsSync(path.join(imgDir, `${h.id}.jpg`));
    
    return {
      id: `habitat-${h.id}`,
      type: 'Habitat' as const,
      title: h.title,
      sourcePage: 'habitats',
      sourcePageTitle: 'Habitats',
      exploreSlug: h.id,
      activityHref: `/habitats/${h.id}`,
      data: {
        type: 'Habitat' as const,
        title: h.title,
        description: h.description,
        childrenHtml: '',
        activityImages: hasImage ? [imgPath] : [],
      },
    };
  });
}
