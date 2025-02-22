import { supabase } from '@/lib/supabase'
import { generateSlug, ensureUniqueSlug, getSiteUrl } from '../utils/url';
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

export type UserRole = 'client' | 'consultant' | 'admin';

export interface UserProfile {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    linkedin?: string;
    roles: UserRole[];
    createdAt: string;
    updatedAt: string;
}

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

// Generate a strong temporary password that meets Supabase requirements
const generateTempPassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    // Ensure at least one of each required character type
    const password = [
        lowercase[Math.floor(Math.random() * lowercase.length)],
        uppercase[Math.floor(Math.random() * uppercase.length)],
        numbers[Math.floor(Math.random() * numbers.length)],
    ];

    // Add more random characters to make it longer
    const allChars = lowercase + uppercase + numbers;
    for (let i = 0; i < 9; i++) {
        password.push(allChars[Math.floor(Math.random() * allChars.length)]);
    }

    // Shuffle the password array
    return password.sort(() => Math.random() - 0.5).join('');
};

// Transform database snake_case to camelCase
const transformProfileFromDB = (profile: ProfileRow): UserProfile => ({
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    linkedin: profile.linkedin || undefined,
    roles: profile.roles as UserRole[],
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
});

export const signUpConsultantWithEmail = async (data: ConsultantSignUpData) => {
    const siteUrl = getSiteUrl();
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    while (retryCount < maxRetries) {
        try {
            const client = supabase();
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
        } catch (error: any) {
            logger.error('Error during consultant signup:', error);
            
            // If we've retried the maximum number of times, or it's not a retryable error
            if (retryCount >= maxRetries) {
                throw error;
            }
        }
    }

    throw new Error('Maximum retry attempts reached');
};

export const signUpClientWithEmail = async (data: ClientSignUpData) => {
    const siteUrl = getSiteUrl();
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    while (retryCount < maxRetries) {
        try {
            const client = supabase();
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
        } catch (error: any) {
            logger.error('Error during client signup:', error);
            
            // If we've retried the maximum number of times, or it's not a retryable error
            if (retryCount >= maxRetries) {
                throw error;
            }
        }
    }

    throw new Error('Maximum retry attempts reached');
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
    const client = supabase();
    const { data: { session }, error: authError } = await client.auth.getSession();
    
    if (authError || !session?.user) {
        if (authError) {
            logger.error('Error getting session:', authError);
        }
        return null;
    }

    const { data: profile, error: profileError } = await client
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    if (profileError || !profile) {
        logger.error('Error getting profile:', profileError);
        return null;
    }

    return transformProfileFromDB(profile);
};

export const resendConfirmationEmail = async (email: string): Promise<void> => {
    const siteUrl = getSiteUrl();
    const client = supabase();
    
    const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/callback`
    });

    if (error) {
        logger.error('Error sending confirmation email:', error);
        throw error;
    }
};

export const checkEmailExists = async (email: string): Promise<boolean> => {
    const client = supabase();
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
    const client = supabase();
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

    const client = supabase();
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
        const slug = await ensureUniqueSlug(baseSlug, 'profile');

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