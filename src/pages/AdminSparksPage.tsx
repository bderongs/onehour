import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Rocket } from 'lucide-react';
import type { Spark } from '../types/spark';
import { supabase } from '../lib/supabase';
import { getSparks, deleteSpark } from '../services/sparks';
import { Notification } from '../components/Notification';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DashboardSparksGrid } from '../components/DashboardSparksGrid';

const EmptyState = ({ onCreateSpark }: { onCreateSpark: () => void }) => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <Rocket className="h-20 w-20 text-blue-500" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Aucun Spark disponible</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Il n'y a actuellement aucun Spark dans la base de données.
            Vous pouvez en créer un nouveau ou attendre que les consultants en créent.
        </p>
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <button
                onClick={onCreateSpark}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg flex items-center gap-2 transition-colors"
            >
                <Plus className="h-6 w-6" />
                Créer un Spark
            </button>
        </motion.div>
    </div>
);

export function AdminSparksPage() {
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
                // Get current user and verify admin role
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    navigate('/signin');
                    return;
                }

                const { data: profile } = await supabase
                    .from('profiles')
                    .select('roles')
                    .eq('id', user.id)
                    .single();

                if (!profile || !profile.roles.includes('admin')) {
                    navigate('/');
                    return;
                }

                // Fetch all sparks for admin
                const fetchedSparks = await getSparks();
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
                    <p className="text-red-600">{error}</p>
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des Sparks</h1>
                    <p className="text-gray-600 mt-2">Gérez tous les Sparks de la plateforme</p>
                </div>

                {sparks.length === 0 ? (
                    <EmptyState onCreateSpark={handleCreateSpark} />
                ) : (
                    <DashboardSparksGrid
                        sparks={sparks}
                        onCreateSpark={handleCreateSpark}
                        onPreviewSpark={handlePreviewSpark}
                        onEditSpark={handleEditSpark}
                        onAIEditSpark={handleAIEditSpark}
                        onDeleteSpark={handleDeleteSpark}
                    />
                )}
            </div>
        </div>
    );
} 