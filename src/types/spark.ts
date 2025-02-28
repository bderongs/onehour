/**
 * spark.ts
 * Type definitions for Spark objects, ensuring compatibility between frontend and database representations.
 */
export interface Spark {
    id: string;
    title: string;
    duration: string; // Represented as string but stored as interval in DB
    prefillText: string;
    price?: string; // Represented as string but stored as numeric(10,2) in DB
    description?: string;
    benefits?: string[];
    highlight?: string;
    consultant: string | null; // ID of the consultant this spark belongs to
    // Additional properties for detailed view
    detailedDescription?: string;
    methodology?: string[];
    targetAudience?: string[];
    prerequisites?: string[];
    deliverables?: string[];
    expertProfile?: {
        expertise: string[];
        experience: string;
    };
    faq?: Array<{
        question: string;
        answer: string;
    }>;
    nextSteps?: string[];
    slug: string; // Unique identifier used in URLs (previously named 'url')
    imageUrl?: string; // URL for the main image (frontend property)
    image_url?: string; // URL for the main image (database column name)
    socialImageUrl?: string; // URL for the social sharing image
    createdAt: string;
    updatedAt: string;
} 