import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, Sparkles } from 'lucide-react';
import type { Spark } from '../types/spark';
import { formatDuration, formatPrice } from '../utils/format';
import { supabase } from '../lib/supabase';
import { getSparks, getSparksByConsultant, deleteSpark } from '../services/sparks';
import { Notification } from '../components/Notification';
import { ConfirmDialog } from '../components/ConfirmDialog';

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
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; sparkUrl: string | null }>({
        isOpen: false,
        sparkUrl: null
    });

    useEffect(() => {
        const fetchUserAndSparks = async () => {
            try {
                // Get current user and their role
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/signin');
                    return;
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (!profile) {
                    throw new Error('Profile not found');
                }

                // Only allow consultants and admins to access this page
                if (profile.role !== 'consultant' && profile.role !== 'admin') {
                    navigate('/');
                    return;
                }

                // Fetch sparks based on role
                const fetchedSparks = profile.role === 'consultant' 
                    ? await getSparksByConsultant(user.id)
                    : await getSparks();

                setSparks(fetchedSparks);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Impossible de charger les Sparks. Veuillez réessayer plus tard.');
                setLoading(false);
            }
        };

        fetchUserAndSparks();
    }, [navigate]);

    const handleCreateSpark = () => {
        navigate('/sparks/ai-create');
    };

    const handleEditSpark = (sparkUrl: string) => {
        navigate(`/sparks/edit/${sparkUrl}`);
    };

    const handleAIEditSpark = (sparkUrl: string) => {
        navigate(`/sparks/ai-edit/${sparkUrl}`);
    };

    const handlePreviewSpark = (sparkUrl: string) => {
        navigate(`/sparks/${sparkUrl}`);
    };

    const handleDeleteSpark = async (sparkUrl: string) => {
        setDeleteConfirm({ isOpen: true, sparkUrl });
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirm.sparkUrl) return;
        
        try {
            await deleteSpark(deleteConfirm.sparkUrl);
            setSparks(sparks.filter(spark => spark.url !== deleteConfirm.sparkUrl));
            setNotification({ type: 'success', message: 'Le Spark a été supprimé avec succès' });
        } catch (error) {
            console.error('Error deleting spark:', error);
            setNotification({ type: 'error', message: 'Échec de la suppression du Spark. Veuillez réessayer.' });
        } finally {
            setDeleteConfirm({ isOpen: false, sparkUrl: null });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des Sparks...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">Impossible de charger les Sparks. Veuillez réessayer plus tard.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                title="Supprimer le Spark"
                message="Êtes-vous sûr de vouloir supprimer ce spark ? Cette action est irréversible."
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirm({ isOpen: false, sparkUrl: null })}
                variant="danger"
            />
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mes Sparks</h1>
                </div>

                {/* Sparks Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Create New Spark Card */}
                    <motion.div
                        onClick={handleCreateSpark}
                        className="bg-white rounded-xl shadow-md p-6 cursor-pointer border-2 border-dashed border-blue-300 hover:border-blue-500 transition-colors flex flex-col items-center justify-center min-h-[250px]"
                        variants={fadeInUp}
                        initial="initial"
                        animate="animate"
                    >
                        <Plus className="h-12 w-12 text-blue-500 mb-4" />
                        <h2 className="text-xl font-semibold text-blue-600">Créer un Spark</h2>
                        <p className="text-gray-500 text-sm text-center mt-2">Cliquez pour créer un nouveau Spark</p>
                    </motion.div>

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
                                        <span>{formatDuration(spark.duration)}</span>
                                        <span>{formatPrice(spark.price)}</span>
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
                                    onClick={() => handleAIEditSpark(spark.url)}
                                    className="text-blue-600 hover:text-blue-700 transition-colors"
                                    title="AI Edit"
                                >
                                    <Sparkles className="h-5 w-5" />
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