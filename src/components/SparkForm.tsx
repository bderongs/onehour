import { useState, useRef } from 'react';
import type { Spark } from '../types/spark';
import { Plus, X, Trash2, Upload, Link } from 'lucide-react';
import { formatDuration, formatPrice } from '../utils/format';
import { Loader2 } from 'lucide-react';
import { uploadSparkImage, deleteSparkImage } from '../services/storage';
import { useNotification } from '../contexts/NotificationContext';

interface SparkFormProps {
    initialData?: Spark;
    onSubmit: (data: Spark) => void;
    onCancel: () => void;
}

export function SparkForm({ initialData, onSubmit, onCancel }: SparkFormProps) {

    // Convert duration from HH:MM:SS format to minutes
    const convertDurationToMinutes = (duration: string): string => {
        if (!duration) return '';
        
        // If it's already in minutes format, return as is
        if (!duration.includes(':')) {
            return duration;
        }

        // Parse HH:MM:SS format
        const [hours, minutes] = duration.split(':');
        return ((parseInt(hours) * 60) + parseInt(minutes)).toString();
    };

    const [formData, setFormData] = useState<Partial<Spark>>(() => {
        if (initialData) {
            // Convert duration from HH:MM:SS to minutes
            const duration = initialData.duration ? convertDurationToMinutes(initialData.duration) : '';
            return {
                ...initialData,
                duration
            };
        }
        return {
            title: '',
            duration: '',
            price: '',
            description: '',
            benefits: [],
            prefillText: '',
            highlight: '',
            detailedDescription: '',
            methodology: [],
            targetAudience: [],
            prerequisites: [],
            deliverables: [],
            expertProfile: {
                expertise: [],
                experience: ''
            },
            faq: [],
            nextSteps: [],
            social_image_url: '',
            uploadingImage: false
        };
    });

    const [highlightError, setHighlightError] = useState<string | null>(null);

    const DURATION_OPTIONS = [
        { value: '15', label: '15 minutes' },
        { value: '30', label: '30 minutes' },
        { value: '45', label: '45 minutes' },
        { value: '60', label: '1 heure' },
        { value: '90', label: '1h30' },
        { value: '120', label: '2 heures' },
    ];

    const handleChange = (field: keyof Spark, value: any) => {
        if (field === 'highlight') {
            const words = value.trim().split(/\s+/);
            if (words.length > 2) {
                setHighlightError('Le tag ne peut pas dépasser 2 mots');
            } else {
                setHighlightError(null);
            }
        }
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (field: keyof Spark, index: number, value: string) => {
        setFormData(prev => {
            const array = [...(prev[field] as string[] || [])];
            array[index] = value;
            return { ...prev, [field]: array };
        });
    };

    const handleArrayAdd = (field: keyof Spark) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] as any[] || []), '']
        }));
    };

    const handleArrayRemove = (field: keyof Spark, index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] as any[]).filter((_, i) => i !== index)
        }));
    };

    const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
        setFormData(prev => {
            const faq = [...(prev.faq || [])];
            faq[index] = { ...faq[index], [field]: value };
            return { ...prev, faq };
        });
    };

    const handleExpertProfileChange = (field: 'expertise' | 'experience', value: any) => {
        setFormData(prev => ({
            ...prev,
            expertProfile: {
                ...(prev.expertProfile || { expertise: [], experience: '' }),
                [field]: value
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Generate URL from title if not provided
        const data = {
            ...formData,
            url: formData.url || formData.title?.toLowerCase().replace(/\s+/g, '-') || ''
        } as Spark;
        onSubmit(data);
    };

    const parsePrice = (value: string): number | null => {
        // Remove currency symbol, spaces, and convert comma to dot
        const cleanValue = value.replace(/[€\s]/g, '').replace(',', '.');
        const number = parseFloat(cleanValue);
        return isNaN(number) ? null : number;
    };

    const handleHighlightBlur = () => {
        if (formData.highlight) {
            const words = formData.highlight.trim().split(/\s+/);
            if (words.length > 2) {
                // Trim to 2 words
                const trimmedValue = words.slice(0, 2).join(' ');
                setFormData(prev => ({ ...prev, highlight: trimmedValue }));
                setHighlightError(null); // Clear the error message after trimming
            }
        }
    };

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const { showNotification } = useNotification();

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !initialData?.id) return;

        try {
            setUploadingImage(true);
            const { publicUrl } = await uploadSparkImage(file, initialData.id, formData.social_image_url);
            handleChange('social_image_url', publicUrl);
            showNotification('success', 'Image mise à jour avec succès');
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
        if (formData.social_image_url) {
            try {
                await deleteSparkImage(formData.social_image_url);
                handleChange('social_image_url', undefined);
                showNotification('success', 'Image supprimée avec succès');
            } catch (error) {
                console.error('Error deleting image:', error);
                showNotification('error', 'Erreur lors de la suppression de l\'image');
            }
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Informations de base</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Ces informations constituent l'en-tête de votre Spark et sont les premières informations que vos clients potentiels verront.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Titre
                        </label>
                        <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Durée
                        </label>
                        <select
                            value={formData.duration || ''}
                            onChange={(e) => handleChange('duration', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            required
                        >
                            <option value="">Sélectionner une durée</option>
                            {DURATION_OPTIONS.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {formData.duration && (
                            <div className="mt-1 text-sm text-gray-500">
                                {formatDuration(formData.duration)}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Prix (€)
                        </label>
                        <input
                            type="text"
                            value={formData.price || ''}
                            onChange={(e) => handleChange('price', parsePrice(e.target.value)?.toString() || '')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="ex: 1500"
                            required
                        />
                        {formData.price && (
                            <div className="mt-1 text-sm text-gray-500">
                                {formatPrice(formData.price)}
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tag
                        </label>
                        <input
                            type="text"
                            value={formData.highlight || ''}
                            onChange={(e) => handleChange('highlight', e.target.value)}
                            onBlur={handleHighlightBlur}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="2 mots maximum"
                        />
                        {highlightError && (
                            <div className="mt-1 text-sm text-red-500">
                                {highlightError}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Une description claire et concise de votre Spark est essentielle. La description courte apparaît dans les aperçus, tandis que la description détaillée permet d'approfondir votre offre.
                </p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description courte
                        </label>
                        <textarea
                            value={formData.description || ''}
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows={3}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description détaillée
                        </label>
                        <textarea
                            value={formData.detailedDescription || ''}
                            onChange={(e) => handleChange('detailedDescription', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows={6}
                        />
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Bénéfices</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Listez les avantages concrets que vos clients obtiendront en choisissant ce Spark. Soyez spécifique et orienté résultats.
                </p>
                <div className="space-y-2">
                    {formData.benefits?.map((benefit, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={benefit}
                                onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => handleArrayRemove('benefits', index)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleArrayAdd('benefits')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Ajouter un bénéfice
                    </button>
                </div>
            </div>

            {/* Target Audience */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Pour qui ?</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Définissez clairement votre audience cible pour aider les clients à identifier si ce Spark leur correspond. Ciblez des profils ou des rôles spécifiques.
                </p>
                <div className="space-y-2">
                    {formData.targetAudience?.map((audience, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={audience}
                                onChange={(e) => handleArrayChange('targetAudience', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => handleArrayRemove('targetAudience', index)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleArrayAdd('targetAudience')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Ajouter une cible
                    </button>
                </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Prérequis</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Indiquez les conditions ou connaissances nécessaires pour tirer le meilleur parti de ce Spark. Cela aide à aligner les attentes dès le départ.
                </p>
                <div className="space-y-2">
                    {formData.prerequisites?.map((prerequisite, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={prerequisite}
                                onChange={(e) => handleArrayChange('prerequisites', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => handleArrayRemove('prerequisites', index)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleArrayAdd('prerequisites')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Ajouter un prérequis
                    </button>
                </div>
            </div>

            {/* Deliverables */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Ce que vous obtiendrez</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Détaillez les livrables concrets que vos clients recevront. Soyez précis sur le format et la nature des délivrables pour éviter toute ambiguïté.
                </p>
                <div className="space-y-2">
                    {formData.deliverables?.map((deliverable, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={deliverable}
                                onChange={(e) => handleArrayChange('deliverables', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => handleArrayRemove('deliverables', index)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleArrayAdd('deliverables')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Ajouter un livrable
                    </button>
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Prochaines étapes</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Décrivez le processus qui suit la réservation du Spark. Cela aide les clients à se projeter et à comprendre le déroulement de la collaboration.
                </p>
                <div className="space-y-2">
                    {formData.nextSteps?.map((step, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={step}
                                onChange={(e) => handleArrayChange('nextSteps', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => handleArrayRemove('nextSteps', index)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleArrayAdd('nextSteps')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Ajouter une étape
                    </button>
                </div>
            </div>

            {/* Methodology */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Méthodologie</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Présentez votre approche étape par étape. Une méthodologie claire rassure vos clients sur votre professionnalisme et votre expertise.
                </p>
                <div className="space-y-2">
                    {formData.methodology?.map((step, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                type="text"
                                value={step}
                                onChange={(e) => handleArrayChange('methodology', index, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <button
                                type="button"
                                onClick={() => handleArrayRemove('methodology', index)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleArrayAdd('methodology')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Ajouter une étape
                    </button>
                </div>
            </div>

            {/* Expert Profile */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Profil Expert</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Mettez en avant votre expertise spécifique pour ce Spark. Concentrez-vous sur les compétences et l'expérience pertinentes pour cette offre en particulier.
                </p>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expérience
                        </label>
                        <textarea
                            value={formData.expertProfile?.experience || ''}
                            onChange={(e) => handleExpertProfileChange('experience', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Expertises
                        </label>
                        <div className="space-y-2">
                            {formData.expertProfile?.expertise.map((exp, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={exp}
                                        onChange={(e) => {
                                            const newExpertise = [...(formData.expertProfile?.expertise || [])];
                                            newExpertise[index] = e.target.value;
                                            handleExpertProfileChange('expertise', newExpertise);
                                        }}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newExpertise = formData.expertProfile?.expertise.filter((_, i) => i !== index);
                                            handleExpertProfileChange('expertise', newExpertise);
                                        }}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    const newExpertise = [...(formData.expertProfile?.expertise || []), ''];
                                    handleExpertProfileChange('expertise', newExpertise);
                                }}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                            >
                                <Plus className="h-4 w-4" />
                                Ajouter une expertise
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">FAQ</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Anticipez les questions fréquentes de vos clients. Une FAQ bien construite peut lever les derniers freins à la réservation de votre Spark.
                </p>
                <div className="space-y-4">
                    {formData.faq?.map((item, index) => (
                        <div key={index} className="space-y-2 pb-4 border-b border-gray-200 last:border-0">
                            <input
                                type="text"
                                value={item.question || ''}
                                onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                                placeholder="Question"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <div className="flex gap-2">
                                <textarea
                                    value={item.answer || ''}
                                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                                    placeholder="Réponse"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                    rows={3}
                                />
                                <button
                                    type="button"
                                    onClick={() => handleArrayRemove('faq', index)}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleArrayAdd('faq')}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                        <Plus className="h-4 w-4" />
                        Ajouter une FAQ
                    </button>
                </div>
            </div>

            {/* Social Image */}
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Image de partage social</h2>
                <p className="text-sm text-gray-500 mb-4">
                    Cette image sera utilisée lorsque votre Spark est partagé sur les réseaux sociaux. 
                    Format recommandé : 1200x630 pixels.
                </p>
                <div className="space-y-4">
                    {formData.social_image_url && (
                        <div className="relative w-full max-w-2xl">
                            <img
                                src={formData.social_image_url}
                                alt="Social preview"
                                className="w-full rounded-lg shadow-md"
                            />
                            <button
                                type="button"
                                onClick={handleImageDelete}
                                className="absolute bottom-2 right-2 p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors"
                                title="Supprimer l'image"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                            disabled={uploadingImage}
                        >
                            {uploadingImage ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Upload className="h-5 w-5" />
                            )}
                            <span>{uploadingImage ? 'Upload en cours...' : 'Uploader une image'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowUrlInput(!showUrlInput)}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-colors"
                        >
                            <Link className="h-5 w-5" />
                            <span>Utiliser une URL</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                        />
                    </div>
                    {showUrlInput && (
                        <input
                            type="url"
                            value={formData.social_image_url || ''}
                            onChange={(e) => handleChange('social_image_url', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="https://example.com/votre-image.jpg"
                        />
                    )}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                    Annuler
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {initialData ? 'Mettre à jour' : 'Créer'}
                </button>
            </div>
        </form>
    );
} 