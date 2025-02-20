'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function MarketingRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
} 