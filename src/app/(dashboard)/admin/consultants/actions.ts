'use server'

import { createClient } from '@/lib/supabase/server'
import type { ConsultantProfile } from '@/types/consultant'
import type { Spark } from '@/types/spark'
import logger from '@/utils/logger'
import { deleteUser } from '@/services/auth/server'
import { transformSparkFromDB } from '@/services/serverSparks'

export async function getAllConsultantsAction(includeSparkierEmails: boolean = false): Promise<ConsultantProfile[]> {
    const client = await createClient()
    
    let query = client
        .from('profiles')
        .select('*')
        .contains('roles', ['consultant'])
        .order('created_at', { ascending: false })
    
    if (!includeSparkierEmails) {
        query = query.not('email', 'like', '%@sparkier.io')
    }
    
    const { data, error } = await query
    
    if (error) {
        logger.error('Error fetching all consultants:', error)
        return []
    }
    
    return data as ConsultantProfile[]
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

    // Transform the database response to the Spark type
    return data ? data.map(spark => transformSparkFromDB(spark)) : []
}

export async function deleteConsultantAction(consultantId: string): Promise<boolean> {
    try {
        // First delete the user from auth
        try {
            await deleteUser(consultantId)
        } catch (error) {
            logger.error('Failed to delete consultant from auth', error)
            return false
        }

        // Then delete from profiles table
        const client = await createClient()
        const { error } = await client
            .from('profiles')
            .delete()
            .eq('id', consultantId)

        if (error) {
            logger.error('Error deleting consultant profile:', error)
            return false
        }

        return true
    } catch (error) {
        logger.error('Error in deleteConsultant:', error)
        return false
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