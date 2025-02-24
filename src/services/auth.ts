import { createClient } from '@/lib/supabase'
import { generateSlug, getSiteUrl } from '@/utils/url/shared';
import { ensureUniqueSlug as ensureUniqueSlugServer } from '@/utils/url/server';
import logger from '../utils/logger';
import type { AuthError } from '@supabase/supabase-js';
import type { Database } from '@/lib/supabase/database.types';

export interface ConsultantSignUpData {
    email: string;
    firstName: string;
    lastName: string;
    linkedin?: string;
}

export interface ClientSignUpData {
    email: string;
    firstName: string;
    lastName: string;
    sparkUrlSlug?: string;
}

export type UserRole = 'admin' | 'consultant' | 'client';

export interface UserProfile {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    roles: UserRole[];
    linkedin?: string | null;
    createdAt: string;
    updatedAt: string;
}

// Helper function to generate a temporary password
const generateTempPassword = () => {
    const length = 16;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};

// Helper function to transform profile from DB format to our format
const transformProfileFromDB = (profile: Database['public']['Tables']['profiles']['Row']): UserProfile => ({
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    roles: profile.roles as UserRole[],
    linkedin: profile.linkedin,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at
});

export const signUpConsultantWithEmail = async (data: ConsultantSignUpData) => {
    const siteUrl = getSiteUrl();
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    while (retryCount < maxRetries) {
        try {
            const client = await createClient();
            // Create the auth user with email confirmation
            const { data: authData, error: authError } = await client.auth.signUp({
                email: data.email,
                password: generateTempPassword(),
                options: {
                    emailRedirectTo: `${siteUrl}/sparks/manage`,
                    data: {
                        first_name: data.firstName,
                        last_name: data.lastName,
                    }
                }
            });

            if (authError) {
                // If it's a timeout or network error, retry
                if (authError.message?.includes('timeout') || authError.message?.includes('network') || authError.message === '{}') {
                    retryCount++;
                    if (retryCount < maxRetries) {
                        logger.info(`Retry attempt ${retryCount} for signup`);
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        continue;
                    }
                }
                throw authError;
            }

            // Determine roles
            const roles = ['consultant'];

            // Create the profile
            const { error: profileError } = await client.from('profiles').insert({
                id: authData.user?.id,
                email: data.email,
                first_name: data.firstName,
                last_name: data.lastName,
                roles: roles,
                linkedin: data.linkedin,
            });

            if (profileError) throw profileError;

            return authData;
        } catch (error) {
            logger.error('Error during consultant signup:', error);
            throw error;
        }
    }
};

export const signUpClientWithEmail = async (data: ClientSignUpData) => {
    const siteUrl = getSiteUrl();
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    while (retryCount < maxRetries) {
        try {
            const client = await createClient();
            // Create the auth user with email confirmation
            const { data: authData, error: authError } = await client.auth.signUp({
                email: data.email,
                password: generateTempPassword(),
                options: {
                    emailRedirectTo: data.sparkUrlSlug 
                        ? `${siteUrl}/client/spark-request-handler?spark_url=${encodeURIComponent(data.sparkUrlSlug)}`
                        : `${siteUrl}/client/dashboard`,
                    data: {
                        first_name: data.firstName,
                        last_name: data.lastName,
                    }
                }
            });

            if (authError) {
                // If it's a timeout or network error, retry
                if (authError.message?.includes('timeout') || authError.message?.includes('network') || authError.message === '{}') {
                    retryCount++;
                    if (retryCount < maxRetries) {
                        logger.info(`Retry attempt ${retryCount} for signup`);
                        await new Promise(resolve => setTimeout(resolve, retryDelay));
                        continue;
                    }
                }
                throw authError;
            }

            // Determine roles
            const roles = ['client'];

            // Create the profile
            const { error: profileError } = await client.from('profiles').insert({
                id: authData.user?.id,
                email: data.email,
                first_name: data.firstName,
                last_name: data.lastName,
                roles: roles,
            });

            if (profileError) throw profileError;

            return authData;
        } catch (error) {
            logger.error('Error during client signup:', error);
            throw error;
        }
    }
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
    try {
        const client = await createClient()
        const { data: { user }, error: sessionError } = await client.auth.getUser()

        if (sessionError) {
            logger.error('Error getting session:', sessionError)
            return null
        }

        if (!user) {
            return null
        }

        const { data: profile, error: profileError } = await client
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        if (profileError) {
            logger.error('Error getting user profile:', profileError)
            return null
        }

        return {
            id: profile.id,
            email: profile.email,
            firstName: profile.first_name,
            lastName: profile.last_name,
            roles: profile.roles as UserRole[],
            linkedin: profile.linkedin,
            createdAt: profile.created_at,
            updatedAt: profile.updated_at
        }
    } catch (error) {
        logger.error('Error in getCurrentUser:', error)
        return null
    }
}

