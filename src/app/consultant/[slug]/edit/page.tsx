'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Loader2, Plus, Trash2, Edit2, Star, X, Upload, Link } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ConsultantProfile, ConsultantReview, ConsultantMission } from '@/types/consultant';
import { getConsultantProfile, updateConsultantProfile, getConsultantReviews, getConsultantMissions, updateConsultantReviews, updateConsultantMissions } from '@/services/consultants';
import { uploadProfileImage, deleteProfileImage } from '@/services/storage';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useNotification } from '@/contexts/NotificationContext';

export default function ConsultantProfileEditPage() {
    const router = useRouter();
    const params = useParams();
    const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug ?? '';
    const [consultant, setConsultant] = useState<ConsultantProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showNotification } = useNotification();
    const [formData, setFormData] = useState<Partial<ConsultantProfile> & {
        languagesInput?: string,
        keyCompetenciesInput?: string,
        reviews?: ConsultantReview[],
        missions?: ConsultantMission[],
        profile_image_path?: string
    }>({});
    const [editingReviewIndex, setEditingReviewIndex] = useState<number | null>(null);
    const [editingMissionIndex, setEditingMissionIndex] = useState<number | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{
        type: 'review' | 'mission';
        index: number;
        isOpen: boolean;
    } | null>(null);
    const [newCompetency, setNewCompetency] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch consultant data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            if (!slug) {
                setError('Consultant slug is required');
                setLoading(false);
                return;
            }

            try {
                const [consultantData, reviews, missions] = await Promise.all([
                    getConsultantProfile(slug),
                    getConsultantReviews(slug),
                    getConsultantMissions(slug)
                ]);

                if (!consultantData) {
                    setError('Consultant not found');
                    setLoading(false);
                    return;
                }

                setConsultant(consultantData);
                setFormData({
                    ...consultantData,
                    languagesInput: consultantData.languages?.join(', ') || '',
                    keyCompetenciesInput: consultantData.key_competencies?.join(', ') || '',
                    reviews: reviews,
                    missions: missions
                });
                setLoading(false);
            } catch (err) {
                console.error('Error fetching consultant data:', err);
                setError('Impossible de charger les données du consultant');
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddCompetency = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newCompetency.trim()) {
            e.preventDefault();
            const competencies = formData.keyCompetenciesInput?.split(',').map(c => c.trim()).filter(Boolean) || [];
            if (!competencies.includes(newCompetency.trim())) {
                setFormData(prev => ({
                    ...prev,
                    keyCompetenciesInput: [...competencies, newCompetency.trim()].join(',')
                }));
            }
            setNewCompetency('');
        }
    };

    const handleRemoveCompetency = (competencyToRemove: string) => {
        const competencies = formData.keyCompetenciesInput?.split(',').map(c => c.trim()).filter(Boolean) || [];
        setFormData(prev => ({
            ...prev,
            keyCompetenciesInput: competencies.filter(c => c !== competencyToRemove).join(',')
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!slug) return;

        const submissionData = {
            ...formData,
            languages: formData.languagesInput?.split(',').map(item => item.trim()).filter(Boolean) || [],
            key_competencies: formData.keyCompetenciesInput?.split(',').map(item => item.trim()).filter(Boolean) || []
        };

        delete submissionData.languagesInput;
        delete submissionData.keyCompetenciesInput;
        delete submissionData.reviews;
        delete submissionData.missions;
        delete submissionData.profile_image_path;

        setSaving(true);
        try {
            const [updatedProfile, reviewsUpdated, missionsUpdated] = await Promise.all([
                updateConsultantProfile(slug, submissionData),
                updateConsultantReviews(slug, formData.reviews || []),
                updateConsultantMissions(slug, formData.missions || [])
            ]);

            if (updatedProfile && reviewsUpdated && missionsUpdated) {
                showNotification('success', 'Profil mis à jour avec succès');
                setTimeout(() => {
                    router.push(`/consultant/${consultant!.slug}`);
                }, 1500);
            } else {
                setError('Impossible de mettre à jour le profil');
                showNotification('error', 'Échec de la mise à jour du profil');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Impossible de mettre à jour le profil');
            showNotification('error', 'Échec de la mise à jour du profil');
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !slug) return;

        try {
            setUploadingImage(true);
            const { publicUrl } = await uploadProfileImage(file, slug, formData.profile_image_url);
            setFormData(prev => ({
                ...prev,
                profile_image_url: publicUrl
            }));
        } catch (error) {
            console.error('Error uploading image:', error);
            showNotification('error', error instanceof Error ? error.message : 'Erreur lors de l\'upload de l\'image');
        } finally {
            setUploadingImage(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleImageDelete = async () => {
        if (formData.profile_image_url) {
            try {
                await deleteProfileImage(formData.profile_image_url);
                setFormData(prev => ({ 
                    ...prev, 
                    profile_image_url: ''
                }));
            } catch (error) {
                console.error('Error deleting image:', error);
                showNotification('error', 'Erreur lors de la suppression de l\'image');
            }
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    if (loading) {
        return <LoadingSpinner message="Chargement du profil..." />;
    }

    if (error || !consultant) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{error || 'Profil introuvable'}</p>
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
            <div className="max-w-7xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => router.push(`/consultant/${consultant.slug}`)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information Card */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Informations de base</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                Ces informations constituent l'en-tête de votre profil et sont essentielles pour vous présenter aux clients potentiels.
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Photo de profil
                                    </label>
                                    <div className="space-y-4">
                                        {formData.profile_image_url && (
                                            <div className="relative w-40 h-40 md:w-72 md:h-96 bg-gray-400 rounded-2xl border-4 border-white overflow-hidden">
                                                <img
                                                    src={formData.profile_image_url}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
} 