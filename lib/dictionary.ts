import dictionaryData from '@/content/dictionary.json';
import { useMemo } from 'react';

export interface DictionaryEntry {
  word: string;
  definition: string;
  aliases?: string[];
  pages?: { title: string, href: string }[];
}

export const getDictionary = (): DictionaryEntry[] => {
  return dictionaryData as DictionaryEntry[];
};

/**
 * Returns a mapping of all possible terms (including aliases)
 * to their respective DictionaryEntry.
 */
export function generateWordVariants(word: string): string[] {
  const variants = new Set<string>();
  variants.add(word);

  variants.add(word + 's');
  variants.add(word + 'es');
  variants.add(word + 'ly');
  variants.add(word + 'ed');
  variants.add(word + 'ing');

  if (word.endsWith('e')) {
    const root = word.slice(0, -1);
    variants.add(root + 'ed');
    variants.add(root + 'ing');
    variants.add(root + 'ation');
    variants.add(root + 'ations');
    variants.add(root + 'ator');
    variants.add(root + 'ators');
  } else {
    variants.add(word + 'ation');
    variants.add(word + 'ations');
    variants.add(word + 'ator');
    variants.add(word + 'ators');
  }

  if (word.endsWith('y')) {
    const root = word.slice(0, -1);
    variants.add(root + 'ies');
    variants.add(root + 'ied');
  }

  return Array.from(variants);
}

export const getDictionaryMap = (): Map<string, DictionaryEntry> => {
  const map = new Map<string, DictionaryEntry>();
  for (const entry of getDictionary()) {
    const variants = generateWordVariants(entry.word.toLowerCase());
    for (const v of variants) {
      map.set(v, entry);
    }
    if (entry.aliases) {
      for (const alias of entry.aliases) {
        const aliasVariants = generateWordVariants(alias.toLowerCase());
        for (const av of aliasVariants) {
          map.set(av, entry);
        }
      }
    }
  }
  return map;
};

// Simple sort logic to arrange entries alphabetically A-Z
export const getSortedDictionary = (): DictionaryEntry[] => {
  return [...getDictionary()].sort((a, b) => a.word.localeCompare(b.word));
};

export const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const generateDictionaryRegex = (): RegExp => {
  const terms = new Set<string>();
  getDictionary().forEach((entry) => {
    generateWordVariants(entry.word).forEach(v => terms.add(v));
    if (entry.aliases) {
      entry.aliases.forEach(alias => {
        generateWordVariants(alias).forEach(v => terms.add(v));
      });
    }
  });

  const termsArray = Array.from(terms);
  termsArray.sort((a, b) => b.length - a.length);

  const escapedTerms = termsArray.map(escapeRegExp);
  const pattern = `\\b(${escapedTerms.join('|')})\\b`;
  return new RegExp(pattern, 'gi');
};
