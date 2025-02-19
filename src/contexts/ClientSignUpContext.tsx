import React, { createContext, useContext, useState } from 'react';

interface ClientSignUpContextType {
    sparkUrlSlug: string | null;
    setSparkUrlSlug: (slug: string | null) => void;
    clearSignUpData: () => void;
}

const ClientSignUpContext = createContext<ClientSignUpContextType | undefined>(undefined);

const isBrowserEnvironment = typeof window !== 'undefined';

const getStoredValue = (key: string): string | null => {
    if (!isBrowserEnvironment) return null;
    return localStorage.getItem(key);
};

const setStoredValue = (key: string, value: string | null) => {
    if (!isBrowserEnvironment) return;
    if (value) {
        localStorage.setItem(key, value);
    } else {
        localStorage.removeItem(key);
    }
};

export function ClientSignUpProvider({ children }: { children: React.ReactNode }) {
    // Initialize from localStorage if available
    const [sparkUrlSlug, setSparkUrlSlugState] = useState<string | null>(() => {
        return getStoredValue('sparkSignUpUrlSlug');
    });

    const setSparkUrlSlug = (slug: string | null) => {
        setSparkUrlSlugState(slug);
        setStoredValue('sparkSignUpUrlSlug', slug);
    };

    const clearSignUpData = () => {
        setSparkUrlSlugState(null);
        setStoredValue('sparkSignUpUrlSlug', null);
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