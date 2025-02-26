'use client';

import { Footer } from '@/components/Footer';
import { Header } from './components/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-grow pt-16">
        <ProtectedRoute>{children}</ProtectedRoute>
      </main>
      <Footer />
    </>
  );
} 