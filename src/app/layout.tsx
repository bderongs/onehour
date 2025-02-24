import './globals.css';
import { Metadata } from 'next';
import { Providers } from '@/components/Providers';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Sparkier',
  description: 'Plateforme de mise en relation entre consultants et clients',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Suspense fallback={<LoadingSpinner />}>
              {children}
            </Suspense>
          </div>
        </Providers>
      </body>
    </html>
  );
} 