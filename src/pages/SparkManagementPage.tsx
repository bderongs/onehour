import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { getSparks } from '../services/sparks';
import type { Spark } from '../types/spark';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

export function SparkManagementPage() {
    const navigate = useNavigate();
    const [sparks, setSparks] = useState<Spark[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSparks = async () => {
            try {
                const fetchedSparks = await getSparks();
                // TODO: Filter sparks by consultant ID once authentication is implemented
                setSparks(fetchedSparks);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching sparks:', err);
                setError('Failed to load sparks. Please try again later.');
                setLoading(false);
            }
        };

        fetchSparks();
    }, []);

    const handleCreateSpark = () => {
        navigate('/sparks/create');
    };

    const handleEditSpark = (sparkUrl: string) => {
        navigate(`/sparks/edit/${sparkUrl}`);
    };

    const handlePreviewSpark = (sparkUrl: string) => {
        navigate(`/sparks/${sparkUrl}`);
    };

    const handleDeleteSpark = async (sparkUrl: string) => {
        // TODO: Implement delete functionality
        if (window.confirm('Are you sure you want to delete this spark?')) {
            console.log('Delete spark:', sparkUrl);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading sparks...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mes Sparks</h1>
                    <button
                        onClick={handleCreateSpark}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 
                                transition-colors flex items-center gap-2"
                    >
                        <Plus className="h-5 w-5" />
                        Créer un Spark
                    </button>
                </div>

                {/* Sparks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sparks.map((spark) => (
                        <motion.div
                            key={spark.url}
                            className="bg-white rounded-xl shadow-md p-6"
                            variants={fadeInUp}
                            initial="initial"
                            animate="animate"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{spark.title}</h2>
                                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                                        <span>{spark.duration}</span>
                                        <span>{spark.price}</span>
                                    </div>
                                </div>
                                {spark.highlight && (
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {spark.highlight}
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-gray-600 mb-6 line-clamp-2">{spark.description}</p>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handlePreviewSpark(spark.url)}
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                    title="Preview"
                                >
                                    <Eye className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleEditSpark(spark.url)}
                                    className="text-gray-600 hover:text-gray-900 transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => handleDeleteSpark(spark.url)}
                                    className="text-red-600 hover:text-red-700 transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
} 