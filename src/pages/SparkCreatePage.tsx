import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparkForm } from '../components/SparkForm';
import { createSpark } from '../services/sparks';
import type { Spark } from '../types/spark';
import { useAuth } from '../contexts/AuthContext';

export function SparkCreatePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: Spark) => {
        try {
            await createSpark({
                ...data,
                consultant: user?.roles?.includes('admin') ? null : (user?.id ?? null)
            });
            navigate('/sparks/manage');
        } catch (error) {
            console.error('Error creating spark:', error);
            setError('Impossible de créer le spark. Veuillez réessayer plus tard.');
        }
    };

    const handleCancel = () => {
        navigate('/sparks/manage');
    };

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Créer un nouveau Spark</h1>
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-red-600">{error}</p>
                        </div>
                    )}
                    <SparkForm onSubmit={handleSubmit} onCancel={handleCancel} />
                </motion.div>
            </div>
        </div>
    );
} 