import { supabase } from '../lib/supabase';
import type { ConsultantProfile, ConsultantReview } from '../types/consultant';
import type { Spark } from '../types/spark';
import type { ConsultantMission } from '../types/consultant';
import { generateSlug, ensureUniqueSlug } from '../utils/url';

export async function getConsultantProfile(id: string): Promise<ConsultantProfile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .contains('roles', ['consultant'])
        .single();

    if (error) {
        console.error('Error fetching consultant profile:', error);
        return null;
    }

    return data as ConsultantProfile;
}

export async function getConsultantReviews(consultantId: string): Promise<ConsultantReview[]> {
    const { data, error } = await supabase
        .from('consultant_reviews')
        .select('*')
        .eq('consultant_id', consultantId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching consultant reviews:', error);
        return [];
    }

    return data.map(review => ({
        id: review.id,
        consultant_id: review.consultant_id,
        client_name: review.reviewer_name,
        client_role: review.reviewer_role,
        client_company: review.reviewer_company,
        review_text: review.review_text,
        rating: review.rating,
        client_image_url: review.reviewer_image_url,
        created_at: review.created_at
    })) as ConsultantReview[];
}

export async function getConsultantSparks(consultantId: string): Promise<Spark[]> {
    const { data, error } = await supabase
        .from('sparks')
        .select('*')
        .eq('consultant', consultantId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching consultant sparks:', error);
        return [];
    }

    return data as Spark[];
}

export async function getConsultantBySlug(slug: string): Promise<ConsultantProfile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('slug', slug)
        .contains('roles', ['consultant'])
        .single();

    if (error) {
        console.error('Error fetching consultant profile:', error);
        return null;
    }

    return data as ConsultantProfile;
}

