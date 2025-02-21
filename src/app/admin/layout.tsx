'use client';

import { Footer } from '@/components/Footer';
import { DashboardHeader } from '@/components/DashboardHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardHeader />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </>
  );
} 