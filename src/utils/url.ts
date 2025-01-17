import { supabase } from '../lib/supabase';

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

/**
 * Ensures a unique URL by appending a number if necessary
 * Example: If "my-title" exists, returns "my-title-2"
 */
export const ensureUniqueSlug = async (baseSlug: string, currentUrl?: string): Promise<string> => {
    let slug = baseSlug;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
        const { data } = await supabase
            .from('sparks')
            .select('url')
            .eq('url', slug)
            .neq('url', currentUrl || '') // Ignore current URL when updating
            .single();

        if (!data) {
            isUnique = true;
        } else {
            counter++;
            slug = `${baseSlug}-${counter}`;
        }
    }

    return slug;
}; 