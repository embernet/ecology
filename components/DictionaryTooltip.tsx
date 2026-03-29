'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { DictionaryEntry } from '@/lib/dictionary';

interface DictionaryTooltipProps {
  word: string;
  entry: DictionaryEntry;
}

export function DictionaryTooltip({ word, entry }: DictionaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const [arrowStyle, setArrowStyle] = useState<React.CSSProperties>({});
  
  const anchorRef = useRef<HTMLSpanElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setPopoverStyle({});
      return;
    }

    const positionPopover = () => {
      if (anchorRef.current && popoverRef.current) {
        const anchorRect = anchorRef.current.getBoundingClientRect();
        
        // We temporarily display the popover invisibly to get its dimensions if it's 0
        const popoverWidth = popoverRef.current.offsetWidth || 256; // 64 * 4px = 256px
        const popoverHeight = popoverRef.current.offsetHeight || 100;
        
        let left = anchorRect.left + anchorRect.width / 2 - popoverWidth / 2;
        let top = anchorRect.top - popoverHeight - 8;

        const margin = 16;
        if (left < margin) {
          left = margin;
        } else if (left + popoverWidth > window.innerWidth - margin) {
          left = window.innerWidth - margin - popoverWidth;
        }

        const arrowLeft = anchorRect.left + anchorRect.width / 2 - left;
        
        setPopoverStyle({
          position: 'fixed',
          left: `${left}px`,
          top: `${top}px`,
          zIndex: 100000,
        });
        setArrowStyle({
          left: `${arrowLeft}px`
        });
      }
    };

    positionPopover();

    const handleScroll = () => {
      setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    window.addEventListener('resize', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      window.removeEventListener('resize', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <span className="relative inline-block dictionary-word-anchor">
      <span
        ref={anchorRef}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="text-emerald-700 underline decoration-emerald-300 decoration-dotted underline-offset-2 cursor-pointer hover:bg-emerald-50 transition-colors"
        title="Click for definition"
      >
        {word}
      </span>
      {isOpen && (
        <span
          ref={popoverRef}
          className="w-64 p-3 bg-white border border-emerald-200 rounded-lg shadow-2xl text-sm leading-tight animate-fade-in"
          style={{ ...popoverStyle, cursor: 'default' }}
        >
          <span className="block font-bold text-emerald-800 mb-1 capitalize border-b border-emerald-100 pb-1">
            {entry.word}
          </span>
          <span className="block text-gray-700 text-left whitespace-normal font-normal">
            {entry.definition}
          </span>
          <span 
            className="absolute top-full -translate-x-1/2 -mt-px w-3 h-3 bg-white border-b border-r border-emerald-200 rotate-45 shadow-sm"
            style={arrowStyle}
          ></span>
        </span>
      )}
    </span>
  );
}
