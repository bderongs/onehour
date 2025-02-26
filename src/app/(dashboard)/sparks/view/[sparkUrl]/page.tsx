/**
 * This file displays a Spark product page with details, pricing, and action buttons
 * It handles different contexts (marketing, purchase, preview) and renders appropriate UI
 */
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getSparkByUrl } from '@/services/sparks';
import { SparkProductSkeleton } from './_components/SparkProductSkeleton';
import { MainContent } from './_components/MainContent';

// Context types for the page
type PageContext = 'consultant_marketing' | 'client_purchase' | 'consultant_preview';

interface PageProps {
    params: {
        sparkUrl: string;
    };
}

export async function generateMetadata({ params }: PageProps) {
    // Await params to ensure they're fully resolved
    const sparkUrl = await Promise.resolve(params.sparkUrl);
    const spark = await getSparkByUrl(sparkUrl);
    
    if (!spark) {
        return {
            title: 'Spark not found',
            description: 'The requested spark could not be found.'
        };
    }

    return {
        title: `${spark.title} | Sparkier`,
        description: spark.description,
        openGraph: {
            title: spark.title,
            description: spark.description,
            type: 'website',
            // Add image if available in the future
        },
    };
}

export default async function SparkProductPage({ params }: PageProps) {
    // Await params to ensure they're fully resolved
    const sparkUrl = await Promise.resolve(params.sparkUrl);
    const DEMO_CONSULTANT_ID = process.env.NEXT_PUBLIC_DEMO_CONSULTANT_ID;

    const spark = await getSparkByUrl(sparkUrl);

    if (!spark) {
        notFound();
    }

    // Determine page context - this will be passed to client components
    let pageContext: PageContext = 'client_purchase';
    if (spark.consultant === DEMO_CONSULTANT_ID) {
        pageContext = 'consultant_marketing';
    }
    // Note: consultant_preview context will be determined client-side based on user role

    return (
        <Suspense fallback={<SparkProductSkeleton />}>
            <MainContent 
                spark={spark} 
                pageContext={pageContext} 
                sparkUrl={sparkUrl} 
            />
        </Suspense>
    );
} 