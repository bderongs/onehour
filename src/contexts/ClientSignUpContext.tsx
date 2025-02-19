import React, { createContext, useContext, useState } from 'react';
import { browserStorage } from '../utils/storage';

type ClientSignUpContextType = {
    sparkUrlSlug: string | null;
    setSparkUrlSlug: (slug: string | null) => void;
    clearSignUpData: () => void;
};

const ClientSignUpContext = createContext<ClientSignUpContextType | undefined>(undefined);

const STORAGE_KEY = 'sparkSignUpUrlSlug';

export function ClientSignUpProvider({ children }: { children: React.ReactNode }) {
    // Initialize from storage if available
    const [sparkUrlSlug, setSparkUrlSlugState] = useState<string | null>(() => {
        return browserStorage.get(STORAGE_KEY);
    });

    const setSparkUrlSlug = (slug: string | null) => {
        setSparkUrlSlugState(slug);
        if (slug) {
            browserStorage.set(STORAGE_KEY, slug);
        } else {
            browserStorage.remove(STORAGE_KEY);
        }
    };

    const clearSignUpData = () => {
        setSparkUrlSlugState(null);
        browserStorage.remove(STORAGE_KEY);
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