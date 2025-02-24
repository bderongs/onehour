import { createClient } from '@/lib/supabase/server';
import { generateSlug } from './shared';
import type { SlugContext } from './shared';
import logger from '@/utils/logger';

/**
 * Ensures a unique URL by appending a number if necessary within a specific context
 * Example: If "my-title" exists, returns "my-title-2"
 * This version uses the server-side Supabase client
 */
export const ensureUniqueSlug = async (
    baseSlug: string, 
    context: SlugContext,
    currentSlug?: string
): Promise<string> => {
    let slug = baseSlug;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
        let data, error;
        const client = await createClient();

        if (context === 'spark') {
            const result = await client
                .from('sparks')
                .select('url')
                .eq('url', slug)
                .neq('url', currentSlug || '');
            data = result.data;
            error = result.error;
        } else {
            const result = await client
                .from('profiles')
                .select('slug')
                .eq('slug', slug)
                .neq('slug', currentSlug || '');
            data = result.data;
            error = result.error;
        }

        if (error) {
            logger.error(`Error checking URL uniqueness for ${context}:`, error);
            throw error;
        }

        if (!data || data.length === 0) {
            isUnique = true;
        } else {
            counter++;
            slug = `${baseSlug}-${counter}`;
        }
    }

    return slug;
}; 