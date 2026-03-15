import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { ResourcePackProvider } from '@/contexts/ResourcePackContext';
import { ResourcePackPanel } from '@/components/ResourcePackPanel';
import { ResourcePackUrlLoader } from '@/components/ResourcePackUrlLoader';
import { MainContent } from '@/components/MainContent';

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
        <ResourcePackProvider>
          <Suspense fallback={null}>
            <ResourcePackUrlLoader />
          </Suspense>
          <header className="bg-primary text-white py-4 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <Link href="/">
                <h1 className="text-2xl font-bold bg-clip-text">🌱 Ecology Curriculum</h1>
              </Link>
              <nav className="space-x-4">
                <Link href="/" className="hover:underline font-medium">Home</Link>
                <Link href="/wiki/science" className="hover:underline font-medium">Science</Link>
                <Link href="/wiki/geography" className="hover:underline font-medium">Geography</Link>
                <Link href="/wiki/teaching-principles-used-to-create-the-learning-resources" className="hover:underline font-medium">About</Link>
              </nav>
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
      </body>
    </html>
  );
}
