import { supabase } from '../lib/supabase';
import { isBrowser } from './browser';

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

        if (context === 'spark') {
            const result = await supabase
                .from('sparks')
                .select('url')
                .eq('url', slug)
                .neq('url', currentSlug || '');
            data = result.data;
            error = result.error;
        } else {
            const result = await supabase
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

export const createObjectURL = (blob: Blob): string | null => {
    if (!isBrowser) return null;
    try {
        return URL.createObjectURL(blob);
    } catch (e) {
        console.error('Error creating object URL:', e);
        return null;
    }
};

export const revokeObjectURL = (url: string): void => {
    if (!isBrowser) return;
    try {
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error('Error revoking object URL:', e);
    }
};

export const setScrollRestoration = (value: ScrollRestoration): void => {
    if (!isBrowser) return;
    if ('scrollRestoration' in history) {
        history.scrollRestoration = value;
    }
}; 