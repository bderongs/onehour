import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNotification } from '../contexts/NotificationContext';

interface SignInFormProps {
    email: string;
    onSuccess: () => void;
    onBack: () => void;
    className?: string;
}

export function SignInForm({ 
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
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                throw error;
            }

            onSuccess();
        } catch (error) {
            console.error('Error signing in:', error);
            showNotification('error', 'Email ou mot de passe incorrect.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                </label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Votre mot de passe"
                />
            </div>

            <div className="flex flex-col gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Connexion...' : 'Se connecter'}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                    type="button"
                    onClick={onBack}
                    className="text-gray-600 hover:text-gray-800 text-sm"
                >
                    Utiliser une autre adresse email
                </button>
            </div>
        </form>
    );
} 