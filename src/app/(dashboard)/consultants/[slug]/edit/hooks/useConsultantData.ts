// Purpose: Custom hook to fetch and manage consultant data for the edit page
// This hook handles loading consultant profile data, reviews, and missions

import { useState, useEffect } from 'react';
import type { ConsultantProfile, ConsultantReview, ConsultantMission } from '@/types/consultant';
import { 
    getConsultantProfileAction, 
    getConsultantBySlugAction,
    getConsultantReviewsAction, 
    getConsultantMissionsAction
} from '../actions';
import logger from '@/utils/logger';

type ConsultantFormData = Partial<ConsultantProfile> & {
    languagesInput?: string,
    keyCompetenciesInput?: string,
    reviews?: ConsultantReview[],
    missions?: ConsultantMission[],
    profile_image_path?: string
};

export function useConsultantData(slug: string) {
    const [consultant, setConsultant] = useState<ConsultantProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<ConsultantFormData>({});

    // Fetch consultant data when component mounts
    useEffect(() => {
        const fetchData = async () => {
            if (!slug) {
                setError('Consultant slug is required');
                setLoading(false);
                return;
            }

            try {
                // First get the consultant ID from the slug
                const consultantData = await getConsultantBySlugAction(slug);
                
                if (!consultantData || !consultantData.id) {
                    setError('Consultant not found');
                    setLoading(false);
                    return;
                }
                
                const consultantId = consultantData.id;
                
                // Then fetch all the related data
                const [profile, reviews, missions] = await Promise.all([
                    getConsultantProfileAction(consultantId),
                    getConsultantReviewsAction(consultantId),
                    getConsultantMissionsAction(consultantId)
                ]);

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
                logger.error('Error fetching consultant data:', err);
                setError('Impossible de charger les données du consultant');
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    return { consultant, formData, setFormData, loading, error };
} 