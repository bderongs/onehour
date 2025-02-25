'use server'

import { deleteSpark as deleteSparkServer } from '@/services/serverSparks'
import logger from '@/utils/logger'

export async function deleteSparkAction(url: string): Promise<void> {
  try {
    return await deleteSparkServer(url)
  } catch (error) {
    logger.error('Error in deleteSparkAction:', error)
    throw error
  }
} 