import React, { ReactNode } from 'react';
import { getDictionaryMap, generateDictionaryRegex, DictionaryEntry } from '@/lib/dictionary';
import { DictionaryTooltip } from './DictionaryTooltip';

let dictionaryRegexCache: RegExp | null = null;
let dictionaryMapCache: Map<string, DictionaryEntry> | null = null;

const parseTextForDictionary = (text: string): ReactNode[] | string => {
  if (!dictionaryRegexCache) {
    dictionaryRegexCache = generateDictionaryRegex();
  }
  if (!dictionaryMapCache) {
    dictionaryMapCache = getDictionaryMap();
  }

  const parts = text.split(dictionaryRegexCache);
  
  if (parts.length === 1) return text; 

  return parts.map((part, index) => {
    if (index % 2 === 0) {
      return part ? <React.Fragment key={index}>{part}</React.Fragment> : null;
    }
    
    const entry = dictionaryMapCache!.get(part.toLowerCase());
    if (entry) {
      return <DictionaryTooltip key={index} word={part} entry={entry} />;
    }
    
    return <React.Fragment key={index}>{part}</React.Fragment>;
  }).filter(Boolean);
};

export function wrapWithDictionaryNodes(node: ReactNode): ReactNode {
  if (typeof node === 'string') {
    return parseTextForDictionary(node);
  }

  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <React.Fragment key={i}>{wrapWithDictionaryNodes(child)}</React.Fragment>
    ));
  }

  if (React.isValidElement(node)) {
    if (typeof node.type === 'string' && ['code', 'pre', 'a'].includes(node.type)) {
      return node;
    }

    const element = node as React.ReactElement;
    const props = element.props as any;
    if (props && props.children) {
      const parsedChildren = wrapWithDictionaryNodes(props.children);
      return React.cloneElement(element, { ...props, children: parsedChildren });
    }
  }

  return node;
}

export function DictionaryParserProvider({ children }: { children: ReactNode }) {
  return <>{wrapWithDictionaryNodes(children)}</>;
}

export const dictionaryMarkdownComponents = {
  p: ({ children }: any) => <p><DictionaryParserProvider>{children}</DictionaryParserProvider></p>,
  li: ({ children }: any) => <li><DictionaryParserProvider>{children}</DictionaryParserProvider></li>,
};
