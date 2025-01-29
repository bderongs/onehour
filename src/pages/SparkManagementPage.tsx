import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, Sparkles, Rocket } from 'lucide-react';
import type { Spark } from '../types/spark';
import { formatDuration, formatPrice } from '../utils/format';
import { supabase } from '../lib/supabase';
import { getSparks, getSparksByConsultant, deleteSpark } from '../services/sparks';
import { Notification } from '../components/Notification';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { DashboardSparksGrid } from '../components/DashboardSparksGrid';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

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
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Lancez votre premier Spark !</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Créez votre premier Spark en quelques minutes grâce à notre assistant IA.
            Partagez votre expertise et développez une nouvelle source de revenus avec des appels optimisés et semi-automatisés.
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
                Créer mon premier Spark
            </button>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <Sparkles className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Création rapide avec l'assistant IA</h3>
                <p className="text-gray-600">Notre assistant vous guide pour créer un Spark professionnel en quelques minutes</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <Eye className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Attirez des clients</h3>
                <p className="text-gray-600">Augmentez votre visibilité et trouvez de nouveaux clients qualifiés</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <Rocket className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Optimisez vos revenus</h3>
                <p className="text-gray-600">Maximisez l'impact de vos appels grâce à un processus semi-automatisé</p>
            </div>
        </div>
    </div>
);

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
                    .select('roles')
                    .eq('id', user.id)
                    .single();

                if (!profile) {
                    throw new Error('Profile not found');
                }

                // Only allow consultants and admins to access this page
                if (!profile.roles.includes('consultant') && !profile.roles.includes('admin')) {
                    navigate('/');
                    return;
                }

                // Fetch sparks based on roles
                const fetchedSparks = profile.roles.includes('admin')
                    ? await getSparks()
                    : await getSparksByConsultant(user.id);

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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Mes Sparks</h1>
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