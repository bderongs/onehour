import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, ChevronDown, ChevronUp, Trash2, Building, Clock } from 'lucide-react';
import type { ClientProfile } from '../services/clients';
import { getAllClients, deleteClient } from '../services/clients';
import { Notification } from '../components/Notification';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

const EmptyState = () => (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            <Users className="h-20 w-20 text-blue-500" />
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Aucun client</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Il n'y a actuellement aucun client inscrit sur la plateforme.
        </p>
    </div>
);

const ClientRow = ({ 
    client, 
    isExpanded,
    onToggle,
    onDelete
}: { 
    client: ClientProfile;
    isExpanded: boolean;
    onToggle: () => void;
    onDelete: () => void;
}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        const success = await deleteClient(client.id);
        setIsDeleting(false);
        if (success) {
            onDelete();
        }
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div 
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-4"
                    onClick={onToggle}
                >
                    <div className="flex-1 grid grid-cols-3 gap-4 items-center">
                        {/* Nom */}
                        <div className="flex items-center gap-2">
                            <h3 className="text-base font-medium text-gray-900">
                                {client.first_name} {client.last_name}
                            </h3>
                        </div>

                        {/* Entreprise */}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Building className="h-4 w-4" />
                            <span>{client.company || 'Non spécifié'}</span>
                        </div>

                        {/* Date d'inscription */}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>Inscrit le {new Date(client.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(true);
                            }}
                            disabled={isDeleting}
                            className={`${
                                isDeleting 
                                    ? 'opacity-50 cursor-wait' 
                                    : 'hover:bg-red-50'
                            } p-1.5 rounded-full transition-colors group`}
                            title="Supprimer"
                        >
                            <Trash2 className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                        </button>
                        {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                            <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                    </div>
                </div>
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-gray-100"
                        >
                            <div className="p-4 bg-gray-50">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Informations</h4>
                                        <dl className="space-y-2">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Email</dt>
                                                <dd className="text-sm text-gray-900 flex items-center gap-1">
                                                    <Mail className="h-4 w-4" />
                                                    {client.email}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Entreprise</dt>
                                                <dd className="text-sm text-gray-900">{client.company || 'Non spécifié'}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">Date d'inscription</dt>
                                                <dd className="text-sm text-gray-900">{new Date(client.created_at).toLocaleDateString()}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <ConfirmDialog
                isOpen={showDeleteConfirm}
                title="Supprimer le client"
                message={`Êtes-vous sûr de vouloir supprimer le client ${client.first_name} ${client.last_name} ? Cette action supprimera définitivement toutes les données associées et est irréversible.`}
                confirmLabel={isDeleting ? "Suppression..." : "Supprimer définitivement"}
                cancelLabel="Annuler"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteConfirm(false)}
                variant="danger"
            />
        </>
    );
};

export function AdminClientsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [clients, setClients] = useState<ClientProfile[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [showAllClients, setShowAllClients] = useState(false);

    const fetchClients = async (includeSparkierEmails: boolean) => {
        try {
            const clientsData = await getAllClients(includeSparkierEmails);
            setClients(clientsData);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError('Impossible de charger les clients. Veuillez réessayer plus tard.');
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkUserAndFetchClients = async () => {
            try {
                if (!user) {
                    navigate('/signin');
                    return;
                }

                if (!user.roles?.includes('admin')) {
                    navigate('/');
                    return;
                }

                // Fetch clients
                await fetchClients(showAllClients);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Impossible de charger les clients. Veuillez réessayer plus tard.');
                setLoading(false);
            }
        };

        checkUserAndFetchClients();
    }, [navigate, showAllClients, user]);

    const toggleShowAll = async () => {
        setLoading(true);
        setShowAllClients(!showAllClients);
    };

    const toggleExpand = (clientId: string) => {
        setExpandedId(expandedId === clientId ? null : clientId);
    };

    const handleClientDelete = () => {
        setNotification({
            type: 'success',
            message: 'Le client a été supprimé avec succès'
        });
        fetchClients(showAllClients);
    };

    if (loading) {
        return <LoadingSpinner message="Chargement des clients..." />;
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
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestion des clients</h1>
                        <p className="text-gray-600 mt-2">Gérez les clients de la plateforme</p>
                    </div>
                    <button
                        onClick={toggleShowAll}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {showAllClients ? 'Masquer les emails @sparkier.io' : 'Afficher tous les clients'}
                    </button>
                </div>

                {clients.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-2">
                        {clients
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map((client) => (
                            <ClientRow
                                key={client.id}
                                client={client}
                                isExpanded={expandedId === client.id}
                                onToggle={() => toggleExpand(client.id)}
                                onDelete={handleClientDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 