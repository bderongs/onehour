import { createClient } from '../lib/supabase';

/**
 * Converts a string to a URL-friendly slug
 * Example: "My Great Title!" -> "my-great-title"
 */
export const generateSlug = (text: string): string => {
    return text
        .toLowerCase() // Convert to lowercase
        .normalize('NFD') // Normalize unicode characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        .substring(0, 100); // Limit length to 100 chars
};

type SlugContext = 'spark' | 'profile';

/**
 * Ensures a unique URL by appending a number if necessary within a specific context
 * Example: If "my-title" exists, returns "my-title-2"
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
        const client = createClient();

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
            console.error(`Error checking URL uniqueness for ${context}:`, error);
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

// Get the site URL based on environment
export const getSiteUrl = () => {
    const url = process.env.NEXT_PUBLIC_SITE_URL;
    if (!url) {
        throw new Error('NEXT_PUBLIC_SITE_URL environment variable is not defined');
    }
    return url;
}; 