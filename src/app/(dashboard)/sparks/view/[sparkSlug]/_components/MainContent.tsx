/**
 * This client component displays the main content of the Spark product page
 * It handles the layout and rendering of all sections
 */
'use client'

import { Clock } from 'lucide-react';
import { Suspense } from 'react';
import { formatDuration, formatPrice } from '@/utils/format';
import { SparkActionButton } from './SparkActionButton';
import { FaqSection } from './FaqSection';
import { SparkContent } from './SparkContent';
import { BackButton } from './BackButton';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Spark } from '@/types/spark';

type PageContext = 'consultant_marketing' | 'client_purchase' | 'consultant_preview';

interface MainContentProps {
    spark: Spark;
    pageContext: PageContext;
    sparkSlug: string;
}

export function MainContent({ spark, pageContext, sparkSlug }: MainContentProps) {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
            {/* Demo Warning Banner */}
            {pageContext === 'consultant_marketing' && (
                <div className="bg-amber-50 border-b border-amber-200">
                    <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 text-amber-800">
                            <span className="text-xs sm:text-sm">Ceci est un exemple de Spark. Créez le vôtre en quelques minutes !</span>
                        </div>
                        <SparkActionButton 
                            pageContext={pageContext}
                            sparkSlug={sparkSlug}
                            className="text-xs sm:text-sm font-medium text-amber-800 hover:text-amber-900"
                        />
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <div className="mb-8">
                    <BackButton />
                </div>

                {/* Hero Section */}
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
                    <div className="flex flex-col gap-6 lg:gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3 lg:mb-4">
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{spark.title}</h1>
                                {spark.highlight && (
                                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                        {spark.highlight}
                                    </span>
                                )}
                            </div>
                            <p className="text-base lg:text-lg text-gray-600 mb-4 lg:mb-6">{spark.description}</p>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Clock className="h-5 w-5" />
                                    <span>{formatDuration(spark.duration)}</span>
                                </div>
                                <div className="text-xl font-bold text-gray-900">{formatPrice(spark.price)}</div>
                            </div>
                        </div>
                        
                        {/* Desktop Action Button */}
                        <div className="hidden lg:flex justify-end">
                            <SparkActionButton 
                                pageContext={pageContext}
                                sparkSlug={sparkSlug}
                            />
                        </div>
                        
                        {/* Mobile Action Button */}
                        <div className="lg:hidden w-full">
                            <SparkActionButton 
                                pageContext={pageContext}
                                sparkSlug={sparkSlug}
                                isMobile
                            />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <Suspense fallback={<LoadingSpinner message="Chargement du contenu..." />}>
                    <SparkContent spark={spark} />
                </Suspense>

                {/* FAQ Section */}
                {spark.faq && (
                    <div className="mt-6 lg:mt-8">
                        <Suspense fallback={<LoadingSpinner message="Chargement des FAQ..." />}>
                            <FaqSection faq={spark.faq} />
                        </Suspense>
                    </div>
                )}
            </div>
        </div>
    );
} 