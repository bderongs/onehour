import React, { createContext, useContext, useState } from 'react';

interface ClientSignUpContextType {
    sparkId: string | null;
    setSparkId: (id: string | null) => void;
    clearSignUpData: () => void;
}

const ClientSignUpContext = createContext<ClientSignUpContextType | undefined>(undefined);

export function ClientSignUpProvider({ children }: { children: React.ReactNode }) {
    const [sparkId, setSparkId] = useState<string | null>(null);

    const clearSignUpData = () => {
        setSparkId(null);
    };

    return (
        <ClientSignUpContext.Provider value={{ sparkId, setSparkId, clearSignUpData }}>
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