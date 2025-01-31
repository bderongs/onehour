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
    url: string;
} 