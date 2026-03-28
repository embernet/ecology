import fs from 'fs';
import path from 'path';

export interface ResourceData {
  type: string;
  title?: string;
  emoji?: string;
  facts?: string;
  description?: string;
  text?: string;
  childrenHtml: string;
  wikiImages?: { filename: string; alt: string }[];
}

export interface RegistryResource {
  type: string;
  title: string;
  sourcePage: string;
  sourcePageTitle: string;
  data: ResourceData;
}

export type ResourceRegistry = Record<string, RegistryResource>;

let cachedRegistry: ResourceRegistry | null = null;
let slugToIdMap: Record<string, string> = {};
let idToSlugMap: Record<string, string> = {};

function generateSlugs(registry: ResourceRegistry) {
  slugToIdMap = {};
  idToSlugMap = {};
  const seenSlugs = new Set<string>();

  for (const [id, resource] of Object.entries(registry)) {
    // Determine base string for the slug
    let baseText = resource.data.title || resource.title || resource.type;
    
    // Remove special characters, replace spaces with underscores
    let baseSlug = baseText
      .replace(/[^a-zA-Z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '_');

    // Ensure it's not totally empty
    if (!baseSlug) baseSlug = 'Explore_Item';

    let finalSlug = baseSlug;
    let counter = 2;
    while (seenSlugs.has(finalSlug.toLowerCase())) {
      finalSlug = `${baseSlug}_${counter}`;
      counter++;
    }

    seenSlugs.add(finalSlug.toLowerCase());
    slugToIdMap[finalSlug.toLowerCase()] = id; // map lowercase for case-insensitive lookup
    idToSlugMap[id] = finalSlug; // store the actual cased slug
  }
}

export function getResourceRegistry(): ResourceRegistry {
  if (cachedRegistry) return cachedRegistry;
  
  const registryPath = path.join(process.cwd(), 'public', 'resource-registry.json');
  try {
    const fileContents = fs.readFileSync(registryPath, 'utf8');
    cachedRegistry = JSON.parse(fileContents);
    generateSlugs(cachedRegistry as ResourceRegistry);
    return cachedRegistry as ResourceRegistry;
  } catch (error) {
    console.error("Failed to read resource-registry.json", error);
    return {};
  }
}

export function getResourceById(id: string): RegistryResource | null {
  const registry = getResourceRegistry();
  return registry[id] || null;
}

export function getResourceBySlug(slug: string): (RegistryResource & { id: string }) | null {
  const registry = getResourceRegistry(); // ensures caching/slugs are built
  const id = slugToIdMap[slug.toLowerCase()];
  if (!id || !registry[id]) return null;
  return { id, ...registry[id] };
}

export function getSlugForId(id: string): string {
  getResourceRegistry(); // ensure fully loaded
  return idToSlugMap[id] || id;
}

export function getAllResourceSlugs(): string[] {
  getResourceRegistry(); // ensure fully loaded
  return Object.values(idToSlugMap);
}

export function getAllResourceIds(): string[] {
  const registry = getResourceRegistry();
  return Object.keys(registry);
}

export function getAllResourcesList(): (RegistryResource & { id: string, exploreSlug: string })[] {
  const registry = getResourceRegistry();
  return Object.entries(registry).map(([id, resource]) => ({
    id,
    exploreSlug: getSlugForId(id),
    ...resource
  }));
}
