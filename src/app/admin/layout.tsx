'use client';

import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

export default function AdminLayout({
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