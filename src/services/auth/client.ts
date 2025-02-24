import { createBrowserClient } from '@/lib/supabase';
import logger from '@/utils/logger';
import type { UserProfile } from './types';
import { transformProfileFromDB } from './types';

export const getCurrentUser = async (): Promise<UserProfile | null> => {
    try {
        const client = createBrowserClient();
        const { data: { user }, error: sessionError } = await client.auth.getUser();

        if (sessionError) {
            logger.error('Error getting session:', sessionError);
            return null;
        }

        if (!user) {
            return null;
        }

        const { data: profile, error: profileError } = await client
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (profileError) {
            logger.error('Error getting user profile:', profileError);
            return null;
        }

        return transformProfileFromDB(profile);
    } catch (error) {
        logger.error('Error in getCurrentUser:', error);
        return null;
    }
};

export const signOut = async (): Promise<void> => {
    try {
        const client = createBrowserClient();
        const { error } = await client.auth.signOut();
        if (error) {
            logger.error('Error signing out:', error);
            throw error;
        }
    } catch (error) {
        logger.error('Error in signOut:', error);
        throw error;
    }
}; 