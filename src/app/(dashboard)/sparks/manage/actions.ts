'use server'

import { deleteSpark as deleteSparkServer } from '@/services/serverSparks'
import logger from '@/utils/logger'

export async function deleteSparkAction(slug: string): Promise<void> {
  try {
    return await deleteSparkServer(slug)
  } catch (error) {
    logger.error('Error in deleteSparkAction:', error)
    throw error
  }
} 