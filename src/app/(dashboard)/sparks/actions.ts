'use server'

import { createSpark as createSparkServer, updateSpark as updateSparkServer, deleteSpark as deleteSparkServer } from '@/services/serverSparks'
import type { Spark } from '@/types/spark'
import logger from '@/utils/logger'

export async function createSparkAction(spark: Omit<Spark, 'id'>): Promise<Spark> {
  try {
    return await createSparkServer(spark)
  } catch (error) {
    logger.error('Error in createSparkAction:', error)
    throw error
  }
}

export async function updateSparkAction(url: string, spark: Partial<Spark>): Promise<Spark> {
  try {
    return await updateSparkServer(url, spark)
  } catch (error) {
    logger.error('Error in updateSparkAction:', error)
    throw error
  }
}

export async function deleteSparkAction(url: string): Promise<void> {
  try {
    return await deleteSparkServer(url)
  } catch (error) {
    logger.error('Error in deleteSparkAction:', error)
    throw error
  }
} 