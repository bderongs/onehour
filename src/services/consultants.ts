import { supabase } from '../lib/supabase';
import type { ConsultantProfile, ConsultantReview } from '../types/consultant';
import type { Spark } from '../types/spark';

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
