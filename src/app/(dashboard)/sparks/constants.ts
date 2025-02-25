import type { Spark } from '@/types/spark'

// Default spark state
export const DEFAULT_SPARK: Omit<Spark, 'id'> = {
    title: '',
    description: '',
    detailedDescription: '',
    duration: '60',
    price: '0',
    methodology: [],
    targetAudience: [],
    prerequisites: [],
    deliverables: [],
    nextSteps: [],
    url: '',
    consultant: null,
    highlight: '',
    prefillText: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    benefits: [],
    expertProfile: {
        expertise: [],
        experience: ''
    },
    faq: [],
    imageUrl: '',
    socialImageUrl: ''
} 