export async function updateConsultantProfile(id: string, profile: Partial<ConsultantProfile>): Promise<ConsultantProfile | null> {
    let updatedProfile: Partial<ConsultantProfile> = { ...profile };
    
    // If name is being updated, generate new slug
    if (profile.first_name || profile.last_name) {
        const { data: currentProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name, slug')
            .eq('id', id)
            .single();
            
        const firstName = profile.first_name || currentProfile?.first_name || '';
        const lastName = profile.last_name || currentProfile?.last_name || '';
        const baseSlug = generateSlug(`${firstName} ${lastName}`);
        updatedProfile.slug = await ensureUniqueSlug(baseSlug, currentProfile?.slug);
    }

    const { data, error } = await supabase
        .from('profiles')
        .update({
            ...updatedProfile,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .contains('roles', ['consultant'])
        .select()
        .single();

    if (error) {
        console.error('Error updating consultant profile:', error);
        return null;
    }

    return data as ConsultantProfile;
}

export async function getConsultantMissions(consultantId: string): Promise<ConsultantMission[]> {
    const { data, error } = await supabase
        .from('consultant_missions')
        .select('*')
        .eq('consultant_id', consultantId)
        .order('start_date', { ascending: false });

    if (error) {
        console.error('Error fetching consultant missions:', error);
        return [];
    }

    return data.map(mission => ({
        title: mission.title,
        company: mission.company,
        description: mission.description,
        duration: mission.duration,
        date: mission.start_date
    })) as ConsultantMission[];
}

export async function updateConsultantReviews(consultantId: string, reviews: ConsultantReview[]): Promise<boolean> {
    try {
        // Get current reviews to identify ones that need to be deleted
        const { data: currentReviews } = await supabase
            .from('consultant_reviews')
            .select('id')
            .eq('consultant_id', consultantId);

        if (currentReviews) {
            const currentIds = new Set(currentReviews.map(r => r.id));
            const existingReviews = reviews.filter(review => !review.id.startsWith('temp-'));
            const newReviews = reviews.filter(review => review.id.startsWith('temp-'));
            const keepIds = new Set(existingReviews.map(r => r.id));
            const idsToDelete = [...currentIds].filter(id => !keepIds.has(id));

            // Delete reviews that are no longer present
            if (idsToDelete.length > 0) {
                const { error: deleteError } = await supabase
                    .from('consultant_reviews')
                    .delete()
                    .in('id', idsToDelete)
                    .eq('consultant_id', consultantId);

                if (deleteError) {
                    console.error('Error deleting removed reviews:', deleteError);
                    return false;
                }
            }

            // Update existing reviews one by one to respect RLS
            for (const review of existingReviews) {
                const { error: updateError } = await supabase
                    .from('consultant_reviews')
                    .update({
                        reviewer_name: review.client_name,
                        reviewer_role: review.client_role,
                        reviewer_company: review.client_company,
                        review_text: review.review_text,
                        rating: review.rating,
                        reviewer_image_url: review.client_image_url
                    })
                    .eq('id', review.id)
                    .eq('consultant_id', consultantId);

                if (updateError) {
                    console.error('Error updating review:', updateError);
                    return false;
                }
            }

            // Insert new reviews
            if (newReviews.length > 0) {
                const { error: insertError } = await supabase
                    .from('consultant_reviews')
                    .insert(newReviews.map(review => ({
                        consultant_id: consultantId,
                        reviewer_name: review.client_name,
                        reviewer_role: review.client_role,
                        reviewer_company: review.client_company,
                        review_text: review.review_text,
                        rating: review.rating,
                        reviewer_image_url: review.client_image_url,
                        created_at: review.created_at
                    })));

                if (insertError) {
                    console.error('Error inserting new reviews:', insertError);
                    return false;
                }
            }
        }

        return true;
    } catch (error) {
        console.error('Error in updateConsultantReviews:', error);
        return false;
    }
}

export async function updateConsultantMissions(consultantId: string, missions: ConsultantMission[]): Promise<boolean> {
    try {
        // Get current missions to identify ones that need to be deleted
        const { data: currentMissions } = await supabase
            .from('consultant_missions')
            .select('id, title')
            .eq('consultant_id', consultantId);

        if (currentMissions) {
            // Create a map of current missions by title (since we don't have IDs in the frontend)
            const currentMissionsMap = new Map(currentMissions.map(m => [m.title, m.id]));
            const newTitles = new Set(missions.map(m => m.title));

            // Find missions to delete (those that exist in DB but not in the new list)
            const idsToDelete = currentMissions
                .filter(m => !newTitles.has(m.title))
                .map(m => m.id);

            // Delete removed missions
            if (idsToDelete.length > 0) {
                const { error: deleteError } = await supabase
                    .from('consultant_missions')
                    .delete()
                    .in('id', idsToDelete)
                    .eq('consultant_id', consultantId);

                if (deleteError) {
                    console.error('Error deleting removed missions:', deleteError);
                    return false;
                }
            }

            // Separate missions into existing and new ones
            const existingMissions = missions.filter(m => currentMissionsMap.has(m.title));
            const newMissions = missions.filter(m => !currentMissionsMap.has(m.title));

            // Update existing missions one by one
            for (const mission of existingMissions) {
                const missionId = currentMissionsMap.get(mission.title);
                const { error: updateError } = await supabase
                    .from('consultant_missions')
                    .update({
                        title: mission.title,
                        company: mission.company,
                        description: mission.description,
                        duration: mission.duration,
                        start_date: mission.date
                    })
                    .eq('id', missionId)
                    .eq('consultant_id', consultantId);

                if (updateError) {
                    console.error('Error updating mission:', updateError);
                    return false;
                }
            }

            // Insert new missions
            if (newMissions.length > 0) {
                const { error: insertError } = await supabase
                    .from('consultant_missions')
                    .insert(newMissions.map(mission => ({
                        consultant_id: consultantId,
                        title: mission.title,
                        company: mission.company,
                        description: mission.description,
                        duration: mission.duration,
                        start_date: mission.date
                    })));

                if (insertError) {
                    console.error('Error inserting new missions:', insertError);
                    return false;
                }
            }
        }

        return true;
    } catch (error) {
        console.error('Error in updateConsultantMissions:', error);
        return false;
    }
}

export async function getAllConsultants(includeSparkierEmails: boolean = false): Promise<ConsultantProfile[]> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .contains('roles', ['consultant']);

    if (error) {
        console.error('Error fetching all consultants:', error);
        return [];
    }

    const consultants = data as ConsultantProfile[];
    
    if (!includeSparkierEmails) {
        return consultants.filter(c => !c.email.endsWith('@sparkier.io'));
    }

    return consultants;
}
