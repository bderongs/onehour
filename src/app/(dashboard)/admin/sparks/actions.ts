'use server'

import { createClient } from '@/lib/supabase/server'
import type { Spark } from '@/types/spark'
import logger from '@/utils/logger'

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

        return data as Spark[]
    } catch (error) {
        logger.error('Error in getSparks:', error)
        return []
    }
}

export async function deleteSparkAction(sparkUrl: string): Promise<boolean> {
    try {
        const client = await createClient()
        const { error } = await client
            .from('sparks')
            .delete()
            .eq('url', sparkUrl)

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