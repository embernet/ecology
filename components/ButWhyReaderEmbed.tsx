'use client';

import { useEffect, useRef } from 'react';

// Minimal shape of the global the vanilla reader attaches to window.
interface ButWhyReaderGlobal {
  load: (el: HTMLElement, url: string) => Promise<{ destroy: () => void }>;
}
declare global {
  interface Window {
    ButWhyReader?: ButWhyReaderGlobal;
  }
}

const SCRIPT_SRC = '/but-why/but-why-reader.js';
const STYLE_HREF = '/but-why/but-why-reader.css';

let scriptPromise: Promise<void> | null = null;

function ensureReaderScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.ButWhyReader) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load but-why-reader.js'));
    document.body.appendChild(s);
  });
  return scriptPromise;
}

function ensureReaderStyles() {
  if (typeof document === 'undefined') return;
  if (document.querySelector(`link[href="${STYLE_HREF}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  document.head.appendChild(link);
}

/**
 * Mounts the framework-free "But Why?" reader (teams/ecology/apps/but-why-reader)
 * for a single conversation. The reader owns its container and is torn down on
 * unmount, so it coexists cleanly with React.
 */
export function ButWhyReaderEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let instance: { destroy: () => void } | null = null;
    let cancelled = false;

    ensureReaderStyles();
    ensureReaderScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.ButWhyReader) return;
        return window.ButWhyReader.load(containerRef.current, url);
      })
      .then((inst) => {
        if (cancelled) {
          inst?.destroy();
        } else if (inst) {
          instance = inst;
        }
      })
      .catch((err) => {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML =
            '<p style="color:#b91c1c">Sorry — this conversation could not be loaded.</p>';
        }
        // eslint-disable-next-line no-console
        console.error(err);
      });

    return () => {
      cancelled = true;
      if (instance) instance.destroy();
    };
  }, [url]);

  return <div ref={containerRef} />;
}
