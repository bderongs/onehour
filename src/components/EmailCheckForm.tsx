import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { checkEmailExists } from '../services/auth';
import { Notification } from './Notification';

interface EmailCheckFormProps {
    onEmailExists: (email: string) => void;
    onEmailNotExists: (email: string) => void;
    className?: string;
}

export function EmailCheckForm({ 
    onEmailExists, 
    onEmailNotExists,
    className = "" 
}: EmailCheckFormProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const exists = await checkEmailExists(email);
            if (exists) {
                onEmailExists(email);
            } else {
                onEmailNotExists(email);
            }
        } catch (error) {
            console.error('Error checking email:', error);
            setNotification({
                type: 'error',
                message: 'Une erreur est survenue. Veuillez réessayer.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
            <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email professionnel
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="vous@entreprise.com"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Vérification...' : 'Continuer'}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>
            </form>
        </>
    );
} 
