'use server'

import { createSpark as createSparkServer } from '@/services/serverSparks'
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