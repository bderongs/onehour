export interface Spark {
    id: string;
    title: string;
    duration: string;
    prefillText: string;
    price?: string;
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
    testimonials?: Array<{
        text: string;
        author: string;
        company?: string;
        role?: string;
    }>;
    nextSteps?: string[];
    url: string;
} 