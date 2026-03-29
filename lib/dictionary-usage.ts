import { getAllPosts } from './content';
import { getDictionaryMap, generateDictionaryRegex } from './dictionary';

export interface DictionaryUsage {
  title: string;
  href: string;
}

export function getDictionaryUsageMap(): Map<string, DictionaryUsage[]> {
  const dictionaryRegex = generateDictionaryRegex();
  const dictionaryMap = getDictionaryMap();
  
  const usageMap = new Map<string, Map<string, DictionaryUsage>>(); 
  
  const posts = getAllPosts();
  for (const post of posts) {
    if (!post) continue;
    
    const text = post.content;
    const matches = Array.from(text.matchAll(dictionaryRegex));
    
    for (const match of matches) {
      if (!match || !match[0]) continue;
      const matchText = match[0];
      const entry = dictionaryMap.get(matchText.toLowerCase());
      
      if (entry) {
        if (!usageMap.has(entry.word)) {
          usageMap.set(entry.word, new Map());
        }
        
        const href = `/wiki/${post.slug}`;
        const title = (post.frontmatter.title as string) || post.slug;
        usageMap.get(entry.word)!.set(href, {
          title,
          href,
        });
      }
    }
  }
  
  const finalMap = new Map<string, DictionaryUsage[]>();
  for (const [word, usage] of usageMap.entries()) {
    finalMap.set(word, Array.from(usage.values()));
  }
  
  return finalMap;
}
