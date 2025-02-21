"use client";

import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ClientSignUpProvider } from '@/contexts/ClientSignUpContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ClientSignUpProvider>
          {children}
        </ClientSignUpProvider>
      </AuthProvider>
    </NotificationProvider>
  );
} 