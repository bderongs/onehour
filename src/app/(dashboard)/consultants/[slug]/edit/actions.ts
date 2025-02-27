// Purpose: Server actions for consultant profile editing
// This file contains all the server-side functions needed for the consultant profile edit page
'use server'

import { createClient } from '@/lib/supabase/server'
import type { ConsultantProfile, ConsultantReview, ConsultantMission } from '@/types/consultant'
import logger from '@/utils/logger'
import { generateSlug } from '@/utils/url/shared'
import { ensureUniqueSlug } from '@/utils/url/server'

/**
 * Fetches a consultant profile by slug
 */
export async function getConsultantBySlugAction(slug: string): Promise<ConsultantProfile | null> {
    const client = await createClient()
    const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('slug', slug)
        .contains('roles', ['consultant'])
        .single()

    if (error) {
        logger.error('Error fetching consultant profile by slug:', error)
        return null
    }

    return data as ConsultantProfile
}

export async function getConsultantProfileAction(id: string): Promise<ConsultantProfile | null> {
    const client = await createClient()
    const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', id)
        .contains('roles', ['consultant'])
        .single()

    if (error) {
        logger.error('Error fetching consultant profile:', error)
        return null
    }

    return data as ConsultantProfile
}

export async function getConsultantReviewsAction(consultantId: string): Promise<ConsultantReview[]> {
    const client = await createClient()
    const { data, error } = await client
        .from('consultant_reviews')
        .select('*')
        .eq('consultant_id', consultantId)
        .order('created_at', { ascending: false })

    if (error) {
        logger.error('Error fetching consultant reviews:', error)
        return []
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
    }))
}

export async function getConsultantMissionsAction(consultantId: string): Promise<ConsultantMission[]> {
    const client = await createClient()
    const { data, error } = await client
        .from('consultant_missions')
        .select('*')
        .eq('consultant_id', consultantId)
        .order('start_date', { ascending: false })

    if (error) {
        logger.error('Error fetching consultant missions:', error)
        return []
    }

    return data.map((mission: any) => ({
        title: mission.title,
        company: mission.company,
        description: mission.description,
        duration: mission.duration,
        date: mission.start_date
    }))
}

export async function updateConsultantProfileAction(id: string, profile: Partial<ConsultantProfile>): Promise<ConsultantProfile | null> {
    const client = await createClient()
    
    // If name is being updated, generate new slug
    let updatedProfile = { ...profile }
    if (profile.first_name || profile.last_name) {
        // Get current profile to get the full name
        const { data: currentProfile, error: fetchError } = await client
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', id)
            .single()

        if (fetchError) {
            logger.error('Error fetching current profile:', fetchError)
            return null
        }

        const firstName = profile.first_name || currentProfile.first_name
        const lastName = profile.last_name || currentProfile.last_name
        const baseSlug = generateSlug(`${firstName} ${lastName}`)
        
        // Generate new slug
        updatedProfile.slug = await ensureUniqueSlug(baseSlug, 'profile', profile.slug)
    }

    // Update the profile
    const { data, error } = await client
        .from('profiles')
        .update(updatedProfile as Partial<ConsultantProfile>)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        logger.error('Error updating consultant profile:', error)
        return null
    }

    return data as ConsultantProfile
}

export async function updateConsultantReviewsAction(consultantId: string, reviews: ConsultantReview[]): Promise<boolean> {
    try {
        // Get current reviews to identify ones that need to be deleted
        const client = await createClient()
        const { data: currentReviews } = await client
            .from('consultant_reviews')
            .select('id')
            .eq('consultant_id', consultantId)

        if (currentReviews) {
            const currentIds = new Set(currentReviews.map((r: { id: string }) => r.id))
            const existingReviews = reviews.filter(review => !review.id.startsWith('temp-'))
            const newReviews = reviews.filter(review => review.id.startsWith('temp-'))
            const keepIds = new Set(existingReviews.map(r => r.id))
            const idsToDelete = Array.from(currentIds).filter((id: unknown): id is string => 
                typeof id === 'string' && !keepIds.has(id)
            )

            // Delete reviews that are no longer present
            if (idsToDelete.length > 0) {
                const { error: deleteError } = await client
                    .from('consultant_reviews')
                    .delete()
                    .in('id', idsToDelete)
                    .eq('consultant_id', consultantId)

                if (deleteError) {
                    logger.error('Error deleting removed reviews:', deleteError)
                    return false
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
                    .eq('consultant_id', consultantId)

                if (updateError) {
                    logger.error('Error updating review:', updateError)
                    return false
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
                    })))

                if (insertError) {
                    logger.error('Error inserting new reviews:', insertError)
                    return false
                }
            }
        }

        return true
    } catch (error) {
        logger.error('Error in updateConsultantReviews:', error)
        return false
    }
}

export async function updateConsultantMissionsAction(consultantId: string, missions: ConsultantMission[]): Promise<boolean> {
    try {
        const client = await createClient()
        const { data: currentMissions } = await client
            .from('consultant_missions')
            .select('id, title')
            .eq('consultant_id', consultantId)

        if (currentMissions) {
            // Delete all existing missions
            const { error: deleteError } = await client
                .from('consultant_missions')
                .delete()
                .eq('consultant_id', consultantId)

            if (deleteError) {
                logger.error('Error deleting existing missions:', deleteError)
                return false
            }

            // Insert all missions as new
            if (missions.length > 0) {
                const { error: insertError } = await client
                    .from('consultant_missions')
                    .insert(missions.map(mission => ({
                        consultant_id: consultantId,
                        title: mission.title,
                        company: mission.company,
                        description: mission.description,
                        duration: mission.duration,
                        start_date: mission.date
                    })))

                if (insertError) {
                    logger.error('Error inserting missions:', insertError)
                    return false
                }
            }
        }

        return true
    } catch (error) {
        logger.error('Error in updateConsultantMissions:', error)
        return false
    }
} 