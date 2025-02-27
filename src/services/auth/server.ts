import { createClient } from '@/lib/supabase/server';
import { generateSlug, getSiteUrl } from '@/utils/url/shared';
import { ensureUniqueSlug as ensureUniqueSlugServer } from '@/utils/url/server';
import logger from '@/utils/logger';
import type { ConsultantSignUpData, ClientSignUpData, UserProfile, UserRole } from './types';
import { transformProfileFromDB } from './types';

// Helper function to generate a temporary password that meets Supabase requirements
const generateTempPassword = () => {
    // Create a simple password that meets Supabase requirements:
    // At least one lowercase, one uppercase, one number
    return `Password123!${Math.floor(Math.random() * 10000)}`; // Simple but compliant password
};

export const signUpConsultantWithEmail = async (data: ConsultantSignUpData) => {
    const siteUrl = getSiteUrl();
    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    while (retryCount < maxRetries) {
        try {
            logger.info('Creating Supabase client for consultant signup');
            const client = await createClient();
            
            // Generate a secure password that meets requirements
            logger.info('Generating temporary password for consultant signup');
            const tempPassword = generateTempPassword();
            
            // Log password requirements check (without revealing the password)
            const hasLowercase = /[a-z]/.test(tempPassword);
            const hasUppercase = /[A-Z]/.test(tempPassword);
            const hasNumber = /[0-9]/.test(tempPassword);
            const hasSpecial = /[!@#$%^&*()_+]/.test(tempPassword);
            logger.info('Password requirements check:', { 
                hasLowercase, 
                hasUppercase, 
                hasNumber, 
                hasSpecial,
                length: tempPassword.length
            });
            
            // Create the auth user with email confirmation
            logger.info('Attempting to create auth user for consultant signup');
            const { data: authData, error: authError } = await client.auth.signUp({
                email: data.email,
                password: tempPassword,
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
                logger.error('Auth error during consultant signup:', authError);
                throw authError;
            }

            // Create the profile
            logger.info('Creating profile for consultant user');
            
            if (!authData.user) {
                logger.error('Auth user is null after successful signup');
                throw new Error('Auth error: User data is missing after signup');
            }
            
            // Ensure roles is an array of user_role type
            const roles = ['consultant'] as const;
            
            // Validate required fields based on the database schema
            if (!data.firstName || !data.lastName) {
                logger.error('Missing required fields for profile creation', {
                    hasFirstName: !!data.firstName,
                    hasLastName: !!data.lastName
                });
                throw new Error('Profile error: First name and last name are required');
            }
            
            // Generate a slug from the consultant's name
            logger.info('Generating slug for consultant profile');
            const baseSlug = generateSlug(`${data.firstName}-${data.lastName}`);
            // Ensure the slug is unique
            const slug = await ensureUniqueSlugServer(baseSlug, 'profile');
            logger.info('Generated unique slug for consultant:', slug);
            
            // Prepare the profile data with proper types
            const now = new Date().toISOString();
            const profileData = {
                id: authData.user.id,
                email: data.email,
                first_name: data.firstName || '',
                last_name: data.lastName || '',
                roles: roles,
                linkedin: data.linkedin || null,
                slug: slug, // Add slug to profile data
                created_at: now,
                updated_at: now
            };
            
            logger.info('Profile data prepared:', {
                id: profileData.id.substring(0, 8) + '...',  // Log partial ID for privacy
                email: profileData.email,
                hasFirstName: !!profileData.first_name,
                hasLastName: !!profileData.last_name,
                roles: profileData.roles,
                hasLinkedin: !!profileData.linkedin,
                slug: profileData.slug  // Add slug to logging
            });
            
            const { error: profileError } = await client.from('profiles').insert(profileData);

            if (profileError) {
                logger.error('Error creating profile:', {
                    code: profileError.code,
                    message: profileError.message,
                    hint: profileError.hint,
                    details: profileError.details || 'No details available',
                    sqlErrorCode: profileError.code,
                    sqlErrorMessage: profileError.message
                });
                
                // Try to clean up the auth user if profile creation fails
                if (client.auth.admin && typeof client.auth.admin.deleteUser === 'function') {
                    try {
                        logger.info(`Attempting to clean up auth user after profile creation failure: ${authData.user.id}`);
                        await client.auth.admin.deleteUser(authData.user.id);
                        logger.info('Auth user cleanup successful');
                    } catch (cleanupError) {
                        logger.error('Failed to clean up auth user after profile creation failure:', cleanupError);
                    }
                } else {
                    logger.warn('Admin API not available for auth user cleanup');
                }
                
                throw new Error(`Profile error: ${profileError.message}`);
            }

            logger.info('Consultant signup completed successfully');
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
            logger.info('Creating Supabase client for client signup');
            const client = await createClient();
            
            // Generate a secure password that meets requirements
            logger.info('Generating temporary password for client signup');
            const tempPassword = generateTempPassword();
            
            // Log password requirements check (without revealing the password)
            const hasLowercase = /[a-z]/.test(tempPassword);
            const hasUppercase = /[A-Z]/.test(tempPassword);
            const hasNumber = /[0-9]/.test(tempPassword);
            const hasSpecial = /[!@#$%^&*()_+]/.test(tempPassword);
            logger.info('Password requirements check:', { 
                hasLowercase, 
                hasUppercase, 
                hasNumber, 
                hasSpecial,
                length: tempPassword.length
            });
            
            // Create the auth user with email confirmation
            logger.info('Attempting to create auth user for client signup');
            const { data: authData, error: authError } = await client.auth.signUp({
                email: data.email,
                password: tempPassword,
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
                logger.error('Auth error during client signup:', {
                    message: authError.message,
                    code: authError.code,
                    status: authError.status,
                    name: authError.name
                });
                throw new Error(`Auth error: ${authError.message || 'Unknown auth error'}`);
            }
            
            // Check if user was actually created
            if (!authData.user || !authData.user.id) {
                logger.error('Auth data incomplete - no user created:', authData);
                throw new Error('User account could not be created');
            }

            // Ensure roles is an array of user_role type
            const roles = ['client'] as const;

            // Create the profile
            logger.info('Creating profile for client user');
            
            if (!authData.user) {
                logger.error('Auth user is null after successful signup');
                throw new Error('Auth error: User data is missing after signup');
            }
            
            // Validate required fields based on the database schema
            if (!data.firstName || !data.lastName) {
                logger.error('Missing required fields for profile creation', {
                    hasFirstName: !!data.firstName,
                    hasLastName: !!data.lastName
                });
                throw new Error('Profile error: First name and last name are required');
            }
            
            // Validate client-specific fields
            if (!data.company || !data.companyRole) {
                logger.error('Missing required client fields for profile creation', {
                    hasCompany: !!data.company,
                    hasCompanyRole: !!data.companyRole
                });
                throw new Error('Profile error: Company and company role are required for client profiles');
            }
            
            // Prepare the profile data with proper types
            const now = new Date().toISOString();
            const profileData = {
                id: authData.user.id,
                email: data.email,
                first_name: data.firstName || '',
                last_name: data.lastName || '',
                roles: roles,
                company: data.company || null,
                company_title: data.companyRole || null,
                slug: data.sparkUrlSlug || null,
                created_at: now,
                updated_at: now
            };
            
            logger.info('Profile data prepared:', {
                id: profileData.id.substring(0, 8) + '...',  // Log partial ID for privacy
                email: profileData.email,
                hasFirstName: !!profileData.first_name,
                hasLastName: !!profileData.last_name,
                roles: profileData.roles,
                hasCompany: !!profileData.company,
                hasCompanyTitle: !!profileData.company_title,
                hasSlug: !!profileData.slug
            });
            
            const { error: profileError } = await client.from('profiles').insert(profileData);

            if (profileError) {
                logger.error('Error creating profile:', {
                    code: profileError.code,
                    message: profileError.message,
                    hint: profileError.hint,
                    details: profileError.details || 'No details available',
                    sqlErrorCode: profileError.code,
                    sqlErrorMessage: profileError.message
                });
                
                // Try to clean up the auth user if profile creation fails
                if (client.auth.admin && typeof client.auth.admin.deleteUser === 'function') {
                    try {
                        logger.info(`Attempting to clean up auth user after profile creation failure: ${authData.user.id}`);
                        await client.auth.admin.deleteUser(authData.user.id);
                        logger.info('Auth user cleanup successful');
                    } catch (cleanupError) {
                        logger.error('Failed to clean up auth user after profile creation failure:', cleanupError);
                    }
                } else {
                    logger.warn('Admin API not available for auth user cleanup');
                }
                
                throw new Error(`Profile error: ${profileError.message}`);
            }

            logger.info('Client signup completed successfully');
            return authData;
        } catch (error) {
            logger.error('Error during client signup:', error);
            
            // On the last retry, throw a more detailed error
            if (retryCount >= maxRetries - 1) {
                if (error instanceof Error) {
                    throw error; // Preserve the original error message
                } else {
                    throw new Error('Failed to sign up: Unknown error occurred');
                }
            }
            
            throw error;
        }
    }
    
    // This should never be reached due to the throw in the catch block
    throw new Error('Failed to sign up after maximum retries');
};

export const getCurrentUser = async (): Promise<UserProfile | null> => {
    try {
        const client = await createClient();
        const { data: { session }, error: sessionError } = await client.auth.getSession();

        if (sessionError) {
            logger.error('Error getting session:', sessionError);
            return null;
        }

        if (!session?.user) {
            logger.info('No active session found');
            return null;
        }

        const user = session.user;

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
        const client = await createClient();
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

export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
    try {
        const client = await createClient();
        
        // Convert camelCase to snake_case for database
        const dbUpdates: Record<string, any> = {};
        if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
        if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
        if (updates.roles !== undefined) dbUpdates.roles = updates.roles;
        
        const { data, error } = await client
            .from('profiles')
            .update(dbUpdates)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            logger.error('Error updating user profile:', error);
            throw error;
        }

        return transformProfileFromDB(data);
    } catch (error) {
        logger.error('Error in updateUserProfile:', error);
        throw error;
    }
};

// Test the Supabase connection
export const testSupabaseConnection = async (): Promise<boolean> => {
    try {
        logger.info('Testing Supabase connection');
        const client = await createClient();
        
        // Try a simple query to test the connection
        const { data, error } = await client
            .from('profiles')
            .select('id')  // Select a specific column instead of count(*)
            .limit(1);
            
        if (error) {
            logger.error('Error testing Supabase connection:', error);
            return false;
        }
        
        logger.info('Supabase connection test successful');
        return true;
    } catch (error) {
        logger.error('Error testing Supabase connection:', error);
        return false;
    }
}; 