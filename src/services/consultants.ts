import { createClient } from '@/lib/supabase/server';
import type { ConsultantProfile, ConsultantReview } from '../types/consultant';
import type { Spark } from '../types/spark';
import type { ConsultantMission } from '../types/consultant';
import { generateSlug } from '@/utils/url/shared';
import { ensureUniqueSlug as ensureUniqueSlugServer } from '@/utils/url/server';
import { deleteUserAction } from '@/app/(public)/auth/actions';
import logger from '@/utils/logger';

// Transform database response to ConsultantProfile
const transformConsultantFromDB = (data: any): ConsultantProfile => ({
    id: data.id,
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    roles: data.roles,
    linkedin: data.linkedin,
    slug: data.slug,
    created_at: data.created_at,
    updated_at: data.updated_at
});

export async function getConsultantProfile(id: string): Promise<ConsultantProfile | null> {
    const client = await createClient();
    const { data, error } = await client
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
    const client = await createClient();
    const { data, error } = await client
        .from('consultant_reviews')
        .select('*')
        .eq('consultant_id', consultantId)
        .order('created_at', { ascending: false });

    if (error) {
        logger.error('Error fetching consultant reviews:', error);
        return [];
    }

    return data.map((review: any) => ({
        id: review.id,
        consultant_id: review.consultant_id,
        client_name: review.reviewer_name,
        client_role: review.reviewer_role,
        client_company: review.reviewer_company,
        review_text: review.review_text,
        rating: review.rating,
        client_image_url: review.reviewer_image_url,
        created_at: review.created_at
    }));
}

export async function getConsultantSparks(consultantId: string): Promise<Spark[]> {
    const client = await createClient();
    const { data, error } = await client
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
    const client = await createClient();
    const { data, error } = await client
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

export const updateConsultantProfile = async (id: string, profile: Partial<ConsultantProfile>): Promise<ConsultantProfile> => {
    const client = await createClient();
    
    // If name is being updated, generate new slug
    let updatedProfile = { ...profile };
    if (profile.first_name || profile.last_name) {
        // Get current profile to get the full name
        const { data: currentProfile, error: fetchError } = await client
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', id)
            .single();

        if (fetchError) {
            logger.error('Error fetching current profile:', fetchError);
            throw fetchError;
        }

        const firstName = profile.first_name || currentProfile.first_name;
        const lastName = profile.last_name || currentProfile.last_name;
        const baseSlug = generateSlug(`${firstName} ${lastName}`);
        
        // Generate new slug
        updatedProfile.slug = await ensureUniqueSlugServer(baseSlug, 'profile', profile.slug);
    }

    // Update the profile
    const { data, error } = await client
        .from('profiles')
        .update(updatedProfile)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        logger.error('Error updating consultant profile:', error);
        throw error;
    }

    return transformConsultantFromDB(data);
};

export async function getConsultantMissions(consultantId: string): Promise<ConsultantMission[]> {
    const client = await createClient();
    const { data, error } = await client
        .from('consultant_missions')
        .select('*')
        .eq('consultant_id', consultantId)
        .order('start_date', { ascending: false });

    if (error) {
        logger.error('Error fetching consultant missions:', error);
        return [];
    }

    return data.map((mission: any) => ({
        title: mission.title,
        company: mission.company,
        description: mission.description,
        duration: mission.duration,
        date: mission.start_date
    }));
}

export async function updateConsultantReviews(consultantId: string, reviews: ConsultantReview[]): Promise<boolean> {
    try {
        // Get current reviews to identify ones that need to be deleted
        const client = await createClient();
        const { data: currentReviews } = await client
            .from('consultant_reviews')
            .select('id')
            .eq('consultant_id', consultantId);

        if (currentReviews) {
            const currentIds = new Set(currentReviews.map((r: { id: string }) => r.id));
            const existingReviews = reviews.filter(review => !review.id.startsWith('temp-'));
            const newReviews = reviews.filter(review => review.id.startsWith('temp-'));
            const keepIds = new Set(existingReviews.map(r => r.id));
            const idsToDelete = Array.from(currentIds).filter((id: unknown): id is string => 
                typeof id === 'string' && !keepIds.has(id)
            );

            // Delete reviews that are no longer present
            if (idsToDelete.length > 0) {
                const { error: deleteError } = await client
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
                const { error: updateError } = await client
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
                const { error: insertError } = await client
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
        logger.error('Error in updateConsultantReviews:', error);
        return false;
    }
}

export async function updateConsultantMissions(consultantId: string, missions: ConsultantMission[]): Promise<boolean> {
    try {
        const client = await createClient();
        const { data: currentMissions } = await client
            .from('consultant_missions')
            .select('id, title')
            .eq('consultant_id', consultantId);

        if (currentMissions) {
            const currentMissionsMap = new Map(
                currentMissions.map((m: { title: string; id: string }) => [m.title, m.id])
            );
            const newTitles = new Set(missions.map(m => m.title));

            const idsToDelete = currentMissions
                .filter((m: { title: string }) => !newTitles.has(m.title))
                .map((m: { id: string }) => m.id);

            // Delete removed missions
            if (idsToDelete.length > 0) {
                const { error: deleteError } = await client
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
                const { error: updateError } = await client
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
                const { error: insertError } = await client
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
        logger.error('Error in updateConsultantMissions:', error);
        return false;
    }
}

export async function getAllConsultants(includeSparkierEmails: boolean = false): Promise<ConsultantProfile[]> {
    const client = await createClient();
    const { data, error } = await client
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

export async function deleteConsultant(consultantId: string): Promise<boolean> {
    try {
        // First, verify that the user exists and is a consultant
        const client = await createClient();
        const { data: profile, error: profileError } = await client
            .from('profiles')
            .select('roles')
            .eq('id', consultantId)
            .single();

        if (profileError) {
            console.error('Error getting profile:', profileError);
            return false;
        }

        if (!profile || !profile.roles.includes('consultant')) {
            console.error('User not found or is not a consultant');
            return false;
        }

        // Delete the user from Supabase Auth
        // The profile will be automatically deleted due to ON DELETE CASCADE
        await deleteUserAction(consultantId);
        return true;
    } catch (error) {
        console.error('Error deleting consultant:', error);
        return false;
    }
}

/**
 * Get a consultant profile by UUID
 * @param uuid The UUID of the consultant
 */
export async function getConsultantByUuid(uuid: string): Promise<ConsultantProfile | null> {
    const client = await createClient();
    const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', uuid)
        .contains('roles', ['consultant'])
        .single();

    if (error) {
        console.error('Error fetching consultant profile by UUID:', error);
        return null;
    }

    return data as ConsultantProfile;
}
