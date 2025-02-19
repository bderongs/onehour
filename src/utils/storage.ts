// Browser storage utilities
export const browserStorage = {
    get: (key: string): string | null => {
        if (typeof window === 'undefined') return null;
        try {
            return localStorage.getItem(key);
        } catch (e) {
            console.error('Error accessing localStorage:', e);
            return null;
        }
    },

    set: (key: string, value: string): void => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(key, value);
        } catch (e) {
            console.error('Error writing to localStorage:', e);
        }
    },

    remove: (key: string): void => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    }
}; 