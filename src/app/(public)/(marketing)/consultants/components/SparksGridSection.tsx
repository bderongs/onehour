'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SparksGrid } from '@/app/(public)/(marketing)/components/SparksGrid';
import type { Spark } from '@/types/spark';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import logger from '@/utils/logger';

interface SparksGridSectionProps {
    initialSparks: Spark[];
}

export const SparksGridSection: React.FC<SparksGridSectionProps> = React.memo(({ initialSparks }) => {
    const router = useRouter();
    const [expandedCallIndex, setExpandedCallIndex] = useState<number | null>(0);
    const [loading, setLoading] = useState(false);

    const handleSparkCreation = useCallback(() => {
        const element = document.getElementById('signup-form');
        const headerOffset = 120;

        if (element) {
            setTimeout(() => {
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, []);

    // Memoize the filtered sparks array
    const filteredSparks = useMemo(() => initialSparks.filter(spark => [
        'fda49682-dd97-4e3a-b9db-52a234348454',
        '60f1dcb7-a91b-4821-9fdd-7c19f240aa4d',
        '886c9a5c-19f6-429e-90fd-e3305eb37cf8'
    ].includes(spark.id)), [initialSparks]);

    const handleDetailsClick = useCallback((spark: Spark) => {
        router.push(`/sparks/${spark.url}`);
    }, [router]);

    if (loading) {
        return (
            <div className="text-center py-8">
                <LoadingSpinner message="Chargement des Sparks..." />
            </div>
        );
    }

    return (
        <div className="mb-12 sm:mb-16">
            <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                    Exemples de Sparks populaires
                </h3>
                <p className="text-gray-600 max-w-3xl mx-auto mb-6">
                    Découvrez comment d'autres consultants structurent leurs offres. Inspirez-vous de ces exemples pour créer vos propres Sparks personnalisés.
                </p>
            </div>

            <SparksGrid
                sparks={filteredSparks}
                expandedCallIndex={expandedCallIndex}
                setExpandedCallIndex={setExpandedCallIndex}
                onCallClick={handleSparkCreation}
                buttonText="Créer mon premier Spark"
                showAvailability={false}
                showCreateCard={true}
                showDetailsButton={true}
                onDetailsClick={handleDetailsClick}
            />
        </div>
    );
}); 