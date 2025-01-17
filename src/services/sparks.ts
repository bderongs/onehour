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
const transformSparkToDB = (spark: Spark) => ({
    title: spark.title,
    duration: spark.duration,
    price: spark.price,
    description: spark.description,
    benefits: spark.benefits,
    prefill_text: spark.prefillText,
    highlight: spark.highlight,
    consultant: spark.consultant,
    url: spark.url,
    detailed_description: spark.detailedDescription,
    methodology: spark.methodology,
    target_audience: spark.targetAudience,
    prerequisites: spark.prerequisites,
    deliverables: spark.deliverables,
    expert_profile: spark.expertProfile,
    faq: spark.faq,
    testimonials: spark.testimonials,
    next_steps: spark.nextSteps,
});

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

export const createSpark = async (spark: Spark): Promise<Spark> => {
    // Generate URL from title
    const baseSlug = generateSlug(spark.title);
    const url = await ensureUniqueSlug(baseSlug);

    const sparkWithUrl = {
        ...spark,
        url
    };

    const { data, error } = await supabase
        .from('sparks')
        .insert([transformSparkToDB(sparkWithUrl)])
        .select()
        .single();

    if (error) {
        console.error('Error creating spark:', error);
        throw error;
    }

    return transformSparkFromDB(data);
};

export const updateSpark = async (url: string, spark: Partial<Spark>): Promise<Spark> => {
    // If title is being updated, generate new URL
    let updatedSpark = { ...spark };
    if (spark.title) {
        const baseSlug = generateSlug(spark.title);
        updatedSpark.url = await ensureUniqueSlug(baseSlug, url);
    }

    const { data, error } = await supabase
        .from('sparks')
        .update(transformSparkToDB(updatedSpark as Spark))
        .eq('url', url)
        .select()
        .single();

    if (error) {
        console.error('Error updating spark:', error);
        throw error;
    }

    return transformSparkFromDB(data);
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