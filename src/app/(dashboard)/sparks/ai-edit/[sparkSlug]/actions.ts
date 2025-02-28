'use server';

import { createClient } from '@/lib/supabase/server';
import logger from '@/utils/logger';
import type { Spark } from '@/types/spark';
import { generateSlug } from '@/utils/url/shared';
import { ensureUniqueSlug } from '@/utils/url/server';

// Get a spark by its slug
export async function getSparkBySlug(slug: string): Promise<Spark | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('sparks')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      logger.error('Error fetching spark by slug:', error);
      return null;
    }

    return data ? transformSparkFromDB(data) : null;
  } catch (error) {
    logger.error('Error in getSparkBySlug server action:', error);
    return null;
  }
}

// Update a spark
export async function updateSpark(slug: string, spark: Partial<Spark>): Promise<Spark> {
  try {
    const supabase = await createClient();
    // First, verify the spark exists
    const { data: existingSpark, error: fetchError } = await supabase
      .from('sparks')
      .select('*')
      .eq('slug', slug)
      .single();

    if (fetchError) {
      logger.error('Error fetching spark:', fetchError);
      throw fetchError;
    }

    if (!existingSpark) {
      throw new Error(`Spark with slug ${slug} not found`);
    }

    // If title is being updated, generate new slug
    let updatedSpark = { ...spark };
    if (spark.title) {
      const baseSlug = generateSlug(spark.title);
      // Only generate a new slug if the title has changed
      if (baseSlug !== slug) {
        const { data } = await supabase
          .from('sparks')
          .select('slug')
          .eq('slug', baseSlug)
          .single();

        // If the slug is already taken, generate a unique one
        if (data) {
          updatedSpark.slug = await ensureUniqueSlug(baseSlug, 'spark');
        } else {
          updatedSpark.slug = baseSlug;
        }
      }
    }

    // Convert to DB format
    const dbSpark = transformSparkToDB(updatedSpark);

    // Update the spark
    const { data, error } = await supabase
      .from('sparks')
      .update(dbSpark)
      .eq('slug', slug)
      .select('*')
      .single();

    if (error) {
      logger.error('Error updating spark:', error);
      throw new Error(`Failed to update spark: ${error.message}`);
    }

    return transformSparkFromDB(data);
  } catch (error) {
    logger.error('Error in updateSpark:', error);
    throw error;
  }
}

// Helper functions for data transformation
// Convert database snake_case to camelCase for frontend
const transformSparkFromDB = (dbSpark: any): Spark => ({
  id: dbSpark.id,
  title: dbSpark.title,
  duration: dbSpark.duration,
  price: dbSpark.price,
  description: dbSpark.description,
  benefits: dbSpark.benefits,
  prefillText: dbSpark.prefill_text,
  highlight: dbSpark.highlight,
  consultant: dbSpark.consultant,
  slug: dbSpark.slug,
  detailedDescription: dbSpark.detailed_description,
  methodology: dbSpark.methodology,
  targetAudience: dbSpark.target_audience,
  prerequisites: dbSpark.prerequisites,
  deliverables: dbSpark.deliverables,
  expertProfile: dbSpark.expert_profile,
  faq: dbSpark.faq,
  nextSteps: dbSpark.next_steps,
  imageUrl: dbSpark.image_url,
  socialImageUrl: dbSpark.social_image_url,
  createdAt: dbSpark.created_at,
  updatedAt: dbSpark.updated_at,
});

// Convert frontend camelCase to snake_case for database
const transformSparkToDB = (spark: Partial<Spark>): Record<string, any> => {
  const transformed: Record<string, any> = {};
  
  // Map each field with proper snake_case conversion
  Object.entries(spark).forEach(([key, value]) => {
    if (value === undefined) return;
    if (key === 'id') return; // Skip the id field
    
    // Convert camelCase to snake_case
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    
    // Clean up and transform specific fields
    if (key === 'price' && value !== undefined) {
      // Handle empty string or falsy values as 0
      if (!value) {
        transformed[snakeKey] = '0';
      } else {
        transformed[snakeKey] = value.toString().replace(/[^0-9]/g, '');
      }
    } else if (key === 'duration') {
      // Define allowed durations
      const ALLOWED_DURATIONS = [15, 30, 45, 60, 90, 120];
      
      // Parse the input value to get minutes, handling various formats
      let minutes: number;
      const value_str = value?.toString().toLowerCase() || '60';
      
      // Remove any text and extract the number
      const numberMatch = value_str.match(/\d+/);
      if (!numberMatch) {
        minutes = 60; // Default to 60 if no number found
      } else {
        minutes = parseInt(numberMatch[0], 10);
      }
      
      // Find the closest allowed duration
      if (!ALLOWED_DURATIONS.includes(minutes)) {
        minutes = 60; // Default to 60 if not in allowed values
      }
      
      // Convert to proper HH:MM:SS format
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      transformed[snakeKey] = `${hours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}:00`;
    }
    // Special handling for nested objects
    else if (key === 'expertProfile' && value) {
      transformed['expert_profile'] = value;
    } else if (key === 'targetAudience') {
      transformed['target_audience'] = value;
    } else if (key === 'prefillText') {
      transformed['prefill_text'] = value;
    } else if (key === 'detailedDescription') {
      transformed['detailed_description'] = value;
    } else if (key === 'nextSteps') {
      transformed['next_steps'] = value;
    } else {
      transformed[snakeKey] = value;
    }
  });

  return transformed;
}; 