'use client';

import ReactMarkdown from 'react-markdown';
import type { ResourcePackItem } from '@/lib/resource-pack-types';

interface ResourceRendererProps {
  item: ResourcePackItem;
}

export function ResourceRenderer({ item }: ResourceRendererProps) {
  const { data } = item;

  const sourceTag = (
    <p className="text-xs text-slate-400 mt-2">From: {item.sourcePageTitle}</p>
  );

  switch (data.type) {
    case 'NatureExample':
      return (
        <div className="my-6 rounded-xl overflow-hidden shadow-lg border border-green-100 bg-white">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 flex items-start gap-4 border-b border-green-100">
            {data.emoji && (
              <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center text-4xl bg-white rounded-full shadow-sm border border-green-100">
                {data.emoji}
              </div>
            )}
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-green-800 m-0">{item.title}</h3>
              {data.childrenHtml && (
                <div
                  className="mt-4 prose prose-green max-w-none"
                  dangerouslySetInnerHTML={{ __html: data.childrenHtml }}
                />
              )}
            </div>
          </div>
          {data.facts && (
            <div className="bg-yellow-50 p-6 border-t border-yellow-100">
              <h4 className="flex items-center gap-2 text-lg font-bold text-yellow-800 mb-3 uppercase tracking-wide">
                Fun Facts
              </h4>
              <div className="prose prose-yellow max-w-none text-slate-700">
                <ReactMarkdown>{data.facts}</ReactMarkdown>
              </div>
            </div>
          )}
          {sourceTag}
        </div>
      );

    case 'Activity':
      return (
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
            <ReactMarkdown>{data.description || ''}</ReactMarkdown>
          </div>
          {sourceTag}
        </div>
      );

    case 'Reflection':
      return (
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
            <ReactMarkdown>{data.description || ''}</ReactMarkdown>
          </div>
          {sourceTag}
        </div>
      );

    case 'Requirement':
      return (
        <div className="my-6 p-5 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg shadow-sm">
          <h4 className="text-blue-800 font-bold mb-2 uppercase text-xs tracking-wider">Curriculum Requirement</h4>
          <div className="text-blue-900 font-medium text-lg leading-relaxed prose prose-blue max-w-none">
            {data.text && <ReactMarkdown>{data.text}</ReactMarkdown>}
            {data.childrenHtml && (
              <div dangerouslySetInnerHTML={{ __html: data.childrenHtml }} />
            )}
          </div>
          {sourceTag}
        </div>
      );

    case 'Note':
      return (
        <div className="bg-slate-50 border-l-4 border-slate-400 p-4 my-4 text-slate-900 prose prose-slate max-w-none">
          <strong>Note:</strong>
          {data.text && <div className="inline-block ml-1"><ReactMarkdown>{data.text}</ReactMarkdown></div>}
          {data.childrenHtml && (
            <div dangerouslySetInnerHTML={{ __html: data.childrenHtml }} />
          )}
          {sourceTag}
        </div>
      );

    case 'Guidance':
      return (
        <div className="bg-gray-100 border-l-4 border-gray-500 p-4 my-4 text-gray-800 text-sm prose prose-gray max-w-none">
          <strong>Guidance:</strong>
          {data.text && <div className="mt-2"><ReactMarkdown>{data.text}</ReactMarkdown></div>}
          {data.childrenHtml && (
            <div dangerouslySetInnerHTML={{ __html: data.childrenHtml }} />
          )}
          {sourceTag}
        </div>
      );

    case 'Handout':
      return (
        <div className="my-6 rounded-xl overflow-hidden shadow-lg border border-amber-100 bg-white">
          {data.imageSrc ? (
            <img
              src={data.imageSrc}
              alt={item.title}
              className="w-full h-auto"
            />
          ) : data.childrenHtml ? (
            <div dangerouslySetInnerHTML={{ __html: data.childrenHtml }} />
          ) : null}
          {sourceTag}
        </div>
      );

    default:
      return null;
  }
}
