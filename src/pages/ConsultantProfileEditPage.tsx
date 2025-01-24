import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ConsultantProfile } from '../types/consultant';
import { getConsultantProfile, updateConsultantProfile } from '../services/consultants';
import { Notification } from '../components/Notification';

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
        keyCompetenciesInput?: string
    }>({});

    // Fetch consultant data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            if (!id) {
                setError('Consultant ID is required');
                setLoading(false);
                return;
            }

            try {
                const consultantData = await getConsultantProfile(id);
                if (!consultantData) {
                    setError('Consultant not found');
                    setLoading(false);
                    return;
                }

                setConsultant(consultantData);
                setFormData({
                    ...consultantData,
                    languagesInput: consultantData.languages?.join(', ') || '',
                    keyCompetenciesInput: consultantData.key_competencies?.join(', ') || ''
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

        // Remove temporary input fields
        delete submissionData.languagesInput;
        delete submissionData.keyCompetenciesInput;

        setSaving(true);
        try {
            const updatedProfile = await updateConsultantProfile(id, submissionData);
            if (updatedProfile) {
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

            <div className="max-w-4xl mx-auto px-4 py-6 lg:py-12">
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
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Modifier mon profil</h1>
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
        </div>
    );
} 