import { typeColorConfig } from './type-colors';

export type ResourceType = 
  | 'Creature'
  | 'NatureExample'
  | 'Activity'
  | 'Reflection'
  | 'Requirement'
  | 'Note'
  | 'Guidance'
  | 'Handout'
  | 'InteractiveActivity'
  | 'Biomimicry'
  | 'Habitat'
  | 'ButWhy'
  | 'FieldNotebookTemplate'
  | 'TaxonomicKey'
  | 'ExternalResource';

export interface WikiImageData {
  filename: string;
  alt: string;
  isStandardImg?: boolean;
  credit?: string;
}

export interface ResourcePackItemData {
  type: ResourceType;
  emoji?: string;
  facts?: string;
  text?: string;
  description?: string;
  imageSrc?: string;
  url?: string;
  childrenHtml: string;
  wikiImages: WikiImageData[];
}

export interface ResourcePackItem {
  id: string;
  shortId: string;
  type: ResourceType;
  sourcePage: string;
  sourcePageTitle: string;
  title: string;
  addedAt: number;
  order: number;
  data: ResourcePackItemData;
}

export function makeResourceLookupKey(type: ResourceType, title: string, sourcePage: string): string {
  return `${type}:${title}:${sourcePage}`;
}
