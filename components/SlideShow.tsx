'use client';

import { useState, useEffect, useRef } from 'react';
import type { ResourcePackItem } from '@/lib/resource-pack-types';
import { ResourceRenderer } from './ResourceRenderer';

interface SlideShowProps {
  items: ResourcePackItem[];
  packName: string;
  onClose: () => void;
}

export function SlideShow({ items, packName, onClose }: SlideShowProps) {
  const [currentIndex, setCurrentIndex] = useState(0); // 0 is title slide, 1 is items[0]
  const [isPlaying, setIsPlaying] = useState(false);
  const [delaySecs, setDelaySecs] = useState(5);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('slideshow-delay');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setDelaySecs(parsed);
      }
    }
  }, []);

  const updateDelay = (newDelay: number) => {
    if (newDelay < 1) newDelay = 1;
    setDelaySecs(newDelay);
    localStorage.setItem('slideshow-delay', newDelay.toString());
  };

  // Reset scroll when slide changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  useEffect(() => {
    if (!isPlaying) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let rafId: number;

    const runSequence = async () => {
      const container = containerRef.current;
      if (!container) return;

      // Wait a short moment to let images/content layout compute height accurately
      await new Promise(r => { timer = setTimeout(r, 150); });
      if (cancelled) return;

      const maxScrollInitial = Math.max(0, container.scrollHeight - container.clientHeight);
      
      const wait = (ms: number) => new Promise(resolve => {
        timer = setTimeout(resolve, ms);
      });

      // We determine if we need to scroll based on the initial height, 
      // but also if height expands during the pause
      if (maxScrollInitial > 0) {
        // Pause at top (half the timer time)
        await wait((delaySecs / 2) * 1000);
        if (cancelled) return;

        // Scroll slowly to bottom (60px per second)
        const speed = 60; 
        let startT = performance.now();
        let startScroll = container.scrollTop;
        
        await new Promise<void>(resolve => {
          const scrollLoop = (now: DOMHighResTimeStamp) => {
            if (cancelled) {
              resolve();
              return;
            }
            const currentMaxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
            const elapsed = (now - startT) / 1000;
            const targetScroll = startScroll + elapsed * speed;
            
            if (targetScroll >= currentMaxScroll) {
              container.scrollTop = currentMaxScroll;
              resolve();
            } else {
              container.scrollTop = targetScroll;
              rafId = requestAnimationFrame(scrollLoop);
            }
          };
          rafId = requestAnimationFrame(scrollLoop);
        });
        if (cancelled) return;

        // Pause at bottom (half the timer time)
        await wait((delaySecs / 2) * 1000);
        if (cancelled) return;
      } else {
        // If it initially fits completely, wait the full timer time.
        // Even if images load during this time, we just treat it as a non-scrolling slide.
        await wait(delaySecs * 1000);
        if (cancelled) return;
      }

      // Advance
      if (currentIndex < items.length) {
        setCurrentIndex(c => c + 1);
      } else {
        setIsPlaying(false);
        setCurrentIndex(0);
      }
    };

    runSequence();

    return () => {
      cancelled = true;
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
    };
  }, [isPlaying, currentIndex, delaySecs, items.length]);

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-slate-900 text-white flex flex-col items-center justify-between" style={{ backdropFilter: 'blur(8px)' }}>
      {/* Top Bar for close */}
      <div className="w-full flex justify-end p-4 z-10 flex-shrink-0">
        <button onClick={onClose} className="p-2 bg-slate-800 text-white rounded-full hover:bg-slate-700 transition" aria-label="Close Slide Show">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Content Area */}
      <div 
        ref={containerRef} 
        className="flex-grow w-full max-w-5xl mx-auto overflow-y-auto overflow-x-hidden p-4 relative"
      >
        <div className="w-full bg-transparent pb-16">
          {currentIndex === 0 ? (
            <div className="flex items-center justify-center h-full min-h-[50vh]">
              <h1 className="text-5xl md:text-7xl font-bold text-green-500 text-center px-4 leading-tight">
                {packName || 'Resource Pack'}
              </h1>
            </div>
          ) : (
            <ResourceRenderer item={items[currentIndex - 1]} />
          )}
        </div>
      </div>

      {/* Control Bar (Tape Player Style) */}
      <div className="w-full bg-slate-800 p-4 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 z-10 flex-shrink-0">
        <div className="flex-1 text-slate-400 text-sm">
          Slide {currentIndex + 1} of {items.length + 1}
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 bg-slate-900 p-2 rounded-lg border border-slate-700">
          {/* Rewind to Start */}
          <button onClick={() => setCurrentIndex(0)} className="p-2 hover:text-green-400 hover:bg-slate-800 rounded transition" title="Rewind to start">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953l7.108-4.062A1.125 1.125 0 0121 8.688v8.123zM11.25 16.811c0 .864-.933 1.405-1.683.977l-7.108-4.062a1.125 1.125 0 010-1.953L9.567 7.71a1.125 1.125 0 011.683.977v8.123z" />
            </svg>
          </button>
          
          {/* Step Back */}
          <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} className="p-2 hover:text-green-400 hover:bg-slate-800 rounded transition" title="Step back">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          
          {/* Stop */}
          <button onClick={() => { setIsPlaying(false); setCurrentIndex(0); }} className="p-2 hover:text-red-400 hover:bg-slate-800 rounded transition" title="Stop">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
          
          {/* Play / Pause */}
          <button 
            onClick={() => setIsPlaying(!isPlaying)} 
            className={`p-3 rounded-full transition ${isPlaying ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-slate-700 text-white hover:bg-slate-600'}`}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 ml-1">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Step Next */}
          <button onClick={() => setCurrentIndex(i => Math.min(items.length, i + 1))} className="p-2 hover:text-green-400 hover:bg-slate-800 rounded transition" title="Next">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          
          {/* Fast Forward to End */}
          <button onClick={() => setCurrentIndex(items.length)} className="p-2 hover:text-green-400 hover:bg-slate-800 rounded transition" title="Fast forward to end">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062A1.125 1.125 0 013 16.81V8.688zM12.75 8.688c0-.864.933-1.405 1.683-.977l7.108 4.062a1.125 1.125 0 010 1.953l-7.108 4.062a1.125 1.125 0 01-1.683-.977V8.688z" />
            </svg>
          </button>
        </div>
        
        {/* Delay Control */}
        <div className="flex-1 flex justify-end">
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-1">
            <span className="text-slate-400 text-xs mr-2 ml-2">Delay (sec)</span>
            <button onClick={() => updateDelay(delaySecs - 1)} className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded" aria-label="Decrease delay">-</button>
            <div className="w-10 text-center font-mono text-white text-sm">{delaySecs}</div>
            <button onClick={() => updateDelay(delaySecs + 1)} className="px-2 py-1 text-slate-300 hover:text-white hover:bg-slate-800 rounded" aria-label="Increase delay">+</button>
          </div>
        </div>
      </div>
    </div>
  );
}