export const resendConfirmationEmail = async (email: string): Promise<void> => {
    const siteUrl = getSiteUrl();
    const client = await createClient();
    
    const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/callback`
    });

    if (error) {
        logger.error('Error sending confirmation email:', error);
        throw error;
    }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
    const client = await createClient();
    const { data: profile, error } = await client
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

    if (error) {
        logger.error('Error checking email existence:', error);
        throw error;
    }

    return !!profile;
};

export const deleteUser = async (userId: string): Promise<void> => {
    const client = await createClient();
    const { error: deleteError } = await client.rpc('delete_user', {
        user_id: userId
    });

    if (deleteError) {
        logger.error('Error deleting user:', deleteError);
        throw deleteError;
    }
};

export const isConsultant = async (): Promise<boolean> => {
    const user = await getCurrentUser();
    return user?.roles.includes('consultant') ?? false;
};

export const isAdmin = async (): Promise<boolean> => {
    const user = await getCurrentUser();
    return user?.roles.includes('admin') ?? false;
};

export const isClient = async (): Promise<boolean> => {
    const user = await getCurrentUser();
    return user?.roles.includes('client') ?? false;
};

export const updateUserRoles = async (userId: string, roles: UserRole[], currentRoles: UserRole[] = []): Promise<void> => {
    // Only admins can update roles
    const currentUser = await getCurrentUser();
    if (!currentUser?.roles.includes('admin')) {
        throw new Error('Only administrators can update user roles');
    }

    const client = await createClient();
    // If adding consultant role, we need to handle slug generation
    if (roles.includes('consultant') && !currentRoles.includes('consultant')) {
        // Get user info to generate slug
        const { data: profile, error: profileError } = await client
            .from('profiles')
            .select('first_name, last_name, slug')
            .eq('id', userId)
            .single();

        if (profileError) {
            logger.error('Error fetching profile for slug generation:', profileError);
            throw profileError;
        }

        // Generate slug if needed
        const baseSlug = generateSlug(`${profile.first_name} ${profile.last_name}`);
        const slug = await ensureUniqueSlugServer(baseSlug, 'profile');

        // Update both roles and slug
        const { error: updateError } = await client
            .from('profiles')
            .update({ roles, slug })
            .eq('id', userId);

        if (updateError) {
            logger.error('Error updating user roles and slug:', updateError);
            throw updateError;
        }
    } else {
        // Just update roles
        const { error } = await client
            .from('profiles')
            .update({ roles })
            .eq('id', userId);

        if (error) {
            logger.error('Error updating user roles:', error);
            throw error;
        }
    }
};

export const signOut = async (): Promise<void> => {
    try {
        const client = await createClient()
        const { error } = await client.auth.signOut()
        if (error) {
            logger.error('Error signing out:', error)
            throw error
        }
    } catch (error) {
        logger.error('Error in signOut:', error)
        throw error
    }
}

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
    try {
        const client = await createClient()
        
        // Convert camelCase to snake_case for database
        const dbUpdates: Record<string, any> = {}
        if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName
        if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName
        if (updates.roles !== undefined) dbUpdates.roles = updates.roles
        
        const { data, error } = await client
            .from('profiles')
            .update(dbUpdates)
            .eq('id', userId)
            .select()
            .single()

        if (error) {
            logger.error('Error updating user profile:', error)
            throw error
        }

        return {
            id: data.id,
            email: data.email,
            firstName: data.first_name,
            lastName: data.last_name,
            roles: data.roles as UserRole[],
            linkedin: data.linkedin,
            createdAt: data.created_at,
            updatedAt: data.updated_at
        }
    } catch (error) {
        logger.error('Error in updateUserProfile:', error)
        throw error
    }
} 