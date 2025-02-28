/**
 * constants.ts
 * Contains default values and constants for the sparks module.
 */
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
    slug: `spark-${Date.now()}`, // Generate a default slug based on timestamp
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
    image_url: '', // Database column name
    socialImageUrl: ''
} 