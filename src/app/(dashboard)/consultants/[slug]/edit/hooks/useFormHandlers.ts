// Purpose: Custom hook to handle form interactions for the consultant profile edit page
// This hook manages form state changes, image uploads, and form submission

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ConsultantProfile, ConsultantReview, ConsultantMission } from '@/types/consultant';
import { uploadProfileImage, deleteProfileImage } from '@/services/storage';
import { useNotification } from '@/contexts/NotificationContext';
import { 
    updateConsultantProfileAction,
    updateConsultantReviewsAction,
    updateConsultantMissionsAction
} from '../actions';
import logger from '@/utils/logger';

type ConsultantFormData = Partial<ConsultantProfile> & {
    languagesInput?: string,
    keyCompetenciesInput?: string,
    reviews?: ConsultantReview[],
    missions?: ConsultantMission[],
    profile_image_path?: string
};

// Helper function to scroll to an element and highlight it
const scrollAndHighlightElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
        // Scroll to the element with a small offset
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add highlight effect
        element.classList.add('validation-error-highlight');
        
        // Remove highlight after animation completes
        setTimeout(() => {
            element.classList.remove('validation-error-highlight');
        }, 2000);
    }
};

export function useFormHandlers(
    consultant: ConsultantProfile | null,
    formData: ConsultantFormData,
    setFormData: React.Dispatch<React.SetStateAction<ConsultantFormData>>
) {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [newCompetency, setNewCompetency] = useState('');
    const [newLanguage, setNewLanguage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showNotification } = useNotification();

    // Add CSS for the highlight effect when component mounts
    useEffect(() => {
        // Create a style element if it doesn't exist
        if (!document.getElementById('validation-highlight-style')) {
            const style = document.createElement('style');
            style.id = 'validation-highlight-style';
            style.innerHTML = `
                @keyframes highlightError {
                    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
                }
                .validation-error-highlight {
                    animation: highlightError 2s ease-in-out;
                    border-color: rgb(239, 68, 68) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Function to add a competency directly (without requiring a keyboard event)
    const addCompetency = (competency: string) => {
        if (!competency.trim()) return;
        
        const competencies = formData.keyCompetenciesInput?.split(',').map(c => c.trim()).filter(Boolean) || [];
        if (!competencies.includes(competency.trim())) {
            setFormData(prev => ({
                ...prev,
                keyCompetenciesInput: [...competencies, competency.trim()].join(',')
            }));
        }
        return true; // Return true if competency was added successfully
    };

    // Function to add a competency from keyboard event
    const handleAddCompetency = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newCompetency.trim()) {
            e.preventDefault();
            if (addCompetency(newCompetency)) {
                setNewCompetency('');
            }
        }
    };

    // Function to remove a competency
    const handleRemoveCompetency = (competencyToRemove: string) => {
        const competencies = formData.keyCompetenciesInput?.split(',').map(c => c.trim()).filter(Boolean) || [];
        setFormData(prev => ({
            ...prev,
            keyCompetenciesInput: competencies.filter(c => c !== competencyToRemove).join(',')
        }));
    };

    // Function to add a language directly (without requiring a keyboard event)
    const addLanguage = (language: string) => {
        if (!language.trim()) return;
        
        const languages = formData.languagesInput?.split(',').map(l => l.trim()).filter(Boolean) || [];
        if (!languages.includes(language.trim())) {
            setFormData(prev => ({
                ...prev,
                languagesInput: [...languages, language.trim()].join(',')
            }));
        }
        return true; // Return true if language was added successfully
    };

    // Function to add a language from keyboard event
    const handleAddLanguage = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newLanguage.trim()) {
            e.preventDefault();
            if (addLanguage(newLanguage)) {
                setNewLanguage('');
            }
        }
    };

    // Function to remove a language
    const handleRemoveLanguage = (languageToRemove: string) => {
        const languages = formData.languagesInput?.split(',').map(l => l.trim()).filter(Boolean) || [];
        setFormData(prev => ({
            ...prev,
            languagesInput: languages.filter(l => l !== languageToRemove).join(',')
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !consultant?.id) return;

        try {
            setUploadingImage(true);
            const { publicUrl } = await uploadProfileImage(file, consultant.id, formData.profile_image_url);
            setFormData(prev => ({
                ...prev,
                profile_image_url: publicUrl
            }));
        } catch (error) {
            logger.error('Error uploading image:', error);
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
                logger.error('Error deleting image:', error);
                showNotification('error', 'Erreur lors de la suppression de l\'image');
            }
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!consultant || !consultant.id) return;

        logger.info('Form submission started', { 
            reviewsCount: formData.reviews?.length || 0,
            missionsCount: formData.missions?.length || 0
        });

        // Validate reviews - all fields are required
        const validatedReviews = formData.reviews?.map((review, reviewIndex) => {
            // Check each field individually
            const fields = {
                client_name: review.client_name.trim() !== '',
                client_role: (review.client_role?.trim() || '') !== '',
                client_company: (review.client_company?.trim() || '') !== '',
                review_text: review.review_text.trim() !== ''
            };
            
            const hasAllRequiredFields = 
                fields.client_name && 
                fields.client_role && 
                fields.client_company && 
                fields.review_text;
            
            return { 
                review, 
                reviewIndex,
                isValid: hasAllRequiredFields, 
                reason: hasAllRequiredFields ? 'valid' : 'missing_required_fields',
                fields
            };
        }) || [];
        
        // Log validation results
        validatedReviews.forEach(item => {
            logger.info('Review validation', { 
                id: item.review.id,
                isValid: item.isValid,
                reason: item.reason,
                fields: item.fields
            });
        });
        
        // Check if any reviews are invalid
        const invalidReviews = validatedReviews.filter(item => !item.isValid);
        if (invalidReviews.length > 0) {
            showNotification('error', 'Tous les champs des avis clients sont obligatoires');
            
            // Find the first invalid field in the first invalid review
            const firstInvalidReview = invalidReviews[0];
            const reviewIndex = firstInvalidReview.reviewIndex;
            
            // Determine which field is invalid
            let fieldId = '';
            if (!firstInvalidReview.fields.client_name) {
                fieldId = `client-name-${reviewIndex}`;
            } else if (!firstInvalidReview.fields.client_role) {
                fieldId = `client-role-${reviewIndex}`;
            } else if (!firstInvalidReview.fields.client_company) {
                fieldId = `client-company-${reviewIndex}`;
            } else if (!firstInvalidReview.fields.review_text) {
                fieldId = `review-text-${reviewIndex}`;
            }
            
            // Scroll to and highlight the invalid field
            if (fieldId) {
                setTimeout(() => scrollAndHighlightElement(fieldId), 100);
            }
            
            setSaving(false);
            return;
        }
        
        // Filter to only valid reviews
        const filteredReviews = validatedReviews.map(item => item.review);

        // Validate missions - all fields are required
        const validatedMissions = formData.missions?.map((mission, missionIndex) => {
            // Check each field individually
            const fields = {
                title: mission.title.trim() !== '',
                company: mission.company.trim() !== '',
                duration: mission.duration.trim() !== '',
                description: mission.description.trim() !== ''
            };
            
            const hasAllRequiredFields = 
                fields.title && 
                fields.company && 
                fields.duration && 
                fields.description;
            
            return { 
                mission, 
                missionIndex,
                isValid: hasAllRequiredFields, 
                reason: hasAllRequiredFields ? 'valid' : 'missing_required_fields',
                fields
            };
        }) || [];
        
        // Log validation results
        validatedMissions.forEach(item => {
            logger.info('Mission validation', { 
                title: item.mission.title,
                isValid: item.isValid,
                reason: item.reason,
                fields: item.fields
            });
        });
        
        // Check if any missions are invalid
        const invalidMissions = validatedMissions.filter(item => !item.isValid);
        if (invalidMissions.length > 0) {
            showNotification('error', 'Tous les champs des missions sont obligatoires');
            
            // Find the first invalid field in the first invalid mission
            const firstInvalidMission = invalidMissions[0];
            const missionIndex = firstInvalidMission.missionIndex;
            
            // Determine which field is invalid
            let fieldId = '';
            if (!firstInvalidMission.fields.title) {
                fieldId = `mission-title-${missionIndex}`;
            } else if (!firstInvalidMission.fields.company) {
                fieldId = `mission-company-${missionIndex}`;
            } else if (!firstInvalidMission.fields.duration) {
                fieldId = `mission-duration-${missionIndex}`;
            } else if (!firstInvalidMission.fields.description) {
                fieldId = `mission-description-${missionIndex}`;
            }
            
            // Scroll to and highlight the invalid field
            if (fieldId) {
                setTimeout(() => scrollAndHighlightElement(fieldId), 100);
            }
            
            setSaving(false);
            return;
        }
        
        // Filter to only valid missions
        const filteredMissions = validatedMissions.map(item => item.mission);

        logger.info('After validation', { 
            filteredReviewsCount: filteredReviews.length,
            filteredMissionsCount: filteredMissions.length
        });

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
        delete submissionData.profile_image_path;

        setSaving(true);
        try {
            // Log the data being sent to the server
            logger.info('Submitting form data', {
                consultantId: consultant.id,
                reviewsCount: filteredReviews.length,
                reviewIds: filteredReviews.map(r => r.id),
                missionsCount: filteredMissions.length
            });
            
            // Update profile, reviews, and missions in parallel
            const [updatedProfile, reviewsUpdated, missionsUpdated] = await Promise.all([
                updateConsultantProfileAction(consultant.id, submissionData),
                updateConsultantReviewsAction(consultant.id, filteredReviews),
                updateConsultantMissionsAction(consultant.id, filteredMissions)
            ]);

            logger.info('Update results', { 
                profileUpdated: !!updatedProfile,
                reviewsUpdated,
                missionsUpdated
            });

            if (updatedProfile && reviewsUpdated && missionsUpdated) {
                showNotification('success', 'Profil mis à jour avec succès');
                // Add a small delay before redirecting to allow the notification to display
                // and prevent layout flashing during navigation
                setTimeout(() => {
                    router.push(`/${consultant.slug}`);
                }, 1000);
            } else {
                showNotification('error', 'Échec de la mise à jour du profil');
            }
        } catch (err) {
            logger.error('Error updating profile:', err);
            showNotification('error', 'Échec de la mise à jour du profil');
        } finally {
            setSaving(false);
        }
    };

    return {
        saving,
        uploadingImage,
        newCompetency,
        setNewCompetency,
        newLanguage,
        setNewLanguage,
        fileInputRef,
        handleInputChange,
        addCompetency,
        handleAddCompetency,
        handleRemoveCompetency,
        addLanguage,
        handleAddLanguage,
        handleRemoveLanguage,
        handleImageUpload,
        handleImageDelete,
        handleSubmit
    };
} 