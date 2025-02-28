/**
 * actions.ts
 * Server actions for spark management in the admin dashboard.
 */
'use server'

import { createClient } from '@/lib/supabase/server'
import type { Spark } from '@/types/spark'
import logger from '@/utils/logger'
import { transformSparkFromDB } from '@/services/serverSparks'

export async function getSparksAction(): Promise<Spark[]> {
    try {
        const client = await createClient()
        const { data, error } = await client
            .from('sparks')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            logger.error('Error fetching sparks:', error)
            return []
        }

        // Transform the database response to the Spark type
        return data ? data.map(spark => transformSparkFromDB(spark)) : []
    } catch (error) {
        logger.error('Error in getSparks:', error)
        return []
    }
}

export async function deleteSparkAction(sparkSlug: string): Promise<boolean> {
    try {
        const client = await createClient()
        const { error } = await client
            .from('sparks')
            .delete()
            .eq('slug', sparkSlug)

        if (error) {
            logger.error('Error deleting spark:', error)
            return false
        }

        return true
    } catch (error) {
        logger.error('Error in deleteSpark:', error)
        return false
    }
} 