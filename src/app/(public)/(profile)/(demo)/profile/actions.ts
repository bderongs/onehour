'use server';

import { getConsultantProfile } from '@/services/consultants';
import logger from '@/utils/logger';

export async function getDemoConsultantSlug(demoConsultantId: string): Promise<string | null> {
  try {
    if (!demoConsultantId) {
      logger.error('Missing demo consultant ID');
      return null;
    }

    const consultant = await getConsultantProfile(demoConsultantId);
    
    if (!consultant || !consultant.slug) {
      logger.error('Demo consultant not found or missing slug');
      return null;
    }

    return consultant.slug;
  } catch (error) {
    logger.error('Error fetching demo consultant slug:', error);
    return null;
  }
} 