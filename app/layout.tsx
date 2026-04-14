import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Link from 'next/link';
import { Sidebar, SidebarToggleButton } from '@/components/Sidebar';
import { HeaderNav } from '@/components/HeaderNav';
import { ResourcePackProvider } from '@/contexts/ResourcePackContext';
import { PageNavigationProvider } from '@/contexts/PageNavigationContext';
import { ResourcePackPanel, ResourcePackToggleButton } from '@/components/ResourcePackPanel';
import { ResourcePackUrlLoader } from '@/components/ResourcePackUrlLoader';
import { MainContent } from '@/components/MainContent';
import { SearchBar } from '@/components/SearchBar';
import { ServiceWorker } from '@/components/ServiceWorker';

export const metadata: Metadata = {
  title: 'Ecology Curriculum',
  description: 'An Ecology Resource Wiki for primary school teachers',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Ecology Curriculum',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 h-screen overflow-hidden flex flex-col">
        <ServiceWorker />
        <PageNavigationProvider>
        <ResourcePackProvider>
          <Suspense fallback={null}>
            <ResourcePackUrlLoader />
          </Suspense>
          <header className="bg-primary text-white shadow-md z-[60] flex-shrink-0">
            <div className="container mx-auto px-4">
              <div className="flex items-center header-bar">
                <HeaderNav />
                <Link href="/" className="header-title-link flex items-center gap-2 sm:gap-3 overflow-hidden">
                  <h1 className="font-bold bg-clip-text whitespace-nowrap truncate" style={{ fontSize: 'clamp(1.2rem, 4.5vw, 1.5rem)' }}>
                    🌱 Ecology Curriculum
                  </h1>
                  <span 
                    className="text-[10px] sm:text-sm leading-tight font-extrabold -rotate-3 bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 text-transparent bg-clip-text flex-shrink-0 w-16 sm:w-auto text-center" 
                    style={{ filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.3))' }}
                  >
                    Not just for kids!
                  </span>
                </Link>
              </div>
              <div className="search-bar-row">
                <SidebarToggleButton />
                <SearchBar />
                <ResourcePackToggleButton />
              </div>
            </div>
          </header>
          <div className="layout-with-sidebar flex-1 overflow-hidden min-h-0 pb-4">
            <Sidebar />
            <main className="main-content flex-1 flex flex-col bg-white shadow-sm mt-4 rounded-lg overflow-hidden">
              <MainContent>{children}</MainContent>
            </main>
            <ResourcePackPanel />
          </div>
          <footer className="layout-footer text-center py-8 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Ecology Curriculum - Open Educational Resource</p>
          </footer>
        </ResourcePackProvider>
        </PageNavigationProvider>
      </body>
    </html>
  );
}
