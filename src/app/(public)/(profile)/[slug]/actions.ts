'use server'

import { createClient } from '@/lib/supabase/server'
import type { ConsultantProfile, ConsultantReview, ConsultantMission } from '@/types/consultant'
import type { Spark } from '@/types/spark'
import logger from '@/utils/logger'
import { transformSparkFromDB } from '@/services/serverSparks'

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

export async function getConsultantSparksAction(consultantId: string): Promise<Spark[]> {
    const client = await createClient()
    const { data, error } = await client
        .from('sparks')
        .select('*')
        .eq('consultant', consultantId)
        .order('created_at', { ascending: false })

    if (error) {
        logger.error('Error fetching consultant sparks:', error)
        return []
    }

    return data ? data.map(spark => transformSparkFromDB(spark)) : []
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