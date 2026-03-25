'use client';

import { useEffect } from 'react';

export function ServiceWorker() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    // updateViaCache: 'none' means the browser always fetches sw.js fresh from
    // the network (ignoring HTTP cache), so it picks up your updates immediately
    navigator.serviceWorker
      .register('/sw.js', { updateViaCache: 'none' })
      .then(registration => {
        // Check for updates on every page load
        registration.update();

        // Also check for updates every 60 seconds while the tab is open
        const interval = setInterval(() => registration.update(), 60_000);
        return () => clearInterval(interval);
      })
      .catch(() => {
        // SW registration failure is non-fatal; the site still works normally
      });
  }, []);

  return null;
}
