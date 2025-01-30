import { supabase } from '../lib/supabase';
import type { Spark } from '../types/spark';
import { generateSlug, ensureUniqueSlug } from '../utils/url';

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
    url: dbSpark.url,
    detailedDescription: dbSpark.detailed_description,
    methodology: dbSpark.methodology,
    targetAudience: dbSpark.target_audience,
    prerequisites: dbSpark.prerequisites,
    deliverables: dbSpark.deliverables,
    expertProfile: dbSpark.expert_profile,
    faq: dbSpark.faq,
    testimonials: dbSpark.testimonials,
    nextSteps: dbSpark.next_steps,
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
    const { data, error } = await supabase
        .from('sparks')
        .select('*')
        .order('title');

    if (error) {
        console.error('Error fetching sparks:', error);
        throw error;
    }

    return data.map(transformSparkFromDB);
};

export const getSparkByUrl = async (url: string): Promise<Spark | null> => {
    const { data, error } = await supabase
        .from('sparks')
        .select('*')
        .eq('url', url)
        .single();

    if (error) {
        if (error.code === 'PGRST116') { // Record not found
            return null;
        }
        console.error('Error fetching spark:', error);
        throw error;
    }

    return transformSparkFromDB(data);
};

export const getSparksByConsultant = async (consultantId: string): Promise<Spark[]> => {
    const { data, error } = await supabase
        .from('sparks')
        .select('*')
        .eq('consultant', consultantId)
        .order('title');

    if (error) {
        console.error('Error fetching consultant sparks:', error);
        throw error;
    }

    return data.map(transformSparkFromDB);
};

export const createSpark = async (spark: Omit<Spark, 'id'>): Promise<Spark> => {
    // Generate URL from title
    const baseSlug = generateSlug(spark.title);
    const url = await ensureUniqueSlug(baseSlug);

    // Create a new object without the id field and with the generated URL
    const sparkData = {
        ...spark,
        url
    };

    const { data, error } = await supabase
        .from('sparks')
        .insert([transformSparkToDB(sparkData)])
        .select()
        .single();

    if (error) {
        console.error('Error creating spark:', error);
        throw error;
    }

    return transformSparkFromDB(data);
};

export const updateSpark = async (url: string, spark: Partial<Spark>): Promise<Spark> => {
    // First, verify the spark exists
    const { data: existingSpark, error: fetchError } = await supabase
        .from('sparks')
        .select('*')
        .eq('url', url)
        .single();

    if (fetchError) {
        console.error('Error fetching spark:', fetchError);
        throw fetchError;
    }

    if (!existingSpark) {
        throw new Error(`Spark with URL ${url} not found`);
    }

    // If title is being updated, generate new URL
    let updatedSpark = { ...spark };
    if (spark.title) {
        const baseSlug = generateSlug(spark.title);
        // Only generate a new URL if the title has changed
        if (baseSlug !== url) {
            const { data } = await supabase
                .from('sparks')
                .select('url')
                .eq('url', baseSlug)
                .single();

            // If the URL is already taken, generate a unique one
            if (data) {
                updatedSpark.url = await ensureUniqueSlug(baseSlug);
            } else {
                updatedSpark.url = baseSlug;
            }
        }
    }

    // Remove id and transform using the same function as create
    const { id, ...updateFields } = updatedSpark;
    const transformedUpdate = transformSparkToDB(updateFields);

    // First update the spark - try without select first
    const { error: updateError } = await supabase
        .from('sparks')
        .update(transformedUpdate)
        .eq('url', url);

    if (updateError) {
        console.error('Error updating spark:', updateError);
        throw updateError;
    }

    // Then fetch the updated record
    const { data: updatedData, error: fetchUpdatedError } = await supabase
        .from('sparks')
        .select('*')
        .eq('url', updatedSpark.url || url)
        .single();

    if (fetchUpdatedError) {
        console.error('Error fetching updated spark:', fetchUpdatedError);
        throw fetchUpdatedError;
    }

    if (!updatedData) {
        throw new Error(`Failed to fetch updated spark with URL ${url}`);
    }

    return transformSparkFromDB(updatedData);
};

export const deleteSpark = async (url: string): Promise<void> => {
    const { error } = await supabase
        .from('sparks')
        .delete()
        .eq('url', url);

    if (error) {
        console.error('Error deleting spark:', error);
        throw error;
    }
}; 