import { Suspense } from 'react';
import { Metadata } from 'next';
import { SparkRequestHandler } from './_components/SparkRequestHandler';
import { SparkRequestSkeleton } from './_components/SparkRequestSkeleton';

export const metadata: Metadata = {
    title: 'Traitement de la demande | Sparkier',
    description: 'Traitement de votre demande de spark',
    robots: {
        index: false,
        follow: false,
    },
};

export default function SparkRequestPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const sparkSlug = searchParams.spark_url as string | null;

    return (
        <Suspense fallback={<SparkRequestSkeleton />}>
            <SparkRequestHandler sparkSlug={sparkSlug} />
        </Suspense>
    );
} 