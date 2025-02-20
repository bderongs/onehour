"use client";

import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ClientSignUpProvider } from '@/contexts/ClientSignUpContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <NotificationProvider>
        <AuthProvider>
          <ClientSignUpProvider>
            {children}
          </ClientSignUpProvider>
        </AuthProvider>
      </NotificationProvider>
    </HelmetProvider>
  );
} 