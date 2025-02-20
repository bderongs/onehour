'use client';

import { Footer } from '@/components/Footer';
import { DashboardHeader } from '@/components/DashboardHeader';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardHeader />
      <main className="flex-grow pt-16">
        <ProtectedRoute>{children}</ProtectedRoute>
      </main>
      <Footer />
    </>
  );
} 