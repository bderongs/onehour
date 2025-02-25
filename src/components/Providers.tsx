"use client";

import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ClientSignUpProvider } from '@/contexts/ClientSignUpContext';
import { PageTypeProvider } from '@/contexts/PageTypeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ClientSignUpProvider>
          <PageTypeProvider>
            {children}
          </PageTypeProvider>
        </ClientSignUpProvider>
      </AuthProvider>
    </NotificationProvider>
  );
} 