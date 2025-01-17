import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SparkForm } from '../components/SparkForm';
import { getSparkByUrl, updateSpark } from '../services/sparks';
import type { Spark } from '../types/spark';

export function SparkEditPage() {
    const navigate = useNavigate();
    const { sparkUrl } = useParams();
    const [spark, setSpark] = useState<Spark | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSpark = async () => {
            if (!sparkUrl) {
                navigate('/sparks/manage');
                return;
            }

            try {
                const fetchedSpark = await getSparkByUrl(sparkUrl);
                if (!fetchedSpark) {
                    navigate('/sparks/manage');
                    return;
                }
                setSpark(fetchedSpark);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching spark:', err);
                setError('Failed to load spark. Please try again later.');
                setLoading(false);
            }
        };

        fetchSpark();
    }, [sparkUrl, navigate]);

    const handleSubmit = async (data: Spark) => {
        try {
            if (!sparkUrl) return;
            await updateSpark(sparkUrl, data);
            navigate('/sparks/manage');
        } catch (error) {
            console.error('Error updating spark:', error);
            setError('Failed to update spark. Please try again later.');
        }
    };

    const handleCancel = () => {
        navigate('/sparks/manage');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading spark...</p>
                </div>
            </div>
        );
    }

    if (error || !spark) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error || 'Spark not found'}</p>
                    <button
                        onClick={() => navigate('/sparks/manage')}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                        Return to sparks
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Modifier le Spark</h1>
                    <SparkForm
                        initialData={spark}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </motion.div>
            </div>
        </div>
    );
} 