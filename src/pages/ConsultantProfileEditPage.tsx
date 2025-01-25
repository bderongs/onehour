import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Plus, Trash2, Edit2, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ConsultantProfile, ConsultantReview, ConsultantMission } from '../types/consultant';
import { getConsultantProfile, updateConsultantProfile, getConsultantReviews, getConsultantMissions, updateConsultantReviews, updateConsultantMissions } from '../services/consultants';
import { Notification } from '../components/Notification';
import { ConfirmDialog } from '../components/ConfirmDialog';

export default function ConsultantProfileEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [consultant, setConsultant] = useState<ConsultantProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [formData, setFormData] = useState<Partial<ConsultantProfile> & {
        languagesInput?: string,
        keyCompetenciesInput?: string,
        reviews?: ConsultantReview[],
        missions?: ConsultantMission[]
    }>({});
    const [editingReviewIndex, setEditingReviewIndex] = useState<number | null>(null);
    const [editingMissionIndex, setEditingMissionIndex] = useState<number | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{
        type: 'review' | 'mission';
        index: number;
        isOpen: boolean;
    } | null>(null);

    // Fetch consultant data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('Consultant ID is required');
                setLoading(false);
                return;
            }

            try {
                const [consultantData, reviews, missions] = await Promise.all([
                    getConsultantProfile(id),
                    getConsultantReviews(id),
                    getConsultantMissions(id)
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
                setError('Failed to load consultant data');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        // Convert string inputs to arrays before submitting
        const submissionData = {
            ...formData,
            languages: formData.languagesInput?.split(',').map(item => item.trim()).filter(Boolean) || [],
            key_competencies: formData.keyCompetenciesInput?.split(',').map(item => item.trim()).filter(Boolean) || []
        };

        // Remove temporary input fields and arrays that are stored in separate tables
        delete submissionData.languagesInput;
        delete submissionData.keyCompetenciesInput;
        delete submissionData.reviews;
        delete submissionData.missions;

        setSaving(true);
        try {
            // Update profile, reviews, and missions in parallel
            const [updatedProfile, reviewsUpdated, missionsUpdated] = await Promise.all([
                updateConsultantProfile(id, submissionData),
                updateConsultantReviews(id, formData.reviews || []),
                updateConsultantMissions(id, formData.missions || [])
            ]);

            if (updatedProfile && reviewsUpdated && missionsUpdated) {
                setNotification({ type: 'success', message: 'Profil mis à jour avec succès' });
                // Wait a bit to show the success message before redirecting
                setTimeout(() => {
                    navigate(`/consultants/${id}`);
                }, 1500);
            } else {
                setError('Failed to update profile');
                setNotification({ type: 'error', message: 'Échec de la mise à jour du profil' });
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Failed to update profile');
            setNotification({ type: 'error', message: 'Échec de la mise à jour du profil' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement du profil...</p>
                </div>
            </div>
        );
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
            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="max-w-7xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <button
                            onClick={() => navigate(`/consultants/${id}`)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information Card */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Informations de base</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                            Titre professionnel
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                            Localisation
                                        </label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={formData.location || ''}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                                        Biographie
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio || ''}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="languages" className="block text-sm font-medium text-gray-700 mb-1">
                                        Langues (séparées par des virgules)
                                    </label>
                                    <input
                                        type="text"
                                        id="languagesInput"
                                        name="languagesInput"
                                        value={formData.languagesInput || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="Ex: Français, Anglais, Espagnol"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Company Information Card */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Informations entreprise</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                                        Entreprise
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={formData.company || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="company_title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Titre dans l'entreprise
                                    </label>
                                    <input
                                        type="text"
                                        id="company_title"
                                        name="company_title"
                                        value={formData.company_title || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional Details Card */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Détails professionnels</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-1">
                                        Expertise
                                    </label>
                                    <textarea
                                        id="expertise"
                                        name="expertise"
                                        value={formData.expertise || ''}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                                        Expérience
                                    </label>
                                    <textarea
                                        id="experience"
                                        name="experience"
                                        value={formData.experience || ''}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="key_competencies" className="block text-sm font-medium text-gray-700 mb-1">
                                        Compétences clés (séparées par des virgules)
                                    </label>
                                    <input
                                        type="text"
                                        id="keyCompetenciesInput"
                                        name="keyCompetenciesInput"
                                        value={formData.keyCompetenciesInput || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="Ex: Stratégie, Marketing Digital, Management"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Social Links Card */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Liens sociaux</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                                        LinkedIn
                                    </label>
                                    <input
                                        type="url"
                                        id="linkedin"
                                        name="linkedin"
                                        value={formData.linkedin || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                                        Twitter
                                    </label>
                                    <input
                                        type="url"
                                        id="twitter"
                                        name="twitter"
                                        value={formData.twitter || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                                        Site web
                                    </label>
                                    <input
                                        type="url"
                                        id="website"
                                        name="website"
                                        value={formData.website || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="profile_image_url" className="block text-sm font-medium text-gray-700 mb-1">
                                        URL de la photo de profil
                                    </label>
                                    <input
                                        type="url"
                                        id="profile_image_url"
                                        name="profile_image_url"
                                        value={formData.profile_image_url || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Reviews Card */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Avis clients</h2>
                            <div className="space-y-4">
                                {formData.reviews?.map((review, index) => (
                                    <div key={review.id} className="border rounded-lg p-4">
                                        {editingReviewIndex === index ? (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-medium">Avis {index + 1}</h3>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteConfirm({
                                                            type: 'review',
                                                            index,
                                                            isOpen: true
                                                        })}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Nom du client
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={review.client_name}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    reviews: prev.reviews?.map((r, i) =>
                                                                        i === index ? { ...r, client_name: e.target.value } : r
                                                                    )
                                                                }));
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Rôle du client
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={review.client_role || ''}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    reviews: prev.reviews?.map((r, i) =>
                                                                        i === index ? { ...r, client_role: e.target.value } : r
                                                                    )
                                                                }));
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Entreprise du client
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={review.client_company || ''}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    reviews: prev.reviews?.map((r, i) =>
                                                                        i === index ? { ...r, client_company: e.target.value } : r
                                                                    )
                                                                }));
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Note (1-5)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max="5"
                                                            value={review.rating}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    reviews: prev.reviews?.map((r, i) =>
                                                                        i === index ? { ...r, rating: Number(e.target.value) } : r
                                                                    )
                                                                }));
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Texte de l'avis
                                                        </label>
                                                        <textarea
                                                            value={review.review_text}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    reviews: prev.reviews?.map((r, i) =>
                                                                        i === index ? { ...r, review_text: e.target.value } : r
                                                                    )
                                                                }));
                                                            }}
                                                            rows={3}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div 
                                                className="space-y-4 cursor-pointer hover:bg-gray-50 -m-4 p-4 rounded-lg transition-colors"
                                                onClick={() => setEditingReviewIndex(index)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{review.client_name}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            {review.client_role} • {review.client_company}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            className="text-blue-600 hover:text-blue-700"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-gray-600 text-sm">{review.review_text}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newReview = {
                                            id: `temp-${Date.now()}`,
                                            consultant_id: id || '',
                                            client_name: '',
                                            client_role: '',
                                            client_company: '',
                                            review_text: '',
                                            rating: 5,
                                            created_at: new Date().toISOString()
                                        };
                                        setFormData(prev => ({
                                            ...prev,
                                            reviews: [...(prev.reviews || []), newReview]
                                        }));
                                        setEditingReviewIndex((formData.reviews?.length || 0));
                                    }}
                                    className="w-full flex items-center justify-center gap-2 p-4 text-blue-600 hover:text-blue-700 border-2 border-dashed border-gray-200 hover:border-blue-200 rounded-lg transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Ajouter un avis
                                </button>
                            </div>
                        </div>

                        {/* Missions Card */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Missions</h2>
                            <div className="space-y-4">
                                {formData.missions?.map((mission, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                        {editingMissionIndex === index ? (
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-medium">Mission {index + 1}</h3>
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteConfirm({
                                                            type: 'mission',
                                                            index,
                                                            isOpen: true
                                                        })}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Titre de la mission
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={mission.title}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    missions: prev.missions?.map((m, i) =>
                                                                        i === index ? { ...m, title: e.target.value } : m
                                                                    )
                                                                }));
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Entreprise
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={mission.company}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    missions: prev.missions?.map((m, i) =>
                                                                        i === index ? { ...m, company: e.target.value } : m
                                                                    )
                                                                }));
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Durée
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={mission.duration}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    missions: prev.missions?.map((m, i) =>
                                                                        i === index ? { ...m, duration: e.target.value } : m
                                                                    )
                                                                }));
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                            placeholder="Ex: 3 mois"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Date
                                                        </label>
                                                        <input
                                                            type="date"
                                                            value={mission.date.split('T')[0]}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    missions: prev.missions?.map((m, i) =>
                                                                        i === index ? { ...m, date: e.target.value } : m
                                                                    )
                                                                }));
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Description
                                                        </label>
                                                        <textarea
                                                            value={mission.description}
                                                            onChange={(e) => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    missions: prev.missions?.map((m, i) =>
                                                                        i === index ? { ...m, description: e.target.value } : m
                                                                    )
                                                                }));
                                                            }}
                                                            rows={3}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div 
                                                className="space-y-4 cursor-pointer hover:bg-gray-50 -m-4 p-4 rounded-lg transition-colors"
                                                onClick={() => setEditingMissionIndex(index)}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-medium text-gray-900">{mission.title}</h3>
                                                        <p className="text-sm text-gray-500">
                                                            {mission.company} • {mission.duration}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            className="text-blue-600 hover:text-blue-700"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm">{mission.description}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(mission.date).toLocaleDateString('fr-FR', {
                                                        year: 'numeric',
                                                        month: 'long'
                                                    })}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newMission = {
                                            title: '',
                                            company: '',
                                            description: '',
                                            duration: '',
                                            date: new Date().toISOString().split('T')[0]
                                        };
                                        setFormData(prev => ({
                                            ...prev,
                                            missions: [...(prev.missions || []), newMission]
                                        }));
                                        setEditingMissionIndex((formData.missions?.length || 0));
                                    }}
                                    className="w-full flex items-center justify-center gap-2 p-4 text-blue-600 hover:text-blue-700 border-2 border-dashed border-gray-200 hover:border-blue-200 rounded-lg transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                    Ajouter une mission
                                </button>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/consultants/${id}`)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-900"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                {saving ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Enregistrement...
                                    </div>
                                ) : (
                                    'Mettre à jour'
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>

            <ConfirmDialog
                isOpen={!!deleteConfirm}
                title={`Supprimer ${deleteConfirm?.type === 'review' ? 'l\'avis' : 'la mission'}`}
                message={`Êtes-vous sûr de vouloir supprimer ${deleteConfirm?.type === 'review' ? 'cet avis' : 'cette mission'} ? Cette action est irréversible.`}
                confirmLabel="Supprimer"
                cancelLabel="Annuler"
                onConfirm={() => {
                    if (deleteConfirm) {
                        const { type, index } = deleteConfirm;
                        setFormData(prev => ({
                            ...prev,
                            [type === 'review' ? 'reviews' : 'missions']: prev[type === 'review' ? 'reviews' : 'missions']?.filter((_, i) => i !== index)
                        }));
                        if (type === 'review') {
                            setEditingReviewIndex(null);
                        } else {
                            setEditingMissionIndex(null);
                        }
                        setDeleteConfirm(null);
                    }
                }}
                onCancel={() => setDeleteConfirm(null)}
                variant="danger"
            />
        </div>
    );
} 