import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, CheckCircle, XCircle, Loader2, MessageSquare, ArrowRight } from 'lucide-react';
import { getClientRequestById, updateClientRequestMessage } from '../services/clientRequests';
import { getSparkById } from '../services/sparks';
import type { ClientRequest } from '../services/clientRequests';
import type { Spark } from '../types/spark';
import { formatDuration, formatPrice } from '../utils/format';
import logger from '../utils/logger';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const statusConfig = {
    pending: {
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        icon: Loader2,
        label: 'En attente',
        description: 'Votre demande est en cours de traitement par le consultant'
    },
    accepted: {
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: CheckCircle,
        label: 'Acceptée',
        description: 'Le consultant a accepté votre demande'
    },
    rejected: {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        icon: XCircle,
        label: 'Refusée',
        description: 'Le consultant a refusé votre demande'
    },
    completed: {
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: CheckCircle,
        label: 'Terminée',
        description: 'La mission est terminée'
    }
};

export function ClientRequestPage() {
    const { requestId } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState<ClientRequest | null>(null);
    const [spark, setSpark] = useState<Spark | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState(request?.message || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchRequestAndSpark = async () => {
            if (!requestId) {
                logger.info('No requestId provided, redirecting to dashboard');
                navigate('/client/dashboard');
                return;
            }

            try {
                logger.info('Fetching client request', { requestId });
                const requestData = await getClientRequestById(requestId);
                if (!requestData) {
                    logger.error('Request not found', { requestId });
                    setError('Demande introuvable');
                    setLoading(false);
                    return;
                }
                logger.info('Client request found', { requestData });
                setRequest(requestData);

                // Fetch associated spark
                logger.info('Fetching associated spark', { sparkId: requestData.sparkId });
                const sparkData = await getSparkById(requestData.sparkId);
                if (!sparkData) {
                    logger.error('Associated spark not found', { sparkId: requestData.sparkId });
                    setError('Spark associé introuvable');
                    setLoading(false);
                    return;
                }
                logger.info('Associated spark found', { sparkData });
                setSpark(sparkData);

                setLoading(false);
            } catch (err) {
                logger.error('Error in fetchRequestAndSpark:', err);
                setError('Une erreur est survenue lors du chargement des détails');
                setLoading(false);
            }
        };

        fetchRequestAndSpark();
    }, [requestId, navigate]);

    const handleSubmitContext = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!request) return;

        setIsSubmitting(true);
        try {
            const updatedRequest = await updateClientRequestMessage(request.id, message);
            if (updatedRequest) {
                setRequest(updatedRequest);
                // TODO: Redirect to booking page when ready
                // navigate(`/client/booking/${request.id}`);
            }
        } catch (err) {
            logger.error('Error updating request message:', err);
            // TODO: Show error notification
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des détails de la demande...</p>
                </div>
            </div>
        );
    }

    if (error || !request || !spark) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error || 'Demande introuvable'}</p>
                    <button
                        onClick={() => navigate('/client/dashboard')}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                        Retour au tableau de bord
                    </button>
                </div>
            </div>
        );
    }

    const status = statusConfig[request.status];

    const renderContextForm = () => (
        <motion.section
            className="bg-white rounded-xl shadow-md p-6"
            variants={fadeInUp}
        >
            <h2 className="text-xl font-semibold mb-4">Contexte de votre demande</h2>
            <form onSubmit={handleSubmitContext} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Décrivez votre besoin
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Expliquez votre contexte et vos attentes pour cette mission..."
                    />
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 
                                transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Enregistrement...' : 'Continuer vers la réservation'}
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </form>
        </motion.section>
    );

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/client/dashboard')}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                </div>

                {/* Status Card */}
                <motion.div
                    className="bg-white rounded-2xl shadow-lg p-6 mb-8"
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                Demande de mission
                            </h1>
                            <p className="text-gray-600">
                                Créée le {new Date(request.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${status.bgColor} ${status.color}`}>
                            <status.icon className="h-5 w-5" />
                            <span className="font-medium">{status.label}</span>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Left Column - Spark Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.section
                            className="bg-white rounded-xl shadow-md p-6"
                            variants={fadeInUp}
                        >
                            <h2 className="text-xl font-semibold mb-4">{spark.title}</h2>
                            <p className="text-gray-600 mb-4">{spark.description}</p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="h-5 w-5" />
                                    <span>{formatDuration(spark.duration)}</span>
                                </div>
                                <div className="text-xl font-bold text-gray-900">
                                    {formatPrice(spark.price)}
                                </div>
                            </div>
                        </motion.section>

                        {/* Context Form or Message Display */}
                        {!request.message ? renderContextForm() : (
                            <motion.section
                                className="bg-white rounded-xl shadow-md p-6"
                                variants={fadeInUp}
                            >
                                <h2 className="text-xl font-semibold mb-4">Votre message</h2>
                                <div className="flex items-start gap-3">
                                    <MessageSquare className="h-5 w-5 text-gray-400 mt-1" />
                                    <p className="text-gray-600">{request.message}</p>
                                </div>
                            </motion.section>
                        )}
                    </div>

                    {/* Right Column - Status and Actions */}
                    <div className="space-y-6">
                        <motion.section
                            className={`border rounded-xl p-6 ${status.borderColor} ${status.bgColor}`}
                            variants={fadeInUp}
                        >
                            <h2 className="text-xl font-semibold mb-4">État de la demande</h2>
                            <div className="flex items-start gap-3">
                                <status.icon className={`h-5 w-5 ${status.color}`} />
                                <div>
                                    <p className={`font-medium ${status.color}`}>{status.label}</p>
                                    <p className="text-gray-600 mt-1">{status.description}</p>
                                </div>
                            </div>
                        </motion.section>

                        {/* Next Steps based on status */}
                        <motion.section
                            className="bg-white rounded-xl shadow-md p-6"
                            variants={fadeInUp}
                        >
                            <h2 className="text-xl font-semibold mb-4">Prochaines étapes</h2>
                            {request.status === 'pending' && (
                                <p className="text-gray-600">
                                    Le consultant va examiner votre demande et vous répondra dans les plus brefs délais.
                                </p>
                            )}
                            {request.status === 'accepted' && (
                                <p className="text-gray-600">
                                    Le consultant a accepté votre demande. Vous allez recevoir un email avec les prochaines étapes.
                                </p>
                            )}
                            {request.status === 'rejected' && (
                                <p className="text-gray-600">
                                    Le consultant n'a malheureusement pas pu accepter votre demande. N'hésitez pas à explorer d'autres Sparks.
                                </p>
                            )}
                            {request.status === 'completed' && (
                                <p className="text-gray-600">
                                    La mission est terminée. Merci de votre confiance !
                                </p>
                            )}
                        </motion.section>
                    </div>
                </div>
            </div>
        </div>
    );
} 