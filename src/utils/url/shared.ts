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

// Get the site URL based on environment
export const getSiteUrl = () => {
    const url = process.env.NEXT_PUBLIC_SITE_URL;
    
    if (!url) {
        const errorMessage = 'NEXT_PUBLIC_SITE_URL environment variable is not defined';
        console.error(errorMessage);
        
        // Provide a fallback for development
        if (process.env.NODE_ENV === 'development') {
            console.warn('Using fallback URL for development: http://localhost:3000');
            return 'http://localhost:3000';
        }
        
        throw new Error(errorMessage);
    }
    
    return url;
};

export type SlugContext = 'spark' | 'profile'; 