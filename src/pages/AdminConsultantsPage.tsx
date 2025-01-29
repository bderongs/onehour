import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Mail, ExternalLink, ChevronDown, ChevronUp, Linkedin } from 'lucide-react';
import type { ConsultantProfile } from '../types/consultant';
import { supabase } from '../lib/supabase';
import { getAllConsultants } from '../services/consultants';
import { Notification } from '../components/Notification';

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
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Aucun consultant</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            Il n'y a actuellement aucun consultant inscrit sur la plateforme.
        </p>
    </div>
);

const ConsultantRow = ({ 
    consultant, 
    isExpanded,
    onToggle
}: { 
    consultant: ConsultantProfile;
    isExpanded: boolean;
    onToggle: () => void;
}) => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div 
            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-4"
            onClick={onToggle}
        >
            <div className="flex-1 grid grid-cols-4 gap-4 items-center">
                {/* Nom et badges */}
                <div className="flex items-center gap-2">
                    <h3 className="text-base font-medium text-gray-900">
                        {consultant.first_name} {consultant.last_name}
                    </h3>
                </div>

                {/* Date d'inscription */}
                <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>Inscrit le {new Date(consultant.created_at).toLocaleDateString()}</span>
                </div>

                {/* Rôle admin */}
                <div className="flex items-center gap-2">
                    {consultant.roles?.includes('admin') && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Admin
                        </span>
                    )}
                </div>

                {/* LinkedIn */}
                <div className="flex items-center justify-end">
                    {consultant.linkedin && (
                        <a 
                            href={consultant.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Linkedin className="h-4 w-4" />
                            <span className="text-sm">LinkedIn</span>
                        </a>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 ml-4">
                <a
                    href={`/consultants/${consultant.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ExternalLink className="h-5 w-5" />
                </a>
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
                                            {consultant.email}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Titre</dt>
                                        <dd className="text-sm text-gray-900">{consultant.title || 'Non défini'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Rôles</dt>
                                        <dd className="text-sm text-gray-900">{consultant.roles.join(', ')}</dd>
                                    </div>
                                </dl>
                            </div>
                            {consultant.key_competencies && consultant.key_competencies.length > 0 && (
                                <div>
                                    <h4 className="font-medium text-gray-900 mb-2">Spécialités</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {consultant.key_competencies.map((specialty, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {specialty}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

export function AdminConsultantsPage() {
    const navigate = useNavigate();
    const [consultants, setConsultants] = useState<ConsultantProfile[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [showAllConsultants, setShowAllConsultants] = useState(false);

    const fetchConsultants = async (includeSparkierEmails: boolean) => {
        try {
            const consultantsData = await getAllConsultants(includeSparkierEmails);
            setConsultants(consultantsData);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching consultants:', err);
            setError('Impossible de charger les consultants. Veuillez réessayer plus tard.');
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkUserAndFetchConsultants = async () => {
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

                // Fetch consultants
                await fetchConsultants(showAllConsultants);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Impossible de charger les consultants. Veuillez réessayer plus tard.');
                setLoading(false);
            }
        };

        checkUserAndFetchConsultants();
    }, [navigate, showAllConsultants]);

    const toggleShowAll = async () => {
        setLoading(true);
        setShowAllConsultants(!showAllConsultants);
    };

    const toggleExpand = (consultantId: string) => {
        setExpandedId(expandedId === consultantId ? null : consultantId);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des consultants...</p>
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
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestion des consultants</h1>
                        <p className="text-gray-600 mt-2">Gérez les consultants de la plateforme</p>
                    </div>
                    <button
                        onClick={toggleShowAll}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {showAllConsultants ? 'Masquer les emails @sparkier.io' : 'Afficher tous les consultants'}
                    </button>
                </div>

                {consultants.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="space-y-2">
                        {consultants.map((consultant) => (
                            <ConsultantRow
                                key={consultant.id}
                                consultant={consultant}
                                isExpanded={expandedId === consultant.id}
                                onToggle={() => toggleExpand(consultant.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 