import { supabase } from '../lib/supabase';
import logger from '../utils/logger';

const getSiteUrl = () => {
    return import.meta.env.VITE_SUPABASE_URL;
};

/**
 * Deletes a user completely from both auth and profiles.
 * This is a permanent action and cannot be undone.
 * 
 * @param userId - The ID of the user to delete
 * @throws Error if the deletion fails
 */
export const deleteUser = async (userId: string): Promise<void> => {
    try {
        // Call our Edge Function to delete the user
        const response = await fetch(`${getSiteUrl()}/functions/v1/delete-user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
            },
            body: JSON.stringify({ userId })
        });

        if (!response.ok) {
            const error = await response.json();
            logger.error('Error deleting user:', error);
            throw new Error(error.error || 'Failed to delete user');
        }

        logger.info('User deleted successfully:', userId);
    } catch (error) {
        logger.error('Error in deleteUser:', error);
        throw error;
    }
}; 
