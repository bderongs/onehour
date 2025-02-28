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

export async function updateSparkAction(slug: string, spark: Partial<Spark>): Promise<Spark> {
  try {
    return await updateSparkServer(slug, spark)
  } catch (error) {
    logger.error('Error in updateSparkAction:', error)
    throw error
  }
}

export async function deleteSparkAction(slug: string): Promise<void> {
  try {
    return await deleteSparkServer(slug)
  } catch (error) {
    logger.error('Error in deleteSparkAction:', error)
    throw error
  }
} 