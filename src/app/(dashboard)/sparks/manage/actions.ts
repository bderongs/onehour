/**
 * actions.ts
 * Server actions for managing sparks, including refreshing the list of sparks
 * to ensure newly created sparks are visible after navigation.
 */
'use server'

import { deleteSpark as deleteSparkServer, getSparksByConsultant } from '@/services/serverSparks'
import { getCurrentUser } from '@/services/auth/server'
import type { Spark } from '@/types/spark'
import logger from '@/utils/logger'

export async function deleteSparkAction(slug: string): Promise<void> {
  try {
    return await deleteSparkServer(slug)
  } catch (error) {
    logger.error('Error in deleteSparkAction:', error)
    throw error
  }
}

/**
 * Refreshes the list of sparks for the current user
 * Used to ensure newly created sparks are visible after navigation
 */
export async function refreshSparksAction(): Promise<Spark[]> {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      throw new Error('User not authenticated')
    }
    
    return await getSparksByConsultant(user.id)
  } catch (error) {
    logger.error('Error in refreshSparksAction:', error)
    return []
  }
} 