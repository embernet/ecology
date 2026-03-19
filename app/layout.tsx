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

export const metadata: Metadata = {
  title: 'Ecology Curriculum',
  description: 'An Ecology Resource Wiki for primary school teachers',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800">
        <PageNavigationProvider>
        <ResourcePackProvider>
          <Suspense fallback={null}>
            <ResourcePackUrlLoader />
          </Suspense>
          <header className="bg-primary text-white shadow-md sticky top-0 z-[60]">
            <div className="container mx-auto px-4">
              <div className="flex items-center header-bar">
                <HeaderNav />
                <Link href="/" className="header-title-link">
                  <h1 className="text-2xl font-bold bg-clip-text">🌱 Ecology Curriculum</h1>
                </Link>
              </div>
              <div className="search-bar-row">
                <SidebarToggleButton />
                <SearchBar />
                <ResourcePackToggleButton />
              </div>
            </div>
          </header>
          <div className="layout-with-sidebar">
            <Sidebar />
            <main className="main-content bg-white shadow-sm mt-4 rounded-lg">
              <MainContent>{children}</MainContent>
            </main>
            <ResourcePackPanel />
          </div>
          <footer className="text-center py-8 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Ecology Curriculum - Open Educational Resource</p>
          </footer>
        </ResourcePackProvider>
        </PageNavigationProvider>
      </body>
    </html>
  );
}
