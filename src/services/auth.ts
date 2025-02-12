import { supabase } from '../lib/supabase'
import { generateSlug, ensureUniqueSlug } from '../utils/url';
import logger from '../utils/logger';

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
    company: string;
    companyRole: string;
    industry: string;
    sparkUrlSlug?: string; // Optional sparkUrlSlug for direct signup from SparkProductPage
}

// Get the site URL based on environment
const getSiteUrl = () => {
    const isDevelopment = import.meta.env.MODE === 'development';
    return isDevelopment ? 'http://localhost:5173' : 'https://www.sparkier.io';
};

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

export const signUpConsultantWithEmail = async (data: ConsultantSignUpData) => {
    const siteUrl = getSiteUrl();
    
    // Create the auth user with email confirmation
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: generateTempPassword(),
        options: {
            emailRedirectTo: `${siteUrl}/auth/callback`,
            data: {
                first_name: data.firstName,
                last_name: data.lastName,
            }
        }
    })

    if (authError) throw authError

    // Generate the initial slug
    const baseSlug = generateSlug(`${data.firstName} ${data.lastName}`);
    const slug = await ensureUniqueSlug(baseSlug, 'profile');

    // Then, store additional user data in a profiles table
    const { error: profileError } = await supabase
        .from('profiles')
        .insert([
            {
                id: authData.user?.id,
                email: data.email,
                first_name: data.firstName,
                last_name: data.lastName,
                linkedin: data.linkedin,
                roles: ['consultant'],
                slug: slug,
                created_at: new Date().toISOString()
            }
        ])

    if (profileError) throw profileError

    return authData
}

export const signUpClientWithEmail = async (data: ClientSignUpData) => {
    const siteUrl = getSiteUrl();
    
    // Create the auth user with email confirmation
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: generateTempPassword(),
        options: {
            emailRedirectTo: data.sparkUrlSlug 
                ? `${siteUrl}/auth/callback?spark_url=${encodeURIComponent(data.sparkUrlSlug)}`
                : `${siteUrl}/auth/callback`,
            data: {
                first_name: data.firstName,
                last_name: data.lastName,
            }
        }
    })

    if (authError) throw authError

    // Then, store additional user data in the profiles table
    const { error: profileError } = await supabase
        .from('profiles')
        .insert([
            {
                id: authData.user?.id,
                email: data.email,
                first_name: data.firstName,
                last_name: data.lastName,
                company: data.company,
                roles: ['client'],
                created_at: new Date().toISOString()
            }
        ])

    if (profileError) throw profileError

    // Return the auth data and sparkUrlSlug
    return {
        ...authData,
        sparkUrlSlug: data.sparkUrlSlug // Return sparkUrlSlug if it was provided
    }
}

export type UserRole = 'client' | 'consultant' | 'admin';

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    linkedin?: string;
    roles: UserRole[];
}

// Transform database snake_case to camelCase
const transformProfileFromDB = (profile: any): UserProfile => ({
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    linkedin: profile.linkedin,
    roles: profile.roles,
});

export const getCurrentUser = async (): Promise<UserProfile | null> => {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session?.user) {
        if (authError) {
            logger.error('Error getting session:', authError);
        }
        return null;
    }

    const { data: profile, error: profileError } = await supabase
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

    // If adding consultant role, we need to handle slug generation
    if (roles.includes('consultant') && !currentRoles.includes('consultant')) {
        // Get user info to generate slug
        const { data: profile, error: profileError } = await supabase
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
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ roles, slug })
            .eq('id', userId);

        if (updateError) {
            logger.error('Error updating user roles and slug:', updateError);
            throw updateError;
        }
    } else {
        // Just update roles
        const { error } = await supabase
            .from('profiles')
            .update({ roles })
            .eq('id', userId);

        if (error) {
            logger.error('Error updating user roles:', error);
            throw error;
        }
    }
};

export const resendConfirmationEmail = async (email: string): Promise<void> => {
    const siteUrl = getSiteUrl();
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/callback`
    });

    if (error) {
        logger.error('Error sending confirmation email:', error);
        throw error;
    }
}; 