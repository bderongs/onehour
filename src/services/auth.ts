import { supabase } from '../lib/supabase'

export interface ConsultantSignUpData {
    email: string;
    firstName: string;
    lastName: string;
    linkedin?: string;
    expertise: string;
    experience: string;
}

export interface ClientSignUpData {
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    role: string;
    industry: string;
}

export const signUpConsultantWithEmail = async (data: ConsultantSignUpData) => {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: generateSecurePassword(), // We'll send this via email
        options: {
            data: {
                first_name: data.firstName,
                last_name: data.lastName,
            }
        }
    })

    if (authError) throw authError

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
                expertise: data.expertise,
                experience: data.experience,
                created_at: new Date().toISOString()
            }
        ])

    if (profileError) throw profileError

    return authData
}

export const signUpClientWithEmail = async (data: ClientSignUpData) => {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: generateSecurePassword(), // We'll send this via email
        options: {
            data: {
                first_name: data.firstName,
                last_name: data.lastName,
            }
        }
    })

    if (authError) throw authError

    // Then, store additional user data in a client_profiles table
    const { error: profileError } = await supabase
        .from('client_profiles')
        .insert([
            {
                id: authData.user?.id,
                email: data.email,
                first_name: data.firstName,
                last_name: data.lastName,
                company: data.company,
                role: data.role,
                industry: data.industry,
                created_at: new Date().toISOString()
            }
        ])

    if (profileError) throw profileError

    return authData
}

// Helper function to generate a secure random password
function generateSecurePassword(): string {
    const length = 16
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length)
        password += charset[randomIndex]
    }
    return password
}

export type UserRole = 'client' | 'consultant' | 'admin';

export interface UserProfile {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    linkedin?: string;
    expertise: string;
    experience: string;
    role: UserRole;
}

// Transform database snake_case to camelCase
const transformProfileFromDB = (profile: any): UserProfile => ({
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    linkedin: profile.linkedin,
    expertise: profile.expertise,
    experience: profile.experience,
    role: profile.role,
});

export const getCurrentUser = async (): Promise<UserProfile | null> => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        console.error('Error getting user:', authError);
        return null;
    }

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (profileError || !profile) {
        console.error('Error getting profile:', profileError);
        return null;
    }

    return transformProfileFromDB(profile);
};

export const isConsultant = async (): Promise<boolean> => {
    const user = await getCurrentUser();
    return user?.role === 'consultant';
};

export const isAdmin = async (): Promise<boolean> => {
    const user = await getCurrentUser();
    return user?.role === 'admin';
};

export const isClient = async (): Promise<boolean> => {
    const user = await getCurrentUser();
    return user?.role === 'client';
};

export const updateUserRole = async (userId: string, role: UserRole): Promise<void> => {
    // Only admins can update roles
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
        throw new Error('Only administrators can update user roles');
    }

    const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

    if (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
}; 