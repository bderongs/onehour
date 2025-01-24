import { supabase } from '../lib/supabase';
import type { ConsultantProfile, ConsultantReview } from '../types/consultant';
import type { Spark } from '../types/spark';
import type { ConsultantMission } from '../types/consultant';

export async function getConsultantProfile(id: string): Promise<ConsultantProfile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('role', 'consultant')
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

export async function updateConsultantProfile(id: string, profile: Partial<ConsultantProfile>): Promise<ConsultantProfile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .update({
            ...profile,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('role', 'consultant')
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
    // First, delete all existing reviews for this consultant
    const { error: deleteError } = await supabase
        .from('consultant_reviews')
        .delete()
        .eq('consultant_id', consultantId);

    if (deleteError) {
        console.error('Error deleting existing reviews:', deleteError);
        return false;
    }

    // Then insert the new reviews
    if (reviews.length > 0) {
        const { error: insertError } = await supabase
            .from('consultant_reviews')
            .insert(reviews.map(review => ({
                // Remove the id field completely to let the database generate a new one
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

    return true;
}

export async function updateConsultantMissions(consultantId: string, missions: ConsultantMission[]): Promise<boolean> {
    // First, delete all existing missions for this consultant
    const { error: deleteError } = await supabase
        .from('consultant_missions')
        .delete()
        .eq('consultant_id', consultantId);

    if (deleteError) {
        console.error('Error deleting existing missions:', deleteError);
        return false;
    }

    // Then insert the new missions
    if (missions.length > 0) {
        const { error: insertError } = await supabase
            .from('consultant_missions')
            .insert(missions.map(mission => ({
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

    return true;
}
