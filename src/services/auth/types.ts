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
    company: string;
    companyRole: string;
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
    slug?: string | null;
    createdAt: string;
    updatedAt: string;
}

// Helper function to transform profile from DB format to our format
export const transformProfileFromDB = (profile: Database['public']['Tables']['profiles']['Row']): UserProfile => ({
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    roles: profile.roles as UserRole[],
    linkedin: profile.linkedin,
    slug: profile.slug,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at
}); 