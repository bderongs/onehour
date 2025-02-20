'use client';

import { useEffect, useState, useMemo } from 'react';
import { CheckCircle, Star, Linkedin, Twitter, Globe, X, BadgeCheck, Sparkles, PenSquare, Instagram, Facebook, Youtube, FileText, BookOpen } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { AIChatInterface, Message } from '@/components/AIChatInterface';
import { ConsultantConnect } from '@/components/ConsultantConnect';
import { DOCUMENT_TEMPLATES } from '@/data/documentTemplates';
import { createChatConfigs } from '@/data/chatConfigs';
import type { DocumentSummary } from '@/types/chat';
import type { Spark } from '@/types/spark';
import type { ConsultantProfile, ConsultantReview, ConsultantMission } from '@/types/consultant';
import { getConsultantProfile, getConsultantBySlug, getConsultantReviews, getConsultantSparks, getConsultantMissions } from '@/services/consultants';
import { formatDuration, formatPrice } from '@/utils/format';
import { getCurrentUser } from '@/services/auth';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useNotification } from '@/contexts/NotificationContext';
import { Metadata } from '@/components/Metadata';
import { getDefaultAvatarUrl } from '@/utils/avatar';

export default function ConsultantProfilePage({ id: propId }: { id?: string }) {
    const router = useRouter();
    const params = useParams();
    const urlSlug = params.slug as string;
    const { showNotification } = useNotification();
    const [showChat, setShowChat] = useState(false);
    const [showConnect, setShowConnect] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [shouldReset, setShouldReset] = useState(false);
    const [sparks, setSparks] = useState<Spark[]>([]);
    const [consultant, setConsultant] = useState<ConsultantProfile | null>(null);
    const [reviews, setReviews] = useState<ConsultantReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
    const [documentSummary, setDocumentSummary] = useState<DocumentSummary>({
        challenge: '',
        currentSituation: '',
        desiredOutcome: '', 
        constraints: '',
        stakeholders: '',
        previousAttempts: '',
        hasEnoughData: false
    });
    const [missions, setMissions] = useState<ConsultantMission[]>([]);

    // Use propId if provided, otherwise use urlSlug
    const consultantIdentifier = propId || urlSlug;

    // Fetch current user when component mounts
    useEffect(() => {
        const fetchCurrentUser = async () => {
            const user = await getCurrentUser();
            setCurrentUser(user);
        };
        fetchCurrentUser();
    }, []);

    // Fetch consultant data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // If we have a propId, use getConsultantProfile, otherwise use getConsultantBySlug
                const consultantData = propId 
                    ? await getConsultantProfile(propId)
                    : await getConsultantBySlug(consultantIdentifier || '');

                if (!consultantData) {
                    console.error('No consultant found for identifier:', consultantIdentifier || 'unknown');
                    setError('Consultant not found');
                    setLoading(false);
                    router.push('/');
                    showNotification('error', 'Vous avez été redirigé vers la page d\'accueil car le profil n\'existe pas.');
                    return;
                }

                const [reviewsData, sparksData, missionsData] = await Promise.all([
                    getConsultantReviews(consultantData.id),
                    getConsultantSparks(consultantData.id),
                    getConsultantMissions(consultantData.id)
                ]);

                setConsultant(consultantData);
                setReviews(reviewsData);
                setSparks(sparksData);
                setMissions(missionsData);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching consultant data:', err);
                setError('Impossible de charger les données du consultant');
                setLoading(false);
                router.push('/');
                showNotification('error', 'Vous avez été redirigé vers la page d\'accueil car le profil n\'existe pas.');
            }
        };

        fetchData();
        
        // Cleanup function
        return () => {
            setLoading(true);
            setError(null);
            setConsultant(null);
            setReviews([]);
            setSparks([]);
            setMissions([]);
        };
    }, [consultantIdentifier, propId, router, showNotification]);

    // Memoize chat configs based on consultant's firstname
    const chatConfigs = useMemo(
        () => createChatConfigs(consultant?.first_name),
        [consultant?.first_name]
    );

    // Update messages when consultant changes
    useEffect(() => {
        if (consultant) {
            setMessages([chatConfigs.consultant_qualification.initialMessage]);
        }
    }, [consultant, chatConfigs]);

    // Reset shouldReset after it's been consumed
    useEffect(() => {
        if (shouldReset) {
            setShouldReset(false);
        }
    }, [shouldReset]);

    const handleChatOpen = () => {
        setShowChat(true);
        // Coordinate the scroll timing with the animation
        setTimeout(() => {
            const chatElement = document.querySelector('.slide-down-enter-active');
            if (chatElement) {
                const elementPosition = chatElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: elementPosition - 100,
                    behavior: 'smooth'
                });
            }
        }, 50);
    };

    const handleConnect = () => {
        setShowConnect(true);
        setShowChat(false);
    };

    const handleBack = () => {
        setShowConnect(false);
        setShowChat(false);
        setShouldReset(true);
        if (consultant) {
            setMessages([chatConfigs.consultant_qualification.initialMessage]);
        }
        setDocumentSummary({
            challenge: '',
            currentSituation: '',
            desiredOutcome: '',
            constraints: '',
            stakeholders: '',
            previousAttempts: '',
            hasEnoughData: false
        });
    };

    const handleMessagesUpdate = (newMessages: Message[]) => {
        setMessages(newMessages);
        for (let i = newMessages.length - 1; i >= 0; i--) {
            const msg = newMessages[i];
            if (msg.role === 'assistant' && msg.summary) {
                if ('hasEnoughData' in msg.summary) {
                    setDocumentSummary(msg.summary as DocumentSummary);
                }
                break;
            }
        }
    };

    // Handle loading state
    if (loading) {
        return <LoadingSpinner message="Chargement du profil..." />;
    }

    // If no consultant data, don't render anything as we're redirecting
    if (!consultant) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Metadata consultant={consultant} />

            {/* Sticky Edit Button */}
            {currentUser?.id === consultant.id && (
                <div className="fixed right-4 top-4 z-50">
                    <button
                        onClick={() => router.push(`/consultants/${consultant.id}/edit`)}
                        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:shadow-xl border border-gray-200 text-gray-700 hover:text-blue-600 transition-all duration-200"
                        title="Modifier mon profil"
                    >
                        <PenSquare className="h-5 w-5" />
                        <span className="font-medium">Modifier</span>
                    </button>
                </div>
            )}

            <main className="flex-grow relative">
                {/* Cover Section - Full Width */}
                <div className="w-full bg-white shadow-md mb-8 animate-fade-in-up">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative p-4 md:p-6 flex flex-col gap-6">
                            {/* Logo Section - Mobile only */}
                            {(consultant.company || consultant.company_title) && (
                                <div className="block md:hidden text-right">
                                    {consultant.company && (
                                        <div className="text-xl md:text-3xl font-bold text-blue-600">{consultant.company}</div>
                                    )}
                                    {consultant.company_title && (
                                        <div className="text-lg md:text-2xl font-semibold text-gray-700">{consultant.company_title}</div>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                <div className="w-40 h-40 md:w-72 md:h-96 mx-auto md:mx-0 flex-shrink-0 bg-gray-400 rounded-2xl border-4 border-white overflow-hidden">
                                    <img
                                        src={consultant.profile_image_url || getDefaultAvatarUrl(consultant.id, 384)}
                                        alt={`${consultant.first_name} ${consultant.last_name}`}
                                        width={288}
                                        height={384}
                                        loading="eager"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-grow flex flex-col justify-between">
                                    {/* Logo Section - Desktop only */}
                                    {(consultant.company || consultant.company_title) && (
                                        <div className="hidden md:block text-right">
                                            {consultant.company && (
                                                <div className="text-xl md:text-3xl font-bold text-blue-600">{consultant.company}</div>
                                            )}
                                            {consultant.company_title && (
                                                <div className="text-lg md:text-2xl font-semibold text-gray-700">{consultant.company_title}</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 