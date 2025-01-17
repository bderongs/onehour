import { createClient } from '@supabase/supabase-js';
import type { Spark } from '../src/types/spark.js';
import { supabaseUrl } from './config.js';

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl!, process.env.SUPABASE_SERVICE_ROLE_KEY || '');

// Convert database snake_case to camelCase for frontend
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
});

export const createSpark = async (spark: Spark): Promise<Spark> => {
    const { data, error } = await supabase
        .from('sparks')
        .insert([transformSparkToDB(spark)])
        .select()
        .single();

    if (error) {
        throw error;
    }

    return spark;
}; 