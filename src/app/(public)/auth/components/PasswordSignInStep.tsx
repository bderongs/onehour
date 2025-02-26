'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';
import { useNotification } from '@/contexts/NotificationContext';

interface SignInFormProps {
    email: string;
    onSuccess: () => void;
    onBack: () => void;
    className?: string;
}

export function PasswordSignInStep({ 
    email,
    onSuccess,
    onBack,
    className = "" 
}: SignInFormProps) {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { showNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        try {
            const supabase = createBrowserClient();
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            onSuccess();
        } catch (error: any) {
            showNotification('error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form 
            onSubmit={handleSubmit} 
            className={`space-y-6 ${className}`}
            method="POST"
            action="#"
        >
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Votre mot de passe"
                />
            </div>

            <div className="flex flex-col gap-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <div className="h-5 w-5 border-t-2 border-white border-solid rounded-full animate-spin"></div>
                            <span>Connexion en cours...</span>
                        </>
                    ) : (
                        <>
                            Se connecter
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                <button
                    type="button"
                    onClick={onBack}
                    className="text-sm text-gray-600 hover:text-gray-900"
                >
                    Retour
                </button>
            </div>
        </form>
    );
} 