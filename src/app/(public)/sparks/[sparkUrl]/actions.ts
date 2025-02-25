'use server';

import { getSparkByUrl } from '@/services/serverSparks';
import type { Spark } from '@/types/spark';
import logger from '@/utils/logger';

export async function getSparkByUrlAction(url: string): Promise<Spark | null> {
  try {
    return await getSparkByUrl(url);
  } catch (error) {
    logger.error('Error fetching spark by URL:', error);
    return null;
  }
} 