'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { SparksGrid } from '@/app/(public)/(marketing)/components/SparksGrid';
import type { Spark } from '@/types/spark';
import logger from '@/utils/logger';

interface SparksGridSectionProps {
    initialSparks: Spark[];
    onSparkClick: (prefillText: string) => void;
}

export const SparksGridSection = React.memo(function SparksGridSection({ 
    initialSparks,
    onSparkClick
}: SparksGridSectionProps) {
    const [expandedCallIndex, setExpandedCallIndex] = useState<number | null>(0);

    // Memoize the filtered sparks array
    const filteredSparks = useMemo(() => initialSparks.filter(spark => 
        !spark.consultant && spark.consultant !== undefined
    ), [initialSparks]);

    // Log render with useEffect to avoid unnecessary logging
    React.useEffect(() => {
        logger.info('SparksGridSection rendered', {
            sparksCount: filteredSparks.length,
            expandedCallIndex
        });
    }, [filteredSparks.length, expandedCallIndex]);

    return (
        <div className="mb-12 sm:mb-16">
            <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                    Exemples de Sparks
                </h3>
                <p className="text-gray-600 max-w-3xl mx-auto mb-6">
                    Découvrez comment les Sparks peuvent vous aider à résoudre vos problématiques.
                </p>
            </div>

            <SparksGrid
                sparks={filteredSparks}
                expandedCallIndex={expandedCallIndex}
                setExpandedCallIndex={setExpandedCallIndex}
                onCallClick={onSparkClick}
                buttonText="Choisir ce Spark"
                showAvailability={false}
                showCreateCard={false}
                showDetailsButton={false}
            />
        </div>
    );
}); 