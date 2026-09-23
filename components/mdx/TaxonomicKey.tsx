'use client';

import React, { useState } from 'react';
import { SelectableResource } from '../SelectableResource';

interface TaxonomicKeyProps {
    id: string;
    title: string;
}

type NodeId = string;

interface KeyNode {
    question?: string;
    yesNode?: NodeId;
    noNode?: NodeId;
    resultTitle?: string;
    resultEmoji?: string;
    resultDesc?: string;
}

const INVERTEBRATE_KEY: Record<NodeId, KeyNode> = {
    start: {
        question: "Does it have legs?",
        yesNode: "has_legs",
        noNode: "no_legs"
    },
    no_legs: {
        question: "Does it have a shell?",
        yesNode: "shell",
        noNode: "no_shell"
    },
    shell: {
        resultTitle: "Snail",
        resultEmoji: "🐌",
        resultDesc: "A soft-bodied creature that carries its coiled home on its back!"
    },
    no_shell: {
        question: "Is its body divided into many segments?",
        yesNode: "worm",
        noNode: "slug"
    },
    worm: {
        resultTitle: "Earthworm",
        resultEmoji: "🪱",
        resultDesc: "A segmented worm that helps aerate the soil."
    },
    slug: {
        resultTitle: "Slug",
        resultEmoji: "🐌(slug)",
        resultDesc: "Like a snail, but without a shell!"
    },
    has_legs: {
        question: "Does it have exactly 6 legs?",
        yesNode: "six_legs",
        noNode: "more_legs"
    },
    six_legs: {
        question: "Does it have hard wing cases?",
        yesNode: "beetle",
        noNode: "bug_or_fly"
    },
    beetle: {
        resultTitle: "Beetle",
        resultEmoji: "🪲",
        resultDesc: "An insect with hard protective wing cases (elytra)."
    },
    bug_or_fly: {
        resultTitle: "Other Insect",
        resultEmoji: "🦟",
        resultDesc: "Could be a fly, bee, wasp, or butterfly!"
    },
    more_legs: {
        question: "Does it have exactly 8 legs?",
        yesNode: "spider",
        noNode: "many_legs"
    },
    spider: {
        resultTitle: "Spider",
        resultEmoji: "🕷️",
        resultDesc: "An arachnid that spins webs to catch its prey."
    },
    many_legs: {
        question: "Does it have a flat body with one pair of legs per segment?",
        yesNode: "centipede",
        noNode: "millipede"
    },
    centipede: {
        resultTitle: "Centipede",
        resultEmoji: "🐛",
        resultDesc: "A fast-moving predator with a flat body."
    },
    millipede: {
        resultTitle: "Millipede",
        resultEmoji: "🐛",
        resultDesc: "A slower moving detritivore with a round body and two pairs of legs per segment."
    }
};

export const TaxonomicKey: React.FC<TaxonomicKeyProps> = ({ id, title }) => {
    const [currentNode, setCurrentNode] = useState<NodeId>('start');
    const [history, setHistory] = useState<NodeId[]>([]);
    
    const node = INVERTEBRATE_KEY[currentNode];

    const handleAnswer = (nextNode: NodeId) => {
        setHistory([...history, currentNode]);
        setCurrentNode(nextNode);
    };

    const handleBack = () => {
        if (history.length > 0) {
            const prev = history[history.length - 1];
            setHistory(history.slice(0, -1));
            setCurrentNode(prev);
        }
    };

    const handleReset = () => {
        setHistory([]);
        setCurrentNode('start');
    };

    return (
        <SelectableResource
            resourceId={id}
            type="TaxonomicKey"
            title={title}
            data={{}}
        >
            <div className="bg-white border-2 border-green-200 rounded-xl overflow-hidden shadow-sm my-6">
                <div className="bg-green-50 px-6 py-4 border-b border-green-200 flex justify-between items-center">
                    <h3 className="font-bold text-green-900 flex items-center gap-2">
                        <span className="text-xl">🔍</span> {title}
                    </h3>
                    {history.length > 0 && (
                        <button onClick={handleReset} className="text-xs text-green-700 hover:text-green-900 font-semibold underline print:hidden">
                            Start Over
                        </button>
                    )}
                </div>
                
                <div className="p-8 text-center min-h-[300px] flex flex-col justify-center items-center print:hidden">
                    {node.question ? (
                        <div className="max-w-md w-full">
                            <h4 className="text-2xl font-bold text-slate-800 mb-8">{node.question}</h4>
                            <div className="flex gap-4 justify-center">
                                <button 
                                    onClick={() => handleAnswer(node.yesNode!)}
                                    className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-sm transition-transform active:scale-95"
                                >
                                    Yes
                                </button>
                                <button 
                                    onClick={() => handleAnswer(node.noNode!)}
                                    className="px-8 py-3 bg-slate-600 hover:bg-slate-700 text-white font-bold rounded-lg shadow-sm transition-transform active:scale-95"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-md w-full bg-yellow-50 p-8 rounded-2xl border border-yellow-200 animate-in fade-in zoom-in duration-300">
                            <div className="text-6xl mb-4">{node.resultEmoji}</div>
                            <h4 className="text-3xl font-bold text-slate-800 mb-3">{node.resultTitle}</h4>
                            <p className="text-slate-600 text-lg">{node.resultDesc}</p>
                        </div>
                    )}
                </div>
                
                {/* Print-only static fallback */}
                <div className="hidden print:block p-8 border-t border-green-200 bg-white">
                    <h4 className="text-xl font-bold mb-4 text-green-900">How to use this key outdoors:</h4>
                    <p className="mb-4 text-sm text-slate-700">Answer the questions below to identify what you found!</p>
                    <div className="space-y-4">
                        {Object.entries(INVERTEBRATE_KEY).filter(([_, n]) => n.question).map(([id, n]) => (
                            <div key={id} className="p-3 bg-slate-50 border border-slate-200 rounded">
                                <p className="font-bold text-slate-800">{n.question}</p>
                                <div className="ml-4 mt-2 text-sm text-slate-600">
                                    <p>&#8226; If YES: Go to <strong>{n.yesNode}</strong></p>
                                    <p>&#8226; If NO: Go to <strong>{n.noNode}</strong></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {history.length > 0 && (
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-start print:hidden">
                        <button onClick={handleBack} className="text-sm text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1">
                            <span aria-hidden="true">&larr;</span> Go Back
                        </button>
                    </div>
                )}
            </div>
        </SelectableResource>
    );
};
