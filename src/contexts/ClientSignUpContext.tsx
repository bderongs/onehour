"use client";

import React, { createContext, useContext, useState } from 'react';

interface ClientSignUpContextType {
    sparkUrlSlug: string | null;
    setSparkUrlSlug: (slug: string | null) => void;
    clearSignUpData: () => void;
}

const ClientSignUpContext = createContext<ClientSignUpContextType | undefined>(undefined);

export function ClientSignUpProvider({ children }: { children: React.ReactNode }) {
    // Initialize from localStorage if available
    const [sparkUrlSlug, setSparkUrlSlugState] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('sparkSignUpUrlSlug');
            return stored ? stored : null;
        }
        return null;
    });

    const setSparkUrlSlug = (slug: string | null) => {
        setSparkUrlSlugState(slug);
        if (typeof window !== 'undefined') {
            if (slug) {
                localStorage.setItem('sparkSignUpUrlSlug', slug);
            } else {
                localStorage.removeItem('sparkSignUpUrlSlug');
            }
        }
    };

    const clearSignUpData = () => {
        setSparkUrlSlugState(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('sparkSignUpUrlSlug');
        }
    };

    return (
        <ClientSignUpContext.Provider value={{ sparkUrlSlug, setSparkUrlSlug, clearSignUpData }}>
            {children}
        </ClientSignUpContext.Provider>
    );
}

export function useClientSignUp() {
    const context = useContext(ClientSignUpContext);
    if (context === undefined) {
        throw new Error('useClientSignUp must be used within a ClientSignUpProvider');
    }
    return context;
} 