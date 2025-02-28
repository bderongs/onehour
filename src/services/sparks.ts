import { createClient } from '@/lib/supabase/client';
import logger from '../utils/logger';
import type { Spark } from '../types/spark';
import { generateSlug } from '@/utils/url/shared';

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

export const getSparks = async (): Promise<Spark[]> => {
    try {
        const client = createClient();
        const { data, error } = await client
            .from('sparks')
            .select('*')
            .order('title');

        if (error) {
            logger.error('Error fetching sparks:', error);
            throw error;
        }

        if (!data) {
            throw new Error('No data received from Supabase');
        }

        return data.map(transformSparkFromDB);
    } catch (err) {
        logger.error('Error in getSparks:', err);
        throw err;
    }
};

export const getSparkBySlug = async (slug: string): Promise<Spark | null> => {
    try {
        const supabase = createClient();
        const { data, error } = await supabase
            .from('sparks')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            logger.error('Error fetching spark by slug', { error, slug });
            return null;
        }

        return data ? transformSparkFromDB(data) : null;
    } catch (error) {
        logger.error('Exception fetching spark by slug', { error, slug });
        return null;
    }
};

export const getSparksByConsultant = async (consultantId: string): Promise<Spark[]> => {
    const client = createClient();
    const { data, error } = await client
        .from('sparks')
        .select('*')
        .eq('consultant', consultantId)
        .order('title');

    if (error) {
        logger.error('Error fetching consultant sparks:', error);
        throw error;
    }

    return data.map(transformSparkFromDB);
};

// Note: For client-side, we don't implement createSpark, updateSpark, and deleteSpark
// as these operations should be performed server-side

export const getSparkById = async (id: string): Promise<Spark | null> => {
    const client = createClient();
    const { data, error } = await client
        .from('sparks')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        logger.error('Error fetching spark by ID:', error);
        return null;
    }

    return data ? transformSparkFromDB(data) : null;
}; 