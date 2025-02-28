/**
 * actions.ts
 * Server actions for fetching Spark data by slug
 */
'use server';

import { getSparkBySlug } from '@/services/serverSparks';
import type { Spark } from '@/types/spark';
import logger from '@/utils/logger';

export async function getSparkBySlugAction(slug: string): Promise<Spark | null> {
  try {
    return await getSparkBySlug(slug);
  } catch (error) {
    logger.error('Error fetching spark by slug:', error);
    return null;
  }
} 