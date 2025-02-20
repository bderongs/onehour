'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, ArrowLeft, CheckCircle, XCircle, Loader2, MessageSquare, ArrowRight } from 'lucide-react';
import { getClientRequestById, updateClientRequestMessage } from '@/services/clientRequests';
import { getSparkById } from '@/services/sparks';
import type { ClientRequest } from '@/services/clientRequests';
import type { Spark } from '@/types/spark';
import { formatDuration, formatPrice } from '@/utils/format';
import logger from '@/utils/logger';
import { LoadingSpinner } from '@/components/LoadingSpinner';

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

export default function ClientRequestPage() {
    const router = useRouter();
    const params = useParams();
    const requestId = params.requestId as string;
    const [request, setRequest] = useState<ClientRequest | null>(null);
    const [spark, setSpark] = useState<Spark | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchRequestAndSpark = async () => {
            if (!requestId) {
                logger.info('No requestId provided, redirecting to dashboard');
                router.push('/client/dashboard');
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
                setMessage(requestData.message || '');

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
    }, [requestId, router]);

    const handleSubmitContext = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!request) return;

        setIsSubmitting(true);
        try {
            const updatedRequest = await updateClientRequestMessage(request.id, message);
            if (updatedRequest) {
                setRequest(updatedRequest);
                // TODO: Redirect to booking page when ready
                // router.push(`/client/booking/${request.id}`);
            }
        } catch (err) {
            logger.error('Error updating request message:', err);
            // TODO: Show error notification
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderContextForm = () => (
        <motion.form
            onSubmit={handleSubmitContext}
            className="bg-white rounded-xl shadow-md p-6"
            variants={fadeInUp}
        >
            <h2 className="text-xl font-semibold mb-4">Contexte de votre demande</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message pour le consultant
                    </label>
                    <textarea
                        id="message"
                        rows={4}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Décrivez votre besoin, vos attentes et tout contexte utile pour le consultant..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Envoi en cours...
                        </>
                    ) : (
                        <>
                            <ArrowRight className="h-5 w-5" />
                            Envoyer
                        </>
                    )}
                </button>
            </div>
        </motion.form>
    );

    if (loading) {
        return <LoadingSpinner message="Chargement de la demande..." />;
    }

    if (error || !request || !spark) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error || 'Demande introuvable'}</p>
                    <button
                        onClick={() => router.push('/client/dashboard')}
                        className="mt-4 text-blue-600 hover:text-blue-700"
                    >
                        Retour au tableau de bord
                    </button>
                </div>
            </div>
        );
    }

    const status = statusConfig[request.status];

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/client/dashboard')}
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
                    </div>
                </div>
            </div>
        </div>
    );
} 