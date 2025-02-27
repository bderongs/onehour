// Purpose: Component for editing basic consultant information
// This component handles the basic information section of the consultant profile edit page

import { useRef, useState } from 'react';
import { Loader2, Upload, Link as LinkIcon, Trash2 } from 'lucide-react';
import type { ConsultantProfile } from '@/types/consultant';

type BasicInformationProps = {
    formData: Partial<ConsultantProfile> & {
        languagesInput?: string;
    };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleImageDelete: () => Promise<void>;
    uploadingImage: boolean;
};

export function BasicInformation({
    formData,
    handleInputChange,
    handleImageUpload,
    handleImageDelete,
    uploadingImage
}: BasicInformationProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [showUrlInput, setShowUrlInput] = useState(false);

    return (
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
                                <button
                                    type="button"
                                    onClick={handleImageDelete}
                                    className="absolute bottom-2 right-2 p-2 bg-black/50 backdrop-blur-sm text-white rounded-lg hover:bg-black/70 transition-colors"
                                    title="Supprimer la photo"
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
                                <span>{uploadingImage ? 'Upload en cours...' : 'Uploader une photo'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowUrlInput(!showUrlInput)}
                                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 rounded-md transition-colors"
                            >
                                <LinkIcon className="h-5 w-5" />
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
                                id="profile_image_url"
                                name="profile_image_url"
                                value={formData.profile_image_url || ''}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="https://example.com/votre-photo.jpg"
                            />
                        )}
                        <p className="text-sm text-gray-500">
                            Choisissez une photo professionnelle de bonne qualité. Format recommandé : JPEG ou PNG, ratio carré.
                        </p>
                    </div>
                </div>
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
                            placeholder="Ex: Consultant en Stratégie Digitale"
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
                            placeholder="Ex: Paris, France"
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
                        placeholder="Ex: Fort de 10 ans d'expérience dans la transformation digitale, j'accompagne les entreprises dans leur évolution technologique et organisationnelle..."
                    />
                </div>
                <div>
                    <label htmlFor="languagesInput" className="block text-sm font-medium text-gray-700 mb-1">
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
                <div>
                    <label htmlFor="booking_url" className="block text-sm font-medium text-gray-700 mb-1">
                        Lien de réservation
                    </label>
                    <input
                        type="url"
                        id="booking_url"
                        name="booking_url"
                        value={formData.booking_url || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="https://calendly.com/votre-compte ou https://zcal.co/votre-compte"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                        Utilisez un service comme Calendly, Zcal ou tout autre outil de réservation en ligne pour générer votre lien.
                    </p>
                </div>
            </div>
        </div>
    );
} 