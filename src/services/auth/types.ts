import type { Database } from '@/lib/supabase/database.types';
import logger from '@/utils/logger';

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
export const transformProfileFromDB = (profile: Database['public']['Tables']['profiles']['Row']): UserProfile => {
    if (!profile) {
        logger.error('transformProfileFromDB: Profile is null or undefined');
        throw new Error('Profile data is missing');
    }

    logger.info('transformProfileFromDB: Raw profile data:', profile);

    // Check for required fields
    if (!profile.id) {
        logger.error('transformProfileFromDB: Profile is missing id');
        throw new Error('Profile is missing id');
    }

    if (!profile.email) {
        logger.error('transformProfileFromDB: Profile is missing email');
        throw new Error('Profile is missing email');
    }

    // Check if roles is an array
    if (!Array.isArray(profile.roles)) {
        logger.error('transformProfileFromDB: Roles is not an array:', profile.roles);
        // Default to empty array if roles is not valid
        profile.roles = [];
    }

    return {
        id: profile.id,
        email: profile.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
        roles: profile.roles as UserRole[],
        linkedin: profile.linkedin,
        slug: profile.slug,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
    };
}; 