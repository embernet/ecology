'use client';

import React from 'react';
import { SelectableResource } from '../SelectableResource';

interface FieldNotebookTemplateProps {
    id: string;
    title: string;
}

export const FieldNotebookTemplate: React.FC<FieldNotebookTemplateProps> = ({ id, title }) => {
    return (
        <SelectableResource
            resourceId={id}
            type="FieldNotebookTemplate"
            title={title}
            data={{}}
        >
            <div className="bg-white border-2 border-amber-200 rounded-xl overflow-hidden shadow-sm my-6">
                <div className="bg-amber-50 px-6 py-4 border-b border-amber-200 flex justify-between items-center no-print">
                    <div>
                        <h3 className="font-bold text-amber-900 flex items-center gap-2">
                            <span className="text-xl">📓</span> {title}
                        </h3>
                    </div>
                </div>
                
                {/* The actual printable area */}
                <div className="p-8 bg-white min-h-[500px]">
                    <div className="border-b-2 border-slate-300 pb-4 mb-6 flex justify-between">
                        <div className="text-xl font-bold text-slate-800 uppercase tracking-wider">Field Record</div>
                        <div className="flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 font-bold uppercase">Date</span>
                                <div className="border-b border-slate-300 w-32 h-6"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-slate-500 font-bold uppercase">Time</span>
                                <div className="border-b border-slate-300 w-24 h-6"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <span className="text-xs text-slate-500 font-bold uppercase">Observer (Who)</span>
                            <div className="border-b border-slate-300 w-full h-8"></div>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 font-bold uppercase">Location (Where)</span>
                            <div className="border-b border-slate-300 w-full h-8"></div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <span className="text-xs text-slate-500 font-bold uppercase block mb-2">Species Found (What)</span>
                        <div className="border border-slate-300 rounded-lg h-12 w-full"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div>
                            <span className="text-xs text-slate-500 font-bold uppercase block mb-2">Sketch or Rubbing</span>
                            <div className="border border-slate-300 rounded-lg h-64 w-full bg-white"></div>
                            <div className="text-center text-slate-400 text-sm mt-2 font-medium">Draw here</div>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 font-bold uppercase block mb-2">Notes & Observations</span>
                            <div className="flex flex-col gap-8 mt-4">
                                <div className="border-b border-slate-300 w-full h-1"></div>
                                <div className="border-b border-slate-300 w-full h-1"></div>
                                <div className="border-b border-slate-300 w-full h-1"></div>
                                <div className="border-b border-slate-300 w-full h-1"></div>
                                <div className="border-b border-slate-300 w-full h-1"></div>
                                <div className="border-b border-slate-300 w-full h-1"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-end border-t-2 border-slate-300 pt-4 mt-12">
                        <div className="flex-1"></div>
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-500 font-bold uppercase">Weather</span>
                            <div className="border-b border-slate-300 w-48 h-6"></div>
                        </div>
                    </div>
                </div>
            </div>
        </SelectableResource>
    );
};
