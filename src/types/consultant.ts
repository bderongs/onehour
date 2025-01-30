export interface ConsultantProfile {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    roles: string[];
    slug: string;
    
    // Basic profile info
    title?: string;
    bio?: string;
    company?: string;
    company_title?: string;
    location?: string;
    languages?: string[];
    
    // Social and web presence
    linkedin?: string;
    twitter?: string;
    website?: string;
    profile_image_url?: string;
    
    // Professional details
    expertise: string;
    experience: string;
    key_competencies?: string[];
    
    // Rating and verification
    average_rating?: number;
    review_count?: number;
    is_verified?: boolean;
    verification_date?: string;
    
    // Reviews and missions
    reviews?: ConsultantReview[];
    missions?: ConsultantMission[];
    
    // Timestamps
    created_at: string;
    updated_at: string;
}

export interface ConsultantReview {
    id: string;
    consultant_id: string;
    client_name: string;       // Maps to reviewer_name in DB
    client_role?: string;      // Maps to reviewer_role in DB
    client_company?: string;   // Maps to reviewer_company in DB
    review_text: string;
    rating: number;
    client_image_url?: string; // Maps to reviewer_image_url in DB
    created_at: string;
}

export interface ConsultantMission {
    title: string;
    company: string;
    description: string;
    duration: string;
    date: string;
}

export interface ConsultantAvailability {
    date: Date;
    time_slots: string[];
} 