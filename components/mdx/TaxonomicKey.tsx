import React from 'react';
import { SelectableResource } from '../SelectableResource';

interface TaxonomicKeyProps {
    id: string;
    title: string;
}

const KEY_STEPS = [
    {
        num: 1,
        question: "Does it have legs?",
        options: [
            { text: "Yes", destination: "Go to step 4" },
            { text: "No", destination: "Go to step 2" }
        ]
    },
    {
        num: 2,
        question: "Does it have a shell?",
        options: [
            { text: "Yes", destination: "Snail 🐌" },
            { text: "No", destination: "Go to step 3" }
        ]
    },
    {
        num: 3,
        question: "Is its body divided into many segments?",
        options: [
            { text: "Yes", destination: "Earthworm 🪱" },
            { text: "No", destination: "Slug 🐌(slug)" }
        ]
    },
    {
        num: 4,
        question: "Does it have exactly 6 legs?",
        options: [
            { text: "Yes", destination: "Go to step 5" },
            { text: "No", destination: "Go to step 6" }
        ]
    },
    {
        num: 5,
        question: "Does it have hard wing cases?",
        options: [
            { text: "Yes", destination: "Beetle 🪲" },
            { text: "No", destination: "Other Insect 🦟" }
        ]
    },
    {
        num: 6,
        question: "Does it have exactly 8 legs?",
        options: [
            { text: "Yes", destination: "Spider 🕷️" },
            { text: "No", destination: "Go to step 7" }
        ]
    },
    {
        num: 7,
        question: "Does it have a flat body with one pair of legs per segment?",
        options: [
            { text: "Yes", destination: "Centipede 🐛" },
            { text: "No", destination: "Millipede 🐛" }
        ]
    }
];

const RESULTS = [
    { name: "Snail", emoji: "🐌", desc: "A soft-bodied creature that carries its coiled home on its back!" },
    { name: "Slug", emoji: "🐌(slug)", desc: "Like a snail, but without a shell!" },
    { name: "Earthworm", emoji: "🪱", desc: "A segmented worm that helps aerate the soil." },
    { name: "Beetle", emoji: "🪲", desc: "An insect with hard protective wing cases (elytra)." },
    { name: "Other Insect", emoji: "🦟", desc: "Could be a fly, bee, wasp, or butterfly!" },
    { name: "Spider", emoji: "🕷️", desc: "An arachnid that spins webs to catch its prey." },
    { name: "Centipede", emoji: "🐛", desc: "A fast-moving predator with a flat body." },
    { name: "Millipede", emoji: "🐛", desc: "A slower moving detritivore with a round body and two pairs of legs per segment." },
];

export const TaxonomicKey: React.FC<TaxonomicKeyProps> = ({ id, title }) => {
    return (
        <SelectableResource
            resourceId={id}
            type="TaxonomicKey"
            title={title}
            data={{}}
        >
            <div className="bg-white border-2 border-emerald-200 rounded-xl overflow-hidden shadow-sm my-6">
                <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-200 flex justify-between items-center no-print">
                    <div>
                        <h3 className="font-bold text-emerald-900 flex items-center gap-2">
                            <span className="text-xl">🔍</span> {title}
                        </h3>
                    </div>
                </div>
                
                <div className="p-6 sm:p-8 bg-white">
                    <div className="mb-6 border-b-2 border-slate-200 pb-3">
                        <h4 className="text-xl font-black text-slate-800 uppercase tracking-wide">Dichotomous Key</h4>
                        <p className="text-sm text-slate-500 mt-1">Follow the numbered steps to identify the minibeast you found!</p>
                    </div>

                    <div className="space-y-2 mb-8">
                        {KEY_STEPS.map((step) => (
                            <div key={step.num} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg gap-2 sm:gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0 w-6 h-6 text-sm bg-emerald-600 text-white font-bold rounded-full flex items-center justify-center">
                                        {step.num}
                                    </div>
                                    <div className="font-bold text-slate-800">{step.question}</div>
                                </div>
                                <div className="flex gap-2 sm:gap-4 items-center text-sm ml-9 sm:ml-0">
                                    {step.options.map((opt, i) => (
                                        <div key={i} className="flex items-center whitespace-nowrap">
                                            <span className="font-semibold text-slate-600 mr-1.5">{opt.text}:</span>
                                            <span className="font-bold text-emerald-700">{opt.destination}</span>
                                            {i === 0 && <span className="text-slate-300 mx-3 hidden sm:inline">|</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h4 className="text-lg font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Identification Guide</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {RESULTS.map((res) => (
                                <div key={res.name} className="border border-slate-200 rounded-lg p-3 text-center bg-white shadow-sm flex flex-col items-center">
                                    <div className="text-3xl mb-1">{res.emoji}</div>
                                    <div className="font-bold text-slate-800 text-sm mb-1">{res.name}</div>
                                    <div className="text-[11px] text-slate-500 leading-tight">{res.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SelectableResource>
    );
};
