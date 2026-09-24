'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import type { ResourcePackItem, ResourceType } from '@/lib/resource-pack-types';
import { dictionaryMarkdownComponents } from '@/components/DictionaryWrapper';
import { FieldNotebookTemplate } from '@/components/mdx/FieldNotebookTemplate';
import { TaxonomicKey } from '@/components/mdx/TaxonomicKey';
import { ExternalResource } from '@/components/mdx/ExternalResource';

interface ResourceRendererProps {
  item: ResourcePackItem;
}

interface RendererFnProps {
  item: ResourcePackItem;
  sourceTag: React.ReactNode;
}

const RENDERERS: Record<ResourceType, React.FC<RendererFnProps>> = {
  Creature: ({ item, sourceTag }) => (
    <div className="my-6 rounded-2xl shadow-lg border border-amber-100 bg-white overflow-hidden">
      {item.data.childrenHtml && (
        <div
          className="print-creature-content"
          dangerouslySetInnerHTML={{ __html: item.data.childrenHtml }}
        />
      )}
      <div className="p-4 border-t border-amber-50 bg-amber-50/30">
        {sourceTag}
      </div>
    </div>
  ),

  NatureExample: ({ item, sourceTag }) => (
    <div className="my-6 rounded-2xl shadow-lg border border-green-100 bg-white overflow-hidden">
      {item.data.childrenHtml && (
        <div
          className="print-nature-example-content"
          dangerouslySetInnerHTML={{ __html: item.data.childrenHtml }}
        />
      )}
      <div className="p-4 border-t border-green-50 bg-green-50/30">
        {sourceTag}
      </div>
    </div>
  ),

  Activity: ({ item, sourceTag }) => (
    <div className="my-6 p-6 bg-white border border-indigo-100 rounded-xl shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-gray-800 m-0">{item.title}</h3>
      </div>
      <div className="text-gray-600 prose prose-indigo max-w-none">
        <ReactMarkdown components={dictionaryMarkdownComponents}>{item.data.description || ''}</ReactMarkdown>
      </div>
      {sourceTag}
    </div>
  ),

  InteractiveActivity: ({ item, sourceTag }) => (
    <div className="my-6 p-6 bg-white border border-teal-100 rounded-xl shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <h3 className="text-xl font-bold text-teal-800 m-0">{item.title}</h3>
      </div>
      <div className="text-teal-600 prose prose-teal max-w-none">
        <ReactMarkdown components={dictionaryMarkdownComponents}>{item.data.description || ''}</ReactMarkdown>
      </div>
      {sourceTag}
    </div>
  ),

  Reflection: ({ item, sourceTag }) => (
    <div className="my-6 p-6 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-purple-900 m-0">{item.title}</h3>
      </div>
      <div className="text-purple-800 italic leading-relaxed prose prose-purple max-w-none">
        <ReactMarkdown components={dictionaryMarkdownComponents}>{item.data.description || ''}</ReactMarkdown>
      </div>
      {sourceTag}
    </div>
  ),

  Requirement: ({ item, sourceTag }) => (
    <div className="my-6 p-5 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg shadow-sm">
      <h4 className="text-blue-800 font-bold mb-2 uppercase text-xs tracking-wider">Curriculum Requirement</h4>
      <div className="text-blue-900 font-medium text-lg leading-relaxed prose prose-blue max-w-none">
        {item.data.text && <ReactMarkdown components={dictionaryMarkdownComponents}>{item.data.text}</ReactMarkdown>}
        {item.data.childrenHtml && (
          <div dangerouslySetInnerHTML={{ __html: item.data.childrenHtml }} />
        )}
      </div>
      {sourceTag}
    </div>
  ),

  Note: ({ item, sourceTag }) => (
    <div className="bg-slate-50 border-l-4 border-slate-400 p-4 my-4 text-slate-900 prose prose-slate max-w-none">
      <strong>Note:</strong>
      {item.data.text && <div className="inline-block ml-1"><ReactMarkdown components={dictionaryMarkdownComponents}>{item.data.text}</ReactMarkdown></div>}
      {item.data.childrenHtml && (
        <div dangerouslySetInnerHTML={{ __html: item.data.childrenHtml }} />
      )}
      {sourceTag}
    </div>
  ),

  Guidance: ({ item, sourceTag }) => (
    <div className="bg-gray-100 border-l-4 border-gray-500 p-4 my-4 text-gray-800 text-sm prose prose-gray max-w-none">
      <strong>Guidance:</strong>
      {item.data.text && <div className="mt-2"><ReactMarkdown components={dictionaryMarkdownComponents}>{item.data.text}</ReactMarkdown></div>}
      {item.data.childrenHtml && (
        <div dangerouslySetInnerHTML={{ __html: item.data.childrenHtml }} />
      )}
      {sourceTag}
    </div>
  ),

  Handout: ({ item, sourceTag }) => (
    <div className="my-6 rounded-xl overflow-hidden shadow-lg border border-amber-100 bg-white">
      {item.data.imageSrc ? (
        <img
          src={item.data.imageSrc}
          alt={item.title}
          className="w-full h-auto"
        />
      ) : item.data.childrenHtml ? (
        <div dangerouslySetInnerHTML={{ __html: item.data.childrenHtml }} />
      ) : null}
      {sourceTag}
    </div>
  ),

  Habitat: ({ item, sourceTag }) => (
    <div className="my-6 rounded-2xl shadow-lg border border-teal-100 bg-white overflow-hidden">
      {item.data.childrenHtml && (
        <div
          className="print-habitat-content"
          dangerouslySetInnerHTML={{ __html: item.data.childrenHtml }}
        />
      )}
      <div className="p-4 border-t border-teal-50 bg-teal-50/30">
        {sourceTag}
      </div>
    </div>
  ),

  Biomimicry: ({ item, sourceTag }) => (
    <div className="my-6 rounded-2xl shadow-lg border border-lime-100 bg-white overflow-hidden">
      {item.data.childrenHtml && (
        <div
          className="print-biomimicry-content"
          dangerouslySetInnerHTML={{ __html: item.data.childrenHtml }}
        />
      )}
      <div className="p-4 border-t border-lime-50 bg-lime-50/30">
        {sourceTag}
      </div>
    </div>
  ),

  ButWhy: ({ item, sourceTag }) => (
    <div className="my-6 rounded-2xl shadow-lg border border-rose-100 bg-white overflow-hidden">
      {item.data.childrenHtml && (
        <div
          className="print-butwhy-content"
          dangerouslySetInnerHTML={{ __html: item.data.childrenHtml }}
        />
      )}
      <div className="p-4 border-t border-rose-50 bg-rose-50/30">
        {sourceTag}
      </div>
    </div>
  ),

  FieldNotebookTemplate: ({ item }) => (
    <FieldNotebookTemplate id={item.shortId} title={item.title} />
  ),

  TaxonomicKey: ({ item }) => (
    <TaxonomicKey id={item.shortId} title={item.title} />
  ),

  ExternalResource: ({ item }) => (
    <ExternalResource id={item.shortId} title={item.title} url={item.data.url || ''} description={item.data.description || item.data.text} />
  ),
};

export function ResourceRenderer({ item }: ResourceRendererProps) {
  const sourceTag = (
    <p className="text-xs text-slate-400 mt-2">From: {item.sourcePageTitle}</p>
  );

  const Renderer = RENDERERS[item.type];

  if (!Renderer) {
    // Fallback for any unmapped or legacy types (should be caught by TS, but safe for runtime)
    return (
      <div className="my-6 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 m-0 mb-3">{item.title}</h3>
        {item.data.childrenHtml && (
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: item.data.childrenHtml }}
          />
        )}
        {sourceTag}
      </div>
    );
  }

  return <Renderer item={item} sourceTag={sourceTag} />;
}
