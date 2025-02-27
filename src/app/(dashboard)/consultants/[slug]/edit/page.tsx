// Purpose: Edit page for consultant profiles, allowing users to update their information
// This page handles editing consultant profiles with Next.js
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useConsultantData } from './hooks/useConsultantData';
import { useFormHandlers } from './hooks/useFormHandlers';
import { BasicInformation } from './components/BasicInformation';
import { CompanyInformation } from './components/CompanyInformation';
import { Competencies } from './components/Competencies';
import { Languages } from './components/Languages';
import { SocialLinks } from './components/SocialLinks';
import { ReviewsList } from './components/Reviews/ReviewsList';
import { MissionsList } from './components/Missions/MissionsList';
import logger from '@/utils/logger';

export default function ConsultantProfileEditPage() {
    const params = useParams<{ slug: string }>();
    const router = useRouter();
    const { consultant, formData, setFormData, loading, error } = useConsultantData(params.slug as string);
    const { 
        saving, 
        uploadingImage, 
        handleInputChange, 
        handleAddCompetency, 
        handleRemoveCompetency, 
        handleAddLanguage,
        handleRemoveLanguage,
        handleImageUpload, 
        handleImageDelete, 
        handleSubmit,
        addCompetency,
        addLanguage
    } = useFormHandlers(consultant, formData, setFormData);
    
    const [deleteConfirm, setDeleteConfirm] = useState<{
        type: 'review' | 'mission';
        index: number;
        isOpen: boolean;
    } | null>(null);

    const handleRequestDelete = (type: 'review' | 'mission', index: number) => {
        setDeleteConfirm({
            type,
            index,
            isOpen: true
        });
    };

    // Prevent form submission when Enter key is pressed
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
            e.preventDefault();
            logger.info('Form submission prevented on Enter key press');
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
                            onClick={() => router.push(`/${consultant.slug}`)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">Mon profil</h1>
                    </div>

                    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-8">
                        {/* Basic Information */}
                        <BasicInformation 
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleImageUpload={handleImageUpload}
                            handleImageDelete={handleImageDelete}
                            uploadingImage={uploadingImage}
                        />

                        {/* Company Information */}
                        <CompanyInformation 
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />

                        {/* Competencies */}
                        <Competencies 
                            formData={formData}
                            handleAddCompetency={handleAddCompetency}
                            handleRemoveCompetency={handleRemoveCompetency}
                            setFormData={setFormData}
                            addCompetency={addCompetency}
                        />

                        {/* Languages */}
                        <Languages 
                            formData={formData}
                            handleAddLanguage={handleAddLanguage}
                            handleRemoveLanguage={handleRemoveLanguage}
                            setFormData={setFormData}
                            addLanguage={addLanguage}
                        />

                        {/* Social Links */}
                        <SocialLinks 
                            formData={formData}
                            handleInputChange={handleInputChange}
                        />

                        {/* Reviews */}
                        <ReviewsList 
                            consultant={consultant}
                            formData={formData}
                            setFormData={setFormData}
                            onRequestDelete={(type, index) => handleRequestDelete(type, index)}
                        />

                        {/* Missions */}
                        <MissionsList 
                            consultant={consultant}
                            formData={formData}
                            setFormData={setFormData}
                            onRequestDelete={(type, index) => handleRequestDelete(type, index)}
                        />

                        {/* Form Actions */}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => router.push(`/${consultant.slug}`)}
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
                                        <LoadingSpinner message="Enregistrement..." />
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
                        setDeleteConfirm(null);
                    }
                }}
                onCancel={() => setDeleteConfirm(null)}
                variant="danger"
            />
        </div>
    );
}